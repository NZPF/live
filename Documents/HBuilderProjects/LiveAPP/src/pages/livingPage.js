var template = require("../template/livingPage.html");
var oAJAX = require("../js/ajax")();
var oUtils = require("../js/utils")();
module.exports = function() {
	return {
		template: template,
		data: function() {
			return {
				info: {},
				live: {
					msg: "",
					oMsgItems: [],
					oScrollTimer: null
				},
				status: {
					infoLoaded: false,
					msgLoaded: false,
					noMsg: false,
					liveMenu: false,
					offLive: false,
					onlyLeader:false,
					lowVersion:false
				},
				touchData: {
					iPreMoveX: 0
				}
			}
		},
		created: function() {
			this.$emit("change-page", this.$route.query.title, [
				"showNavgator",
				"showInfoBtn",
				"showMoreBtn"
			]);
			
			//兼容系统版本
			var oUserAgent=window.navigator.userAgent;
			var iVersion=parseFloat(oUserAgent.substring(28,33));
		
			if(iVersion<5){
				this.status.lowVersion=true;
			}
			
			var _this = this;
			oAJAX.ajax({
				url: "getLivingInfo",
				data: {
					userId: localStorage.getItem("userId"),
					liveId: _this.$route.query.liveId
				},
				success: function(backData) {
					console.log(backData);
					_this.info = backData.live;
					_this.status.infoLoaded = true;

					var oLiveHistory = wilddog.sync().ref("live_history/" + backData.live.historyKey + "/mess_items");

					oLiveHistory.once("value").then(function(snapshot) {
						_this.status.msgLoaded = true;
						if(snapshot.val() == null) {
							_this.status.noMsg = true;
						} 
					});

					oLiveHistory.orderByPriority().on("child_added", function(snapshot) {
						//						console.log(snapshot.val());
						var oItem=snapshot.val();
						//如果已经打开了只看主讲状态并且不是主讲发送的就不显示
						oItem["display"]=oItem.isLeader?true:!_this.status.onlyLeader;
						
						_this.live.oMsgItems.push(oItem);
						_this.status.noMsg = false;
						setTimeout(function() {
							//ScrollTop获取的是A元素中超过A元素高度的上滚高度
							var iBodyHeight = document.body.offsetHeight;
							var iScrollTop = document.body.scrollTop;
							var iLiveConHeight = document.getElementById("living_page").offsetHeight;
							//需要移动的步数
							var iScrollStep = iLiveConHeight - (iBodyHeight + iScrollTop);

							var iStep = 0;
							var iSpeed = 1;
							//							console.log("iScrollStep=" + iScrollStep);
							clearInterval(_this.live.oScrollTimer);
							_this.live.oScrollTimer = setInterval(function() {
								iSpeed = Math.ceil((iScrollStep - iStep) / 10);
								//								console.log("iSpeed=" + iSpeed);
								document.body.scrollTop = document.body.scrollTop + iSpeed;
								iStep += iSpeed;
								//								console.log("iStep=" + iStep);
								if(iStep >= iScrollStep) {
									clearInterval(_this.live.oScrollTimer);
								}
							}, 1);

						}, 100);
					});

				},
				failed: function() {}
			});
		},
		methods: {
			msgTouchStart: function() {
				console.log("msgTouchStart");
				clearInterval(this.live.oScrollTimer);
			},
			touchStart: function(event) {
				console.log("touchStart")
				this.touchData.iPreMoveX = event.targetTouches[0].clientX;
			},
			touchMove: function(event) {
				//滑动必须限制在两边
				//右边多出的距离用el宽度减去屏幕宽度
				console.log("touchMove")
				var oLivingPanel = document.getElementById("living_panel");
				//el宽度
				var iLPWidth = parseInt(getComputedStyle(oLivingPanel)["width"]);

				var iClientWidth = 0;
				if(document.body.clientWidth) {
					iClientWidth = document.body.clientWidth;
				} else {
					iClientWidth = document.documentElement.clientWidth;
				}

				//右侧多余宽度
				var iRightExcessWidth = iLPWidth - iClientWidth;
				//当前移动到MoveX
				var iMoveX = event.targetTouches[0].clientX;

				//首先获取el当前left
				var iLPLeft = oLivingPanel.offsetLeft + (iMoveX - this.touchData.iPreMoveX);
				//判断el Left范围
				if(iLPLeft <= 0 && iLPLeft >= -iRightExcessWidth) {
					oLivingPanel.style.left = iLPLeft + "px";
					console.log(oLivingPanel.style.left);
				}
				this.touchData.iPreMoveX = iMoveX;
			},
			sendMsg: function() {
				if(this.live.msg.length != 0 && !oUtils.isAllSpace(this.live.msg)) {
					var oHistory = wilddog.sync().ref("live_history/" + this.info.historyKey + "/mess_items");
					//更新需要一个key,我们可以在数据中存入当前key
					var time = new Date().getTime();
					var json = {
						time: time,
						name: this.info.userId == localStorage.getItem("userId") ? this.info.leaderName : localStorage.getItem("userName"),
						//name:"测试姓名",
						con: this.live.msg,
						hasVoice: false,
						hasTxt: true,
						isLeader: this.info.userId == localStorage.getItem("userId") ? true : false,
						like: false,
						likeCount: 0,
						imgURL:localStorage.getItem("icon")
					};

					oHistory.push(json);
					this.live.msg = "";
				}
			},
			sendVoice: function() {
				console.log("sendVoice");
			},
			sendNice: function() {
				console.log("sendNice")
			},
			openMenu: function() {
				if(localStorage.getItem("userId") == this.info.userId) {
					this.status.offLive = true;
				}
				this.status.liveMenu = !this.status.liveMenu;
			},
			toTop:function(){
				document.body.scrollTop=0;
			},
			toBottom:function(){
				var oLivingPage=document.getElementById("living_page");
				document.body.scrollTop=oLivingPage.offsetHeight;
			},
			onlyLeader:function(){
				//主讲的是永远显示的
				this.status.onlyLeader=!this.status.onlyLeader;
				for(var i=0;i<this.live.oMsgItems.length;i++){
						if(!this.live.oMsgItems[i].isLeader)
							this.live.oMsgItems[i].display=!this.status.onlyLeader;
				}
			},
			menuOperator:function(){
				this.status.liveMenu=false;
			},
			offLive:function(){
				this.$emit("dialog","确认结束Live吗？","acceptOffLive");
			},
			acceptOffLive:function(){
				var _this=this;
				oAJAX.ajax({
					url:"offLive",
					data:{
						liveId:this.info.id
					},
					success:function(){
						_this.info.progress=2;
					},
					failed:function(){
						_this.$emit("error","网络错误");						
					}
				})
			}
			
		}
	}
}