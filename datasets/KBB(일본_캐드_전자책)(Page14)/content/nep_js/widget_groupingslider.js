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
var nw_groupingslider = {
	cName: "nw_groupingslider",
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
			bd:{w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2)},
			_total:t.find(".nw_list>li").length,
			_secondtotal:[],
			_thirdtotal:[],
			dc:{x:0, y:0},
			cs:{start:0, end:0, left:0, last:0},
			cs2:{start:0, end:0, top:0, last:0},
			cs3:{start:0, end:0, left:0, last:0},
			now:{prev:0, current:0, next:0},
			secondnow:[],
			thirdnow:[],
			dmod:true,
			dmod2:true,
			dmod3:false,
			_pos:[],
			_secondpos:[],
			_thirdpos:[],
			_tmp:0,
			_tmp2:0,
			_tmp3:0,
			_mouse_up:{x:0, t:0},
			_mouse_down:{x:0, t:0},
			_dragging:"",
			_dragoption:"",
			lastx:0,
			lasty:0
		};
		if(!cf.roll)cf.roll = "false";
		if(!cf.flexible)cf.flexible = "false";

		var e = {
			init : function(){
				/* Value Reset */
				cf.roll = gv(t, "roll");
				cf.flexible = gv(t, "flexible");
				cf.fullview = gv(t, "fullview");
				
				/* Init */
				var li_w = parseFloat(t.width());
				var li_h = parseFloat(t.height())*0.9;
				
				/* All depth */
				t.find(".tree").css({
					"line-height":(parseFloat(t.height())*0.1)+"px"
				});
				t.find("ul").css("height", li_h);
				t.find("li").each(function(){
					$(this).css({"width":li_w,"height":li_h});

					if(cf.flexible == "true")$(this).find("img").css({"width":li_w,"height":li_h,"opacity":"1"});
					else if(cf.flexible == "false")$(this).find("img").css({"width":"0","height":"0","opacity":"0"});
				});

				t.find(".nav_2").css("bottom",(parseFloat(t.height())*0.1)+5);

				/* 1 depth */
				t.find(".nw_list>li").each(function(i){
					cf._pos[i] = i * li_w;
					var loc = t.find(".nw_list>li:eq("+i+")");
					$(this).css({"top":"0px", "left":cf._pos[i]}).attr({"data-depth":"1","data-first":i});
					
					if(loc.find("ul").length < 1){
						if(cf.flexible == "true")$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%"});
						else if(cf.flexible == "false")$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"contain"});
						$(this).find("img").css("opacity", "0");
					}else{
						$(this).css("background-image", "");
					}
					
					/* 2 depth */
					var depth_arr2 = [];
					t.find(".nw_list>li:eq("+i+")>ul>li").each(function(j){
						var loc2 = t.find(".nw_list>li:eq("+i+")>ul>li:eq("+j+")");
						$(this).css({"top":"0px", "left":cf._pos[i]}).attr({"data-depth":"2","data-first":i, "data-second":j});
						depth_arr2.push(li_h * j);
						cf._secondpos[i] = depth_arr2;

						$(this).css({"top":cf._secondpos[i][j], "left":"0px"});
						if(loc2.find("ul").length < 1){
							if(cf.flexible == "true")$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%"});
							else if(cf.flexible == "false")$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"contain"});
							$(this).find("img").css("opacity", "0");
						}else{
							$(this).css("background-image", "");
						}

						/* 3 depth */
						var depth_arr3 = [];
						t.find(".nw_list>li:eq("+i+")>ul>li:eq("+j+")>ul>li").each(function(k){
							var loc3 = t.find(".nw_list>li:eq("+i+")>ul>li:eq("+j+")>ul>li:eq("+k+")");
							$(this).css({"top":"0px", "left":cf._pos[i]}).attr({"data-depth":"3","data-first":i, "data-second":j, "data-third":k});
							depth_arr3.push(li_w * k);
							cf._thirdpos[i+"_"+j] = depth_arr3;

							$(this).css({"top":"0px", "left":cf._thirdpos[i+"_"+j][k]});
							if(cf.flexible == "true")$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"100% 99.99%"});
							else if(cf.flexible == "false")$(this).css({"background-image":"url('"+$(this).find("img").attr("src")+"')", "background-size":"contain"});
							$(this).find("img").css("opacity", "0");
						});
						var third = {prev:t.find(".nw_list>li:eq("+i+")>ul>li:eq("+j+")>ul>li").length-1, current:0, next:1};
						
						if(t.find(".nw_list>li:eq("+i+")>ul>li:eq("+j+")>ul").length > 0 && t.find(".nw_list>li:eq("+i+")>ul>li:eq("+j+")>ul>li").length < 1){
							t.find(".nw_list>li:eq("+i+")>ul>li:eq("+j+")").remove();
						}

						cf.thirdnow[i+"_"+j] = third;
						cf._thirdtotal[i+"_"+j] = t.find(".nw_list>li:eq("+i+")>ul>li:eq("+j+")>ul>li").length;
					});

					var second = {prev:t.find(".nw_list>li:eq("+i+")>ul>li").length-1, current:0, next:1};
					cf.secondnow[i] = second;
					cf._secondtotal[i] = t.find(".nw_list>li:eq("+i+")>ul>li").length;

					if(t.find(".nw_list>li:eq("+i+")>ul>li").length < 1){
						t.find(".nw_list>li:eq("+i+")").remove();
					}
				});

				cf._total = t.find(".nw_list>li").length;
				cf.now = {prev:cf._total-1, current:0, next:1};
				e.treeSet();

				t.find(".nav").each(function(){
					$(this).css("background-image", "url('"+$(this).find("img").attr("src")+"')");
					$(this).find("img").css("display", "none");
				});

				$(".nw_groupingslider li").css("position", "absolute");
				$(".nw_groupingslider>.np>.nav").css("position", "absolute");
				$(".nw_groupingslider>.np>.tree").css("position", "absolute");
			},
			exeEvent : function(){
				/* binding unset */
				t.find("li").unbind();

				/* all binding */
				t.find("li")
				.bind("dragstart", e.dragController)
				.bind("drag", e.dragController)
				.bind("dragend", e.dragController);

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

				t.mouseleave(function(event){
					t.trigger("mouseup");
				});
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
			dragController : function(event){
				if(t.find("li").is(":animated"))return;
				var d = {x:event.clientX, y:event.clientY}
				var l1 = t.find(".nw_list>li").length;
				var l2 = t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").length;
				var l3 = t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").length;

				if(l1 < 2 && l2 < 2)return;

				if(d.x)cf.lastx = d.x;
				if(d.y)cf.lasty = d.y;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf.dc = {x:d.x, y:d.y}
					cf.cs.start = d.x;
					cf.cs.left = parseFloat(t.find(".nw_list>li").eq(cf.now.current).css("left"));
					if(l2 > 0){
						cf.cs2.start = d.y;
						cf.cs2.top = parseFloat(t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].current).css("top"));
					}
					if(l3 > 0){
						cf.cs3.start = d.x;
						cf.cs3.left = parseFloat(t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[cf.now.current+"_"+cf.secondnow[cf.now.current].current].current).css("left"));
					}
				}else if(event.type == "drag"||event.type == "touchmove"){
					if(cf.dc.x+10 < d.x||cf.dc.x-10 > d.x||cf._dragoption == "1"){	
						if(cf.dmod != false && !cf._dragging||cf.dmod != false && cf._dragging == "1"){
							cf._dragging = "1";
							if(l1 < 2)return;
							e.drag_1(event);
						}
						if(cf.dmod3 != false && l3 > 0 && !cf._dragging||cf.dmod3 != false && l3 > 0 && cf._dragging == "3"){
							cf._dragging = "3";
							e.drag_3(event);
						}
						cf._dragoption = "1";
					}else if(cf.dc.y+10 < d.y||cf.dc.y-10 > d.y||cf._dragoption == "2"){
						if(cf.dmod2 != false && l2 > 0 && !cf._dragging||cf.dmod2 != false && l2 > 0 && cf._dragging == "2"){
							cf._dragging = "2";
							e.drag_2(event);
						}
						cf._dragoption = "2";
					}
				}else if(event.type == "dragend"||event.type == "touchend"){
					d.x = !d.x ? cf.lastx : d.x;
					d.y = !d.y ? cf.lasty : d.y;

					if(cf._dragging == "1"||(cf.dc.x+10 < d.x) && cf._dragging == "1"||(cf.dc.x-10 > d.x) && cf._dragging == "1"){
						if(cf.dmod != false){
							cf._dragging = "";
							if(l1 < 2)return;
							e.drag_1(event);
						}
					}else if(cf._dragging == "3"||(cf.dc.x+10 < d.x) && cf._dragging == "3"||(cf.dc.x-10 > d.x) && cf._dragging == "3"){
						if(cf.dmod3 != false && l3 > 0){
							cf._dragging = "";
							e.drag_3(event);
						}
					}else if(cf._dragging == "2"||(cf.dc.y+10 < d.y) && cf._dragging == "2"||(cf.dc.y-10 > d.y) && cf._dragging == "2"){
						if(cf.dmod2 != false && l2 > 0){
							cf._dragging = "";
							e.drag_2(event);
						}
					}else{
						if(cf.dmod != false && cf._dragging == "1")e.drag_1(event);
						if(cf.dmod3 != false && l3 > 0 && cf._dragging == "2")e.drag_3(event);
						if(cf.dmod2 != false && l2 > 0 && cf._dragging == "3")e.drag_2(event);
					}

					/* Controller */
					if(cf.secondnow[cf.now.current].current != 0)cf.dmod = false;
					else cf.dmod = true;

					if(l3 > 0 && cf.dmod == false)cf.dmod3 = true;
					else cf.dmod3 = false;

					e.dragends(event);
				}
			},
			dragends : function(event){
				e.treeSet();
				cf._dragging = "";
				cf._dragoption = "";

				event.preventDefault();
			},
			fixlayer : function(){
				var count = 0;
				for(var i = cf.now.current; i < t.find(".nw_list>li").length; i++){
					cf._pos[i] = parseFloat(t.width())*count;
					count++;
				}
				count = cf.now.current;
				for(var i = 0; i < cf.now.current; i++){
					cf._pos[i] = -(parseFloat(t.width())*count);
					count--;
				}

				t.find(".nw_list>li").each(function(i){
					$(this).css("left", cf._pos[i]);
				});
			},
			drag_1 : function(event){
				var gap = 20;
				var d = event.clientX;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf.cs.start = d;
					cf.cs.left = parseFloat(t.find(".nw_list>li").eq(cf.now.current).css("left"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._tmp = cf.cs.start-d;
					var mov = cf.cs.left - cf._tmp;
					cf.cs.last = d;

					if((cf.now.current == 0) && cf.roll == "true")cf.now.prev = cf._total-1;
					else cf.now.prev = cf.now.current-1;
					if((cf.now.current == cf._total-1) && cf.roll == "true")cf.now.next = 0;
					else cf.now.next = cf.now.current+1;

					if(cf.now.prev != -1 && cf._tmp < 0){
						cf._pos[cf.now.prev] = -t.width();
						t.find(".nw_list>li").eq(cf.now.prev).css("left", mov-parseFloat(t.width()));
					}

					if(cf.now.prev == -1){
						if(cf._tmp > -parseFloat(t.width()) * 0.1){
							t.find(".nw_list>li").eq(cf.now.current).css("left", mov);
						}
					}else if(cf.now.next == cf._total){
						if(cf._tmp < parseFloat(t.width()) * 0.1){
							t.find(".nw_list>li").eq(cf.now.current).css("left", mov);
						}
					}else{
						t.find(".nw_list>li").eq(cf.now.current).css("left", mov);
					}

					if(cf.now.next != cf._total && cf._tmp > 0){
						cf._pos[cf.now.next] = t.width();
						t.find(".nw_list>li").eq(cf.now.next).css("left", mov+parseFloat(t.width()));
					}

				}else if(event.type == "dragend"||event.type == "touchend"){
					if(t.find(".nw_list>li:eq("+cf.now.current+")").is(':animated'))return;

					if(!d)cf.cs.end = cf.cs.last;
					else cf.cs.end = d;
					
					if(((cf.cs.start-cf.cs.end) > gap)){
						if(cf.now.next != cf._total){
							if(cf.roll == "true"){
								if(cf.now.current == cf._total-1 && cf._tmp > 0)cf.now.current = 0;
								else cf.now.current = cf.now.current+1;

								for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= t.width();
								t.find(".nw_list>li").each(function(i){$(this).animate({"left": "-=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
							}else{
								if((cf.now.current+1) > (cf._total-1))return;
								else cf.now.current++;

								for(var i = 0; i < cf._pos.length; i++)cf._pos[i] -= t.width();
								t.find(".nw_list>li").each(function(i){$(this).animate({"left": "-=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
							}
						}else{
							t.find(".nw_list>li").eq(cf.now.prev).animate({"left": -t.width()}, 300);
							t.find(".nw_list>li").eq(cf.now.current).animate({"left": "0px"}, 300, function(){e.fixlayer()});
						}
					}else if(((cf.cs.start-cf.cs.end) < -gap)){
						if(cf.now.prev != -1 && cf._tmp < 0){
							if(cf.roll == "true"){
								if(cf.now.current == 0)cf.now.current = cf._total-1;
								else cf.now.current = cf.now.current-1;

								for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += t.width();
								t.find(".nw_list>li").each(function(i){$(this).animate({"left": "+=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
							}else{
								if((cf.now.current-1) < 0)return;
								else cf.now.current--;

								for(var i = 0; i < cf._pos.length; i++)cf._pos[i] += t.width();
								t.find(".nw_list>li").each(function(i){$(this).animate({"left": "+=20px"}, 200).animate({"left":cf._pos[i]}, 300, function(){e.fixlayer()});});
							}
						}else{
							t.find(".nw_list>li").eq(cf.now.current).animate({"left": "0px"}, 300, function(){e.fixlayer()});
							t.find(".nw_list>li").eq(cf.now.next).animate({"left": t.width()}, 300);
						}
					}else{
						var o = parseFloat(t.find(".nw_list>li").eq(cf.now.current).css("left"));
						if(o > 0||o < 0){
							if(cf.now.prev != -1 && cf._tmp < 0){
								t.find(".nw_list>li").eq(cf.now.prev).animate({"left": -t.width()}, 300);
								cf._pos[cf.now.prev] = -t.width();
							}
							t.find(".nw_list>li").eq(cf.now.current).animate({"left": "0px"}, 300, function(){e.fixlayer()});
							if(cf.now.next != cf._total && cf._tmp > 0){
								t.find(".nw_list>li").eq(cf.now.next).animate({"left": t.width()}, 300);
								cf._pos[cf.now.next] = t.width();
							}
						}
					}
				}
				event.preventDefault();
			},
			drag_2 : function(event){
				var li_h = parseFloat(t.height())*0.9;
				var gap = 20;
				var d = event.clientY;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf.cs2.start = d;
					cf.cs2.top = parseFloat(t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].current).css("top"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._tmp2 = cf.cs2.start-d;
					var mov = cf.cs2.top - cf._tmp2;
					cf.cs2.last = d;

					cf.secondnow[cf.now.current].prev = cf.secondnow[cf.now.current].current-1;
					cf.secondnow[cf.now.current].next = cf.secondnow[cf.now.current].current+1;

					if(cf.secondnow[cf.now.current].prev != -1){
						cf._secondpos[cf.now.current][cf.secondnow[cf.now.current].prev] = -li_h;
						t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].prev).css("top", mov-li_h);
					}

					if(cf.secondnow[cf.now.current].prev == -1){
						if(cf._tmp2 > -li_h * 0.1){
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].current).css("top", mov);
						}
					}else if(cf.secondnow[cf.now.current].next == cf._secondtotal[cf.now.current]){
						if(cf._tmp2 < li_h * 0.1){
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].current).css("top", mov);
						}
					}else{
						t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].current).css("top", mov);
					}

					if(cf.secondnow[cf.now.current].next != cf._secondtotal[cf.now.current]){
						cf._secondpos[cf.now.current][cf.secondnow[cf.now.current].next] = li_h;
						t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].next).css("top", mov+li_h);
					}

				}else if(event.type == "dragend"||event.type == "touchend"){
					if(t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")").is(':animated'))return;

					if(!d)cf.cs2.end = cf.cs2.last;
					else cf.cs2.end = d;

					if(((cf.cs2.start-cf.cs2.end) > gap)){
						if(cf.secondnow[cf.now.current].next != cf._secondtotal[cf.now.current]){
							if((cf.secondnow[cf.now.current].current+1) > (cf._secondtotal[cf.now.current]-1))return;
							else cf.secondnow[cf.now.current].current++;

							for(var i = 0; i < cf._secondpos[cf.now.current].length; i++)cf._secondpos[cf.now.current][i] -= li_h;
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").each(function(i){$(this).animate({"top": "-=20px"}, 200).animate({"top":cf._secondpos[cf.now.current][i]}, 300);});
						}else{
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].prev).animate({"top": -li_h}, 300);
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].current).animate({"top": "0px"}, 300);
						}
					}else if(((cf.cs2.start-cf.cs2.end) < -gap)){
						if(cf.secondnow[cf.now.current].prev != -1){
							if(cf.secondnow[cf.now.current].current == 0)cf.secondnow[cf.now.current].current = cf._secondtotal[cf.now.current]-1;
							else cf.secondnow[cf.now.current].current = cf.secondnow[cf.now.current].current-1;

							for(var i = 0; i < cf._secondpos[cf.now.current].length; i++)cf._secondpos[cf.now.current][i] += li_h;
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").each(function(i){$(this).animate({"top": "+=20px"}, 200).animate({"top":cf._secondpos[cf.now.current][i]}, 300);});
						}else{
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].current).animate({"top": "0px"}, 300);
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].next).animate({"top": li_h}, 300);
						}
					}else{
						var o = parseFloat(t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].current).css("top"));
						if(o > 0||o < 0){
							if(cf.secondnow[cf.now.current].prev != -1){
								t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].prev).animate({"top": -li_h}, 300);
								cf._secondpos[cf.now.current][cf.secondnow[cf.now.current].prev] = -li_h;
							}
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].current).animate({"top": "0px"}, 300);
							if(cf.secondnow[cf.now.current].next != cf._secondtotal[cf.now.current]){
								t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").eq(cf.secondnow[cf.now.current].next).animate({"top": li_h}, 300);
								cf._secondpos[cf.now.current][cf.secondnow[cf.now.current].next] = li_h;
							}
						}
					}
				}
				event.preventDefault();
			},
			drag_3 : function(event){
				var gap = parseFloat(t.width()) * 0.3;
				var d = event.clientX;
				var idx = cf.now.current+"_"+cf.secondnow[cf.now.current].current;

				if(event.type == "dragstart"||event.type == "touchstart"){
					cf.cs3.start = d;
					cf.cs3.left = parseFloat(t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[cf.now.current+"_"+cf.secondnow[cf.now.current].current].current).css("left"));
				}else if(event.type == "drag"||event.type == "touchmove"){
					cf._tmp3 = cf.cs3.start-d;
					var mov = cf.cs3.left - cf._tmp3;
					cf.cs3.last = d;

					cf.thirdnow[idx].prev = cf.thirdnow[idx].current-1;
					cf.thirdnow[idx].next = cf.thirdnow[idx].current+1;

					if(cf.thirdnow[idx].prev != -1){
						cf._thirdpos[idx][cf.thirdnow[idx].prev] = -t.width();
						t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].prev).css("left", mov-parseFloat(t.width()));
					}

					if(cf.thirdnow[idx].prev == -1){
						if(cf._tmp3 > -parseFloat(t.width()) * 0.1){
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].current).css("left", mov);
						}
					}else if(cf.thirdnow[idx].next == cf._thirdtotal[idx]){
						if(cf._tmp3 < parseFloat(t.width()) * 0.1){
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].current).css("left", mov);
						}
					}else{
						t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].current).css("left", mov);
					}

					if(cf.thirdnow[idx].next != cf._thirdtotal[idx]){
						cf._thirdpos[idx][cf.thirdnow[idx].next] = t.width();
						t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].next).css("left", mov+parseFloat(t.width()));
					}

				}else if(event.type == "dragend"||event.type == "touchend"){
					if(!d)cf.cs3.end = cf.cs3.last;
					else cf.cs3.end = d;
					
					if(((cf.cs3.start-cf.cs3.end) > gap) && !t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").is(':animated')){
						if(cf.thirdnow[idx].next != cf._thirdtotal[idx]){
							if((cf.thirdnow[idx].current+1) > (cf._thirdtotal[idx]-1))return;
							else cf.thirdnow[idx].current++;

							for(var i = 0; i < cf._thirdpos[idx].length; i++)cf._thirdpos[idx][i] -= t.width();
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").each(function(i){$(this).animate({"left": "-=20px"}, 200).animate({"left":cf._thirdpos[idx][i]}, 300);});
						}else{
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].prev).animate({"left": -t.width()}, 300);
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].current).animate({"left": "0px"}, 300);
						}
					}else if(((cf.cs3.start-cf.cs3.end) < -gap) && !t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li:eq("+cf.thirdnow[idx].current+")").is(':animated')){
						if(cf.thirdnow[idx].prev != -1){
							if((cf.thirdnow[idx].current-1) < 0)return;
							else cf.thirdnow[idx].current--;

							for(var i = 0; i < cf._thirdpos[idx].length; i++)cf._thirdpos[idx][i] += t.width();
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").each(function(i){$(this).animate({"left": "+=20px"}, 200).animate({"left":cf._thirdpos[idx][i]}, 300);});
						}else{
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].current).animate({"left": "0px"}, 300);
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].next).animate({"left": t.width()}, 300);
						}
					}else{
						var o = parseFloat(t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].current).css("left"));
						if(o > 0||o < 0){
							if(cf.thirdnow[idx].prev != -1){
								t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].prev).animate({"left": -t.width()}, 300);
								cf._thirdpos[idx][cf.thirdnow[idx].prev] = -t.width();
							}
							t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].current).animate({"left": "0px"}, 300);
							if(cf.thirdnow[idx].next != cf._thirdtotal[idx]){
								t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").eq(cf.thirdnow[idx].next).animate({"left": t.width()}, 300);
								cf._thirdpos[idx][cf.thirdnow[idx].next] = t.width();
							}
						}
					}
				}
				event.preventDefault();
			},
			counter : function(obj, total, mod){
				if(mod == "next"){
					if(obj.current != total-1){
						obj.current++;
						obj.prev = obj.current-1;
						obj.next = obj.current+1;
						if(obj.next == total)obj.next = 0;
					}else{
						obj.current = 0;
						obj.prev = total-1;
						obj.next = obj.current+1;
					}
				}else if(mod == "prev"){
					if(obj.current != 0){
						obj.current--;
						obj.prev = obj.current-1;
						obj.next = obj.current+1;
						if(obj.prev == -1)obj.prev = total-1;
					}else{
						obj.current = total-1;
						obj.prev = obj.current-1;
						obj.next = 0;
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
				$(".nw_groupingslider_clone").remove();
				$("body").append("<div class='nw_groupingslider_clone nw_widget_fullview'></div>"); 
				d.clone().appendTo(".nw_groupingslider_clone").css("opacity","1");
				$(".nw_groupingslider_clone").css({
					"position":vt.pos,
					"background":"url('"+$(".nw_groupingslider_clone").find("img").attr("src")+"')",
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
				$(".nw_groupingslider_clone").mousedown(function(event){
					if(detectLeftButton(event) == false)return;
					cf._mouse_down = {x:event.clientX, time:event.timeStamp}
				})
				$(".nw_groupingslider_clone").mouseup(function(event){
					cf._mouse_up = {x:event.clientX, time:event.timeStamp}
					if(Math.abs(cf._mouse_down.x - cf._mouse_up.x) < 5 && Math.abs(cf._mouse_up.time - cf._mouse_down.time) < 200){
						$(this).remove();
					}
					cf._mouse_up = {x:0, time:0}
					cf._mouse_down = {x:0, time:0}
				});
			},
			treeSet : function(){
				var l1 = t.find(".nw_list>li").length-1;
				var l1_idx = cf.now.current;
				var l2 = t.find(".nw_list>li:eq("+cf.now.current+")>ul>li").length-1;
				if(l2 > 0)var l2_idx = cf.secondnow[cf.now.current].current;
				else var l2_idx = 0;
				var l3 = t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").length-1;
				if(l3 > 0)var l3_idx = cf.thirdnow[l1_idx+"_"+l2_idx].current;
				else var l3_idx = 0;


				var item_name = "";
				if(l3 != -1){
					item_name = t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li:eq("+cf.thirdnow[l1_idx+"_"+l2_idx].current+")").attr("data-nw-title");
				}else{
					if(l2 != -1){
						item_name = t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")").attr("data-nw-title");
					}else{
						item_name = t.find(".nw_list>li:eq("+cf.now.current+")").attr("data-nw-title");
					}
				}

				t.find(".nav").css("opacity", "0");

				/* 2 depth icon */
				if(l2_idx != 0)t.find(".nav_0").css("opacity", "1");
				else t.find(".nav_0").css("opacity", "0");
				if(l2_idx != l2 && l2 != -1)t.find(".nav_2").css("opacity", "1");
				else t.find(".nav_2").css("opacity", "0");

				/* 1 ^ 3 depth icon */
				if(l2_idx != 0 && (l3 != -1)){	//2depth의 index가 0이 아니고, 3depth의 개수가 없을 때.
					if(l3_idx != 0 && l3_idx != l3){
						t.find(".nav_1").css("opacity", "1");
						t.find(".nav_3").css("opacity", "1");
					}else if(l3_idx == l3){
						t.find(".nav_1").css("opacity", "0");
						if(t.find(".nw_list>li:eq("+cf.now.current+")>ul>li:eq("+cf.secondnow[cf.now.current].current+")>ul>li").length>1)t.find(".nav_3").css("opacity", "1");
					}else{
						t.find(".nav_1").css("opacity", "1");
						t.find(".nav_3").css("opacity", "0");
					}
				}else if(l2_idx != 0 && (l3 == -1)){	//2depth의 index가 0이 아니고, 3depth의 개수가 있을 때.
					t.find(".nav_1").css("opacity", "0");
					t.find(".nav_3").css("opacity", "0");
				}else{
					if(l1_idx != 0 && l1_idx != (cf._total-1)){
						t.find(".nav_1").css("opacity", "1");
						t.find(".nav_3").css("opacity", "1");
					}else if(l1_idx == 0){
						if(cf.roll != "false")t.find(".nav_3").css("opacity", "1");
						else t.find(".nav_3").css("opacity", "0");
						if(l1 != 0)t.find(".nav_1").css("opacity", "1");
						else t.find(".nav_3").css("opacity", "0");
					}else if(l1_idx == (cf._total-1)){
						if(cf.roll != "false")t.find(".nav_1").css("opacity", "1");
						else t.find(".nav_1").css("opacity", "0");
						t.find(".nav_3").css("opacity", "1");
					}
				}

				if(item_name)t.find(".tree").html(unes(item_name).substr(0, 80));
				else t.find(".tree").html("");

				if(l3 > 0)cf.dmod3 = true;
				else cf.dmod3 = false;
				
			}
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){
			e.init();
			if(document.body.contentEditable != "true")e.exeEvent();
		}
	}
}

