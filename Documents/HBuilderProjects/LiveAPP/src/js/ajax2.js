module.exports = function() {
	function parseData(obj) {
		var str = "";
		for(name in obj) {
			str += name + "=" + encodeURI(encodeURI(obj[name])) + "&";
		}
		return str;
	}
	function parseData2FormData(obj){
		var oFormData=new FormData();
		for(var name in obj){
			oFormData.append(name,obj[name]);
		}
		return oFormData;
	}
	return {
		upload: function(option) {
			var xhr = new XMLHttpRequest();
			var callbackName="fun"+new Date().getTime();
			var url = "http://118.89.142.137:8080/ZhihuService/" + option.url +"?callback="+callbackName;
			xhr.open("POST", url, true);
			
//			xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");

			var oData=parseData2FormData(option.data);
			xhr.onreadystatechange=function(){
				if(xhr.readyState==4){
					if(xhr.status==200){
						window[callbackName]=function(backData){
							window[callbackName]=null;
							option.success(backData);
						}
						eval(xhr.responseText);
					}else{
						option.failed();
					}
				}
			}
			xhr.send(oData);
		}
	}
}