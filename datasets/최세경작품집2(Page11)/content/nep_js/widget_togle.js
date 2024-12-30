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
var nw_togle = {
	cName: "nw_togle",
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
			direction:gv(t, "direction"),
			roll:gv(t, "roll"),
			flexible:gv(t, "flexible"),
			_tile:gv(t, "tile"),
			tile:0,
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
			_total:t.find("li").length,
			_cursor:{_start:0, _end:0, _left:0, _top:0, _move:0, _finish:0, _last:0},
			_current:0,
			_current_prev:0,
			_current_next:0,
			_pos:[],
			_tmp:0,
			_mouse_up:{x:0, t:0},
			_mouse_down:{x:0, t:0},
			_mouse_up2:{x:0, t:0},
			_mouse_down2:{x:0, t:0},
			_src:[],
			_title:[],
			_desc:[],
			_tilesize:{width:0, height:0}
		};
		if(!cf.direction)cf.direction = "horizental";
		if(!cf.roll)cf.roll = "false";
		if(!cf.flexible)cf.flexible = "false";

		switch(cf.direction){
			case "horizental":
				var _op = t.width();
				var $op = "left";
				break;
			case "vertical":
				var _op = t.height();
				var $op = "top";
				break;
		}

		var e = {
			init : function(){
				/* Value Reset */
				cf.direction = gv(t, "direction");
				cf.flexible = gv(t, "flexible");
				cf._tile = gv(t, "tile");
				cf.tile = cf._tile * cf._tile;
				cf._src = [];
				cf._title = [];
				cf._desc = [];
				
				/* Init */
				t.find("li").each(function(i){
					cf._src[i] = $(this).find("img").attr("src");
					var tit = $(this).attr("data-nw-title");
					var des = $(this).attr("data-nw-desc");

					if(tit)cf._title[i] = unes(tit).substr(0, 10);
					else cf._title[i] = "";
					if(des)cf._desc[i] = unes(des).substr(0, 50);
					else cf._desc[i] = "";
				});
				t.find(".nw_list").hide();
				t.find(".nw_togle_list").html("");

				var count = 0;
				var thumb_count = 0;
				var tr = (cf._total / cf.tile);
				cf._tilesize.width = parseFloat(t.width()) / cf._tile;
				cf._tilesize.height = parseFloat(t.height()) / cf._tile;

				for(var i = 0; i < tr; i++)$("<div\>").appendTo(t.find(".nw_togle_list"));
				t.find(".nw_togle_list>div").each(function(i){
					cf._pos[i] = i * _op;
					if(cf.direction == "horizental")$(this).css({"top":"0px", "left":cf._pos[i]});
					else if(cf.direction == "vertical")$(this).css({"top":cf._pos[i],"left":"0px"});
					$(this).css({"width":t.width(),"height":t.height()});
				});

				for(var i = 0; i < cf._total; i++){
					$("<div\>", {class:"tile"}).attr({"data-nw-title":cf._title[i], "data-nw-desc":cf._desc[i]}).appendTo(t.find(".nw_togle_list>div").eq(thumb_count));
					if(cf.flexible == "true"){	
						$("<div\>").html("<img src='"+cf._src[i]+"' />").appendTo(t.find(".nw_togle_list>div").eq(thumb_count).find(".tile").eq(count));
					}else if(cf.flexible == "false"){
						$("<div\>").css({
							"background-image":"url('"+cf._src[i]+"')",
							"background-size":"contain",
							"background-position":"center",
							"background-repeat":"no-repeat"
						}).appendTo(t.find(".nw_togle_list>div").eq(thumb_count).find(".tile").eq(count));
						$("<img\>").attr("src", cf._src[i]).css("opacity","0").appendTo(t.find(".nw_togle_list>div").eq(thumb_count).find(".tile").eq(count).find("div"));
					}
					count++;
					if(count == cf.tile){
						count = 0;
						thumb_count++;
					}
				}

				t.find(".tile").css({"width":cf._tilesize.width,"height":cf._tilesize.height});
				t.find(".tile div").css({"border":"5px solid transparent","width":cf._tilesize.width-10,"height":cf._tilesize.height-10});
				t.find(".tile img").css({"width":cf._tilesize.width-10,"height":cf._tilesize.height-10});

				cf._total = t.find(".nw_togle_list>div").length;

				$(".nw_togle>.np>.nw_togle_list>div").css("position", "absolute");
			},
			exeEvent : function(){
				/* binding unset */
				t.find(".nw_togle_list>div").unbind();

				/* binding set */
				t.find(".nw_togle_list>div")
				.bind("dragstart", e.dragHandler)
				.bind("drag", e.dragHandler)
				.bind("dragend", e.dragHandler);

				t.find(".tile").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				});
				t.find(".tile").mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200)e.showToggle($(this));
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
			dragHandler : function(event){
				if(t.find(".nw_togle_list").is(":animated"))return;
				var gap = 20;
				if(cf.direction == "horizental")var d = event.clientX;
				else if(cf.direction == "vertical")var d = event.clientY;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._cursor._start = d;
					cf._cursor._left = parseFloat(t.find(".nw_togle_list>div").eq(cf._current).css("left"));
					cf._cursor._top = parseFloat(t.find(".nw_togle_list>div").eq(cf._current).css("top"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._tmp = cf._cursor._start-d;
					cf._cursor._last = d;
					if(cf.direction == "horizental")cf._cursor._move = cf._cursor._left - cf._tmp;
					else if(cf.direction == "vertical")cf._cursor._move = cf._cursor._top - cf._tmp;

					if((cf._current == 0) && cf.roll == "true")cf._current_prev = cf._total-1;
					else cf._current_prev = cf._current-1;
					if((cf._current == cf._total-1) && cf.roll == "true")cf._current_next = 0;
					else cf._current_next = cf._current+1;

					if(cf._total > 1){
						if(cf._current_prev != -1){
							if(cf.direction == "horizental"){
								cf._pos[cf._current_prev] = -t.width();
								t.find(".nw_togle_list>div").eq(cf._current_prev).css("left", cf._cursor._move-_op);
							}else if(cf.direction == "vertical"){
								cf._pos[cf._current_prev] = -t.height();
								t.find(".nw_togle_list>div").eq(cf._current_prev).css("top", cf._cursor._move-_op);
							}
						}

					if(cf._current_prev == -1){
						if(cf._tmp > -gap){
							if(cf.direction == "horizental")t.find(".nw_togle_list>div").eq(cf._current).css("left", cf._cursor._move);
							else if(cf.direction == "vertical")t.find(".nw_togle_list>div").eq(cf._current).css("top", cf._cursor._move);
						}
					}else if(cf._current_next == cf._total){
						if(cf._tmp < gap){
							if(cf.direction == "horizental")t.find(".nw_togle_list>div").eq(cf._current).css("left", cf._cursor._move);
							else if(cf.direction == "vertical")t.find(".nw_togle_list>div").eq(cf._current).css("top", cf._cursor._move);
						}
					}else{
						if(cf.direction == "horizental")t.find(".nw_togle_list>div").eq(cf._current).css("left", cf._cursor._move);
						else if(cf.direction == "vertical")t.find(".nw_togle_list>div").eq(cf._current).css("top", cf._cursor._move);
					}

						if(cf._current_next != cf._total){
							if(cf.direction == "horizental"){
								cf._pos[cf._current_next] = t.width();
								t.find(".nw_togle_list>div").eq(cf._current_next).css("left", cf._cursor._move+_op);
							}else if(cf.direction == "vertical"){
								cf._pos[cf._current_next] = t.height();
								t.find(".nw_togle_list>div").eq(cf._current_next).css("top", cf._cursor._move+_op);
							}
						}
					}

				}else if(event.type == "dragend"||event.type == "touchend"){
					if(!d)cf._cursor._end = cf._cursor._last;
					else cf._cursor._end = d;
					
					if(cf._total > 1){
						if(((cf._cursor._start-cf._cursor._end) > gap) && !t.find(".nw_togle_list>div:eq("+cf._current+")").is(':animated')){
							if(cf._current_next != cf._total){
								e.next();
							}else{
								if(cf.direction == "horizental"){
									t.find(".nw_togle_list>div").eq(cf._current_prev).animate({"left": -t.width()}, 300);
									t.find(".nw_togle_list>div").eq(cf._current).animate({"left": "0px"}, 300);
								}else if(cf.direction == "vertical"){
									t.find(".nw_togle_list>div").eq(cf._current_prev).animate({"top": -t.height()}, 300);
									t.find(".nw_togle_list>div").eq(cf._current).animate({"top": "0px"}, 300);
								}
							}
						}else if(((cf._cursor._start-cf._cursor._end) < -gap) && !t.find(".nw_togle_list>div:eq("+cf._current+")").is(':animated')){
							if(cf._current_prev != -1){
								e.prev();
							}else{
								if(cf.direction == "horizental"){
									t.find(".nw_togle_list>div").eq(cf._current).animate({"left": "0px"}, 300);
									t.find(".nw_togle_list>div").eq(cf._current_next).animate({"left": t.width()}, 300);
								}else if(cf.direction == "vertical"){
									t.find(".nw_togle_list>div").eq(cf._current).animate({"top": "0px"}, 300);
									t.find(".nw_togle_list>div").eq(cf._current_next).animate({"top": t.height()}, 300);
								}
							}
						}else{
							if(cf.direction == "horizental")var o = parseFloat(t.find(".nw_togle_list>div").eq(cf._current).css("left"));
							else if(cf.direction == "vertical")var o = parseFloat(t.find(".nw_togle_list>div").eq(cf._current).css("top"));
							if(o > 0||o < 0){
								if(cf._current_prev != -1){
									if(cf.direction == "horizental"){
										t.find(".nw_togle_list>div").eq(cf._current_prev).animate({"left": -t.width()}, 300);
										cf._pos[cf._current_prev] = -t.width();
									}else if(cf.direction == "vertical"){
										t.find(".nw_togle_list>div").eq(cf._current_prev).animate({"top": -t.height()}, 300);
										cf._pos[cf._current_prev] = -t.height();
									}
								}
								if(cf.direction == "horizental")t.find(".nw_togle_list>div").eq(cf._current).animate({"left": "0px"}, 300);
								else if(cf.direction == "vertical")t.find(".nw_togle_list>div").eq(cf._current).animate({"top": "0px"}, 300);
								if(cf._current_next != cf._total){
									if(cf.direction == "horizental"){
										t.find(".nw_togle_list>div").eq(cf._current_next).animate({"left": t.width()}, 300);
										cf._pos[cf._current_next] = t.width();
									}else if(cf.direction == "vertical"){
										t.find(".nw_togle_list>div").eq(cf._current_next).animate({"top": t.height()}, 300);
										cf._pos[cf._current_next] = t.height();
									}
								}
							}
						}
					}
				}
				event.preventDefault();
			},
			prev : function(){
				if(cf.roll == "true"){
					if(cf._current == 0)cf._current = cf._total-1;
					else cf._current = cf._current-1;

					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += t.width();
						t.find(".nw_togle_list>div").each(function(i){$(this).animate({"left": "+=20px"}, 200).animate({"left":cf._pos[i]}, 300);});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += t.height();
						t.find(".nw_togle_list>div").each(function(i){$(this).animate({"top": "+=20px"}, 200).animate({"top":cf._pos[i]}, 300);});
					}
				//roll false
				}else{
					if((cf._current-1) < 0)return;
					else cf._current--;
					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += t.width();
						t.find(".nw_togle_list>div").each(function(i){$(this).animate({"left": "+=20px"}, 200).animate({"left":cf._pos[i]}, 300);});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += t.height();
						t.find(".nw_togle_list>div").each(function(i){$(this).animate({"top": "+=20px"}, 200).animate({"top":cf._pos[i]}, 300);});
					}
				}
			},
			next : function(){
				if(cf.roll == "true"){
					if(cf._current == cf._total-1)cf._current = 0;
					else cf._current = cf._current+1;

					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= t.width();
						t.find(".nw_togle_list>div").each(function(i){$(this).animate({"left": "-=20px"}, 200).animate({"left":cf._pos[i]}, 300);});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= t.height();
						t.find(".nw_togle_list>div").each(function(i){$(this).animate({"top": "-=20px"}, 200).animate({"top":cf._pos[i]}, 300);});
					}
				//roll false
				}else{
					if((cf._current+1) > (cf._total-1))return;
					else cf._current++;
					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= t.width();
						t.find(".nw_togle_list>div").each(function(i){$(this).animate({"left": "-=20px"}, 200).animate({"left":cf._pos[i]}, 300);});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= t.height();
						t.find(".nw_togle_list>div").each(function(i){$(this).animate({"top": "-=20px"}, 200).animate({"top":cf._pos[i]}, 300);});
					}
				}
			},
			showToggle : function(o){
				o.unbind();
				var txt = {title:o.attr("data-nw-title"), desc:o.attr("data-nw-desc")};
			    $("<div\>", { class: "toggletextLayer" }).css({
                    "position":"absolute",
					"width":"100%",
					"height":"0%"
				}).appendTo(o).animate({
					"height":"100%"
				}, 300, function(){
					e.setToggleContent(o);
					o.mousedown(function(event){
						if(detectLeftButton(event) == false)return;
						cf._mouse_down = {x:event.clientX, time:event.timeStamp}
					});
					o.mouseup(function(event){
						cf._mouse_up = {x:event.clientX, time:event.timeStamp}
						if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
							cf._mouse_up = {x:0, time:0}
							cf._mouse_down = {x:0, time:0}
							o.find(".toggletextLayer").animate({
								"height":"0%"
							}, 300, function(){
								o.find(".toggletextLayer").remove();
								e.rebind(o);
							});
						}
					});	
				});
			},
			setToggleContent : function(o){
				var stc = {
					container : $("<div\>",{class:"tc_container"}),
					titleLayer : $("<div\>",{class:"tc_title"}).html(o.attr("data-nw-title")),
					descLayer : $("<div\>",{class:"tc_desc"}).html(o.attr("data-nw-desc"))
				};

				var tw = cf._tilesize.width - 20;
				var th = cf._tilesize.height -20;

				stc.titleLayer.css({
					"height":th * 0.2,
					"line-height":(th * 0.2)+"px",
					"font-size":(th * 0.2)+"px"
				}).appendTo(stc.container);
				stc.descLayer.css({
					"height":(th * 0.8)-10,
					"font-size":((th * 0.2)*0.8) + "px"
				}).appendTo(stc.container);
				stc.container.appendTo(o.find(".toggletextLayer"));
			},
			rebind : function(o){
				o.mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down2 = {x:event.clientX, time:event.timeStamp}
				});
				o.mouseup(function(event){
					cf._mouse_up2 = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down2.x - cf._mouse_up2.x) < 5 && Math.abs(cf._mouse_up2.time - cf._mouse_down2.time) < 200)e.showToggle(o);
					cf._mouse_up2 = {x:0, time:0}
					cf._mouse_down2 = {x:0, time:0}
				});
			}
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){e.init();if(document.body.contentEditable != "true")e.exeEvent();}
	}
}

$(function(){nw_togle.exe()});

/* jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt */
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>