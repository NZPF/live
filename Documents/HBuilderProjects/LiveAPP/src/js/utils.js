 module.exports=function(){
	return{
		isAllSpace:function(con){
			var reg=/^[ ]+$/g;
			var txt=con.replace(reg,"");
			if(txt.length==0){
				return true;
			}
			return false;
		},
		getFormatTime:function(){
			var oDate=new Date();
			return oDate.getFullYear()+"-"+(oDate.getMonth()+1)+"-"+oDate.getDate()+" "+oDate.getHours()+":"+(oDate.getMinutes()+1);
		}
	}
}
