module.exports = function(id, img) {
	var oCanvasBg;
	var oCanvasCover;
	var oWrap;
	var oImg = img;
	var iTranslateMode = 1;
	var iScaleMode = 2;
	var oActiveTouch = true;
	var iPreMode;
	var location = {
		translateX: 0,
		translateY: 0,
		scale: 1
	}
	var obj = {
		getBetwenLength: function(x1, y1, x2, y2) {
			return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
		},
		create: function(id) {
			var oBase = document.getElementById(id);
			oWrap = document.createElement("div");
			oWrap.id = "canvas_wrap";

			oBase.appendChild(oWrap);

			oCanvasBg = document.createElement("canvas");
			oCanvasBg.id = "canvas_bg";
			oWrap.appendChild(oCanvasBg);

			var oShadow = document.createElement("div");

			oShadow.id = "canvas_shadow";
			oWrap.appendChild(oShadow);

			oCanvasCover = document.createElement("canvas");
			oCanvasCover.id = "canvas_cover"
			oWrap.appendChild(oCanvasCover);
			
		},
		getCover: function() {
			return oCanvasCover.toDataURL("image/png");
		},
		addListener: function() {
			var iStartX = 0;
			var iStartY = 0;
			var iPreScaleLength = 0;
			var _this = this;
			oWrap.ontouchstart = function(event) {
				if(event.touches.length == 1) {
					iStartX = event.touches[0].clientX;
					iStartY = event.touches[0].clientY;
				} else if(event.touches.length == 2) {
					var first = event.touches[0];
					var second = event.touches[1];

					iPreScaleLength = _this.getBetwenLength(first.clientX, second.clientX, first.clientY, second.clientY);
				}
			}
			oWrap.ontouchmove = function(event) {
				var iEndX = event.touches[0].clientX;
				var iEndY = event.touches[0].clientY;

				var active = {};
				if(event.touches.length == 1) {
					active["mode"] = iTranslateMode;
					var iMoveX = iEndX - iStartX;
					var iMoveY = iEndY - iStartY;
					iStartX = iEndX;
					iStartY = iEndY;
					active["x"] = iMoveX;
					active["y"] = iMoveY;
				} else if(event.touches.length == 2) {
					active["mode"] = iScaleMode;
					var first = event.touches[0];
					var second = event.touches[1];
					var iLastScaleLength = _this.getBetwenLength(first.clientX, second.clientX, first.clientY, second.clientY);
					active["scale"] = iLastScaleLength - iPreScaleLength;
					iPreScaleLength = iLastScaleLength;

				}
				_this.displayImg(active);
			}
		},
		displayImg: function(active) {
			var oCtx = oCanvasBg.getContext("2d");
			var oCtxCover = oCanvasCover.getContext("2d");
			var _this = this;
			//用图片最长的一边构成一个正方形，就可以正常显示图片了
			var iFix = oImg.width > oImg.height ? oImg.width : oImg.height;
			oCanvasBg.width = iFix;
			oCanvasBg.height = iFix;
			//Canvas小了里边显示的内容相应的就大了
			//外Canvas是内Canvas的三倍
			oCanvasCover.width = oCanvasBg.width / 3.3;
			oCanvasCover.height = oCanvasBg.height / 3.3;
			oCtx.save();
			if(active.mode == iTranslateMode) {
				if(oActiveTouch) {
					active.x = active.x > 0 ? active.x + 1 : active.x - 1;
					active.y = active.y > 0 ? active.y + 1 : active.y - 1;
					location.translateX += active.x;
					location.translateY += active.y;
					iPreMode = iTranslateMode;
				}
			}
			if(active.mode == iScaleMode) {
				location.scale += (active.scale / 100);
				if(location.scale < 0.5)
					location.scale = 0.5;
				console.log("缩放模式" + this.location.scale);
				iPreMode = iScaleMode;
				oActiveTouch = false;
				clearTimeout(oTimer);

				var oTimer = setTimeout(function() {
					_this.oActiveTouch = true;
					clearTimeout(oTimer);
				}, 800);
			}

			oCtx.translate(location.translateX, location.translateY);
			oCtxCover.translate(location.translateX, location.translateY);
			oCtx.scale(location.scale, location.scale);
			oCtxCover.scale(location.scale, location.scale);

			oCtx.drawImage(oImg, oCanvasBg.width / 2 - oImg.width / 2, oCanvasBg.height / 2 - oImg.height / 2);
			oCtxCover.drawImage(oImg, oCanvasCover.width / 2 - oImg.width / 2, oCanvasCover.height / 2 - oImg.height / 2);
			oCtx.restore();

		}
	}

	obj.create(id);
	obj.displayImg({
		mode: "hold",
	});
	obj.addListener();
	return obj;
}