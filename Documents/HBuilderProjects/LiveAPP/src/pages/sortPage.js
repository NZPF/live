var oAJAX=require("../js/ajax")();
var template=require("../template/sortPage.html");
module.exports=function(){
	return{
		template:template,
		data:function(){
			return{
				oSorts:[]
			}
		},
		created:function(){
			var _this=this;
			
			this.$emit("change-page","分类浏览 ",[
				"showNavgator"
			]);
			
			oAJAX.ajax({
				url:"getSorts",
				data:{
					userId:localStorage.getItem("userId")
				},
				success:function(backData){
					console.log(backData)
					_this.oSorts=_this.oSorts.concat(backData.subjects);
				},
				failed:function(){
					
				}
			})
		},
		activated:function(){
			
		},
		methods:{
			follow:function(item){
				var _this=this;
				var status="add";
				if(item.isFollow==1){
					status="del";
				}
				oAJAX.ajax({
					url:"subscriberSubject",
					data:{
						userId:localStorage.getItem("userId"),
						status:status,
						name:item.name
					},
					success:function(){
						console.log(item);
						if(item.isFollow==1){
							item.isFollow=0;
						}else{
							item.isFollow=1;
						}
					},
					failed:function(){
						
					}
				})
				
			},
			sortItemPage:function(){
				
			}
		}
	}
}
