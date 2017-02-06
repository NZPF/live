var template = require("../template/allPage.html");
require("../components/swiper/swiper.min.js");
var oAJAX = require("../js/ajax")();
module.exports = function() {
	return {
		template: template,
		data: function() {
			return {
				lives: [],
				status: {
					curPage: 0,
				}
			}
		},
		created: function() {
			setTimeout(function() {
				new Swiper("#all_page_swiper", {
					loop: true,
					autoplay: 3000,
					autoplayDisableOnInteraction: false
				});
			}, 100);

			this.fetchData();
		},
		activated:function(){
			this.$emit("change-page","全部Live",[
				"showNavgator"
			]);
		},
		methods: {
			fetchData: function() {
				var _this = this;
				setTimeout(function() {
					oAJAX.ajax({
						url: "getAllLive",
						data: {
							curPage: _this.status.curPage,
							userId:localStorage.getItem("userId")
						},
						success: function(backData) {
							_this.lives = _this.lives.concat(backData.allLives);
							_this.$refs.dataList.loadSuccess(backData.allLives.length);
						},
						failed: function() {
							_this.$emit("error", "网络错误");
						}
					});
				}, 100);
			},
			loadMore: function() {
				this.fetchData();
			},
			sortPage:function(){
				this.$router.push("sortPage");
			},
			mySubscriberPage:function(){
				this.$router.push("mySubscriberPage");
			}
		}
	}
}