$(function(){nw_groupingslider.exe()});

/* jquery.event.drag.js ~ v1.5 ~ Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)  
Liscensed under the MIT License ~ http://threedubmedia.googlecode.com/files/MIT-LICENSE.txt */
(function(E){E.fn.drag=function(L,K,J){if(K){this.bind("dragstart",L)}if(J){this.bind("dragend",J)}return !L?this.trigger("drag"):this.bind("drag",K?K:L)};var A=E.event,B=A.special,F=B.drag={not:":input",distance:0,which:1,dragging:false,setup:function(J){J=E.extend({distance:F.distance,which:F.which,not:F.not},J||{});J.distance=I(J.distance);A.add(this,"mousedown",H,J);if(this.attachEvent){this.attachEvent("ondragstart",D)}},teardown:function(){A.remove(this,"mousedown",H);if(this===F.dragging){F.dragging=F.proxy=false}G(this,true);if(this.detachEvent){this.detachEvent("ondragstart",D)}}};B.dragstart=B.dragend={setup:function(){},teardown:function(){}};function H(L){var K=this,J,M=L.data||{};if(M.elem){K=L.dragTarget=M.elem;L.dragProxy=F.proxy||K;L.cursorOffsetX=M.pageX-M.left;L.cursorOffsetY=M.pageY-M.top;L.offsetX=L.pageX-L.cursorOffsetX;L.offsetY=L.pageY-L.cursorOffsetY}else{if(F.dragging||(M.which>0&&L.which!=M.which)||E(L.target).is(M.not)){return }}switch(L.type){case"mousedown":E.extend(M,E(K).offset(),{elem:K,target:L.target,pageX:L.pageX,pageY:L.pageY});A.add(document,"mousemove mouseup",H,M);G(K,false);F.dragging=null;return false;case !F.dragging&&"mousemove":if(I(L.pageX-M.pageX)+I(L.pageY-M.pageY)<M.distance){break}L.target=M.target;J=C(L,"dragstart",K);if(J!==false){F.dragging=K;F.proxy=L.dragProxy=E(J||K)[0]}case"mousemove":if(F.dragging){J=C(L,"drag",K);if(B.drop){B.drop.allowed=(J!==false);B.drop.handler(L)}if(J!==false){break}L.type="mouseup"}case"mouseup":A.remove(document,"mousemove mouseup",H);if(F.dragging){if(B.drop){B.drop.handler(L)}C(L,"dragend",K)}G(K,true);F.dragging=F.proxy=M.elem=false;break}return true}function C(M,K,L){M.type=K;var J=E.event.handle.call(L,M);return J===false?false:J||M.result}function I(J){return Math.pow(J,2)}function D(){return(F.dragging===false)}function G(K,J){if(!K){return }K.unselectable=J?"off":"on";K.onselectstart=function(){return J};if(K.style){K.style.MozUserSelect=J?"":"none"}}})(jQuery);
//]]>