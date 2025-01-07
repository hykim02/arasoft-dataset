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
var nw_compare = {
	cName: "nw_compare",
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
			roll:gv(t, "roll"),
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
			_total:t.find(".nw_list>li").length,
			_cursor:{_start:0, _end:0, _left:0, _top:0, _move:0, _finish:0, last:0},
			_current:0,
			_current_prev:0,
			_current_next:0,
			_pos:[],
			_tmp:0,
			_mouse_up:{x:0, t:0},
			_mouse_down:{x:0, t:0},
			_dragbar:{_start:0, _end:0, _left:0, _top:0, _move:0, _finish:0},
			lwid:{lf:0, lfleft:0, rt:0, rtleft:0}
		};
		if(!cf.roll)cf.roll = "false";
		if(!cf.flexible)cf.flexible = "false";

		var _op = t.height();
		var $op = "top";

		var e = {
			init : function(){
				/* Value Reset */
				cf.roll = gv(t, "roll");
				cf.flexible = gv(t, "flexible");
				
				/* Init */
				var bar_width = 10;
				var n_width = (parseFloat(t.width())-bar_width)/2;
				t.find(".dragbar").remove();

				t.find(".nw_list>li").each(function(i){
					cf._pos[i] = i * _op;
					$(this).css({"top":cf._pos[i], "left":"0px"});
					$(this).css({"width":t.width(),"height":t.height()});
					$("<div\>",{class:"dragbar"}).css({
						"width":bar_width, 
						"height":t.height(),
						"left":(parseFloat(t.width())-bar_width)/2
					}).appendTo($(this));

					$(this).find("li").each(function(){
						$(this).css({
							"width":(parseFloat(t.width())-bar_width)/2,
							"height":t.height(),
							"top":"0px",
							"left":"0px",
							"background-image":"url('"+$(this).find("img").attr("src")+"')",
							"background-repeat":"no-repeat",
							"background-size":"cover",
							"background-position":"center"
						});
						$(this).find("img").css("opacity","0");
					});
					$(this).find("li:eq(1)").css("left", (parseFloat($(this).find("li:eq(1)").width()))+bar_width);
				});

				$(".nw_compare>.np>.nw_list>li").css("position", "absolute");
				$(".nw_compare>.np>.nw_list>li>ul>li").css("position", "absolute");
				$(".nw_compare>.np>.nw_list>li>.dragbar").css("position", "absolute");
			},
			exeEvent : function(){
				/* binding unset */
				t.find(".nw_list>li").unbind();
				t.find(".dragbar").unbind();

				/* binding set */
				if(t.find(".nw_list>li").length > 1){
					t.find(".nw_list>li")
					.bind("dragstart", e.dragHandler)
					.bind("drag", e.dragHandler)
					.bind("dragend", e.dragHandler);
				}
				
				t.find(".dragbar")
				.bind("dragstart", e.dragHandler2)
				.bind("drag", e.dragHandler2)
				.bind("dragend", e.dragHandler2);
				
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
			fixlayer : function(){
				var count = 0;
				for(var i = cf._current; i < t.find(".nw_list>li").length; i++){
					cf._pos[i] = parseFloat(t.height())*count;
					count++;
				}
				count = cf._current;
				for(var i = 0; i < cf._current; i++){
					cf._pos[i] = -(parseFloat(t.height())*count);
					count--;
				}
				t.find(".nw_list>li").each(function(i){
					$(this).css("top", cf._pos[i]);
				});
			},
			dragHandler : function(event){
				t.find(".nw_list>li").stop();
				if(t.find(".nw_list>li").is(":animated"))return;
				var gap = parseFloat(_op) * 0.4;
				var d = event.clientY;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._cursor._start = d;
					cf._cursor._top = parseFloat(t.find(".nw_list>li").eq(cf._current).css("top"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._tmp = cf._cursor._start-d;
					cf._cursor._last = d;
					cf._cursor._move = cf._cursor._top - cf._tmp;

					if((cf._current == 0) && cf.roll == "true")cf._current_prev = cf._total-1;
					else cf._current_prev = cf._current-1;
					if((cf._current == cf._total-1) && cf.roll == "true")cf._current_next = 0;
					else cf._current_next = cf._current+1;

					if(cf._current_prev != -1 && cf._tmp < 0||cf._current_prev != -1 && cf._total > 3){
						cf._pos[cf._current_prev] = -t.height();
						t.find(".nw_list>li").eq(cf._current_prev).css("top", cf._cursor._move-_op);
					}

					if(cf._current_prev == -1){
						if(cf._tmp > -parseFloat(_op) * 0.1){
							t.find(".nw_list>li").eq(cf._current).css("top", cf._cursor._move);
						}
					}else if(cf._current_next == cf._total){
						if(cf._tmp < parseFloat(_op) * 0.1){
							t.find(".nw_list>li").eq(cf._current).css("top", cf._cursor._move);
						}
					}else{
						t.find(".nw_list>li").eq(cf._current).css("top", cf._cursor._move);
					}

					if(cf._current_next != cf._total && cf._tmp > 0||cf._current_next != cf._total && cf._total > 3){
						cf._pos[cf._current_next] = t.height();
						t.find(".nw_list>li").eq(cf._current_next).css("top", cf._cursor._move+_op);
					}

				}else if(event.type == "dragend"||event.type == "touchend"){
					if(!d)cf._cursor._end = cf._cursor._last;
					else cf._cursor._end = d;

					if(((cf._cursor._start-cf._cursor._end) > gap) && !t.find(".nw_list>li:eq("+cf._current+")").is(':animated')){
						if(cf._current_next != cf._total && cf._tmp > 0||cf._current_next != cf._total && cf._total > 3){
							e.next();
						}else{
							t.find(".nw_list>li").eq(cf._current_prev).animate({"top": -t.height()}, 300);
							t.find(".nw_list>li").eq(cf._current).animate({"top": "0px"}, 300);
						}
					}else if(((cf._cursor._start-cf._cursor._end) < -gap) && !t.find(".nw_list>li:eq("+cf._current+")").is(':animated')){
						if(cf._current_prev != -1 && cf._tmp < 0||cf._current_prev != -1 && cf._total > 3){
							e.prev();
						}else{
							t.find(".nw_list>li").eq(cf._current).animate({"top": "0px"}, 300);
							t.find(".nw_list>li").eq(cf._current_next).animate({"top": t.height()}, 300);
						}
					}else{
						var o = parseFloat(t.find(".nw_list>li").eq(cf._current).css("top"));
						if(o > 0||o < 0){
							if(cf._current_prev != -1 && cf._tmp < 0||cf._current_prev != -1 && cf._total > 3){
								t.find(".nw_list>li").eq(cf._current_prev).animate({"top": -t.height()}, 300);
								cf._pos[cf._current_prev] = -t.height();
							}
							t.find(".nw_list>li").eq(cf._current).animate({"top": "0px"}, 300);
							if(cf._current_next != cf._total && cf._tmp > 0||cf._current_next != cf._total && cf._total > 3){
								t.find(".nw_list>li").eq(cf._current_next).animate({"top": t.height()}, 300);
								cf._pos[cf._current_next] = t.height();
							}
						}
					}
				}
				event.preventDefault();
			},
			dragHandler2 : function(event){
				if(t.find(".nw_list>li").is(":animated"))return;
				var d = event.clientX;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._dragbar._start = d;
					cf._dragbar._left = parseFloat(t.find(".nw_list>li").eq(cf._current).find(".dragbar").css("left"));
					cf.lwid.lf = t.find(".nw_list>li").eq(cf._current).find("li:eq(0)").width();
					cf.lwid.lfleft = parseFloat(t.find(".nw_list>li").eq(cf._current).find("li:eq(0)").css("left"));
					cf.lwid.rt = t.find(".nw_list>li").eq(cf._current).find("li:eq(1)").width();
					cf.lwid.rtleft = parseFloat(t.find(".nw_list>li").eq(cf._current).find("li:eq(1)").css("left"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._tmp = cf._dragbar._start-d;
					var gap = cf._dragbar._left - (cf._dragbar._left - cf._tmp);
					cf._dragbar._move = cf._dragbar._left - cf._tmp;
					
					t.find(".nw_list>li:eq("+cf._current+")").find(".dragbar").css("left", cf._dragbar._move);
					if(gap > 0){
						t.find(".nw_list>li:eq("+cf._current+")").find("li:eq(0)").css({
							"width":(cf.lwid.lf-gap)
						});
						t.find(".nw_list>li:eq("+cf._current+")").find("li:eq(1)").css({
							"width":(cf.lwid.rt+gap),
							"left":(cf.lwid.rtleft-gap)
						});
					}else{
						t.find(".nw_list>li:eq("+cf._current+")").find("li:eq(0)").css({
							"left":"0px",
							"width":(cf.lwid.lf+Math.abs(gap))
						});
						t.find(".nw_list>li:eq("+cf._current+")").find("li:eq(1)").css({
							"left":(cf.lwid.rtleft-gap),
							"width":(cf.lwid.rt+gap)
						});
					}
				}else if(event.type == "dragend"||event.type == "touchend"){
					var bar_width = parseFloat(t.width())*0.02;
					if(parseFloat(t.find(".nw_list>li:eq("+cf._current+")").find(".dragbar").css("left")) > parseFloat(t.width())-10||parseFloat(t.find(".nw_list>li:eq("+cf._current+")").find(".dragbar").css("left")) < 10){
						t.find(".nw_list>li:eq("+cf._current+")").find(".dragbar").animate({"left":(parseFloat(t.width())-bar_width)/2}, 300);
						t.find(".nw_list>li:eq("+cf._current+")").find("li:eq(0)").animate({
							"width":(parseFloat(t.width())-bar_width)/2
						}, 300);
						t.find(".nw_list>li:eq("+cf._current+")").find("li:eq(1)").animate({
							"width":(parseFloat(t.width())-bar_width)/2,
							"left":((parseFloat(t.width())-bar_width)/2)+bar_width
						}, 300);
					}
				}
			},
			prev : function(){
				if(cf.roll == "true"){
					if(cf._current == 0)cf._current = cf._total-1;
					else cf._current = cf._current-1;

					for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += t.height();
					t.find(".nw_list>li").each(function(i){$(this).animate({"top": "+=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
				}else{
					if((cf._current-1) < 0)return;
					else cf._current--;
					for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += t.height();
					t.find(".nw_list>li").each(function(i){$(this).animate({"top": "+=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
				}
			},
			next : function(){
				if(cf.roll == "true"){
					if(cf._current == cf._total-1)cf._current = 0;
					else cf._current = cf._current+1;

					for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= t.height();
					t.find(".nw_list>li").each(function(i){$(this).animate({"top": "-=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
				}else{
					if((cf._current+1) > (cf._total-1))return;
					else cf._current++;

					for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= t.height();
					t.find(".nw_list>li").each(function(i){$(this).animate({"top": "-=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
				}
			}
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){e.init();if(document.body.contentEditable != "true")e.exeEvent();}
	}
}

$(function(){nw_compare.exe()});

/* jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt */
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>