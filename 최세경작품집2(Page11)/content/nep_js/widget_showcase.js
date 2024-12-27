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
var nw_showcase = {
	cName: "nw_showcase",
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
			_cursor:{_start:0, _end:0, _left:0, _move:0, _finish:0, _stime:0, _ftime:0},
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
			item : gv(t, "item"),
			flexible : gv(t, "flexible"),
			fullview : gv(t, "fullview"),
			_mouse_up:{x:0, t:0},
			_mouse_down:{x:0, t:0}
		}

		var e = {
			init : function(){
				/* Value Reset */
				cf.item = gv(t, "item");
				cf.flexible = gv(t, "flexible");
				cf.fullview = gv(t, "fullview");
				t.find("ul").css("left","0px");

				/* 초기 및 리사이징시에 자식 레이어 배치 및 정렬 */
				var p = cf._cellw = t.width() * (1/cf.item);
				t.find("li").each(function(i){
					cf._pos[i] = p * i;

					$(this).css({
						"left":cf._pos[i],
						"width":p,
						"height":t.height()
					});
					
					/*if(cf.flexible == "true"){
						if(cf.fullview == "true")$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%"}).addClass("nw_showcase_pointer");
						else $(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%"});
						$(this).find("div").remove();
					}else if(cf.flexible == "false"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"contain"}).removeClass("nw_showcase_pointer");
					}*/
					if(cf.flexible == "true"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%"});
					}else if(cf.flexible == "false"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"contain"});
					}
					$(this).find("img").css("opacity", "0");
				});

				$(".nw_showcase>.np>ul").css("position", "absolute");
				$(".nw_showcase>.np>ul>li").css("position", "absolute");
				$(".nw_showcase_blind").css("position", "absolute");
			},
			exeEvent : function(){
				/* binding unset */
				t.find("ul").unbind();
				t.find("li").unbind();
				
				/* binding set */
				/*if(cf.fullview == "true"){
					if(cf.flexible == "false"){
						t.find("li").each(function(i){
							var obj = $(this);
							$(this).find("div").remove();
							$(this).find("img").load(function(){
								var nt = {w:parseFloat($(this).get(0).naturalWidth),h:parseFloat($(this).get(0).naturalHeight)};
								if(nt.w > nt.h){
									var fixheight = parseFloat(nt.h) * (cf._cellw/nt.w);
									$("<div\>",{class:"nw_showcase_pointer"}).css({
										"background-image":"url('"+obj.find("img").attr("src")+"')",
										"top":"50%",
										"left":"0px",
										"margin-top":-(fixheight/2),
										"width":cf._cellw,
										"height":fixheight
									}).appendTo(obj);
									obj.find("img").clone().appendTo(obj.find(".nw_showcase_pointer"));
								}else if(nt.h > nt.w){
									var fixwidth = parseFloat(nt.w) * (parseFloat(t.height())/nt.h);
									$("<div\>",{class:"nw_showcase_pointer"}).css({
										"background-image":"url('"+obj.find("img").attr("src")+"')",
										"top":"0px",
										"left":"50%",
										"margin-left":-(fixwidth/2),
										"width":fixwidth,
										"height":t.height()
									}).appendTo(obj);
									obj.find("img").clone().appendTo(obj.find(".nw_showcase_pointer"));
								}else{
									$("<div\>",{class:"nw_showcase_pointer"}).css({
										"background-image":"url('"+obj.find("img").attr("src")+"')",
										"top":"0px",
										"left":"0px",
										"width":cf._cellw,
										"height":t.height()
									}).appendTo(obj);
									obj.find("img").clone().appendTo(obj.find(".nw_showcase_pointer"));
								}
								e.view_clk();
							});
						});
					}else{
						e.view_clk();
					}
				}else{
					t.find("li").css("cursor", "default");
				}*/

				if(cf.fullview == "true"){
					t.find("ul>li").css("cursor", "pointer");
					t.find("img").mousedown(function(event){
						if(detectLeftButton(event) == false)return;
						cf._mouse_down = {x:event.clientX, time:event.timeStamp}
					});
					t.find("img").mouseup(function(event){
						cf._mouse_up = {x:event.clientX, time:event.timeStamp}
						if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
							cf._imgs = $(this);
							e.view();
						}
						cf._mouse_up = {x:0, time:0}
						cf._mouse_down = {x:0, time:0}
					});
				}else{
					t.find("ul>li").css("cursor", "default");
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
			view_clk : function(){
				t.find(".nw_showcase_pointer").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				});
				t.find(".nw_showcase_pointer").mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
						e.view($(this).find("img"));
					}
					
					//clear
					cf._mouse_up = {x:0, time:0}
					cf._mouse_down = {x:0, time:0}
				});
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
					cf._tmp = cf._cursor._start-event.clientX;
					cf._cursor._move = cf._cursor._left - cf._tmp;
					cf._cursor._finish = (parseFloat(t.find("li").width()) * (t.find("li").length-cf.item));
					if(cf._cursor._move < 1 && cf._cursor._move > -(cf._cursor._finish))t.find("ul").css("left", cf._cursor._move);
				}else if(event.type == "dragend"||event.type == "touchend"){
					cf._cursor._end = event.clientX;

					var s = parseFloat(t.find("ul").css("left")) % cf._cellw;
					if(s > -Math.round(cf._cellw/cf.item)){
						var r = parseFloat(t.find("ul").css("left")) + Math.abs(s);
						t.find("ul").animate({"left": r}, 300);
					}else{
						var r = (parseFloat(t.find("ul").css("left")) + Math.abs(s)) - parseFloat(cf._cellw);
						t.find("ul").animate({"left": r}, 300);
					}
				}
				event.preventDefault();
			},
			view : function(){
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

				var txt = cf._imgs.get(0).src;
				txt = txt.replace("ibooks://", "ibooksimg://");		//iBooks ImgURL Replace

				$("<div\>").attr("class","nw_showcase_clone nw_widget_fullview")
				.css({
					"position":vt.pos,
					"background-image":"url('"+txt+"')",
					"background-size":"contain",
					"background-repeat":"no-repeat",
					"background-position":"center",
					"background-color":"rgba(0,0,0,0.7)",
					"top":"0px",
					"left":"0px",
					"width":vt.width,
					"height":vt.height,
					"z-index":(parseFloat(findHighestZIndex())+2)
				})
				.appendTo("body")
				.click(function(){
					$(this).remove();
				});
			},
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){e.init();if(document.body.contentEditable != "true")e.exeEvent();}
	}
}
$(function(){nw_showcase.exe()});

/*jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt*/
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>