//<![CDATA[
function detectLeftButton(evt){evt = evt || window.event;var button = evt.which || evt.button;return button == 1;}
function gv(e, v){return e.attr("data-nw-"+v);}
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
function unes(str){return String(unescape(str)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');}
var nw_arcodian = {
	cName:"nw_arcodian",
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
			_w:parseFloat($("body").width())+(parseFloat($("body").css("padding"))*2),
			_h:parseFloat($("body").height())+(parseFloat($("body").css("padding"))*2),
			arcodian_title:[],
			arcodian_desc:[],
			arcodian:[],
			arcodian_current:""
		};
		var e = {
			init : function(){
				var sh = (parseFloat(t.height())-10) / t.find("li").length;
				var txt_title = sh * 0.4;
				t.find(".nw_arcodianLayer").remove();
				t.find("li").each(function(i){
					var tit = $(this).attr("data-nw-title");
					var des = $(this).attr("data-nw-desc");
					if(tit)cf.arcodian_title[i] = unes(tit).substr(0, 40);
					else cf.arcodian_title[i] = "arcodian "+(i+1);
					if(des)cf.arcodian_desc[i] = unes(des).substr(0, 120);
					else cf.arcodian_desc[i] = "arcodian Description"+(i+1);
					$(this).find("img").css({"width":"0px", "height":"0px"}).css("opacity","0");

					if((t.find("li").length-1) == $(this).index()){
						$(this).css({"height":sh}).addClass("bwhite");
						var sss = (sh * 0.3);
					}else{
						$(this).css({"height":sh-2}).addClass("bwhite");
						var sss = (sh * 0.3)-2;
					}

					var sl = {
						container:$("<div\>",{class:"nw_arcodianLayer"}),
						titlelayer:$("<div\>",{class:"nw_arcodianTitle"}),
						descLayer:$("<div\>",{class:"nw_arcodianDesc"}),
						imgLayer:$("<div\>",{class:"nw_arcodianImg"})
					};
					sl.titlelayer.css({
						"height":txt_title,
						"font-size":(txt_title/2) + "px",
						"line-height":txt_title + "px"
					}).html(cf.arcodian_title[i]).appendTo(sl.container);
					
					sl.container.css({
						"padding-top":(sh * 0.3),
						"padding-bottom":sss,
						"padding-left":(sh * 0.1),
						"padding-right":(sh * 0.1),
					}).prependTo($(this));
					cf.arcodian[i] = sl;
				});
			},
			exeEvent : function(){
				t.unbind();
				t.find("li").unbind();
				t.find("li").bind("click", function(){
					e.openarcodian($(this));
				});
				t.mouseleave(function(){t.trigger("mouseup");});
			},
			openarcodian : function(o){
				if(cf.arcodian_current == String(o.index())){
					e.closearcodian(o);
					return;
				}
				cf.arcodian_current = o.index();
				var ol = (parseFloat(t.height()) * 0.3)/(t.find("li").length-1);
				
				t.find("li").each(function(i){
					if(i != o.index()){
						$(this).animate({
							"height":ol
						}, 300);
						$(this).find(".nw_arcodianLayer").animate({
							"padding-top":(ol * 0.1),
							"padding-bottom":(ol * 0.1),
							"padding-left":"10px",
							"padding-right":"10px"
						}, 300);
						$(this).find(".nw_arcodianTitle").animate({
							"height":(ol * 0.8),
							"font-size":((ol * 0.8)/2) + "px",
							"line-height":(ol * 0.8) + "px"
						}, 300);
						$(this).find(".nw_arcodianImage").remove();
						$(this).find(".nw_arcodianDesc").remove();
					}else{
						if(t.find("li").length > 1)var nh = (parseFloat(t.height()) * 0.7);
						else var nh = parseFloat(t.height());

						$(this).animate({
							"height":nh
						}, 300);
						$(this).find(".nw_arcodianLayer").animate({
							"padding-top":(nh * 0.05),
							"padding-bottom":(nh * 0.05),
							"padding-left":"10px",
							"padding-right":"10px"
						}, 300);
						$(this).find(".nw_arcodianTitle").animate({
							"height":(nh * 0.1),
							"font-size":((nh * 0.1)/2) + "px",
							"line-height":(nh * 0.1) + "px"
						}, 300);
						$("<div\>",{class:"nw_arcodianImage"}).css({
							"height":(nh * 0.6),
							"background-image":"url('"+o.find("img").attr("src")+"')",
							"background-size":"cover",
							"background-repeat":"no-repeat",
							"background-position":"center"
						}).prependTo($(this).find(".nw_arcodianLayer"));
						$("<div\>",{class:"nw_arcodianDesc"}).css({
							"height":(nh * 0.2),
							"padding":"0px 10px 0px 10px",
							"font-size":((nh * 0.1)/2) + "px"
						}).html(cf.arcodian_desc[o.index()]).appendTo($(this).find(".nw_arcodianLayer"));
					}
				});
			},
			closearcodian : function(o){
				cf.arcodian_current = "";
				var sh = parseFloat(t.height()) / t.find("li").length;
				var txt_title = sh * 0.4;

				t.find("li").each(function(){
					$(this).animate({
						"height":sh
					}, 300);
					$(this).find(".nw_arcodianLayer").animate({
						"padding-top":(sh * 0.3),
						"padding-bottom":(sh * 0.3),
						"padding-left":(sh * 0.1),
						"padding-right":(sh * 0.1)
					}, 300);
					$(this).find(".nw_arcodianTitle").animate({
						"height":txt_title,
						"font-size":(txt_title/2) + "px",
						"line-height":txt_title + "px"
					}, 300);
					$(this).find(".nw_arcodianImage").remove();
					$(this).find(".nw_arcodianDesc").remove();
				});
			}
		}
		if(action == "init"){e.init()}
		else if(action == "exe"){e.init();if(document.body.contentEditable != "true")e.exeEvent();}
	}
}
$(function(){nw_arcodian.exe()});
//]]>