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
var nw_thumblist2 = {
	cName : "nw_thumblist2",
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
			_cellw:0,
			vitem:gv(t, "vitem"),
			flexible:gv(t, "flexible"),
			vwidth:"",
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding-left"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding-top"))*2),
			_cursor : {_start:"", _top:0, _left:0, _moveX:0, _moveY:0, _end:""},
			_p : 0,
			_limit : {top:0, left:0},
			_tracks : {_start0:{x:0, y:0}, _start1:{x:0, y:0}, _end0:{x:0, y:0}, _end1:{x:0, y:0}},
			_touch : {ide:"", sta:""},
			_mouse_up:{x:0, t:0},
			_mouse_down:{x:0, t:0},
			_tcursor : {_start:0, _left:0, _end:0},
			_bsize:[]
		};

		var e = {
			init : function(){
				/* Value Reset */
				cf.vitem = gv(t, "vitem");
				
				var _w = cf._cellw = (parseFloat(t.width()) / cf.vitem);
				cf.$w = _w;
				
				var count = 0;
				cf.vwidth = (parseFloat(t.width()) / cf.vitem);
				t.find(".nw_list").css("width", ((parseFloat(t.width()) / cf.vitem) * t.find("li").length));
				t.find(".nw_list li").each(function(i){
					$(this).css({
						"width":cf.vwidth,
						"height":"100%",
						"left":(cf.vwidth*i)
					});
					
					$(this).css("background-image", "url('"+$(this).find("img").attr("src")+"')");
					$(this).find("img").css({"width":"0","height":"0","opacity":"0"}).removeClass("nw_thumblist2_pointer");

					if(cf.flexible == "true"){
						$(this).css("background-size", "100% 99.99%");
					}else if(cf.flexible == "false"){
						$(this).css("background-size", "contain");
					}
				});

				$(".nw_thumblist2>.np>ul").css("position", "absolute");
				$(".nw_thumblist2>.np>ul>li").css("position", "absolute");
				$(".nw_thumblist2_blind").css("position", "absolute");
				$(".nw_thumblist2_pointer").css("position", "absolute");
				$(".nw_thumblist2_btn_close").css("position", "absolute");
				$(".nw_thumblist2_sw").css("position", "absolute");
				$(".nw_thumblist2_sw>.np>ul").css("position", "absolute");
				$(".nw_thumblist2_sw>.np>ul>li").css("position", "absolute");
			},
			exeEvent : function(){
				/* binding unset */
				t.find("li").unbind();
				t.find("ul").unbind();

				/* binding set */
				if(cf.flexible == "false"){
					t.find("ul").css("cursor", "default");
					t.find("li").each(function(i){
						var obj = $(this);
						$(this).find("img").one("load", function(){
						}).each(function(){
							var nt = {w:parseFloat($(this).get(0).naturalWidth),h:parseFloat($(this).get(0).naturalHeight)};
							if(nt.w > nt.h){
								var fixheight = parseFloat(nt.h) * (cf._cellw/nt.w);
								if(fixheight > parseFloat(t.height()))fixheight = parseFloat(t.height());
								$("<div\>",{class:"nw_thumblist2_pointer"}).css({
									//"background-image":"url('"+obj.find("img").attr("src")+"')",
									"top":"50%",
									"left":"0px",
									//"margin-top":-(fixheight/2),
									"width":cf._cellw,
									"height":fixheight
								}).appendTo(obj);
								obj.find("img").clone().appendTo(obj.find(".nw_thumblist2_pointer"));
							}else if(nt.h > nt.w){
								var fixwidth = parseFloat(nt.w) * (parseFloat(t.height())/nt.h);
								if(fixwidth > parseFloat(cf._cellw))fixwidth = cf._cellw;
								$("<div\>",{class:"nw_thumblist2_pointer"}).css({
									//"background-image":"url('"+obj.find("img").attr("src")+"')",
									"top":"0px",
									"left":"50%",
									//"margin-left":-(fixwidth/2),
									"width":fixwidth,
									"height":t.height()
								}).appendTo(obj);
								obj.find("img").clone().appendTo(obj.find(".nw_thumblist2_pointer"));
							}else{
								$("<div\>",{class:"nw_thumblist2_pointer"}).css({
									//"background-image":"url('"+obj.find("img").attr("src")+"')",
									"top":"0px",
									"left":"0px",
									"width":cf._cellw,
									"height":t.height()
								}).appendTo(obj);
								obj.find("img").clone().appendTo(obj.find(".nw_thumblist2_pointer"));
							}
							e.zoom_clk();
						});
					});
				}else if(cf.flexible == "true"){
					t.find("ul").css("cursor", "pointer");
					t.find("ul").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
					});
					t.find("ul").mouseup(function(event){
						cf._mouse_up = {x:event.clientX, time:event.timeStamp}
						if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
							e.zoom(t);
						}
						
						//clear
						cf._mouse_up = {x:0, time:0}
						cf._mouse_down = {x:0, time:0}
					});
				}

				//Touch Event add
				t.mouseleave(function(){t.trigger("mouseup");});
				t.bind("touchstart", e.touchHandler)
					.bind("touchmove", e.touchHandler)
					.bind("touchend", e.touchHandler);

				cf._bsize = [];
				t.find("li").each(function(){
					$(this).find("img").one("load", function(){
						var nt = {w:parseFloat($(this).get(0).naturalWidth),h:parseFloat($(this).get(0).naturalHeight)};
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

						var a = parseFloat(vt.width);
						var b = parseFloat(vt.height);
						var zoomw = parseFloat(vt.width)/cf.vitem;
						var fixheight = parseFloat(nt.h) * (zoomw/nt.w);

						var aa = {
							height:fixheight,
							left:"0px",
							top:(parseFloat(vt.height)-fixheight)/2+"px"
						};
						cf._bsize.push(aa);
					}).each(function(){
						if(this.complete){
							$(this).trigger("load");
						}
					});
				});
			},
			zoom_clk : function(){
				t.find(".nw_thumblist2_pointer").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				});
				t.find(".nw_thumblist2_pointer").mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
						e.zoom(t);
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
				var sul = $(".nw_thumblist2_sw ul");
				var zoomw = parseFloat(vt.width)/cf.vitem;
				var os = cf._cellw/zoomw;
				
				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._cursor._start = event.clientX;
					cf._cursor._left = parseFloat(sul.css("left"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._tmp = cf._cursor._start-event.clientX;
					cf._cursor._move = cf._cursor._left - cf._tmp;
					cf._cursor._finish = (parseFloat(sul.find("li").width()) * (sul.find("li").length-cf.vitem));
					if(cf._cursor._move < 1 && cf._cursor._move > -(cf._cursor._finish)){
						sul.css("left", cf._cursor._move);
						t.find("ul").css("left", cf._cursor._move*os);
					}
				}else if(event.type == "dragend"||event.type == "touchend"){
					cf._cursor._end = event.clientX;

					var s = parseFloat(sul.css("left")) % zoomw;
					if(s > -(zoomw/cf.vitem)){
						var r = parseFloat(sul.css("left")) + Math.abs(s);
						sul.animate({"left": r}, 300);
					}else{
						var r = (parseFloat(sul.css("left")) + Math.abs(s)) - zoomw;
						sul.animate({"left": r}, 300);
					}

					var s = parseFloat(t.find("ul").css("left")) % cf._cellw;
					if(s > -(cf._cellw/cf.vitem)){
						var r = parseFloat(t.find("ul").css("left")) + Math.abs(s);
						t.find("ul").animate({"left": r}, 300);
					}else{
						var r = (parseFloat(t.find("ul").css("left")) + Math.abs(s)) - cf._cellw;
						t.find("ul").animate({"left": r}, 300);
					}
				}
				event.preventDefault();
			},
			zoom : function(zd){
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
				t.find(".nw_thumblist2_pointer").hide();
				$(".nw_thumblist2_sw").remove();
				$(".nw_thumblist2_blind").remove();
				var maxZ = parseFloat(findHighestZIndex());
				var zoomw = parseFloat(vt.width)/cf.vitem;
				var zoomr = zoomw/cf._cellw;
				var pos = t.css("position");

				var cp = zd.clone().unbind();
				$("<div\>").attr("class", "nw_thumblist2_blind nw_widget_fullview").css({"z-index":(maxZ+1),"display":"none",
					"position":vt.pos,
					"width":vt.width,
					"height":vt.height
					}).appendTo("body").fadeIn(300);
				
				var ps = {
					top:parseFloat(t.get(0).offsetTop),
					left:parseFloat(t.get(0).offsetLeft)
				};
				cp.bind("touchstart", e.touchHandler)
					.bind("touchmove", e.touchHandler)
					.bind("touchend", e.touchHandler);
				cp.attr("class", "nw_thumblist2_sw").css({
					"position":vt.pos,
					"width":t.css("width"),
					"height":t.css("height"),
					"top":ps.top,
					"left":ps.left,
					"z-index":(maxZ+2),
					"margin-top":t.css("margin-top"),
					"margin-bottom":t.css("margin-bottom"),
					"margin-left":t.css("margin-left"),
					"margin-right":t.css("margin-right"),
					"padding-top":t.css("padding-top"),
					"padding-bottom":t.css("padding-bottom"),
					"padding-left":t.css("padding-left"),
					"padding-right":t.css("padding-right")
				}).appendTo("body");
				cp.find("ul").animate({
					"width":zoomw*t.find("li").length,
					"left":(parseFloat(cp.find("ul").css("left"))*zoomr)
				}, 300);
				var zl = [];
				cp.find("li").each(function(i){
					var now = zoomw - cf._cellw;
					zl[i] = parseFloat($(this).css("left"))+(now*i);
					$(this).animate({
						"width":zoomw,
						"height":cf._bsize[i].height,
						"top":cf._bsize[i].top,
						"left":zl[i]
					}, 300);
				});
				cp.animate({
					"width":vt.width,
					"height":vt.height,
					"top":"0px",
					"left":"0px",
					"padding":"0px",
					"margin":"0px"
				}, 300, function(){
					$(".nw_thumblist2_sw ul")
					.bind("dragstart", e.dragHandler)
					.bind("drag", e.dragHandler)
					.bind("dragend", e.dragHandler);

					$(".nw_thumblist2_sw li").mousedown(function(event){
						if(detectLeftButton(event) == false)return;
						cf._mouse_down = {x:event.clientX, time:event.timeStamp}
					});
					$(".nw_thumblist2_sw li").mouseup(function(event){
						cf._mouse_up = {x:event.clientX, time:event.timeStamp}
						if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
							$(".nw_thumblist2_sw ul").animate({
								"left":t.find("ul").css("left")
							}, 300);
							cp.find("li").each(function(i){
								$(this).animate({
									"width":cf._cellw,
									"height":"100%",
									"top":"0px",
									"left":t.find("li").eq(i).css("left")
								}, 300);
							});
							$(".nw_thumblist2_sw").animate({
								"width":t.width(),
								"height":t.height(),
								"top":ps.top,
								"left":ps.left,
								"margin-top":t.css("margin-top"),
								"margin-bottom":t.css("margin-bottom"),
								"margin-left":t.css("margin-left"),
								"margin-right":t.css("margin-right"),
								"padding-top":t.css("padding-top"),
								"padding-bottom":t.css("padding-bottom"),
								"padding-left":t.css("padding-left"),
								"padding-right":t.css("padding-right")
							}, 300, function(){
								t.find(".nw_thumblist2_pointer").show();
								$(".nw_thumblist2_sw").remove();
								$(".nw_thumblist2_blind").remove();
							});

							//e.exeEvent();
						}
						
						//clear
						cf._mouse_up = {x:0, time:0}
						cf._mouse_down = {x:0, time:0}
					});
				});
			}
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){e.init();if(document.body.contentEditable != "true")e.exeEvent();}
	}
}

/* only contentEditable inherit */
$(function(){nw_thumblist2.exe()});

/* jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt*/
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>