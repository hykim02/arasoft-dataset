//<![CDATA[
function detectLeftButton(evt){evt = evt || window.event;var button = evt.which || evt.button;return button == 1;}
function findHighestZIndex(selector){
	if (!selector) { selector = "*" };
    var elements = document.querySelectorAll(selector) ||
                   oXmlDom.documentElement.selectNodes(selector),
        i = 0,
        e, s,
        max = elements.length,
        found = [];

    for (; i < max; i += 1) {
        e = elements[i].style.zIndex;
        s = elements[i].style.position;
        if (e && s !== "static") {
          found.push(parseInt(e, 10));
        }
    }

    return found.length ? Math.max.apply(null, found) : 0;
}
function gv(e, v){return e.attr("data-nw-"+v);}
var nw_blind = {
	cName:"nw_blind",
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
			_cellw : 0,
			_pos : [],
			_cursor:{_start:0, _end:0, _left:0, _move:0, _finish:0, _stime:0, _ftime:0, _last:0},
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
			fullview : gv(t, "fullview"),
			item : 3,
			flexible : gv(t, "flexible"),
			blindopacity : gv(t, "blindopacity"),
			_mouse_up:{x:0, t:0},
			_mouse_down:{x:0, t:0}
		}

		var e = {
			init : function(){
				/* Value Reset */
				cf.flexible = gv(t, "flexible");
				cf.blindopacity = gv(t, "blindopacity");
				cf.fullview = gv(t, "fullview");

				/* 초기 및 리사이징시에 자식 레이어 배치 및 정렬 */
				var p = cf._cellw = parseFloat(t.width())*0.5;
				t.find(".blind_prev").css({
					"width":parseFloat(t.width())*0.25,
					"height":t.height(),
					"opacity":1-(cf.blindopacity/100)
				});
				t.find(".blind_next").css({
					"width":parseFloat(t.width())*0.25,
					"height":t.height(),
					"opacity":1-(cf.blindopacity/100)
				});
				
				/* blank li make */
				t.find(".blank").remove();
				t.find("ul").css("left", -((parseFloat(t.width())*0.5)/2)).append("<li class='blank'></li>").prepend("<li class='blank'></li>");
				
				t.find("li").each(function(i){
					cf._pos[i] = p * i;
					$(this).css("left", cf._pos[i]);
					$(this).css({
						"width":p,
						"height":t.height()
					});
					
					if(cf.flexible == "true"){
						if($(this).find("img").attr("src"))$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%", "background-size-x":"100%", "background-size-y":"100%"});
					}else if(cf.flexible == "false"){
						if($(this).find("img").attr("src"))$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"contain"});
					}
					$(this).find("img").css("opacity", "0");
				});

				$(".nw_blind>.np>ul").css("position", "absolute");
				$(".nw_blind >.np>ul>li").css("position", "absolute");
				$(".nw_blind>.np>.blind_prev").css("position", "absolute");
				$(".nw_blind>.np>.blind_next").css("position", "absolute");
				$(".nw_blind_blind").css("position", "absolute");
			},
			exeEvent : function(){
				t.find("ul").unbind();
				t.find("li").unbind();

				if(cf.fullview == "true"){
					t.find("li").css("cursor", "pointer");
					t.find("li").mousedown(function(event){
						if(detectLeftButton(event) == false)return;
						cf._mouse_down = {x:event.clientX, time:event.timeStamp}
					});
					t.find("li").mouseup(function(event){
						cf._mouse_up = {x:event.clientX, time:event.timeStamp}
						if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
							e.view($(this).find("img"));
						}
						
						//clear
						cf._mouse_up = {x:0, time:0}
						cf._mouse_down = {x:0, time:0}
					});
				}else{
					t.find("li").css("cursor", "default");
				}

				t.find("ul")
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
				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._cursor._start = event.clientX;
					cf._cursor._left = parseFloat(t.find("ul").css("left"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._cursor._last = event.clientX;
					cf._tmp = cf._cursor._start-event.clientX;
					cf._cursor._move = cf._cursor._left - cf._tmp;
					cf._cursor._finish = (parseFloat(t.find("li").width()) * (t.find("li").length-(cf.item-1)));
					if(cf._cursor._move < 1 && cf._cursor._move > -(cf._cursor._finish))t.find("ul").css("left", cf._cursor._move);
				}else if(event.type == "dragend"||event.type == "touchend"){
					if(!event.clientX)cf._cursor._end = cf._cursor._last;
					else cf._cursor._end = event.clientX;

					var s = parseFloat(t.find("ul").css("left")) % cf._cellw;
					if(s > -Math.round((cf._cellw*0.5)/cf.item)){
						var r = parseFloat(t.find("ul").css("left")) + Math.abs(s);
						t.find("ul").animate({"left": r-((parseFloat(t.width())*0.5)/2)}, 300);
					}else{
						var r = (parseFloat(t.find("ul").css("left")) + Math.abs(s)) - parseFloat(cf._cellw);
						t.find("ul").animate({"left": r+((parseFloat(t.width())*0.5)/2)}, 300);
					}
				}
				event.preventDefault();
			},
			view : function(d){
				if($("meta[name='viewport']").length < 1){
					var vt = {
						pos:"fixed",
						width:$(window).width(),
						height:$(window).height()
					};
				}else{
					var vt = {
						pos:"absolute",
						width:$("body").width(),
						height:$("body").height()
					};
				}
				$(".nw_blind_clone").remove();
				$("body").append("<div class='nw_blind_clone nw_widget_fullview'></div>"); 
				d.clone().appendTo(".nw_blind_clone").css("opacity","0");
				$(".nw_blind_clone").css({
					"position":vt.pos,
					"background":"url('"+$(".nw_blind_clone").find("img").attr("src")+"')",
					"background-size":"contain",
					"background-repeat":"no-repeat",
					"background-position":"center",
					"background-color":"rgba(0,0,0,0.7)",
					"z-index":(parseFloat(findHighestZIndex())+2),
					"width":vt.width,
					"height":vt.height,
					"top":"0",
					"left":"0",
				}).find("img").css("opacity", "0");
				$(".nw_blind_clone").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				})
				$(".nw_blind_clone").mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
						$(this).remove();
					}
					cf._mouse_up = {x:0, time:0}
					cf._mouse_down = {x:0, time:0}
				});
			}
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){e.init();if(document.body.contentEditable != "true")e.exeEvent();}
	}
}

$(function(){nw_blind.exe()});

/*jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt*/
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>