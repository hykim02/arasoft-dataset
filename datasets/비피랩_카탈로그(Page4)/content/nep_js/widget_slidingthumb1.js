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
var nw_slidingthumb1 = {
	cName:"nw_slidingthumb1",
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

		var divS = t.find(".slide");
		var divT = "";

		var cf = {
			direction:gv(t, "direction"),
			roll:gv(t, "roll"),
			thumb:gv(t, "thumb"),
			thumbrow:gv(t, "thumbrow"),
			thumbposition:gv(t, "thumbposition"),
			fullview:gv(t, "fullview"),
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
			_total:divS.find("li").length,
			_cursor:{_start:0, _end:0, _left:0, _top:0, _move:0, _finish:0, _last:0},
			_tcursor:{_start:0, _end:0, _left:0, _top:0, _move:0, _finish:0},
			_current:0,
			_current_prev:0,
			_current_next:0,
			_pos:[],
			_tpos:[],
			_tmp:0,
			_mouse_up:{x:0, t:0},
			_mouse_down:{x:0, t:0},
			flexible:gv(t, "flexible")
		};

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
				cf.roll = gv(t, "roll");
				cf.thumb = gv(t, "thumb");
				cf.thumbrow = gv(t, "thumbrow");
				cf.thumbposition = gv(t, "thumbposition");
				cf.fullview = gv(t, "fullview");

				t.find(".thumb_horizental").remove();
				t.find(".thumb_vertical").remove();
				var td = document.createElement("div");
				var uld = document.createElement("ul");
				
				if(cf.thumbposition == "left"){
					if(cf.direction == "horizental")_op = parseFloat(t.width())*0.8;
					else if(cf.direction == "vertical")_op = parseFloat(t.height());
					
					$(td).attr("class","thumb_horizental");
					t.find(".np").prepend(td);
					t.find(".thumb_horizental").append(uld);
					divT = t.find(".thumb_horizental");

					t.find(".np").css("display","table");
					divS.css({"display":"table-cell","width":parseFloat(t.width())*0.8,"height":t.height()});
					divT.css({"display":"table-cell","z-index":(parseFloat(findHighestZIndex())+2), "width":(parseFloat(t.width())*0.2), "height":(parseFloat(t.height()))});
					divT.find("ul").html("");
				}else if(cf.thumbposition == "right"){
					if(cf.direction == "horizental")_op = parseFloat(t.width())*0.8;
					else if(cf.direction == "vertical")_op = parseFloat(t.height());
					$(td).attr("class","thumb_horizental");
					t.find(".np").append(td);
					t.find(".thumb_horizental").append(uld);
					divT = t.find(".thumb_horizental");

					t.find(".np").css("display","table");
					divS.css({"display":"table-cell","width":parseFloat(t.width())*0.8,"height":t.height()});
					divT.css({"display":"table-cell","z-index":(parseFloat(findHighestZIndex())+2), "width":(parseFloat(t.width())*0.2), "height":(parseFloat(t.height()))});
					divT.find("ul").html("");
				}else if(cf.thumbposition == "top"){
					if(cf.direction == "horizental")_op = parseFloat(t.width());
					else if(cf.direction == "vertical")_op = parseFloat(t.height())*0.7;
					$(td).attr("class","thumb_vertical");
					t.find(".np").prepend(td);
					t.find(".thumb_vertical").append(uld);
					divT = t.find(".thumb_vertical");

					t.find(".np").css("display","");
					divS.css({"display":"","width":t.width(),"height":(parseFloat(t.height()) * 0.7)});
					divT.css({"display":"","z-index":(parseFloat(findHighestZIndex())+2), "width":(parseFloat(t.width())), "height":(parseFloat(t.height()) * 0.3)});
					divT.find("ul").html("");
				}else if(cf.thumbposition == "bottom"){
					if(cf.direction == "horizental")_op = parseFloat(t.width());
					else if(cf.direction == "vertical")_op = parseFloat(t.height())*0.7;
					$(td).attr("class","thumb_vertical");
					t.find(".np").append(td);
					t.find(".thumb_vertical").append(uld);
					divT = t.find(".thumb_vertical");

					t.find(".np").css("display","");
					divS.css({"display":"","width":t.width(),"height":(parseFloat(t.height()) * 0.7)});
					divT.css({"display":"","z-index":(parseFloat(findHighestZIndex())+2), "width":(parseFloat(t.width())), "height":(parseFloat(t.height()) * 0.3)});
					divT.find("ul").html("");
				}

				t.find("li").each(function(i){
					cf._pos[i] = i * _op;
					if(cf.direction == "horizental")$(this).css({"left":cf._pos[i],"top":"0px"});
					else if(cf.direction == "vertical")$(this).css({"left":"0px","top":cf._pos[i]});

					if(cf.thumbposition == "top"||cf.thumbposition == "bottom"){
						$(this).css({
							"width":t.width(),
							"height":(parseFloat(t.height()) * 0.7)
						});
						divT.find("ul").css("height",(parseFloat(t.height()) * 0.3)).append("<li></li>");
						divT.find("li").css("height", (parseFloat(t.height()) * 0.3)-10);
						var w = (parseFloat(t.width())/cf.thumbrow);
						divT.find("ul li").removeClass("active");
						divT.find("ul li:eq(0)").addClass("active");
						divT.find("ul li:eq("+i+")").css({
							"width":w-10,
							"padding":"0px 0px 0px 0px",
							"top":"0px",
							"left":(i * w)
						}).append($(this).find("img").clone());
					}else if(cf.thumbposition == "left"||cf.thumbposition == "right"){
						$(this).css({
							"width":parseFloat(t.width())*0.8,
							"height":t.height()
						});
						divT.find("ul").css("height",t.height()).append("<li></li>");
						divT.find("li").css("width", (parseFloat(t.width())*0.2)-10);
						var h = (parseFloat(t.height())/cf.thumbrow);
						divT.find("ul li").removeClass("active");
						divT.find("ul li:eq(0)").addClass("active");
						divT.find("ul li:eq("+i+")").css({
							"height":h-10,
							"padding":"0px 0px 0px 0px",
							"top":(i * h),
							"left":"0px"
						}).append($(this).find("img").clone());
					}

					if(cf.flexible == "true"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%"});
					}else if(cf.flexible == "false"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"contain"});
					}
					$(this).find("img").css("opacity", "0");
				});
				divT.find("li").each(function(i){
					if(cf.flexible == "true"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%"});
					}else if(cf.flexible == "false"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"contain"});
					}
					$(this).find("img").css("opacity", "0");
				});

				$(".nw_slidingthumb1>.np>ul>li").css("position", "absolute");
				$(".nw_slidingthumb1>.np>.thumb_horizental>ul>li").css("position", "absolute");
				$(".nw_slidingthumb1>.np>.thumb_vertical>ul>li").css("position", "absolute");
				$(".nw_slidingthumb1_blind").css("position", "absolute");
			},
			exeEvent : function(){
				divS.find("li").unbind();
				divT.find("ul").unbind();

				divS.find("li")
				.bind("dragstart", e.dragHandler)
				.bind("drag", e.dragHandler)
				.bind("dragend", e.dragHandler);

				divT.find("ul")
				.bind("dragstart", e.dragHandler2)
				.bind("drag", e.dragHandler2)
				.bind("dragend", e.dragHandler2);

				divT.find("li").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				});
				divT.find("li").mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
						e.paging($(this).index());
					}
					
					//clear
					cf._mouse_up = {x:0, time:0}
					cf._mouse_down = {x:0, time:0}
				});

				if(cf.fullview == "true"){
					divS.find("li").css("cursor", "pointer");
					divS.find("li").mousedown(function(event){
						if(detectLeftButton(event) == false)return;
						cf._mouse_down = {x:event.clientX, time:event.timeStamp}
					});
					divS.find("li").mouseup(function(event){
						cf._mouse_up = {x:event.clientX, time:event.timeStamp}
						if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
							e.view($(this).find("img"));
						}
						
						//clear
						cf._mouse_up = {x:0, time:0}
						cf._mouse_down = {x:0, time:0}
					});
				}else{
					divS.find("li").css("cursor", "default");
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
			dragHandler2 : function(event){
				if(cf.thumbposition == "top"||cf.thumbposition == "bottom")var d = event.clientX;
				else if(cf.thumbposition == "left"||cf.thumbposition == "right")var d = event.clientY;
				
				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._tcursor._start = d;
					cf._tcursor._left = parseFloat(divT.find("li:eq(0)").css("left"));
					cf._tcursor._top = parseFloat(divT.find("li:eq(0)").css("top"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					var tmp = cf._tcursor._start-d;
					if(cf.thumbposition == "top"||cf.thumbposition == "bottom"){
						cf._tcursor._move = cf._tcursor._left - tmp;
						divT.find("ul li").each(function(i){
							if(tmp > 0)$(this).css("left", cf._tcursor._move + (i * (parseFloat($(this).width())+10)));
							else $(this).css("left", cf._tcursor._move + (i * (parseFloat($(this).width())+10) ));
						});
					}else if(cf.thumbposition == "left"||cf.thumbposition == "right"){
						cf._tcursor._move = cf._tcursor._top - tmp;
						divT.find("ul li").each(function(i){
							if(tmp > 0)$(this).css("top", cf._tcursor._move + (i * (parseFloat($(this).height())+10)));
							else $(this).css("top", cf._tcursor._move + (i * (parseFloat($(this).height())+10) ));
						});
					}
				}else if(event.type == "dragend"||event.type == "touchend"){
					if(cf.thumbposition == "top"||cf.thumbposition == "bottom"){
						if(parseFloat(divT.find("li:eq(0)").css("left")) > 0){
							divT.find("ul li").each(function(i){
								$(this).animate({"left": 0 + (i * (parseFloat($(this).width())+10))}, 200);
							});
						}else if(parseFloat(divT.find("li:eq(0)").css("left")) < -(((divT.find("li").length-cf.thumbrow) * (parseFloat(divT.find("li").width())+10)))){
							divT.find("ul li").each(function(i){
								$(this).animate({"left": -(((divT.find("li").length-cf.thumbrow) * (parseFloat(divT.find("li").width())+10))) + (i * (parseFloat($(this).width())+10))}, 200);
							});
						}
					}else if(cf.thumbposition == "left"||cf.thumbposition == "right"){
						if(parseFloat(divT.find("li:eq(0)").css("top")) > 0){
							divT.find("ul li").each(function(i){
								$(this).animate({"top": 0 + (i * (parseFloat($(this).height())+10))}, 200);
							});
						}else if(parseFloat(divT.find("li:eq(0)").css("top")) < -(((divT.find("li").length-cf.thumbrow) * (parseFloat(divT.find("li").height())+10)))){
							divT.find("ul li").each(function(i){
								$(this).animate({"top": -(((divT.find("li").length-cf.thumbrow) * (parseFloat(divT.find("li").height())+10))) + (i * (parseFloat($(this).height())+10))}, 200);
							});
						}
					}
				}
				event.preventDefault();
			},
			fixlayer : function(){
				var count = 0;
				for(var i = cf._current; i < divS.find("li").length; i++){
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

				divS.find("li").each(function(i){
					if(cf.direction == "horizental")$(this).css("left", cf._pos[i]);
					else if(cf.direction == "vertical")$(this).css("top", cf._pos[i]);
				});
			},
			dragHandler : function(event){
				divS.find("li").stop();
				if(divS.find("li").is(":animated"))return;
				var gap = 20;
				if(cf.direction == "horizental")var d = event.clientX;
				else if(cf.direction == "vertical")var d = event.clientY;

				if(divS.find("li").length < 2)return;

				if(event.type == "dragstart"||event.type == "touchstart")e.dragstart(d, gap);
				else if(event.type == "drag"||event.type == "touchmove")e.dragmove(d, gap);
				else if(event.type == "dragend"||event.type == "touchend")e.dragend(d, gap);
				event.preventDefault();
			},
			dragstart : function(d, gap){
				cf._cursor._start = d;
				cf._cursor._left = parseFloat(divS.find("li").eq(cf._current).css("left"));
				cf._cursor._top = parseFloat(divS.find("li").eq(cf._current).css("top"));
			},
			dragmove : function(d, gap){
				cf._tmp = cf._cursor._start-d;
				cf._cursor._last = d;
				if(cf.direction == "horizental")cf._cursor._move = cf._cursor._left - cf._tmp;
				else if(cf.direction == "vertical")cf._cursor._move = cf._cursor._top - cf._tmp;

				if((cf._current == 0) && cf.roll == "true")cf._current_prev = cf._total-1;
				else cf._current_prev = cf._current-1;
				if((cf._current == cf._total-1) && cf.roll == "true")cf._current_next = 0;
				else cf._current_next = cf._current+1;

				if(cf._current_prev != -1 && cf._tmp < 0||cf._current_prev != -1 && cf._total > 3){
					if(cf.direction == "horizental"){
						cf._pos[cf._current_prev] = -_op;
						divS.find("li").eq(cf._current_prev).css("left", cf._cursor._move-_op);
					}else if(cf.direction == "vertical"){
						cf._pos[cf._current_prev] = -_op;
						divS.find("li").eq(cf._current_prev).css("top", cf._cursor._move-_op);
					}
				}

				if(cf._current_prev == -1){
					if(cf._tmp > -parseFloat(_op) * 0.1){
						if(cf.direction == "horizental")divS.find("li").eq(cf._current).css("left", cf._cursor._move);
						else if(cf.direction == "vertical")divS.find("li").eq(cf._current).css("top", cf._cursor._move);
					}
				}else if(cf._current_next == cf._total){
					if(cf._tmp < parseFloat(_op) * 0.1){
						if(cf.direction == "horizental")divS.find("li").eq(cf._current).css("left", cf._cursor._move);
						else if(cf.direction == "vertical")divS.find("li").eq(cf._current).css("top", cf._cursor._move);
					}
				}else{
					if(cf.direction == "horizental")divS.find("li").eq(cf._current).css("left", cf._cursor._move);
					else if(cf.direction == "vertical")divS.find("li").eq(cf._current).css("top", cf._cursor._move);
				}

				if(cf._current_next != cf._total && cf._tmp > 0||cf._current_next != cf._total && cf._total > 3){
					if(cf.direction == "horizental"){
						cf._pos[cf._current_next] = _op;
						divS.find("li").eq(cf._current_next).css("left", cf._cursor._move+_op);
					}else if(cf.direction == "vertical"){
						cf._pos[cf._current_next] = _op;
						divS.find("li").eq(cf._current_next).css("top", cf._cursor._move+_op);
					}
				}
			},
			dragend : function(d, gap){
				if(!d)cf._cursor._end = cf._cursor._last;
				else cf._cursor._end = d;
				if(((cf._cursor._start-cf._cursor._end) > gap) && !divS.find("li:eq("+cf._current+")").is(':animated')){
					if(cf._current_next != cf._total && cf._tmp > 0){
						e.next();
					}else{
						if(cf.direction == "horizental"){
							divS.find("li").eq(cf._current_prev).animate({"left": -_op}, 300);
							divS.find("li").eq(cf._current).animate({"left": "0px"}, 300);
						}else if(cf.direction == "vertical"){
							divS.find("li").eq(cf._current_prev).animate({"top": -_op}, 300);
							divS.find("li").eq(cf._current).animate({"top": "0px"}, 300);
						}
					}
				}else if(((cf._cursor._start-cf._cursor._end) < -gap) && !t.find("li:eq("+cf._current+")").is(':animated')){
					if(cf._current_prev != -1 && cf._tmp < 0){
						e.prev();
					}else{
						if(cf.direction == "horizental"){
							divS.find("li").eq(cf._current).animate({"left": "0px"}, 300);
							divS.find("li").eq(cf._current_next).animate({"left": _op}, 300);
						}else if(cf.direction == "vertical"){
							divS.find("li").eq(cf._current).animate({"top": "0px"}, 300);
							divS.find("li").eq(cf._current_next).animate({"top": _op}, 300);
						}
					}
				}else{
					if(cf.direction == "horizental")var o = parseFloat(divS.find("li").eq(cf._current).css("left"));
					else if(cf.direction == "vertical")var o = parseFloat(divS.find("li").eq(cf._current).css("top"));
					if(o > 0||o < 0){
						if(cf._current_prev != -1 && cf._tmp < 0){
							if(cf.direction == "horizental"){
								divS.find("li").eq(cf._current_prev).animate({"left": -_op}, 300);
								cf._pos[cf._current_prev] = -_op;
							}else if(cf.direction == "vertical"){
								divS.find("li").eq(cf._current_prev).animate({"top": -_op}, 300);
								cf._pos[cf._current_prev] = -_op;
							}
						}
						if(cf.direction == "horizental")divS.find("li").eq(cf._current).animate({"left": "0px"}, 300);
						else if(cf.direction == "vertical")divS.find("li").eq(cf._current).animate({"top": "0px"}, 300);
						if(cf._current_next != cf._total && cf._tmp > 0){
							if(cf.direction == "horizental"){
								divS.find("li").eq(cf._current_next).animate({"left": _op}, 300);
								cf._pos[cf._current_next] = _op;
							}else if(cf.direction == "vertical"){
								divS.find("li").eq(cf._current_next).animate({"top": _op}, 300);
								cf._pos[cf._current_next] = _op;
							}
						}
					}
				}
			},
			prev : function(){
				if(cf.roll == "true"){
					if(cf._current == 0)cf._current = cf._total-1;
					else cf._current = cf._current-1;

					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += _op;
						divS.find("li").each(function(i){$(this).animate({"left": "+=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += _op;
						divS.find("li").each(function(i){$(this).animate({"top": "+=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}
				//roll false
				}else{
					if((cf._current-1) < 0)return;
					else cf._current--;
					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += _op;
						divS.find("li").each(function(i){$(this).animate({"left": "+=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += _op;
						divS.find("li").each(function(i){$(this).animate({"top": "+=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}
				}
				e.thumbset();
			},
			next : function(){
				if(cf.roll == "true"){
					if(cf._current == cf._total-1)cf._current = 0;
					else cf._current = cf._current+1;

					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= _op;
						divS.find("li").each(function(i){$(this).animate({"left": "-=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= _op;
						divS.find("li").each(function(i){$(this).animate({"top": "-=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}
				//roll false
				}else{
					if((cf._current+1) > (cf._total-1))return;
					else cf._current++;
					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= _op;
						divS.find("li").each(function(i){$(this).animate({"left": "-=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= _op;
						divS.find("li").each(function(i){$(this).animate({"top": "-=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}
				}
				e.thumbset();
			},
			paging : function(p){
				if(p == 0){
					cf._current = p;
					cf._current_prev = cf.total-1;
					cf._current_next = p+1;
				}else if(p == cf.total-1){
					cf._current = p;
					cf._current_prev = p-1;
					cf._current_next = 0;
				}else{
					cf._current = p;
					cf._current_prev = p-1;
					cf._current_next = p+1;
				}

				divS.find("li").each(function(i){
					if(cf.direction == "horizental"){
						if(i == p)$(this).css("left", "0px");
						else if(i < p)$(this).css("left", -(parseFloat(_op) * (p-i)));
						else if(i > p)$(this).css("left", parseFloat(_op) * (i-p));
						cf._pos[i] = parseFloat($(this).css("left"));
					}else if(cf.direction == "vertical"){
						if(i == p)$(this).css("top", "0px");
						else if(i < p)$(this).css("top", -(parseFloat(_op) * (p-i)));
						else if(i > p)$(this).css("top", parseFloat(_op) * (i-p));
						cf._pos[i] = parseFloat($(this).css("top"));
					}
				});
				e.thumbset();
			},
			thumbset : function(){
				divT.find("ul li").removeClass("active");
				divT.find("ul li").eq(cf._current).addClass("active");
				
				if(cf.thumbposition == "top"||cf.thumbposition == "bottom"){
					var limit = (cf._total-cf.thumbrow);
					if(parseInt(divT.find("ul li").eq(limit).css("left")) < parseInt(divT.find("ul li").width()) && cf._current > limit)return;
					
					if(cf._current == 0){
						divT.find("ul li").each(function(i){
							$(this).animate({"left": 0 + (i * (parseFloat($(this).width())+10))}, 200);
						});
					}else{
						if(cf._current > limit)var cr = limit+1;
						else cr = cf._current;

						divT.find("li").each(function(i){
							if(i == cr)$(this).animate({"left":parseFloat(divT.find("li").width())+10}, 200);
							else if(i < cr)$(this).animate({"left":-((parseFloat(divT.find("li").width())+10) * ((cr-1)-i))}, 200);
							else if(i > cr)$(this).animate({"left":((parseFloat(divT.find("li").width())+10) * (i-(cr-1)))}, 200);
						});
					}
				}else if(cf.thumbposition == "left"||cf.thumbposition == "right"){
					var limit = (cf._total-cf.thumbrow);
					if(parseInt(divT.find("ul li").eq(limit).css("top")) < parseInt(divT.find("ul li").height()) && cf._current > limit)return;

					if(cf._current == 0){
						divT.find("ul li").each(function(i){
							$(this).animate({"top": 0 + (i * (parseFloat($(this).height())+10))}, 200);
						});
					}else{
						if(cf._current > limit)var cr = limit+1;
						else cr = cf._current;

						divT.find("li").each(function(i){
							if(i == cr)$(this).animate({"top":parseFloat(divT.find("li").height())+10}, 200);
							else if(i < cr)$(this).animate({"top":-((parseFloat(divT.find("li").height())+10) * ((cr-1)-i))}, 200);
							else if(i > cr)$(this).animate({"top":((parseFloat(divT.find("li").height())+10) * (i-(cr-1)))}, 200);
						});
					}
				}
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
				$(".nw_slidingthumb1_clone").remove();
				$("body").append("<div class='nw_slidingthumb1_clone nw_widget_fullview'></div>"); 
				d.clone().appendTo(".nw_slidingthumb1_clone");
				$(".nw_slidingthumb1_clone").css({
					"position":vt.pos,
					"background":"url('"+$(".nw_slidingthumb1_clone").find("img").attr("src")+"')",
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
				$(".nw_slidingthumb1_clone").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				})
				$(".nw_slidingthumb1_clone").mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
						$(this).remove();
					}
					cf._mouse_up = {x:0, time:0}
					cf._mouse_down = {x:0, time:0}
				});
			},
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){e.init();if(document.body.contentEditable != "true")e.exeEvent();}
	}
}
$(function(){nw_slidingthumb1.exe()});

/*jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt*/
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>