var Vue = require("../components/vue");
var VueRouter = require("../components/vue-router");
Vue.use(VueRouter);

module.exports = function() {
	window.onload = function() {
		document.addEventListener('plusready', function() {

			const oEnter = require("../pages/enter")();
			const oAllPage = require("../pages/allPage")();
			const oMyPage = require("../pages/myPage")();
			const oLivingPage = require("../pages/livingPage")();
			const oLikePage = require("../pages/likePage")();
			const oLiveInfoPage = require("../pages/liveInfoPage")();
			const oCommentPage = require("../pages/commentPage")();
			const oSortPage = require("../pages/sortPage")();
			const oMySubscriberPage = require("../pages/mySubscriberPage")();
			const oCreatePage = require("../pages/createPage")();
			const oMyInfoPage = require("../pages/myInfoPage")();
			const oSelectIconPage = require("../pages/selectIconPage")();
			const router = new VueRouter({
				routes: [{
					path: "/selectIconPage",
					name: "selectIconPage",
					components: {
						selectIconPage: oSelectIconPage
					}
				}, {
					path: "/myInfoPage",
					name: "myInfoPage",
					components: {
						myInfoPage: oMyInfoPage
					}
				}, {
					path: "/createPage",
					name: "createPage",
					components: {
						createPage: oCreatePage
					}
				}, {
					path: "/mySubscriberPage",
					name: "mySubscriberPage",
					components: {
						mySubscriberPage: oMySubscriberPage
					}
				}, {
					path: "/sortPage",
					name: "sortPage",
					components: {
						sortPage: oSortPage
					}
				}, {
					path: "/commentPage",
					name: "commentPage",
					components: {
						commentPage: oCommentPage
					}
				}, {
					path: "/liveInfoPage",
					name: "liveInfoPage",
					components: {
						liveInfoPage: oLiveInfoPage
					}
				}, {
					path: "/likePage",
					name: "likePage",
					components: {
						likePage: oLikePage
					}
				}, {
					path: "/livingPage",
					name: "livingPage",
					components: {
						livingPage: oLivingPage
					}
				}, {
					path: "/enter",
					name: "enter",
					components: {
						enter: oEnter
					}
				}, {
					path: "/allPage",
					name: "allPage",
					components: {
						allPage: oAllPage
					}
				}, {
					path: "/myPage",
					name: "myPage",
					components: {
						myPage: oMyPage
					}
				}]
			});

			const app = new Vue({
				router: router,
				data: {
					navTitle: "主页",
					errorTag: "",
					status: {
						showErrorTag: false,
						showNav: false,
						showNavgator: false,
						showAllBtn: false,
						showInfoBtn: false,
						showMoreBtn: false,
						showSubmit: false,
						showExit: false
					},
					dialogStatus: {
						show: false,
						title: "",
						callback: null,
						isNavOperator: false
					}

				},
				methods: {
					dialog: function(title, callback) {
						this.dialogStatus.show = true;
						this.dialogStatus.title = title;
						this.dialogStatus.callback = callback;
					},
					dialogAccept: function() {
						this.dialogStatus.show = false;
						if(this.dialogStatus.isNavOperator) {
							this.dialogStatus.callback();
						} else {
							var name = this.$route.name;
							this.$route.matched[0].instances[name][this.dialogStatus.callback]();
						}
					},
					dialogDeny: function() {
						this.dialogStatus.show = false;
					},
					error: function(tag) {
						this.errorTag = tag;
						var _this = this;
						this.status.showErrorTag = true;
						setTimeout(function() {
							_this.status.showErrorTag = false;
						}, 2500);
					},
					allPage: function() {
						this.$router.push("allPage");
					},
					changePage: function(pageName, operator) {

						for(name in this.status) {
							if(name != "showNav" || pageName == "enter") {
								this.status[name] = false;
							}
						}
						//分开关打开
						for(index in operator) {
							this.status[operator[index]] = true;
						}
						this.navTitle = pageName;
					},
					liveInfo: function() {
						//						console.log(this.$route.query.liveId);
						this.$router.push({
							path: "liveInfoPage",
							query: {
								title: this.$route.query.title,
								liveId: this.$route.query.liveId
							}
						})
					},
					liveOperator: function() {
						this.$route.matched[0].instances["livingPage"].openMenu();
					},
					uploadOperator: function() {
						var name = this.$route.name;
						this.$route.matched[0].instances[name].upload();
					},
					back: function(liveId) {
						this.dialogStatus.show = false;
						this.$router.go(-1);
					},
					exit: function() {
						this.dialogStatus.isNavOperator = true;
						var _this = this;
						this.dialog("确认退出吗？", function() {

							localStorage.removeItem("userId");
							localStorage.removeItem("userName");
							localStorage.removeItem("icon");
							_this.dialogStatus.isNavOperator = false;
							_this.$router.push("enter");
						});
					}
				}
			}).$mount('#app');

			var userId = localStorage.getItem("userId");
			if(userId == undefined) {
				app.$router.push("enter");
				app.status.showNav = false;
			} else {
				app.$router.push("myPage");
				app.status.showNav = true;
			}
	
			plus.key.addEventListener("backbutton",function(){
				console.log("按下返回键");
			});

			window.onscroll = function() {
				setTimeout(function() {
					var name = app.$route.name;
					if(name != "livingPage" && name != "liveInfoPage") {
						var obj = app.$route.matched[0].instances[name].$refs.dataList;
						app.$route.matched[0].instances[name].$refs.dataList.load(obj.$el);
					}
				},100);
			}
		});
	}
}