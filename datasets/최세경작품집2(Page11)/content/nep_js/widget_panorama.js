//<![CDATA[
function detectLeftButton(evt){evt = evt || window.event;var button = evt.which || evt.button;return button == 1;}
function gv(e, v){return e.attr("data-nw-"+v);}
var nw_panorama = {
	cName: "nw_panorama",
	exe : function(){
		var _this = this;
		var node = window.getSelection().anchorNode;
		if(!$(node).hasClass(_this.cName))node = "";
		if(node){
			_this.widget("init", $(node));
		}else{
			$("."+_this.cName).each(function(){
				_this.widget("exe", $(this));
			});
		}
	},
	widget : function(action, t){
		if(!$(t).hasClass(this.cName))return;

		var cf = {
			_drag:{_start:0, _prev:0, _move:0, _end:0, _last:0},
			_dragtime:{_start:0, _end:0},
			devt:{start:"", end:""},
			lastx:0
		};
		var e = {
			init : function(){
			    t.find(".nw_panorama li").css("background-image", "url('" + t.find(".nw_panorama img").attr("src") + "')");
			    t.find(".nw_panorama img").hide();

				$(".nw_panorama>.np>.nw_list>li").css("position", "absolute");
			},
			exeEvent : function(){
				t.find("li")
					.bind("dragstart", e.dragHandler)
					.bind("drag", e.dragHandler)
					.bind("dragend", e.dragHandler);

				t.mouseleave(function(){t.trigger("mouseup");});
				t.bind("touchstart", e.touchHandler)
					.bind("touchmove", e.touchHandler)
					.bind("touchend", e.touchHandler);
			},
			touchHandler : function(event){
				var touch = event.originalEvent.changedTouches[0];
				var simulatedEvent = document.createEvent("MouseEvent");
					simulatedEvent.initMouseEvent({
					touchstart: "mousedown",
					touchmove: "mousemove",
					touchend: "mouseup"
				}[event.type], true, true, window, 1,
					touch.screenX, touch.screenY,
					touch.clientX, touch.clientY, false,
					false, false, false, 0, null);
				touch.target.dispatchEvent(simulatedEvent);
				event.preventDefault();
			},
			dragHandler : function(event){
				if(t.find("li").is(":animated"))
					t.find("li").stop();

				cf.lastx = event.clientX ? event : cf.lastx;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf.devt.start = event;
					cf._drag._start = event.clientX;
					//console.log(event.clientX);
					cf._dragtime._start = event.timeStamp;
				}else if(event.type == "drag"||event.type == "touchmove"){
					if(cf._drag._prev != 0){
						cf._drag._move = cf._drag._prev - event.clientX;
						cf._drag._prev = event.clientX;
					}else{
						cf._drag._move = 0;
						cf._drag._prev = event.clientX;
					}

					var now = parseFloat(t.find("li").css("backgroundPosition"));
					
					t.find("li").css("background-position-x",now-cf._drag._move);
				}else if(event.type == "dragend"||event.type == "touchend"){
					//console.log(event.clientX);
					cf.devt.end = cf.lastx;
					e.setFinished();
					
					cf._drag._prev = 0;
				}
				event.preventDefault();
			},
			setFinished : function(){
				var now = parseFloat(t.find("li").css("backgroundPosition"));
				var opt = {
					tm : cf.devt.end.timeStamp - cf.devt.start.timeStamp,
					dis : cf.devt.end.clientX - cf.devt.start.clientX
				};
				
				//console.log(cf.devt.end.timeStamp + "-" + cf.devt.start.timeStamp + " = " + opt.tm);
				//console.log(cf.devt.end.clientX + "-" + cf.devt.start.clientX + " = " + opt.dis);
				//console.log((parseFloat(now) + (opt.dis*3)));
				
				if(opt.dis < 0 && opt.tm < 200||opt.dis > 0 && opt.tm < 200){
					t.find("li").animate({
						'backgroundPosition': (parseFloat(now) + (opt.dis*3)) + "px"
					}, {queue:false,duration:1000,easing:'smoothmove'});
				}
			}
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){e.init();if(document.body.contentEditable != "true")e.exeEvent();}
	}
}

//smoothmove
$.easing.smoothmove = function (x, t, b, c, d) {
	return -c *(t/=d)*(t-2) + b;
};

$(function(){nw_panorama.exe()});

/* jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt */
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>