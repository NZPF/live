var mui = require("../components/mui.js");
var oAJAX = require("../js/ajax")();
var oTags = require("../js/tags")();
var oUtils = require("../js/utils")();
module.exports = function() {
	return {
		template: require("../template/enter.html"),
		data: function() {
			return {
				tel: "",
				pwd: "",
				name: "",
				status: {
					login: false,
					showPwd: false,
				}
			}
		},
		created: function() {
			this.$emit("change-page","enter");			
		},
		methods: {
			change: function() {
				this.status.login = !this.status.login;
				var oPwd = document.getElementsByName("password")[0];
				if(this.status.login) {
					oPwd.setAttribute("placeholder", "密码");
				} else {
					oPwd.setAttribute("placeholder", "密码不少于6位");
				}
			},
			showPwd: function() {
				var oPwd = document.getElementsByTagName("input")[1];
				this.status.showPwd = !this.status.showPwd;
				if(this.status.showPwd) {
					oPwd.setAttribute("type", "text");
				} else {
					oPwd.setAttribute("type", "password");
				}
			},
			submit: function() {
				var _this = this;
				var bErrorInput = false;

				if(_this.tel.length < 11 && oUtils.isAllSpace(_this.tel)) {
					bErrorInput = true;
				}

				if(_this.pwd.length < 6 && oUtils.isAllSpace(_this.pwd)) {
					bErrorInput = true;
				}

				if(_this.name.length != 0 && oUtils.isAllSpace(_this.name) && !_this.status.login) {
					bErrorInput = true;
				}

				if(bErrorInput) {
					_this.$emit("error", "必要信息不能为空");
					return;
				}

				switch(this.status.login) {
					case true:
						oAJAX.ajax({
							url: "login",
							data: {
								tel: _this.tel,
								password: _this.pwd
							},
							success: function(backData) {
								switch(backData.code) {
									case oTags.ACCOUNT_SUCCESS:
										_this.success(backData.userId, backData.userName);
										break;
									case oTags.ACCOUNT_ERROR:
										_this.failed("账号或密码出现错误");
										break;
								}
							},
							failed: function() {
								_this.failed("网络出现错误");
							}
						})
						break;
					case false:
						oAJAX.ajax({
							url: "register",
							data: {
								name: _this.name,
								tel: _this.tel,
								password: _this.pwd
							},
							success: function(backData) {
								console.log(backData);
								switch(backData.code) {
									case oTags.ACCOUNT_EXIST:
										_this.failed("账号已存在")
										break;
									case oTags.ACCOUNT_SUCCESS:
										//注册成功
										_this.success(backData.userId, backData.userName);
										break;
								}
							},
							failed: function() {
								_this.failed("网络出现错误.");
							}
						})
						break;
				}
			},
			success: function(userId, userName) {
				localStorage.setItem("userId", userId);
				localStorage.setItem("userName", userName);
				this.$router.push("myPage");
			},
			failed: function(errorTag) {
				this.$emit("error", errorTag);
			}
		}
	}
}