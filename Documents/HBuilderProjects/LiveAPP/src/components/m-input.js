var Vue = require("../components/vue");
var template = require("../template/m-input.html");
var oUtils = require("../js/utils")();
module.exports = function() {
	Vue.component("m-input", function(sync) {

		sync({
			template: template,
			props: ["title", "must", "errorTag", "input", "text", "select", "oItems", "type", "name"],
			data: function() {
				return {
					con: this.select ? "请选择" : "",
					error: false,
					callback: function() {
						return {
							con: this.con
						}
					}
				}
			},
			computed: {},
			methods: {
				getData: function() {
					var bIsSuccess = true;
					var con=this.con;
					if(this.must) {
						if(this.con.length != 0 && !oUtils.isAllSpace(this.con) && this.con != "请选择") {
							var cb = this.callback(this.con);
							if(cb.error) {
								bIsSuccess = false;
								con = cb.con;
							}
						} else {
							bIsSuccess=false;
							con = this.errorTag;
						}
					}
					
					bIsSuccess?this.error=false:this.error=true;
					return {
						error: !bIsSuccess,
						con: con
					}
				},
				setFilter: function(callback) {
					this.callback = callback;
				},
				getName: function() {
					return this.name;
				},
				keyUp:function(){
					this.error=false;
				}
			}
		})
	});
}