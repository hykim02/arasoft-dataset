//<![CDATA[
function detectLeftButton(evt){evt = evt || window.event;var button = evt.which || evt.button;return button == 1;}
function gv(e, v){return e.attr("data-nw-"+v);}
function unes(str){return String(unescape(str)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');}
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
var nw_infoinside = {
	cName: "nw_infoinside",
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
			flexible:gv(t, "flexible"),
			fullview:gv(t, "fullview"),
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
			_total:t.find(".nw_list>li").length,
			_cursor:{_start:0, _end:0, _left:0, _top:0, _move:0, _finish:0, _last:0},
			_cursor2:{_start:0, _end:0, _left:0, _top:0, _move:0, _finish:0},
			_current:0,
			_current_prev:0,
			_current_next:0,
			_pos:[],
			_thumbpos:[],
			_title:[],
			_desc:[],
			_tmp:0,
			_mouse_up:{x:0, t:0},
			_mouse_down:{x:0, t:0}
		};
		if(!cf.roll)cf.roll = "false";
		if(!cf.flexible)cf.flexible = "false";
		if(!cf.fullview)cf.fullview = "false";

		var _op = parseFloat(t.height());
		var $op = "top";

		var e = {
			init : function(){
				cf.roll = gv(t, "roll");
				cf.flexible = gv(t, "flexible");
				cf.fullview = gv(t, "fullview");
				
				var tw = parseFloat(t.width())*0.3;
				var th = ((parseFloat(t.height())-80)/5)-1;
				t.find(".thumbdiv").css({
					"width":tw,
					"height":parseFloat(t.height())-80,
					"z-index":(parseFloat(findHighestZIndex())+2)
				}).find("ul").css({"top":"0px","left":"0px"}).html("");
				t.find(".np,.nw_list").css({"width":t.width(), "height":t.height()});
				t.find(".nw_list>li").each(function(i){
					cf._pos[i] = i * _op;

					var tit = $(this).attr("data-nw-title");
					var des = $(this).attr("data-nw-desc");
					if(tit)cf._title[i] = unes(tit).substr(0,16);
					else cf._title[i] = "";
					if(des)cf._desc[i] = unes(des).substr(0,16);
					else cf._desc[i] = "";

					$(this).css({"top":cf._pos[i],"left":"0px","width":t.width(),"height":t.height()});
					if(cf.flexible == "true"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%"});
					}else if(cf.flexible == "false"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"contain"});
					}
					$(this).find("img").css("opacity", "0");

					cf._thumbpos[i] = i * (th+1);
					$("<li\>",{class:"thumb_item"}).css({
						"top":cf._thumbpos[i],
						"width":"100%",
						"height":th
					}).appendTo(t.find(".th_list"));
					
					var ti = {
						container: $("<div\>",{class:"ti_container"}),
						left_thumb: $("<div\>",{class:"ti_thumb"}),
						right_text: $("<div\>",{class:"ti_text"}),
						text_title: $("<div\>",{class:"ti_title"}),
						text_desc: $("<div\>",{class:"ti_desc"})
					};
					ti.left_thumb.css({
						"width":((parseFloat(t.width())*0.3)-10)*0.3,
						"height":th-10,
						"background-image":"url('"+$(this).find("img").attr("src")+"')",
						"background-position":"center",
						"background-size":"cover",
						"background-repeat":"no-repeat"
					}).appendTo(ti.container);
					ti.text_title.css({
						"height":(th-10)*0.4,
						"line-height":((th-10)*0.4)+"px",
						"font-size":(th-10)*0.3
					}).html(cf._title[i]).appendTo(ti.right_text);
					ti.text_desc.css({
						"height":(th-10)*0.6,
						"line-height":((th-10)*0.6)+"px",
						"font-size":(th-10)*0.3
					}).html(cf._desc[i]).css({
						"width":((parseFloat(t.width())*0.3)-14)*0.7
					}).appendTo(ti.right_text);
					ti.right_text.css({
						"width":((parseFloat(t.width())*0.3)-10)*0.7,
						"height":th-10
					}).appendTo(ti.container);
					ti.container.appendTo(t.find(".thumb_item").eq(i));
				});
				t.find(".thumb_item").removeClass("active");
				t.find(".thumb_item:eq(0)").addClass("active");

				$(".nw_infoinside > .np > .nw_list > li").css("position", "absolute");
				$(".nw_infoinside > .np > .nw_list > li > img").css("position", "absolute");
				$(".nw_infoinside > .np > .thumbdiv").css("position", "absolute");
				$(".nw_infoinside > .np > .thumbdiv > ul").css("position", "absolute");
			},
			exeEvent : function(){
				/* binding unset */
				t.unbind();
				t.find(".nw_list>li").unbind();
				t.find(".thumbdiv>.th_list").unbind();
				t.find(".thumb_item").unbind();

				/* binding set */
				t.find(".nw_list>li")
				.bind("dragstart", e.dragHandler)
				.bind("drag", e.dragHandler)
				.bind("dragend", e.dragHandler);

				t.find(".thumbdiv>.th_list")
				.bind("dragstart", e.dragHandler2)
				.bind("drag", e.dragHandler2)
				.bind("dragend", e.dragHandler2);

				if(cf.fullview == "true"){
					t.find(".nw_list>li").css("cursor", "pointer");
					t.find(".nw_list>li").mousedown(function(event){
						if(detectLeftButton(event) == false)return;
						cf._mouse_down = {x:event.clientX, time:event.timeStamp}
					});
					t.find(".nw_list>li").mouseup(function(event){
						cf._mouse_up = {x:event.clientX, time:event.timeStamp}
						if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200)e.view($(this).find("img"));
						/* mouse clear */
						cf._mouse_up = {x:0, time:0}
						cf._mouse_down = {x:0, time:0}
					});
				}else{
					t.find(".nw_list>li").css("cursor", "default");
				}

				t.find(".thumb_item").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				});
				t.find(".thumb_item").mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200)e.gothumb($(this).index());
					/* mouse clear */
					cf._mouse_up = {x:0, time:0}
					cf._mouse_down = {x:0, time:0}
				});

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
					if(cf.direction == "horizental")cf._pos[i] = parseFloat(t.width())*count;
					else if(cf.direction == "vertical")cf._pos[i] = parseFloat(t.height())*count;
					count++;
				}
				count = cf._current;
				for(var i = 0; i < cf._current; i++){
					if(cf.direction == "horizental")cf._pos[i] = -(parseFloat(t.width())*count);
					else if(cf.direction == "vertical")cf._pos[i] = -(parseFloat(t.height())*count);
					count--;
				}

				t.find(".nw_list>li").each(function(i){
					if(cf.direction == "horizental")$(this).css("left", cf._pos[i]);
					else if(cf.direction == "vertical")$(this).css("top", cf._pos[i]);
				});
			},
			dragHandler : function(event){
				var gap = parseFloat(_op) * 0.3;
				var d = event.clientY;

				if(t.find(".nw_list>li").length < 2)return;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._cursor._start = d;
					cf._cursor._top = parseFloat(t.find(".nw_list>li").eq(cf._current).css("top"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._tmp = cf._cursor._start-d;
					cf._cursor._move = cf._cursor._top - cf._tmp;
					cf._cursor._last = d;

					if((cf._current == 0) && cf.roll == "true")cf._current_prev = cf._total-1;
					else cf._current_prev = cf._current-1;
					if((cf._current == cf._total-1) && cf.roll == "true")cf._current_next = 0;
					else cf._current_next = cf._current+1;

					if(cf._current_prev != -1 && cf._tmp < 0){
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

					if(cf._current_next != cf._total && cf._tmp > 0){
						cf._pos[cf._current_next] = t.height();
						t.find(".nw_list>li").eq(cf._current_next).css("top", cf._cursor._move+_op);
					}

				}else if(event.type == "dragend"||event.type == "touchend"){
					if(!d)cf._cursor._end = cf._cursor._last;
					else cf._cursor._end = d;

					if(((cf._cursor._start-cf._cursor._end) > gap) && !t.find("li:eq('"+cf._current+"')").is(':animated')){
						if(cf._current_next != cf._total && cf._tmp > 0){
							e.next();
						}else{
							t.find(".nw_list>li").eq(cf._current_prev).animate({"top": -t.height()}, 300);
							t.find(".nw_list>li").eq(cf._current).animate({"top": "0px"}, 300);
						}
					}else if(((cf._cursor._start-cf._cursor._end) < -gap) && !t.find("li:eq('"+cf._current+"')").is(':animated')){
						if(cf._current_prev != -1 && cf._tmp < 0){
							e.prev();
						}else{
							t.find(".nw_list>li").eq(cf._current).animate({"top": "0px"}, 300);
							t.find(".nw_list>li").eq(cf._current_next).animate({"top": t.height()}, 300);
						}
					}else{
						var o = parseFloat(t.find(".nw_list>li").eq(cf._current).css("top"));
						if(o > 0||o < 0){
							if(cf._current_prev != -1 && cf._tmp < 0){
								t.find(".nw_list>li").eq(cf._current_prev).animate({"top": -t.height()}, 300);
								cf._pos[cf._current_prev] = -t.height();
							}
							t.find(".nw_list>li").eq(cf._current).animate({"top": "0px"}, 300);
							if(cf._current_next != cf._total && cf._tmp > 0){
								t.find(".nw_list>li").eq(cf._current_next).animate({"top": t.height()}, 300);
								cf._pos[cf._current_next] = t.height();
							}
						}
					}
				}
				event.preventDefault();
			},
			dragHandler2 : function(event){
				if(t.find(".th_list>li").length<6)return;
				var d = event.clientY;
				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._cursor2._start = d;
					cf._cursor2._top = parseFloat(t.find(".th_list").css("top"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					var th = ((parseFloat(t.height())-80)/5)-1;
					cf._tmp = cf._cursor2._start-d;
					cf._cursor2._move = cf._cursor2._top - cf._tmp;
					
					if(cf._cursor2._move < 20 && cf._cursor2._move > -(((t.find(".th_list>li").length-5)*(parseFloat(t.find(".th_list>li").height())+1))+20)){
						t.find(".th_list").css("top", cf._cursor2._move);
					}
				}else if(event.type == "dragend"||event.type == "touchend"){
					e.thumbpaging();
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
				e.thumbpaging();
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
				e.thumbpaging();
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
				$(".nw_infoinside_clone").remove();
				$("body").append("<div class='nw_infoinside_clone nw_widget_fullview'></div>"); 
				d.clone().appendTo(".nw_infoinside_clone").css("opacity","1");
				$(".nw_infoinside_clone").css({
					"position":vt.pos,
					"background":"url('"+$(".nw_infoinside_clone").find("img").attr("src")+"')",
					"background-size":"contain",
					"background-repeat":"no-repeat",
					"background-position":"center",
					"background-color":"rgba(0,0,0,0.7)",
					"z-index":(parseFloat(findHighestZIndex())+5),
					"width":vt.width,
					"height":vt.height,
					"top":"0",
					"left":"0",
				}).find("img").css("opacity", "0");
				$(".nw_infoinside_clone").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				})
				$(".nw_infoinside_clone").mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
						$(this).remove();
					}
					cf._mouse_up = {x:0, time:0}
					cf._mouse_down = {x:0, time:0}
				});
			},
			thumbpaging : function(){
				t.find(".thumb_item").removeClass("active");
				t.find(".thumb_item").eq(cf._current).addClass("active");

				if(t.find(".th_list>li").length<6)return;
				var tht = parseFloat(t.find(".th_list").css("top"));
				if(tht > 0){
					t.find(".th_list").animate({"top":"0px"}, 300);
				}else if(tht < -(((t.find(".th_list>li").length-5)*(parseFloat(t.find(".th_list>li").height())+parseFloat(t.find(".th_list>li").css("border-bottom-width")))))){
					var m = -(((t.find(".th_list>li").length-5)*(parseFloat(t.find(".th_list>li").height())+parseFloat(t.find(".th_list>li").css("border-bottom-width")))));
					t.find(".th_list").animate({"top":m}, 300);
				}else{
					if(cf._current == 0){
						t.find(".th_list").animate({"top":"0px"}, 300);
					}else if(cf._current>(cf._total-4)){
						t.find(".th_list").animate({"top":-(((t.find(".th_list>li").length-5)*(parseFloat(t.find(".th_list>li").height())+parseFloat(t.find(".th_list>li").css("border-bottom-width")))))}, 300);
					}else{
						t.find(".th_list").animate({"top":-((parseFloat(t.find(".th_list>li").height())+parseFloat(t.find(".th_list>li").css("border-bottom-width")))*(cf._current-1))}, 300);
					}
				}
			},
			gothumb : function(idx){
				if(t.find(".nw_list>li").is(":animated"))return;
				t.find(".thumb_item").removeClass("active");
				t.find(".thumb_item").eq(idx).addClass("active");
				cf._current = idx;
				if(idx == 0){
					cf._current_prev = cf.total-1;
				}else if(idx == cf.total-1){
					cf._current_next = 0;
				}else{
					cf._current_prev = cf._current--;
					cf._current_next = cf._current++;
				}

				var count = 0;
				for(var i = idx; i < t.find(".nw_list>li").length; i++){
					cf._pos[i] = parseFloat(t.height())*count;
					count++;
				}
				count = idx;
				for(var i = 0; i < idx; i++){
					cf._pos[i] = -(parseFloat(t.height())*count);
					count--;
				}
				t.find(".nw_list>li").css("z-index", "0").eq(cf._current).css("z-index","1");
				t.find(".nw_list>li").each(function(i){
					$(this).animate({"top":cf._pos[i]}, 300);
				});
				e.thumbpaging();
			}
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){e.init();if(document.body.contentEditable != "true")e.exeEvent();}
	}
}

$(function(){nw_infoinside.exe()});

/* jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt */
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>