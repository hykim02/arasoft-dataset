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
var nw_tabslider = {
	cName: "nw_tabslider",
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
			fullview:gv(t, "fullview"),
			cu:[],
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
			_cursor:{_start:0, _end:0, _left:0, _top:0, _move:0, _finish:0, _last:0},
			_pos:[],
			_tmp:0,
			_mouse_up:{x:0, t:0},
			_mouse_down:{x:0, t:0},
			_nowSlide:0,
			_imgs:"",
			_tabname:[]
		};
		if(!cf.direction)cf.direction = "horizental";
		if(!cf.roll)cf.roll = "false";
		if(!cf.flexible)cf.flexible = "false";
		if(!cf.fullview)cf.fullview = "false";

		switch(cf.direction){
			case "horizental":
				var _op = parseFloat(t.width());
				var $op = "left";
				break;
			case "vertical":
				var _op = parseFloat(t.height())*0.9;
				var $op = "top";
				break;
		}

		var e = {
			init : function(){
				/* Value Reset */
				cf.direction = gv(t, "direction");
				cf.roll = gv(t, "roll");
				cf.flexible = gv(t, "flexible");
				cf.fullview = gv(t, "fullview");
				
				/* Init */
				t.find(".nw_tabslider ul>li:eq(0)").css("z-index", (parseFloat(findHighestZIndex()) + 1));
				t.find(".nw_tabslider ul>li>ul:eq(0)").css("z-index", (parseFloat(findHighestZIndex()) + 1));
				
				t.find(".nw_tabslider .tabdiv").remove();
				t.find(".nw_tabslider .nw_list").css({
					"width":(parseFloat(t.width())-4),
					"height":(parseFloat(t.height())*0.9)-4
				});
				$("<div\>", {class:"tabdiv"}).css({
					"width":t.width(),
					"height":parseFloat(t.height())*0.1
				}).prependTo(t.find(".nw_tabslider .np"));

				t.find(".nw_tabslider .nw_list>li").each(function (i) {
					var tabName = $(this).attr("data-nw-title");
					if(tabName)cf._tabname[i] = unes($(this).attr("data-nw-title")).substr(0,10);
					else cf._tabname[i] = "tab_"+(i+1);

					$(this).css({
						"left":t.width(),
						"z-index":"0",
						"width":(parseFloat(t.width())-4),
						"height":(parseFloat(t.height())*0.9)-4
					});

					if ((t.find(".nw_tabslider .nw_list>li").length - 1) == $(this).index()) var sz = ((parseFloat(t.width()) - (t.find(".nw_tabslider .nw_list>li").length * 4)) / t.find(".nw_tabslider .nw_list>li").length);
					else var sz = ((parseFloat(t.width()) - (t.find(".nw_tabslider .nw_list>li").length * 4)) / t.find(".nw_tabslider .nw_list>li").length) - 1;
					$("<div\>",{class:"tab"}).html(cf._tabname[i]).css({
						"height":(parseFloat(t.height())*0.1)-2,
						"font-size":((parseFloat(t.height())*0.1)-2)/2 + "px",
						"line-height":(parseFloat(t.height())*0.1)-2 + "px",
						"width":sz
					}).addClass("bg_tab").appendTo(t.find(".nw_tabslider .tabdiv"));
				});
				t.find(".nw_tabslider .nw_list>li>ul").each(function (i) {
					$(this).parent().css({"width":(parseFloat(t.width())-4),"height":(parseFloat(t.height())*0.9)-4});
					var arr = [];
					var cu = { total: $(this).find(".nw_tabslider li").length, current: 0, prev: 0, next: 0 };
					cf.cu.push(cu);

					$(this).css({"width":parseFloat(t.width())-4,"height":(parseFloat(t.height())*0.9)-4});
					$(this).find(".nw_tabslider li").each(function (j) {
						var arr_value = j * _op;
						if(cf.direction == "horizental"){
							$(this).css({"top":"0px", "left":arr_value});
						}else if(cf.direction == "vertical"){
							$(this).css({"top":arr_value,"left":"0px"});
						}

						$(this).css({
							"width":parseFloat(t.width())-4,
							"height":(parseFloat(t.height())*0.9)-4
						});

						if(cf.flexible == "true"){
						    $(this).css({ "background-image": "url('" + $(this).find(".nw_tabslider img").attr("src") + "')", "background-size": "100% 99.99%" });
						}else if(cf.flexible == "false"){
						    $(this).css({ "background-image": "url('" + $(this).find(".nw_tabslider img").attr("src") + "')", "background-size": "contain" });
						}
						$(this).find(".nw_tabslider img").css("opacity", "0");
						arr.push(arr_value);
					});
					cf._pos[i] = arr;
				});
				t.find(".nw_tabslider .tab:eq(0)").addClass("active");
				t.find(".nw_tabslider .nw_list>li").eq(0).css({
					"left":"0px",
					"z-index":"1"
				});

				$(".nw_tabslider>.np>ul>li").css("position", "absolute");
				$(".nw_tabslider>.np>ul>li>ul").css("position", "absolute");
				$(".nw_tabslider>.np>ul>li>ul>li").css("position", "absolute");
				$(".nw_tabslider>.np>ul>li>ul>li>img").css("position", "absolute");
				$(".nw_tabslider>.np>.navigation").css("position", "absolute");
			},
			exeEvent : function(){
				/* binding unset */
			    t.find(".nw_tabslider li").unbind();
			    t.find(".nw_tabslider .thumb").unbind();

				/* binding set */
			    t.find(".nw_tabslider ul>li>ul>li")
				.bind("dragstart", e.dragHandler)
				.bind("drag", e.dragHandler)
				.bind("dragend", e.dragHandler);

				if(cf.fullview == "true"){
				    t.find(".nw_tabslider ul>li>ul>li").css("cursor", "pointer");
				    t.find(".nw_tabslider img").mousedown(function (event) {
						if(detectLeftButton(event) == false)return;
						cf._mouse_down = {x:event.clientX, time:event.timeStamp}
					});
				    t.find(".nw_tabslider img").mouseup(function (event) {
						cf._mouse_up = {x:event.clientX, time:event.timeStamp}
						if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
							cf._imgs = $(this);
							e.view();
						}
						cf._mouse_up = {x:0, time:0}
						cf._mouse_down = {x:0, time:0}
					});
				}else{
				    t.find(".nw_tabslider ul>li>ul>li").css("cursor", "default");
				}

				t.find(".nw_tabslider .tabdiv div").mousedown(function (event) {
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				});
				t.find(".nw_tabslider .tabdiv div").mouseup(function (event) {
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
					    t.find(".nw_tabslider .nw_list>li").css({
							"left":t.width(),
							"z-index":"0"
						});
					    t.find(".nw_tabslider ul>li>ul").css({
							"left":t.width(),
							"z-index":"0"
						});
					    t.find(".nw_tabslider .tab").removeClass("active");
					    t.find(".nw_tabslider .tab:eq(" + $(this).index() + ")").addClass("active");
					    t.find(".nw_tabslider ul>li>ul").eq($(this).index()).css({
							"left":"0px",
							"z-index":(parseFloat(findHighestZIndex())+1)
						});
					    t.find(".nw_tabslider ul>li>ul").eq($(this).index()).parent().css({
							"left":"0px",
							"z-index":(parseFloat(findHighestZIndex())+1)
						});
						cf._nowSlide = $(this).index();
					}
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
				for (var i = cf._current; i < t.find(".nw_tabslider ul li ul").eq(cf._nowSlide).find(".nw_tabslider li").length; i++) {
					if(cf.direction == "horizental")cf._pos[i] = parseFloat(t.width())*count;
					else if(cf.direction == "vertical")cf._pos[i] = _op*count;
					count++;
				}
				count = cf._current;
				for(var i = 0; i < cf._current; i++){
					if(cf.direction == "horizental")cf._pos[i] = -(parseFloat(t.width())*count);
					else if(cf.direction == "vertical")cf._pos[i] = -(_op*count);
					count--;
				}

				t.find(".nw_tabslider ul li ul").eq(cf._nowSlide).find(".nw_tabslider li").each(function (i) {
					if(cf.direction == "horizental")$(this).css("left", cf._pos[i]);
					else if(cf.direction == "vertical")$(this).css("top", cf._pos[i]);
				});
			},
			dragHandler : function(event){
				var gap = 20;
				var idx = cf._nowSlide;
				if(cf.direction == "horizental")var d = event.clientX;
				else if(cf.direction == "vertical")var d = event.clientY;

				if (t.find(".nw_tabslider ul>li>ul:eq(" + idx + ")>li").length < 2) return;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._cursor._start = d;
					cf._cursor._left = parseFloat(t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).css("left"));
					cf._cursor._top = parseFloat(t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).css("top"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._tmp = cf._cursor._start-d;
					cf._cursor._last = d;
					if(cf.direction == "horizental")cf._cursor._move = cf._cursor._left - cf._tmp;
					else if(cf.direction == "vertical")cf._cursor._move = cf._cursor._top - cf._tmp;

					if((cf.cu[idx].current == 0) && cf.roll == "true")cf.cu[idx].prev = cf.cu[idx].total-1;
					else cf.cu[idx].prev = cf.cu[idx].current-1;
					if((cf.cu[idx].current == cf.cu[idx].total-1) && cf.roll == "true")cf.cu[idx].next = 0;
					else cf.cu[idx].next = cf.cu[idx].current+1;

					if(cf.cu[idx].prev != -1 && cf._tmp < 0){
						if(cf.direction == "horizental"){
							cf._pos[idx][cf.cu[idx].prev] = -t.width();
							t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].prev).css("left", cf._cursor._move - _op);
						}else if(cf.direction == "vertical"){
							cf._pos[idx][cf.cu[idx].prev] = -_op;
							t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].prev).css("top", cf._cursor._move - _op);
						}
					}

					if(cf.cu[idx].prev == -1){
						if(cf._tmp > -parseFloat(_op) * 0.1){
						    if (cf.direction == "horizental") t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).css("left", cf._cursor._move);
						    else if (cf.direction == "vertical") t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).css("top", cf._cursor._move);
						}
					}else if(cf.cu[idx].next == cf.cu[idx].total){
						if(cf._tmp < parseFloat(_op) * 0.1){
						    if (cf.direction == "horizental") t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).css("left", cf._cursor._move);
						    else if (cf.direction == "vertical") t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).css("top", cf._cursor._move);
						}
					}else{
					    if (cf.direction == "horizental") t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).css("left", cf._cursor._move);
					    else if (cf.direction == "vertical") t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).css("top", cf._cursor._move);
					}

					if(cf.cu[idx].next != cf.cu[idx].total && cf._tmp > 0){
						if(cf.direction == "horizental"){
							cf._pos[idx][cf.cu[idx].next] = t.width();
							t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].next).css("left", cf._cursor._move + _op);
						}else if(cf.direction == "vertical"){
							cf._pos[idx][cf.cu[idx].next] = _op;
							t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].next).css("top", cf._cursor._move + _op);
						}
					}

				}else if(event.type == "dragend"||event.type == "touchend"){
					if(!d)cf._cursor._end = cf._cursor._last;
					else cf._cursor._end = d;
					
					if (((cf._cursor._start - cf._cursor._end) > gap) && !t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li:eq(" + cf.cu[idx].current + ")").is(':animated')) {
						if(cf.cu[idx].next != cf.cu[idx].total && cf._tmp > 0){
							e.next(idx);
						}else{
							if(cf.direction == "horizental"){
							    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].prev).animate({ "left": -t.width() }, 300);
							    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).animate({ "left": "0px" }, 300);
							}else if(cf.direction == "vertical"){
							    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].prev).animate({ "top": -_op }, 300);
							    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).animate({ "top": "0px" }, 300);
							}
						}
					} else if (((cf._cursor._start - cf._cursor._end) < -gap) && !t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li:eq(" + cf.cu[idx].current + ")").is(':animated')) {
						if(cf.cu[idx].prev != -1 && cf._tmp < 0){
							e.prev(idx);
						}else{
							if(cf.direction == "horizental"){
							    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).animate({ "left": "0px" }, 300);
							    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].next).animate({ "left": t.width() }, 300);
							}else if(cf.direction == "vertical"){
							    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).animate({ "top": "0px" }, 300);
							    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].next).animate({ "top": _op }, 300);
							}
						}
					}else{
					    if (cf.direction == "horizental") var o = parseFloat(t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).css("left"));
					    else if (cf.direction == "vertical") var o = parseFloat(t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).css("top"));
						if(o > 0||o < 0){
							if(cf.cu[idx].prev != -1 && cf._tmp < 0){
								if(cf.direction == "horizental"){
								    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].prev).animate({ "left": -t.width() }, 300);
									cf._pos[idx][cf.cu[idx].prev] = -t.width();
								}else if(cf.direction == "vertical"){
								    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].prev).animate({ "top": -_op }, 300);
									cf._pos[idx][cf.cu[idx].prev] = -_op;
								}
							}
							if (cf.direction == "horizental") t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).animate({ "left": "0px" }, 300);
							else if (cf.direction == "vertical") t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].current).animate({ "top": "0px" }, 300);
							if(cf.cu[idx].next != cf.cu[idx].total && cf._tmp > 0){
								if(cf.direction == "horizental"){
								    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].next).animate({ "left": t.width() }, 300);
									cf._pos[idx][cf.cu[idx].next] = t.width();
								}else if(cf.direction == "vertical"){
								    t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").eq(cf.cu[idx].next).animate({ "top": _op }, 300);
									cf._pos[idx][cf.cu[idx].next] = _op;
								}
							}
						}
					}
				}
				event.preventDefault();
			},
			prev : function(idx){
				if(cf.roll == "true"){
					if(cf.cu[idx].current == 0)cf.cu[idx].current = cf.cu[idx].total-1;
					else cf.cu[idx].current = cf.cu[idx].current-1;

					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos[idx].length; i++)cf._pos[idx][i] += t.width();
						t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").each(function (i) { $(this).animate({ "left": "+=20px" }, 200).animate({ "left": cf._pos[idx][i] }, 300, function () { e.fixlayer() }); });
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos[idx].length; i++)cf._pos[idx][i] += _op;
						t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").each(function (i) { $(this).animate({ "top": "+=20px" }, 200).animate({ "top": cf._pos[idx][i] }, 300, function () { e.fixlayer() }); });
					}
				//roll false
				}else{
					if((cf.cu[idx].current-1) < 0)return;
					else cf.cu[idx].current--;
					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos[idx].length; i++)cf._pos[idx][i] += t.width();
						t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").each(function (i) { $(this).animate({ "left": "+=20px" }, 200).animate({ "left": cf._pos[idx][i] }, 300, function () { e.fixlayer() }); });
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos[idx].length; i++)cf._pos[idx][i] += _op;
						t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").each(function (i) { $(this).animate({ "top": "+=20px" }, 200).animate({ "top": cf._pos[idx][i] }, 300, function () { e.fixlayer() }); });
					}
				}
			},
			next : function(idx){
				if(cf.roll == "true"){
					if(cf.cu[idx].current == cf.cu[idx].total-1)cf.cu[idx].current = 0;
					else cf.cu[idx].current = cf.cu[idx].current+1;

					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos[idx].length; i++)cf._pos[idx][i] -= t.width();
						t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").each(function (i) { $(this).animate({ "left": "-=20px" }, 200).animate({ "left": cf._pos[idx][i] }, 300, function () { e.fixlayer() }); });
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos[idx].length; i++)cf._pos[idx][i] -= _op;
						t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").each(function (i) { $(this).animate({ "top": "-=20px" }, 200).animate({ "top": cf._pos[idx][i] }, 300, function () { e.fixlayer() }); });
					}
					
				//roll false
				}else{
					if((cf.cu[idx].current+1) > (cf.cu[idx].total-1))return;
					else cf.cu[idx].current++;
					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos[idx].length; i++)cf._pos[idx][i] -= t.width();
						t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").each(function (i) { $(this).animate({ "left": "-=20px" }, 200).animate({ "left": cf._pos[idx][i] }, 300, function () { e.fixlayer() }); });
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos[idx].length; i++)cf._pos[idx][i] -= _op;
						t.find(".nw_tabslider ul li ul").eq(idx).find(".nw_tabslider li").each(function (i) { $(this).animate({ "top": "-=20px" }, 200).animate({ "top": cf._pos[idx][i] }, 300, function () { e.fixlayer() }); });
					}
				}
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

				$("<div\>").attr("class","nw_tabslider_clone nw_widget_fullview")
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

$(function(){nw_tabslider.exe()});

/* jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt */
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>