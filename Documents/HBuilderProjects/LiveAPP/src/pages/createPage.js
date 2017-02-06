var oAJAX = require("../js/ajax")();
var template = require("../template/createPage.html");
var oUtils = require("../js/utils")();
module.exports = function() {
	return {
		template: template,
		data: function() {
			return {

			}
		},
		created: function() {
			this.$emit("change-page", "创建Live", [
				"showNavgator"
			]);

		},
		activated: function() {

		},
		methods: {
			create: function() {
				var _this = this;
				var json = {
					userId: localStorage.getItem("userId"),
					leaderName: localStorage.getItem("userName"),
					time: oUtils.getFormatTime()
				};

				var bAllSuccess = true;
				for(var i = 0; i < this.$children.length; i++) {
					var children = this.$children[i];
					if(children.getName() == "tel") {
						children.setFilter(function(con) {
							if(con.length < 11) {
								return {
									error: true,
									con: "请输入正确的手机号"
								};
							}
							return {
								con: con
							};
						});
					}
					var data = this.$children[i].getData();
					//					console.log(data);
					if(data.error) {
						bAllSuccess = false;
					}
					if(children.getName() == "price") {
						json["price"] = parseInt(data.con);
					} else {
						json[children.getName()] = data.con;
					}
				}

				if(bAllSuccess) {
					//可以发送了
					console.log(json)
					oAJAX.ajax({
						url: "createLive",
						data: json,
						success: function() {
							_this.$emit("back");
						},
						failed: function() {
							_this.$emit("error", "网络错误");
						}
					});
				}
			}
		}
	}
}