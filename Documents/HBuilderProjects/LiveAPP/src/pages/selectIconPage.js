var template=require("../template/selectIconPage.html");
var oAJAX=require("../js/ajax")();
var oAJAX2=require("../js/ajax2")();
module.exports=function(){
	return {
		template:template,
		data:function(){
			return{
					oCanvasUtils:null
			}
		},
		created:function(){
			this.$emit("change-page","选择头像",[
				"showSubmit",
				"showNavgator"
			]);
			
			var oImg=new Image();
			var _this=this;
			oImg.onload=function(){
				_this.oCanvasUtils=require("../components/CanvasUtils")("select_wrap",oImg);
				var iWidth;
				if(document.body.offsetWidth){
					iWidth=document.body.offsetWidth;
				}else{
					iWidth=document.documentElement.offsetWidth;
				}
				document.getElementById("select_wrap").style.height=iWidth+"px";
			}
			var imgSrc=require("../img/pen.png");
			oImg.src=imgSrc;
		},
		methods:{
			upload:function(){
				var oCover=this.oCanvasUtils.getCover();
				var _this=this;
				oAJAX2.upload({
					url:"updateIcon",
					data:{
						userId:localStorage.getItem("userId"),
						icon:oCover.substring(22)
					},
					success:function(backData){
						localStorage.setItem("icon",backData.imgURL)
						_this.$emit("back");
					},
					failed:function(){
						
					}
				});
			}
		}
	}
}
