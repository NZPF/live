var oAJAX = require("../js/ajax")();
var template = require("../template/commentPage.html");
module.exports = function() {
	return {
		template: template,
		data: function() {
			return {
				title: "",
				status: {
					will: false,
					may: false,
					not: false
				},
				subjectStars: [
					[],
					[],
					[]
				]
			}
		},
		created: function() {
			this.title = this.$route.query.title;
			this.$emit("change-page", "评价", [
				"showNavgator"
			]);
			for(var i = 0; i < 3; i++) {
				this.subjectStars[i].length = 5;
			}
		},
		methods: {
			selectFace: function(event) {
				for(var name in this.status) {
					this.status[name] = false;
				}
			},
			will: function() {
				this.selectFace();
				this.status.will = true;
			},
			may: function() {
				this.selectFace();
				this.status.may = true;
			},
			not: function() {
				this.selectFace();
				this.status.not = true;
			},
			starSelect: function(iSIndex, index) {
				//				console.log("iSIndex=" + iSIndex);
				//				console.log("index=" + index);
				//先清空star数组
				this.subjectStars[iSIndex].length = 0;
				//推入红星
				for(var j = 0; j <= index; j++) {
					this.subjectStars[iSIndex].push(true);
				}
				//推入剩余黑星
				for(var i = 0; i < 4 - index; i++) {
					this.subjectStars[iSIndex].push(false);
				}
			},
			submitComment: function() {
				//计算分数吧
				var iScore = 0;

				//计算分数
				//首先计算表情
				var bFaceSelect = false;
				for(var name in this.status) {
					if(this.status[name]) {
						//只要有一个为true就证明选择了
						bFaceSelect = true;
						if(name=="will"){
							iScore++;
						}else if(name=="not"){
							iScore--;
						}
					}
				}
				if(!bFaceSelect) {
					this.$emit("error", "是否会推荐给朋友？");
					return;
				}
				//表情计算完毕
				//计算星星
				var tags = ["内容专业性", "内容信息量", "使用体验"];
				var bStarSelect = true;
				for(var i = 0; i < 3; i++) {

					var bItemSelect = false;
					for(var j = 0; j < 5; j++) {
						if(this.subjectStars[i][j]) {
							//出现一个为真就证明已经打分
							iScore++;
							bItemSelect = true;
						}
					}
					if(!bItemSelect) {
						this.$emit("error", "请给" + tags[i] + "打分");
						return;
					}
				}

				//全部同过可以提交
				iScore/=3;
				var oNumArr=(""+iScore).split(".");
				if(typeof oNumArr[1]!="undefined"){
					//有小数位带半颗星
					iScore=parseInt(oNumArr[0])+0.5;
				}
				console.log("iScore="+iScore);
				var _this=this;
				oAJAX.ajax({
					url:"commentLive",
					data:{
						liveId:this.$route.query.liveId,
						score:iScore,
						userId:localStorage.getItem("userId")
					},
					success:function(){
						console.log("评论完成");
						_this.$emit("back",_this.$route.query.liveId);		
					},
					failed:function(){
						
					}
				})
			}
		}
	}
}