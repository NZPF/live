module.exports = function() {

	function parseData(obj) {
		var str = "";
		for(name in obj) {
			str += name+"=" + encodeURI(encodeURI(obj[name])) + "&";
		}
		return str;
	}

	return {
		ajax: function(option) {
	
			
			var oHead = document.getElementsByTagName("head")[0];

			var oScript = document.createElement("script");

			var callBackName = "fun" + new Date().getTime();
				
			var src="http://118.89.142.137:8080/ZhihuService/" + option.url + "?" + parseData(option.data) + "callback=" + callBackName;
//			console.log("src="+src);
			//43.110 
			//0.3
			//118.89.142.137
			oScript.src =src;  


			var oAjaxTimer = null;

			window[callBackName] = function(backData) {
				window[callBackName] = null;
				clearTimeout(oAjaxTimer);
				if(option.success) {
					option.success(backData);
				}
			}

			oAjaxTimer = setTimeout(function() {
				window[callBackName]=null;
				if(option.failed) {
					option.failed();
				}
			}, 3000);
			
			oHead.appendChild(oScript);

		}
	}
}