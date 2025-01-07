//<![CDATA[
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
function detectLeftButton(evt){evt = evt || window.event;var button = evt.which || evt.button;return button == 1;}
function gv(e, v){return e.attr("data-nw-"+v);}
var nw_slider2 = {
	cName:"nw_slider2",
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
		
		var divBG = t.find(".bg");
		var divL = t.find(".nw_list");
		var cf = {
			imgset:gv(t, "imgset"),
			fullview:gv(t, "fullview"),
			tsize:{w:0,h:0},
			total:divL.find("li").length,
			cursor:{start:0,left:0,end:0},
			now:{current:0, prev:0, next:1},
			nowpos:{current:0, prev:0, next:0},
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
			_mouse_down:{x:0, time:0},
			_mouse_up:{x:0, time:0},
			pos:[],
			size:0
		};

		if(!cf.imgset)cf.imgset = "cover";
		if(!cf.fullview)cf.fullview = "false";

		var e = {
			init : function(){
				/* configure reset */
				divBG.css("z-index", "0");
				divL.css("z-index", (parseFloat(findHighestZIndex())+2));
				cf.tsize.w = parseFloat(t.width());
				cf.tsize.h = parseFloat(t.height());
				cf.size = parseFloat(t.width()*0.8);

				/* background init */
				if(divBG.find("div").length < 1)for(var i = 0; i < 3; i++)divBG.append(document.createElement("div"));
				divBG.find("div").each(function(i){
					$(this).css({"width":cf.size,"height":t.height(),"top":"0px"});
					cf.nowpos = {prev:-(cf.size - (cf.tsize.w * 0.1)),current:parseFloat(t.width())*0.1,next:(cf.tsize.w * 0.9)};
					if(i == 0)$(this).css("left", cf.nowpos.prev);
					if(i == 1)$(this).css("left", cf.nowpos.current);
					if(i == 2)$(this).css("left", cf.nowpos.next);
				});

				/* list init */
				divL.find("li").each(function(i){
					$(this).css({
						"background-image":"url('"+$(this).find("img").attr("src")+"')",
						"width":cf.size,
						"height":t.height(),
						"top":"0px"
					});
					$(this).css("left", t.width());
					if(cf.imgset == "contain"){
						$(this).css({
							"background-image":"url('"+$(this).find("img").attr("src")+"')",
							"background-size":"contain"
						});
						$(this).find("img").css({
							"opacity":"0"
						});
					}else if(cf.imgset == "cover"){
						$(this).css({
							"background-image":"url('"+$(this).find("img").attr("src")+"')",
							"background-size":"cover"
						});
						$(this).find("img").css({
							"opacity":"0"
						});
					}else if(cf.imgset == "fill"){
						$(this).css({
							"background-image":"",
							"background-size":""
						});
						$(this).find("img").css({
							"width":"100%",
							"height":"100%",
							"opacity":"1"
						});
					}
				});
				
				if(divL.find("li").length > 3){
					divL.find("li").eq(0).css("left", cf.nowpos.current);
					divL.find("li").eq(1).css("left", cf.nowpos.next);
					divL.find("li").eq(cf.total-1).css("left", cf.nowpos.prev);
				}else{
					divL.find("li").eq(1).css("left", cf.nowpos.next);
					divL.find("li").eq(cf.total-1).css("left", cf.nowpos.prev);
					divL.find("li").eq(0).css({
						"width":cf.size,
						"height":t.height(),
						"left":cf.nowpos.current
					});
				}

				cf.now.prev = cf.total-1;
				cf.now.current = 0;
				cf.now.next = 1;

				divL.find("li").eq(cf.now.prev).css("background-position", "right center");
				if (divL.find("li").length > 2) divL.find("li").eq(cf.now.next).css("background-position", "left center");

				$(".nw_slider2>.np>.nw_list>li").css("position", "absolute");
				$(".nw_slider2>.np>.bg").css("position", "absolute");
				$(".nw_slider2>.np>.bg>div").css("position", "absolute");
			},
			exeEvent : function(){
				divL.find("li").unbind();
				if(divL.find("li").length > 1){
					divL.find("li")
						.bind("dragstart", e.dragHandler)
						.bind("drag", e.dragHandler)
						.bind("dragend", e.dragHandler);
				}

				if(cf.fullview == "true"){
					divL.find("li").css("cursor", "pointer");
					divL.find("li").mousedown(function(event){
						if(detectLeftButton(event) == false)return;
						cf._mouse_down = {x:event.clientX, time:event.timeStamp}
					});
					divL.find("li").mouseup(function(event){
						cf._mouse_up = {x:event.clientX, time:event.timeStamp}
						if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200)e.view($(this).find("img"));
						cf._mouse_up = {x:0, time:0}
						cf._mouse_down = {x:0, time:0}
					});
				}else{
					divL.find("li").css("cursor", "default");
				}

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
				t.find("li").stop();
				if(t.find("li").is(":animated"))return;
				var gap = 20;
				var d = event.clientX;
				var limit = 0;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf.cursor.start = d;
					cf.cursor.prev = parseFloat(divL.find("li").eq(cf.now.prev).css("left"));
					cf.cursor.current = parseFloat(divL.find("li").eq(cf.now.current).css("left"));
					cf.cursor.next = parseFloat(divL.find("li").eq(cf.now.next).css("left"));
					t.find("li").css("background-position", "center");
				}else if(event.type == "drag"||event.type == "touchmove"){
					var move_prev = parseFloat(cf.cursor.prev)-(cf.cursor.start-d);
					var move_current = parseFloat(cf.cursor.current)-(cf.cursor.start-d);
					var move_next = parseFloat(cf.cursor.next)-(cf.cursor.start-d);
					if(move_current > (cf.nowpos.prev+(cf.size/2)) && move_current < (cf.nowpos.next-(cf.size/2))){
						if(t.find("li").length>2){
							divL.find("li").eq(cf.now.prev).css("left", move_prev);
							divL.find("li").eq(cf.now.current).css("left", move_current);
							divL.find("li").eq(cf.now.next).css("left", move_next);
						}else{
							var o = cf.cursor.start - d;
							if(o < 0 && cf.now.current == 0){
								divL.find("li").eq(cf.now.prev).css("left", move_prev);
								divL.find("li").eq(cf.now.current).css("left", move_current);
							}else if(o > 0 && cf.now.current == 1){
								divL.find("li").eq(cf.now.current).css("left", move_current);
								divL.find("li").eq(cf.now.next).css("left", move_next);
							}
						}
					}
				}else if(event.type == "dragend"||event.type == "touchend"){
					cf.cursor.prev = parseFloat(divL.find("li").eq(cf.now.prev).css("left"));
					cf.cursor.current = parseFloat(divL.find("li").eq(cf.now.current).css("left"));
					cf.cursor.next = parseFloat(divL.find("li").eq(cf.now.next).css("left"));
					var o = cf.cursor.start - d;

					if(cf.cursor.current > (cf.nowpos.current+gap)){
						if(cf.now.prev != 0)var newprev = cf.now.prev-1;
						else var newprev = cf.total-1;

						if(t.find("li").length>2)divL.find("li").eq(newprev).css("left",-cf.tsize.w).animate({"left":cf.nowpos.prev}, 200);
						if(t.find("li").length < 3 && o < 0 && cf.now.current == 0||t.find("li").length > 2){
							divL.find("li").eq(cf.now.prev).animate({"left":cf.nowpos.current}, 200);
							divL.find("li").eq(cf.now.current).animate({"left":cf.nowpos.next}, 200, function(){e.setLR()});
						}
						//divL.find("li").eq(cf.now.next).animate({"left":cf.tsize.w}, 200);

						e.counter("prev");
					}else if(cf.cursor.current < -(cf.nowpos.current-gap)){
						if(cf.now.next != (cf.total-1))var newnext = cf.now.next+1;
						else var newnext = 0;

						//divL.find("li").eq(cf.now.prev).animate({"left":-cf.tsize.w}, 200);
						if(t.find("li").length < 3 && o > 0 && cf.now.current == 1||t.find("li").length > 2){
							divL.find("li").eq(cf.now.current).animate({"left":cf.nowpos.prev}, 200);
							divL.find("li").eq(cf.now.next).animate({"left":cf.nowpos.current}, 200, function(){e.setLR()});
						}
						if(t.find("li").length>2)divL.find("li").eq(newnext).css("left",cf.tsize.w*1.5).animate({"left":cf.nowpos.next}, 200);

						e.counter("next");
					}else{
						if(t.find("li").length > 2){
							divL.find("li").eq(cf.now.prev).animate({"left":cf.nowpos.prev}, 200);
							divL.find("li").eq(cf.now.current).animate({"left":cf.nowpos.current}, 200, function(){e.setLR()});
							divL.find("li").eq(cf.now.next).animate({"left":cf.nowpos.next}, 200);
						}else{
							if(o < 0 && cf.now.current == 0){
								divL.find("li").eq(cf.now.prev).animate({"left":cf.nowpos.prev}, 200);
								divL.find("li").eq(cf.now.current).animate({"left":cf.nowpos.current}, 200, function(){e.setLR()});
							}else if(o > 0 && cf.now.current == 1){
								divL.find("li").eq(cf.now.current).animate({"left":cf.nowpos.current}, 200, function(){e.setLR()});
								divL.find("li").eq(cf.now.next).animate({"left":cf.nowpos.next}, 200);
							}
						}
					}
				}
				event.preventDefault();
			},
			setLR : function(){
				if(cf.imgset == "contain"){
					divL.find("li").eq(cf.now.prev).css("background-position", "right center");
					if(divL.find("li").length>2||cf.now.current != 0)divL.find("li").eq(cf.now.next).css("background-position", "left center");
				}
			},
			counter : function(mod){
				if(mod == "prev"){
					if(cf.now.current == 0){
						cf.now.prev = cf.total-2;
						cf.now.current = cf.total-1;
						cf.now.next = 0;
					}else{
						if(cf.now.prev == 0)cf.now.prev = cf.total-1;
						else cf.now.prev--;
						cf.now.current--;
						if(cf.now.next == 0)cf.now.next = cf.total-1;
						else cf.now.next--;
					}
				}else if(mod == "next"){
					if(cf.now.current == (cf.total-1)){
						cf.now.prev = cf.total-1;
						cf.now.current = 0;
						cf.now.next = 1;
					}else{
						if(cf.now.prev == (cf.total-1))cf.now.prev = 0;
						else cf.now.prev++;
						cf.now.current++;
						if(cf.now.next == (cf.total-1))cf.now.next = 0;
						else cf.now.next++;
					}
				}
			},
			effect : function(){
				/*t.find("li").eq(cf.now.current).css("z-index","1");
				t.find("li").eq(cf.now.prev).css("z-index","2");
				t.find("li").eq(cf.now.next).css("z-index","2");*/
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
				$(".nw_slider2_clone").remove();
				$("body").append("<div class='nw_slider2_clone nw_widget_fullview'></div>"); 
				d.clone().appendTo(".nw_slider2_clone").css("opacity","0");
				$(".nw_slider2_clone").css({
					"position":vt.pos,
					"background":"url('"+$(".nw_slider2_clone").find("img").attr("src")+"')",
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
				$(".nw_slider2_clone").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				})
				$(".nw_slider2_clone").mouseup(function(event){
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
$(function(){nw_slider2.exe()});

/* jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt*/
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>