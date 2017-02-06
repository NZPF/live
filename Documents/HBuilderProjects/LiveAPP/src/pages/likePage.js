var oAJAX=require("../js/ajax")();
var template=require("../template/likePage.html");
module.exports=function(){
	return {
		template:template,
		data:function(){
			return{
				oLikeLives:[],
			}
		},
		created:function(){
				this.fetchData();
		},
		activated:function(){
			this.$emit("change-page","感兴趣的Live",[
				"showNavgator"
			]);
		},
		methods:{
			fetchData:function(){
				var _this=this;
				oAJAX.ajax({
					url:"getLikeLives",
					data:{
						userId:localStorage.getItem("userId")
					},
					success:function(backData){
						_this.oLikeLives=_this.oLikeLives.concat(backData.likeLives);
						_this.$refs.dataList.loadSuccess(backData.likeLives.length);
					},
					failed:function(){
						_this.$refs.dataList.failed();
						_this.$emit("error","网路错误");
					}
				});
			},
			loadMore:function(){
				this.fetchData();
			}
		}
	}
}
