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
var nw_3x3thumb = {
	cName: "nw_3x3thumb",
	exe: function () {
	    $(".nw_3x3thumb>.np>.nw_list>li").css("position", "absolute");
	    $(".nw_3x3thumb>.np>.thumbdiv>.thumb_list>.thumb_item").css("position", "absolute");

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
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
			_total:t.find("li").length,
			_cursor:{_start:0, _end:0, _left:0, _top:0, _move:0, _finish:0, _last:0},
			_current:0,
			_current_prev:0,
			_current_next:0,
			_thumbdrag:{_start:0, _end:0, _left:0, _top:0, _move:0, _finish:0, _last:0},
			_thumb_current:0,
			_thumb_current_prev:0,
			_thumb_current_next:0,
			_pos:[],
			_thumbpos:[],
			_tmp:0,
			_mouse_up:{x:0, t:0},
			_mouse_down:{x:0, t:0}
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
				var _op = parseFloat(t.height());
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
				var count = 0;
				var thumb_count = 0;
				t.find(".thumb_list").css("height",(parseFloat(t.height())*0.8)-20).html("");
				t.find(".thumb_nav").css("height",(parseFloat(t.height())*0.2)).html("");
				t.find("li").each(function(i){
					if(count == 0)$("<div\>",{class:"thumb_item"}).appendTo(t.find(".thumb_list"));

					if(cf.direction == "horizental"){
						cf._pos[i] = i * (parseFloat(t.width())*0.6);
						$(this).css({
							"top":"0px",
							"left":cf._pos[i],
							"width":parseFloat(t.width())*0.6,
							"height":t.height()
						});
					}else if(cf.direction == "vertical"){
						cf._pos[i] = i * parseFloat(t.height());
						$(this).css({
							"top":cf._pos[i],
							"left":"0px",
							"width":parseFloat(t.width())*0.6,
							"height":t.height()
						});
					}

					if(cf.flexible == "true"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%"});
						
						$("<div\>",{class:"thumb"}).attr("data-idx", $(this).index()).css({
							"background":"url('"+$(this).find("img").attr("src")+"')",
							"background-size":"100% 99.99%",
							"background-repeat":"no-repeat",
							"background-position":"center"
						}).appendTo(t.find(".thumb_item").eq(thumb_count));
					}else if(cf.flexible == "false"){
						$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"contain"});

						$("<div\>",{class:"thumb"}).attr("data-idx", $(this).index()).css({
							"background":"url('"+$(this).find("img").attr("src")+"')",
							"background-size":"contain",
							"background-repeat":"no-repeat",
							"background-position":"center"
						}).appendTo(t.find(".thumb_item").eq(thumb_count));
					}
					$(this).find("img").css("opacity", "0");
					count++;
					if(count == 9){
						thumb_count++;
						count = 0;
					}
				});
				
				
				t.find(".thumb").css({
					"width":((parseFloat(t.width())*0.4)-20)/3,
					"height":((parseFloat(t.height())*0.8)-20)/3
				});

				t.find(".thumb_item").each(function(i){
					cf._thumbpos[i] = ((parseFloat(t.width())*0.4)-20) * i;
					$(this).css({
						"width":((parseFloat(t.width())*0.4)-20),
						"height":((parseFloat(t.height())*0.8)-20),
						"left":cf._thumbpos[i]
					});
					$("<button\>").appendTo(t.find(".thumb_nav"));
				});
				t.find(".thumb_nav button").css("margin-top", (parseFloat(t.height())*0.1)).eq(0).addClass("active");
				t.find(".thumb").eq(0).addClass("active");

				$(".nw_3x3thumb>.np>.nw_list>li").css("position", "absolute");
				$(".nw_3x3thumb>.np>.thumbdiv>.thumb_list>.thumb_item").css("position", "absolute");
			},
			exeEvent : function(){
				/* binding unset */
				t.find("li").unbind();

				/* binding set */
				if(t.find("li").length > 1){
					t.find("li")
					.bind("dragstart", e.dragHandler)
					.bind("drag", e.dragHandler)
					.bind("dragend", e.dragHandler);
				}

				t.find(".thumb_item")
				.bind("dragstart", e.dragHandler2)
				.bind("drag", e.dragHandler2)
				.bind("dragend", e.dragHandler2);

				if(cf.fullview == "true"){
					t.find("li").css("cursor", "pointer");
					t.find("li").mousedown(function(event){
						if(detectLeftButton(event) == false)return;
						cf._mouse_down = {x:event.clientX, time:event.timeStamp}
					});
					t.find("li").mouseup(function(event){
						cf._mouse_up = {x:event.clientX, time:event.timeStamp}
						if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200)e.view($(this).find("img"));
						/* mouse clear */
						cf._mouse_up = {x:0, time:0}
						cf._mouse_down = {x:0, time:0}
					});
				}else{
					t.find("li").css("cursor", "default");
				}

				t.find(".thumb").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				});
				t.find(".thumb").mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200)e.paging($(this).attr("data-idx"));
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

				t.find("li").each(function(i){
					if(cf.direction == "horizental")$(this).css("left", cf._pos[i]);
					else if(cf.direction == "vertical")$(this).css("top", cf._pos[i]);
				});
			},
			dragHandler : function(event){
				if(t.find("li").is(":animated"))return;
				if(cf.direction == "horizental"){
					var gap = (parseFloat(t.width())*0.6) * 0.4;
					var d = event.clientX;
				}else if(cf.direction == "vertical"){
					var gap = parseFloat(t.height()) * 0.4;
					var d = event.clientY;
				}

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf._cursor._start = d;
					cf._cursor._left = parseFloat(t.find("li").eq(cf._current).css("left"));
					cf._cursor._top = parseFloat(t.find("li").eq(cf._current).css("top"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._tmp = cf._cursor._start-d;
					cf._cursor._last = d;
					if(cf.direction == "horizental")cf._cursor._move = cf._cursor._left - cf._tmp;
					else if(cf.direction == "vertical")cf._cursor._move = cf._cursor._top - cf._tmp;

					if((cf._current == 0) && cf.roll == "true")cf._current_prev = cf._total-1;
					else cf._current_prev = cf._current-1;
					if((cf._current == cf._total-1) && cf.roll == "true")cf._current_next = 0;
					else cf._current_next = cf._current+1;

					if(cf._current_prev != -1){
						if(cf.direction == "horizental"){
							cf._pos[cf._current_prev] = -(parseFloat(t.width())*0.6);
							t.find("li").eq(cf._current_prev).css("left", cf._cursor._move-(parseFloat(t.width())*0.6));
						}else if(cf.direction == "vertical"){
							cf._pos[cf._current_prev] = -t.height();
							t.find("li").eq(cf._current_prev).css("top", cf._cursor._move-parseFloat(t.height()));
						}
					}

					if(cf._current_prev == -1){
						if(cf._tmp > -parseFloat(t.width()) * 0.1){
							if(cf.direction == "horizental")t.find("li").eq(cf._current).css("left", cf._cursor._move);
							else if(cf.direction == "vertical")t.find("li").eq(cf._current).css("top", cf._cursor._move);
						}
					}else if(cf._current_next == cf._total){
						if(cf._tmp < parseFloat(t.height()) * 0.1){
							if(cf.direction == "horizental")t.find("li").eq(cf._current).css("left", cf._cursor._move);
							else if(cf.direction == "vertical")t.find("li").eq(cf._current).css("top", cf._cursor._move);
						}
					}else{
						if(cf.direction == "horizental")t.find("li").eq(cf._current).css("left", cf._cursor._move);
						else if(cf.direction == "vertical")t.find("li").eq(cf._current).css("top", cf._cursor._move);
					}

					if(cf._current_next != cf._total){
						if(cf.direction == "horizental"){
							cf._pos[cf._current_next] = (parseFloat(t.width())*0.6);
							t.find("li").eq(cf._current_next).css("left", cf._cursor._move+(parseFloat(t.width())*0.6));
						}else if(cf.direction == "vertical"){
							cf._pos[cf._current_next] = t.height();
							t.find("li").eq(cf._current_next).css("top", cf._cursor._move+parseFloat(t.height()));
						}
					}

				}else if(event.type == "dragend"||event.type == "touchend"){
					if(!d)cf._cursor._end = cf._cursor._last;
					else cf._cursor._end = d;

					if(((cf._cursor._start-cf._cursor._end) > gap) && !t.find("li:eq("+cf._current+")").is(':animated')){
						if(cf._current_next != cf._total){
							e.next();
						}else{
							if(cf.direction == "horizental"){
								t.find("li").eq(cf._current_prev).animate({"left": -(parseFloat(t.width())*0.6)}, 300);
								t.find("li").eq(cf._current).animate({"left": "0px"}, 300);
							}else if(cf.direction == "vertical"){
								t.find("li").eq(cf._current_prev).animate({"top": -t.height()}, 300);
								t.find("li").eq(cf._current).animate({"top": "0px"}, 300);
							}
						}
					}else if(((cf._cursor._start-cf._cursor._end) < -gap) && !t.find("li:eq("+cf._current+")").is(':animated')){
						if(cf._current_prev != -1){
							e.prev();
						}else{
							if(cf.direction == "horizental"){
								t.find("li").eq(cf._current).animate({"left": "0px"}, 300);
								t.find("li").eq(cf._current_next).animate({"left": (parseFloat(t.width())*0.6)}, 300);
							}else if(cf.direction == "vertical"){
								t.find("li").eq(cf._current).animate({"top": "0px"}, 300);
								t.find("li").eq(cf._current_next).animate({"top": t.height()}, 300);
							}
						}
					}else{
						if(cf.direction == "horizental")var o = parseFloat(t.find("li").eq(cf._current).css("left"));
						else if(cf.direction == "vertical")var o = parseFloat(t.find("li").eq(cf._current).css("top"));
						if(o > 0||o < 0){
							if(cf._current_prev != -1){
								if(cf.direction == "horizental"){
									t.find("li").eq(cf._current_prev).animate({"left": -(parseFloat(t.width())*0.6)}, 300);
									cf._pos[cf._current_prev] = -(parseFloat(t.width())*0.6);
								}else if(cf.direction == "vertical"){
									t.find("li").eq(cf._current_prev).animate({"top": -t.height()}, 300);
									cf._pos[cf._current_prev] = -t.height();
								}
							}
							if(cf.direction == "horizental")t.find("li").eq(cf._current).animate({"left": "0px"}, 300);
							else if(cf.direction == "vertical")t.find("li").eq(cf._current).animate({"top": "0px"}, 300);
							if(cf._current_next != cf._total){
								if(cf.direction == "horizental"){
									t.find("li").eq(cf._current_next).animate({"left": (parseFloat(t.width())*0.6)}, 300);
									cf._pos[cf._current_next] = (parseFloat(t.width())*0.6);
								}else if(cf.direction == "vertical"){
									t.find("li").eq(cf._current_next).animate({"top": t.height()}, 300);
									cf._pos[cf._current_next] = t.height();
								}
							}
						}
					}
				}
				event.preventDefault();
			},
			dragHandler2 : function(event){
				var wid = (parseFloat(t.width())*0.4)-20;
				var gab = 20;
				if(t.find(".thumb_item").length > 1){
					if(event.type == "dragstart"||event.type == "touchstart"){
						cf._thumbdrag._start = event.clientX;
						cf._thumbdrag._left = parseFloat(t.find(".thumb_item").eq(cf._thumb_current).css("left"));
					}else if(event.type == "drag"||event.type == "touchmove"){
						var tmp = (cf._thumbdrag._start - event.clientX);
						var moves = cf._thumbdrag._left - tmp;
						cf._thumbdrag._last = event.clientX;
						
						cf._thumb_current_prev = cf._thumb_current-1;
						cf._thumb_current_next = cf._thumb_current+1;

						if(cf._thumb_current_prev != -1){
							cf._thumbpos[cf._thumb_current_prev] = -wid;
							t.find(".thumb_item").eq(cf._thumb_current_prev).css("left", moves-wid);
						}

						if(cf._thumb_current_prev == -1){
							if(tmp > -parseFloat(wid) * 0.1){
								t.find(".thumb_item").eq(cf._thumb_current).css("left", moves);
							}
						}else if(cf._thumb_current_next == t.find(".thumb_item").length){
							if(tmp < parseFloat(wid) * 0.1){
								t.find(".thumb_item").eq(cf._thumb_current).css("left", moves);
							}
						}else{
							t.find(".thumb_item").eq(cf._thumb_current).css("left", moves);
						}

						if(cf._thumb_current_next != t.find(".thumb_item").length){
							cf._thumbpos[cf._thumb_current_next] = wid;
							t.find(".thumb_item").eq(cf._thumb_current_next).css("left", moves+wid);
						}
					}else if(event.type == "dragend"||event.type == "touchend"){
						if(!event.clientX)cf._thumbdrag._end = cf._thumbdrag._last;
						else cf._thumbdrag._end = event.clientX;
						
						if(((cf._thumbdrag._start-cf._thumbdrag._end) > gab) && !t.find(".thumb_item:eq("+cf._thumb_current+")").is(':animated')){
							if(cf._thumb_current_next != t.find(".thumb_item").length){
								e.thumb_control("next");
							}else{
								t.find(".thumb_item").eq(cf._thumb_current_prev).animate({"left": -wid}, 300);
								t.find(".thumb_item").eq(cf._thumb_current).animate({"left": "0px"}, 300);
							}
						}else if(((cf._thumbdrag._start-cf._thumbdrag._end) < -gab) && !t.find(".thumb_item:eq("+cf._thumb_current+")").is(':animated')){
							if(cf._thumb_current_prev != -1){
								e.thumb_control("prev");
							}else{
								t.find(".thumb_item").eq(cf._thumb_current).animate({"left": "0px"}, 300);
								t.find(".thumb_item").eq(cf._thumb_current_next).animate({"left": wid}, 300);
							}
						}else{
							var o = parseFloat(t.find(".thumb_item").eq(cf._thumb_current).css("left"));
							if(o > 0||o < 0){
								if(cf._thumb_current_prev != -1){
									t.find(".thumb_item").eq(cf._thumb_current_prev).animate({"left": -wid}, 300);
									cf._thumbpos[cf._thumb_current_prev] = -wid;
								}
								t.find(".thumb_item").eq(cf._thumb_current).animate({"left": "0px"}, 300);
								if(cf._thumb_current_next != t.find(".thumb_item").length){
									t.find(".thumb_item").eq(cf._thumb_current_next).animate({"left": wid}, 300);
									cf._pos[cf._thumb_current_next] = wid;
								}
							}
						}
					}
					e.thumbset();
				}
				event.preventDefault();
			},
			thumb_control : function(mod){
				if(mod == "prev"){
					if((cf._thumb_current-1) < 0)return;
					else cf._thumb_current--;

					for(var i = 0; i < cf._thumbpos.length; i++)cf._thumbpos[i] += ((parseFloat(t.width())*0.4)-20);
					t.find(".thumb_item").each(function(i){$(this).animate({"left":cf._thumbpos[i]}, 300);});
				}else if(mod == "next"){
					if((cf._thumb_current+1) > (t.find(".thumb_item").length-1))return;
					else cf._thumb_current++;

					for(var i = 0; i < cf._thumbpos.length; i++)cf._thumbpos[i] -= ((parseFloat(t.width())*0.4)-20);
					t.find(".thumb_item").each(function(i){$(this).animate({"left":cf._thumbpos[i]}, 300);});
				}
			},
			thumbset : function(){
				t.find(".thumb_nav button").removeClass("active");
				t.find(".thumb_nav button").eq(cf._thumb_current).addClass("active");
			},
			gothumb : function(p){
				t.find(".thumb").removeClass("active");
				t.find(".thumb").eq(p).addClass("active");
				var o = Math.floor(p / 9);
				var wid = (parseFloat(t.width())*0.4)-20;
				var count = 0;

				var count = 0;
				for(var i = o; i < t.find(".thumb_item").length; i++){
					cf._thumbpos[i] = wid * count;
					count++;
				}
				count = o;
				for(var i = 0; i < o; i++){
					cf._thumbpos[i] = -(wid*count);
					count--;
				}

				t.find(".thumb_item").each(function(i){
					$(this).animate({"left":cf._thumbpos[i]}, 300);
				});
				cf._thumb_current = o;
				e.thumbset();
			},
			prev : function(){
				if(cf.roll == "true"){
					if(cf._current == 0)cf._current = cf._total-1;
					else cf._current = cf._current-1;

					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += (_op*0.6);
						t.find("li").each(function(i){$(this).animate({"left": "+=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += t.height();
						t.find("li").each(function(i){$(this).animate({"top": "+=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}
				//roll false
				}else{
					if((cf._current-1) < 0)return;
					else cf._current--;
					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += (_op*0.6);
						t.find("li").each(function(i){$(this).animate({"left": "+=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += t.height();
						t.find("li").each(function(i){$(this).animate({"top": "+=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}
				}
				e.gothumb(cf._current);
			},
			next : function(){
				if(cf.roll == "true"){
					if(cf._current == cf._total-1)cf._current = 0;
					else cf._current = cf._current+1;

					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= (_op*0.6);
						t.find("li").each(function(i){$(this).animate({"left": "-=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= t.height();
						t.find("li").each(function(i){$(this).animate({"top": "-=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}
				//roll false
				}else{
					if((cf._current+1) > (cf._total-1))return;
					else cf._current++;
					if(cf.direction == "horizental"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= (_op*0.6);
						t.find("li").each(function(i){$(this).animate({"left": "-=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}else if(cf.direction == "vertical"){
						for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= t.height();
						t.find("li").each(function(i){$(this).animate({"top": "-=20px"}, 200).animate({"top":cf._pos[i]}, 300, function(){e.fixlayer()});});
					}
				}
				e.gothumb(cf._current);
			},
			paging : function(idx){
				t.find(".thumb").removeClass("active");
				t.find(".thumb").eq(idx).addClass("active");
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
				for(var i = idx; i < t.find("li").length; i++){
					if(cf.direction == "horizental")cf._pos[i] = (_op*0.6)*count;
					else if(cf.direction == "vertical")cf._pos[i] = _op*count;
					count++;
				}
				count = idx;
				for(var i = 0; i < idx; i++){
					if(cf.direction == "horizental")cf._pos[i] = -((_op*0.6)*count);
					else if(cf.direction == "vertical")cf._pos[i] = -(_op*count);
					count--;
				}
				t.find("li").each(function(i){
					if(cf.direction == "horizental")$(this).animate({"left":cf._pos[i]}, 300);
					else if(cf.direction == "vertical")$(this).animate({"top":cf._pos[i]}, 300);
				});
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
				$(".nw_3x3thumb_clone").remove();
				$("body").append("<div class='nw_3x3thumb_clone nw_widget_fullview'></div>"); 
				d.clone().appendTo(".nw_3x3thumb_clone").css("opacity","1");
				$(".nw_3x3thumb_clone").css({
					"position":vt.pos,
					"background":"url('"+$(".nw_3x3thumb_clone").find("img").attr("src")+"')",
					"background-size":"contain",
					"background-repeat":"no-repeat",
					"background-position":"center",
					"background-color":"rgba(0,0,0,0.6)",
					"z-index":(parseFloat(findHighestZIndex())+2),
					"width":vt.width,
					"height":vt.height,
					"top":"0",
					"left":"0",
				}).find("img").css("opacity", "0");
				$(".nw_3x3thumb_clone").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				})
				$(".nw_3x3thumb_clone").mouseup(function(event){
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

$(function(){nw_3x3thumb.exe()});

/* jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt */
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>