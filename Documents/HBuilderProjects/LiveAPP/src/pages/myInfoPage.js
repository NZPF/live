var oAJAX = require("../js/ajax")();
var template = require("../template/myInfoPage.html");
module.exports = function() {
	return {
		template: template,
		data: function() {
			return {
				info: {}
			}
		},
		created: function() {

		},
		activated: function() {

			this.$emit("change-page", "我的信息", [
				"showNavgator",
				"showSubmit"
			]);

			this.fetchData();

		},
		methods: {
			fetchData: function() {
				var _this = this;
				oAJAX.ajax({
					url: "getUserById",
					data: {
						userId: localStorage.getItem("userId")
					},
					success: function(backData) {
						_this.info = backData;
						if(localStorage.getItem("icon") != null) {
							document.getElementById("icon").src = localStorage.getItem("icon");
						}else{
							localStorage.setItem("icon",backData.imgURL);
						}
					},
					failed: function() {
						_this.$emit("error", "网络错误");
					}
				});
			},
			imgChange: function() {
				var _this = this;
				var oDisplayIcon = document.getElementById("icon");

				var oIcon = document.getElementById("icon_file");
				var oIconFile = oIcon.files[0];
				var oFileReader = new FileReader();
				oFileReader.readAsDataURL(oIconFile);
				oFileReader.onload = function() {
					var oResultData = this.result;
					oDisplayIcon.src = oResultData;
					console.log(oResultData);
				}
			},
			upload: function() {
				console.log("上传");

			},
			selectIcon: function() {
				this.$router.push("selectIconPage");
			}
		}
	}
}