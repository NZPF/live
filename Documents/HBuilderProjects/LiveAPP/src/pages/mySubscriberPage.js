var oAJAX = require("../js/ajax")();
var template = require("../template/mySubscriberPage.html");
var oUtils = require("../js/utils")();
module.exports = function() {
	return {
		template: template,
		data: function() {
			return {
				oLives: [],
				status: {
					curPage: 0,
					firstLoad: true,
					noMore:false
				}
			}
		},
		created: function() {

			this.$emit("change-page", "我的订阅", [
				"showNavgator"
			]);

			var _this = this;
			var last_CTime = localStorage.getItem("last_Ctime");
			if(last_CTime == null) {
				//从没查看过
				//设置一个
				var c_time = oUtils.getFormatTime();
				localStorage.setItem("last_Ctime", c_time);
			}
			this.fetchData();
		},
		activated: function() {

		},
		methods: {
			fetchData: function() {
				var _this = this;
				oAJAX.ajax({
					url: "getSubscriberLive",
					data: {
						userId: localStorage.getItem("userId"),
						c_time: localStorage.getItem("last_Ctime"),
						curPage:0
					},
					success: function(backData) {
						console.log(backData);
						if(_this.status.firstLoad){
							localStorage.setItem("last_Ctime",oUtils.getFormatTime());
							_this.status.firstLoad=false;
							_this.status.noMore=true;
						}
						_this.status.curPage++;
						_this.oLives = _this.oLives.concat(backData.lives);
						_this.$refs.dataList.loadSuccess(backData.lives.length);
					},
					failed: function() {
						this.$emit("error", "网络错误");
					}
				});
			},
			loadMore: function() {
				this.fetchData();
			}
		}
	}
}