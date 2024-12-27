//<![CDATA[
function gv(e, v){return e.attr("data-nw-"+v);}
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
var nw_bounce = {
	cName: "nw_bounce",
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
			count:{repeat:gv(t, "repcnt"), remain:gv(t, "repcnt")},
			total:t.find(".nw_list>li").length,
			speed:parseFloat(gv(t, "speed")),
			flexible:gv(t, "flexible"),
			imgDiv:"",
			src_arr:[],
			current:0
		};

		if(cf.flexible == "true"){
			var imgs = "100% 99.99%";
		}else if(cf.flexible == "false"){
			var imgs = "contain";
		}

		var e = {
			init : function(){
				t.find(".nw_list>li").each(function(){
					$(this).css({
						"height":parseFloat(t.height())*0.8,
						"top":parseFloat(t.height())*0.1,
						"background-image":"url('"+$(this).find("img").attr("src")+"')",
						"background-repeat":"no-repeat",
						"background-size":imgs,
						"background-position":"center"
					});
					$(this).find("img").css("opacity", "0");
					cf.src_arr.push($(this).find("img").attr("src"));
				});
				t.find(".nw_list>li").hide().eq(0).show();

				$(".nw_bounce>.np>ul>li").css("position", "absolute");
			},
			exeEvent : function(){
				t.find(".bounce_Images").stop().remove();
				t.find(".nw_list").hide().find("li").show();
				e.fadeImageLoad();
				t.mouseleave(function(){t.trigger("mouseup");});
			},
			fadeImageLoad : function(){
				var h = parseFloat(t.height())*0.8;
			    $("<div\>", { class: "bounce_Images" }).css({
                    "position":"absolute",
					"height":h,
					"top":parseFloat(t.height())*0.1,
					"background-image":"url('"+cf.src_arr[cf.current]+"')",
					"background-size":imgs,
					"background-position":"center",
					"background-repeat":"no-repeat",
					"opacity":"0"
				}).prependTo(t.find(".np"));

				cf.imgDiv = t.find(".bounce_Images");
				e.fadeController();
			},
			fadeController : function(){
				//아직 잔여 횟수가 남았을 경우
				if(cf.count.remain != 0){
					if(cf.count.remain == cf.count.repeat)e.fadeStart();
					else e.fadeAnimation();
				}else{
					e.fadeChange();
				}
			},
			fadeStart : function(){
				cf.imgDiv.animate({
					"opacity":"1"
				}, cf.speed, function(){
					e.fadeAnimation();		
				});
			},
			fadeAnimation : function(){
				cf.imgDiv.animate({
					"top":"0px"
				}, cf.speed, function(){
					cf.imgDiv.animate({
						"top":parseFloat(t.height())*0.2
					}, cf.speed, function(){
							cf.count.remain--;
							e.fadeController();
					});
				});
			},
			fadeChange : function(){
				cf.imgDiv.animate({
					"opacity":"0",
					"top":parseFloat(t.height())*0.1
					}, cf.speed, function(){
						$(this).remove();
						cf.current++;
						if(cf.current == cf.total)cf.current = 0;
						cf.count.remain = cf.count.repeat;
						e.fadeImageLoad();
				});
			}
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){
			e.init();
			if(document.body.contentEditable != "true")e.exeEvent();
		}
	}
}

$(function () { nw_bounce.exe() });

//]]>