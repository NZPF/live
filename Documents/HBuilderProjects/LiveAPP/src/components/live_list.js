var Vue = require("./vue");
var template = require("../template/live_list.html");
var oAJAX = require("../js/ajax")();
module.exports = function() {
	Vue.component("live-list", {
		template: template,
		props: ["oItems", "clickLoadMode"],
		data: function() {
			return {
				status: {
					//进入是显示加载状态
					loading: true,
					loadMore: true,
					clickLoad: false,
					noMore: false,
					clickRefresh:false
				}
			}
		},
		computed: {
			items: function() {
				for(var i = 0; i < this.oItems.length; i++) {
					var oLevelArr = ("" + this.oItems[i].level).split(".");
				
					if(typeof oLevelArr[1] != "undefined") {
						this.oItems[i]["hasHalfScore"] = true;
					}
					this.oItems[i].level = parseInt(oLevelArr[0]);

				}
				return this.oItems;
			}
		},
		created: function() {
			//			console.log("live_list创建完成 ")
			if(this.clickLoadMode) {
				this.status.clickLoad = true;
			}
		},
		methods: {
			load: function(el) {
				if(!this.status.noMore&&!this.status.loading) {
					var oLoadMore = el.getElementsByClassName("load-more")[0];

					//可视高度+上滚高度>=el距离页面顶端高度
					var iClientHeight = document.body.clientHeight;
					var iScrollTop = 0;
					//兼容几乎所有浏览器但不兼容Chrome
					if(document.documentElement.scrollTop) {
						iScrollTop = document.documentElement.scrollTop;
					} else {
						iScrollTop = document.body.scrollTop;
					}
					var iElTop = oLoadMore.offsetTop;

					if(iClientHeight + iScrollTop > iElTop + 30) {
						this.status.loading = true;
						this.$emit("load-more", "auto");
					}
				}
			},
			loadSuccess: function(size) {
				var _this = this;
				_this.status.loading = false;
				
				setTimeout(function() {
					if(_this.clickLoadMode) {
						this.status.clickLoad = true;
					}
					if(size< 10 ) {
						_this.status.loadMore = false;
						_this.status.noMore=true;
					}
				}, 10);
			},
			livingPage: function(item) {
				if(item.selfLive == 1 || item.canComment == 1 || item.canComment == 2) {
					this.$router.push({
						path: "livingPage",
						query: {
							liveId: item.id,
							title: item.title,
						}
					})
				} else {
					this.$router.push({
						path: "liveInfoPage",
						query: {
							liveId: item.id,
							title: item.title
						}
					});
				}
			},
			commentLive: function(item) {
				var status = "";
				if(item.canComment == 1) {
					//评论 进入评论页面
					this.$router.push({
						path: "commentPage",
						query: {
							title: item.title,
							liveId: item.id
						}
					})
				}
			},
			//status=click
			clickLoadMore: function() {
				if(this.status.clickLoad) {
					//切换到loading状态
					this.status.clickLoad = false;
					this.$emit("load-more", "click");
				}
			},
			likeLive: function(item) {
				//添加感兴趣
				if(item.isLike)
					status = "del";
				else
					status = "add";

				oAJAX.ajax({
					url: "likeLive",
					data: {
						liveId: item.id,
						userId: localStorage.getItem("userId"),
						status: status
					},
					success: function() {
						switch(status) {
							case "add":
								item.isLike = 1;
								break;
							case "del":
								item.isLike = 0;
								break;
						}
					},
					failed: function() {

					}
				})

			}
			,refresh:function(){
				this.status.clickRefresh=false;
				if(this.clickLoadMode){
					this.$emit("load-more","click");
				}else{
					this.$emit("load-more","auto");
				}
			},
			failed:function(){
				this.status.loading=false;
				this.status.clickRefresh=true;
			}
		}
	});
}