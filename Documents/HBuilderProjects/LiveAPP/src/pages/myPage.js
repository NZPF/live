var template = require("../template/myPage.html");
var oAJAX = require("../js/ajax")();
module.exports = function() {
	require("../components/live_list")();
	return {
		template: template,
		data: function() {
			return {
				lives: [],
				buyLives: [],
				status: {
					createList: false,
					buyListPage: 0,
					createListPage: 0,
				}
			}
		},
		created: function() {
			this.fetchData("auto");
			this.fetchData("click");
			this.$emit("change-page", "我的Live", [
				"showAllBtn",
				"showNav",
				"showExit"
			]);
		},
		methods: {
			fetchData: function(status) {
				var　 _this = this;
				oAJAX.ajax({
					url: "getLiveByUid",
					data: {
						userId: localStorage.getItem("userId"),
						curPage: status == "auto" ? _this.status.buyListPage : _this.status.createListPage,
						status: status
					},
					success: function(backData) {
//						console.log(backData);
						if(status == "auto") {
							//买的Live
							_this.$refs.dataList.loadSuccess(backData.lives.length);
							_this.buyLives = _this.buyLives.concat(backData.lives);
							_this.status.buyListPage++;
						} else {
							_this.$refs.createList.loadSuccess(backData.lives.length);
							_this.lives = _this.lives.concat(backData.lives);
							_this.status.createListPage++;
						}
					},
					failed: function() {
						_this.$emit("error", "网络错误");
						if(status=="auto"){
							_this.$refs.dataList.failed();
						}else{
							_this.$refs.createList.failed();
						}
					}
				});
			},
			myInfo:function(){
				this.$router.push("myInfoPage");
			},
			myCreateLive: function() {
				this.status.createList = !this.status.createList;
			},
			loadMore: function(status) {
				this.fetchData(status);
			},
			likeLive: function() {
				this.$router.push({
					path: "likePage",
					query: {
						userId: localStorage.getItem("userId")
					}
				})
				this.$emit("like-page");
			}
			,createLive:function(){
				this.$router.push("createPage");	
			}
		}
	}
}