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
var nw_thumblist1 = {
	cName : "nw_thumblist1",
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
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
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
				t.find("ul").css("width", ((parseFloat(t.width()) / cf.vitem) * t.find("li").length));
				t.find("li").each(function(i){
					$(this).css({
						"width":(parseFloat(t.width()) / cf.vitem),
						"height":t.height(),
						"left":(parseFloat(t.width()) / cf.vitem)*i
					});
					
					$(this).css("background-image", "url('"+$(this).find("img").attr("src")+"')");
					$(this).find("img").css({"width":"0","height":"0","opacity":"0"}).removeClass("nw_thumblist1_pointer");

					if(cf.flexible == "true"){
						$(this).css("background-size", "100% 99.99%");
					}else if(cf.flexible == "false"){
						$(this).css("background-size", "contain");
					}
				});

				$(".nw_thumblist1>.np>ul").css("position", "absolute");
				$(".nw_thumblist1>.np>ul>li").css("position", "absolute");
				$(".nw_thumblist1_blind").css("position", "absolute");
				$(".nw_thumblist1_pointer").css("position", "absolute");
			},
			exeEvent : function(){
				/* binding unset */
				t.find("li").unbind();
				t.find("ul").unbind();

				/* binding set */
				if(cf.flexible == "false"){
					t.find("li").css("cursor","default");
					t.find("li").each(function(i){
						var obj = $(this);
						$(this).find("div").remove();
						$(this).find("img").load(function(){
							var nt = {w:parseFloat($(this).get(0).naturalWidth),h:parseFloat($(this).get(0).naturalHeight)};
							if(nt.w > nt.h){
								var fixheight = parseFloat(nt.h) * (cf._cellw/nt.w);
								if(fixheight > parseFloat(t.height()))fixheight = parseFloat(t.height());
								$("<div\>",{class:"nw_thumblist1_pointer"}).css({
									//"background-image":"url('"+obj.find("img").attr("src")+"')",
									"top":"50%",
									"left":"0px",
									//"margin-top":-(fixheight/2),
									"width":cf._cellw,
									"height":fixheight
								}).appendTo(obj);
								obj.find("img").clone().appendTo(obj.find(".nw_thumblist1_pointer"));
							}else if(nt.h > nt.w){
								var fixwidth = parseFloat(nt.w) * (parseFloat(t.height())/nt.h);
								if(fixwidth > parseFloat(cf._cellw))fixwidth = cf._cellw;
								$("<div\>",{class:"nw_thumblist1_pointer"}).css({
									//"background-image":"url('"+obj.find("img").attr("src")+"')",
									"top":"0px",
									"left":"50%",
									//"margin-left":-(fixwidth/2),
									"width":fixwidth,
									"height":t.height()
								}).appendTo(obj);
								obj.find("img").clone().appendTo(obj.find(".nw_thumblist1_pointer"));
							}else{
								$("<div\>",{class:"nw_thumblist1_pointer"}).css({
									//"background-image":"url('"+obj.find("img").attr("src")+"')",
									"top":"0px",
									"left":"0px",
									"width":cf._cellw,
									"height":t.height()
								}).appendTo(obj);
								obj.find("img").clone().appendTo(obj.find(".nw_thumblist1_pointer"));
							}
							e.zoom_clk(obj);
						});
					});
				}else{
					t.find("li").css("cursor","pointer");
					t.find("li").each(function(i){
						e.zoom_clk($(this));
					});
				}
				
				t.find("ul").bind("dragstart", e.dragHandler)
					.bind("drag", e.dragHandler)
					.bind("dragend", e.dragHandler);

				//Touch Event add
				t.mouseleave(function(){t.trigger("mouseup");});
				t.bind("touchstart", e.touchHandler)
					.bind("touchmove", e.touchHandler)
					.bind("touchend", e.touchHandler);

				//cf._bsize = [];
				t.find("li").each(function(){
					var nt = "";
					$(this).find("img").one("load", function(){
						nt = {w:parseFloat($(this).get(0).naturalWidth),h:parseFloat($(this).get(0).naturalHeight)};
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

						var maxWidth = parseFloat(vt.width);
						var maxHeight = parseFloat(vt.height);
						var ratio = 0;
						var width = nt.w;
						var height = nt.h;
						var fixwidth = 0;
						var fixheight = 0;

						var mod = "";

						if(width > height){
							fixwidth = width = maxWidth;
							fixheight = height = (maxWidth/nt.w)*nt.h;
						}
						if(height > width){
							fixheight = height = maxHeight;
							fixwidth = width = (maxHeight/nt.h)*nt.w;
						}
						if(width > maxWidth){
							mod = "a";
							ratio = maxWidth / width;
							fixwidth = maxWidth;
							fixheight = height * ratio;
							height = height * ratio;
							width = width * ratio;
						}
						if(height > maxHeight){
							mod = "b";
							ratio = maxHeight / height;
							fixheight = maxHeight;
							fixwidth = width * ratio;
							width = width * ratio;
							height = height * ratio;
						}

						var aa = {
							"mod":mod,
							width:fixwidth,
							height:fixheight,
							left:(parseFloat(vt.width)-fixwidth)/2+"px",
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
			zoom_clk : function(o){
				o.mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				});
				o.mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
						e.zoom(o);
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
				var d = event.clientX;
				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._tcursor._start = d;
					cf._tcursor._left = parseFloat(t.find("ul").css("left"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					var dragmove = cf._tcursor._left - (cf._tcursor._start - d);
					t.find("ul").css("left", dragmove);
				}else if(event.type == "dragend"||event.type == "touchend"){
					cf._tcursor._end = event.clientX;
					var endl = parseFloat(t.find("ul").css("left"));
					var endo = parseFloat(t.find("ul").width())-(((parseFloat(t.find("ul").find("li").width()))*cf.vitem)-3);
					if(endl > 0)t.find("ul").animate({"left":"0px"}, 200);
					else if(endl < -endo)t.find("ul").animate({"left":-endo}, 200);

					if((endl < 0) && (endl > -endo)){
						var s = parseFloat(t.find("ul").css("left")) % cf._cellw;
						if(s > -Math.round(cf._cellw/cf.vitem)){
							var r = parseFloat(t.find("ul").css("left")) + Math.abs(s);
							t.find("ul").animate({"left": r}, 300);
						}else{
							var r = (parseFloat(t.find("ul").css("left")) + Math.abs(s)) - parseFloat(cf._cellw);
							t.find("ul").animate({"left": r}, 300);
						}
					}
				}
				event.preventDefault();
			},
			zoom : function(e){
				var pos = t.css("position");
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

				if($(".nw_thumblist1_clone").length > 0){$(".nw_thumblist1_clone").remove()}
				if($(".nw_thumblist1_blind").length < 1)$("body").append("<div class='nw_thumblist1_blind'></div>");
				$(".nw_thumblist1_blind").css({
					"position":vt.pos,
					"z-index":(parseFloat(findHighestZIndex())+1),
					"width":vt.width,
					"height":vt.height,
				}).fadeIn(300);
				
				var clone = $(e).clone().appendTo("body").attr("class","nw_thumblist1_clone nw_widget_fullview");
				if(pos != "absolute"){
					var ps = {
						top:parseFloat(t.get(0).offsetTop)+parseFloat(e.get(0).offsetTop)+parseFloat(t.css("padding-top")),
						left:parseFloat(t.get(0).offsetLeft)+parseFloat(e.get(0).offsetLeft)+parseFloat(t.css("padding-left"))+(parseFloat(t.find(".nw_list").css("left")))
					};
				}else{
					var ps = {
						top:parseFloat(t.css("top"))+parseFloat(t.css("padding-top")),
						left:(parseFloat(t.find("ul").css("left"))+e[0].offsetLeft+parseFloat(t.css("left")))+parseFloat(t.css("padding-left"))
					};
				}
				clone.find(".nw_thumblist1_pointer").hide();
				clone.css({
					"position":vt.pos,
					"width":$(e).width(),
					"height":$(e).height(),
					"top":ps.top,
					"left":ps.left,
					"z-index":(parseFloat(findHighestZIndex())+2)
				});
				clone.animate({
					"width":cf._bsize[e.index()].width,
					"height":cf._bsize[e.index()].height,
					"top":cf._bsize[e.index()].top,
					"left":cf._bsize[e.index()].left,
					"margin":"0px",
					"padding":"0px"
				}, 300);
				clone.mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				});
				clone.mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
						if(pos != "absolute"){
							var ps = {
								top:parseFloat(t.get(0).offsetTop)+parseFloat(e.get(0).offsetTop)+parseFloat(t.css("padding-top")),
								left:parseFloat(t.get(0).offsetLeft)+parseFloat(e.get(0).offsetLeft)+parseFloat(t.css("padding-left"))+(parseFloat(t.find(".nw_list").css("left")))
							};
						}else{
							var ps = {
								top:parseFloat(t.css("top"))+parseFloat(t.css("padding-top")),
								left:(parseFloat(t.find("ul").css("left"))+e[0].offsetLeft+parseFloat(t.css("left")))+parseFloat(t.css("padding-left"))
							};
						}
						if(!$(this).is(':animated')){
							$(this).animate({
								"width":e[0].clientWidth,
								"height":e[0].clientHeight,
								"top":ps.top,
								"left":ps.left,
							}, 300);
							$(".nw_thumblist1_blind").fadeOut(300 + 100);
							setTimeout(function(){$(".nw_thumblist1_clone").remove();$(".nw_thumblist1_blind").remove();},300-5);
						}
					}
					
					//clear
					cf._mouse_up = {x:0, time:0}
					cf._mouse_down = {x:0, time:0}
				});
			}
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){e.init();if(document.body.contentEditable != "true")e.exeEvent();}
	}
}

/* only contentEditable inherit */
$(function(){nw_thumblist1.exe()});

/* jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt*/
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>