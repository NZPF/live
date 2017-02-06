var template = require("../template/liveInfoPage.html");
var oAJAX = require("../js/ajax")();
module.exports = function() {
	return {
		template: template,
		data: function() {
			return {
				info: {},
				isBuy: false,
				isCreate: false,
				oParticipants: [],
				status: {
					reBuy: false
				}
			}
		},
		created: function() {
			console.log("liveInfoPage创建完成");
			this.$emit("change-page", this.$route.query.title, [
				"showNavgator"
			]);
			var _this = this;
			oAJAX.ajax({
				url: "getLiveById",
				data: {
					liveId: this.$route.query.liveId,
					userId: localStorage.getItem("userId")
				},
				success: function(backData) {
					_this.info = backData.live;
					_this.isBuy = backData.isBuy;
					_this.isCreate = backData.isCreate;
					_this.oParticipants = backData.participants;
					console.log(backData);
				},
				failed: function() {
					_this.$emit("error","网络错误");
				}
			});

		},
		methods: {
			cancelBuyLive: function() {
				this.status.reBuy = false;
			},
			buyLive: function() {
				var _this = this;
				oAJAX.ajax({
					url: "buyLive",
					data: {
						userId: localStorage.getItem("userId"),
						liveId: this.info.id,
					},
					success: function() {
						_this.isBuy = true;
						_this.status.reBuy = false;
						_this.$router.push({
							path:"livingPage",
							query:{
								liveId:_this.info.id,
								title:_this.info.title
							}
						})
					},
					failed: function() {

					}
				});
			},
			reBuyLive: function() {
				var _this = this;
				_this.status.reBuy = true;
			},
			livingPage: function() {
				this.$router.push({
					path: "livingPage",
					query: {
						title:this.info.title,
						liveId: this.info.id
					}
				})
			},
			likeLive: function() {
				var _this = this;

				oAJAX.ajax({
					url: "likeLive",
					data: {
						userId: localStorage.getItem("userId"),
						liveId: _this.info.id,
						status: _this.info.isLike == 1 ? "del" : "add"
					},
					success: function() {
						if(_this.info.isLike) {
							_this.info.isLike = 0;
						} else {
							_this.info.isLike = 1;
						}
					}
				})

			},
			gift: function() {

			}
		}
	}
}