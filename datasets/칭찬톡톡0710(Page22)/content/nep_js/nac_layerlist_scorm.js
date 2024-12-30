
// nac_layerlist_scorm.js

$(function () {
    if (typeof Setter !== typeof undefined)
        return;

    NacLLScorm.initEvent();
    NacLLScorm.initSize();
    NacLLScorm.initMedia();
});

var NacLLScorm = {};

NacLLScorm.volume = 1;
NacLLScorm.duration = 200;
NacLLScorm.animating = false;
NacLLScorm.playingVideo = null;
NacLLScorm.fullScreenScaleFactor = -1;
NacLLScorm.fullScreenOffsetX = 0;
NacLLScorm.fullScreenOffsetY = 0;

NacLLScorm.mouseDownState = 0; // 0:none, 1:time, 2:volume
NacLLScorm.mouseDownObject = null;

NacLLScorm.initEvent = function () {
    var scorm = $(".nac_layerlist_scorm");
    scorm.each(function () {
        var node = $(this);
        var prev = NacLLScorm.prevButton(node);
        var next = NacLLScorm.nextButton(node);
        prev.on("click", NacLLScorm.onPrev);
        next.on("click", NacLLScorm.onNext);

        var content = NacLLScorm.contentPart(node);
        content.children(".nac_item").each(function () {
            var video = $(this).children(".nac_scorm_video");
            video.on("play", NacLLScorm.handleVideoPlay);
            video.on("pause", NacLLScorm.handleVideoPause);
            video.on("ended", NacLLScorm.handleVideoEnded);
            video.on("seeking", NacLLScorm.handleVideoSeeking);

            var layerlist = $(this).children(".nac_layerlist");
            if (layerlist.length == 1)
                layerlist.on("pageChanged", NacLLScorm.handleChildLayerPageChanged);
        });

        var navigate = NacLLScorm.navigatePart(node);
        navigate.find(".nac_popup").on("click", NacLLScorm.onPopup);
        content.children(".nac_popup_window").children(".nac_close_popup").on("click", NacLLScorm.onClosePopup);
        navigate.find(".nac_play").on("click", NacLLScorm.onPlay);
        navigate.find(".nac_pause").on("click", NacLLScorm.onPause);
        navigate.find(".nac_reset").on("click", NacLLScorm.onReset);
        navigate.find(".nac_subtitle").on("click", NacLLScorm.onSubtitle);
        navigate.find(".nac_volume").on("click", NacLLScorm.onVolume);
        navigate.find(".nac_mute").on("click", NacLLScorm.onMute);
        navigate.find(".nac_enterfullscreen").on("click", NacLLScorm.onEnterFullScreen);
        navigate.find(".nac_exitfullscreen").on("click", NacLLScorm.onExitFullScreen);

        navigate.find(".nac_current_time").on("mousedown", NacLLScorm.onMouseDownTime);
        navigate.find(".nac_current_volume").on("mousedown", NacLLScorm.onMouseDownVolume);
        $(document).on("mousemove", NacLLScorm.onMouseMove);
        $(document).on("mouseup", NacLLScorm.onMouseUp);
        $(document).on("mouseleave", NacLLScorm.onMouseUp);

        navigate.find(".nac_current_time").on("touchstart", NacLLScorm.onTouchTime);
        navigate.find(".nac_current_volume").on("touchstart", NacLLScorm.onTouchVolume);
        $(document).on("touchmove", NacLLScorm.onTouchMove);
        $(document).on("touchend", NacLLScorm.onTouchEnd);

        $(window).resize(function () {
            NacLLScorm.setItemSize(node);
        });
    });
    scorm.on("show", NacLLScorm.onShow);
    $(document).on("webkitfullscreenchange", NacLLScorm.onFullScreenChange);
    $(document).on("fullscreenchange", NacLLScorm.onFullScreenChange);
    setInterval(NacLLScorm.update, 200);
}

NacLLScorm.initSize = function () {
    var scorm = $(".nac_layerlist_scorm");
    scorm.each(function () {
        var node = $(this);
        NacLLScorm.setItemSize(node);
    });
}

NacLLScorm.initMedia = function () {
    var scorm = $(".nac_layerlist_scorm");
    scorm.find("audio, video").each(function () { this.pause(); });
    scorm.each(function () {
        var navigate = NacLLScorm.navigatePart(scorm);
        NacLLScorm.setThumbPosition(navigate.find(".nac_current_time"), 0);
        NacLLScorm.setThumbPosition(navigate.find(".nac_current_volume"), 1);
        var item = NacLLScorm.activeItem(scorm);
        var video = item.children(".nac_scorm_video");
        if (video.length > 0)
            NacLLScorm.playingVideo = video[0];
        NacLLScorm.showOrHideVideoControl(item);
    });
}

NacLLScorm.initItem = function (item) {
    item.find(".nac_layerlist_slider").each(function () {
        if (NacLLSlider.initItem)
            NacLLSlider.initItem($(this));
    });
    item.find(".nac_layerlist_qslider").each(function () {
        if (NacLLQSlider.initItem)
            NacLLQSlider.initItem($(this));
    });
}

NacLLScorm.isVisible = function (node) {
    return node[0].offsetWidth > 0 || node[0].offsetHeight > 0;
}

NacLLScorm.showOrHideVideoControl = function (item) {
    var scorm = NacLLScorm.parentLayerListScormElement(item);
    if (item.children(".nac_scorm_video").length > 0)
        scorm.find(".nac_video_control").css("visibility", "");
    else
        scorm.find(".nac_video_control").css("visibility", "hidden");
}

NacLLScorm.selectionChanged = function (scorm, currentItem, newItem) {
    currentItem.find("audio, video").each(function () { this.pause(); });
    newItem.find(".nac_media, .nac_layerlist").trigger("show");
    NacLLScorm.showOrHideVideoControl(newItem);
    NacLLScorm.initItem(newItem);
    NacLLScorm.play(newItem, 0);
    NacLLScorm.unapplyNextPageEffect(scorm);
}

NacLLScorm.parentLayerListScormElement = function (child) {
    var cur = child.parent();
    while (cur.length > 0) {
        if (cur.hasClass("nac_layerlist_scorm"))
            return cur;
        cur = cur.parent();
    }
    return null;
}

NacLLScorm.prevButton = function (scorm) {
    return scorm.children(".nac_navigate_part").children(".nac_prev");
}

NacLLScorm.nextButton = function (scorm) {
    return scorm.children(".nac_navigate_part").children(".nac_next");
}

NacLLScorm.contentPart = function (scorm) {
    return scorm.children(".nac_content_part");
}

NacLLScorm.navigatePart = function (scorm) {
    return scorm.children(".nac_navigate_part");
}

NacLLScorm.items = function (scorm) {
    return NacLLScorm.contentPart(scorm).children(".nac_item");
}

NacLLScorm.activeItem = function (scorm) {
    return NacLLScorm.contentPart(scorm).children(".nac_item.nac_active");
}

NacLLScorm.pageIndex = function (scorm) {
    return NacLLScorm.navigatePart(scorm).children(".nac_page").children(".nac_page_index");
}

NacLLScorm.pageCount = function (scorm) {
    return NacLLScorm.navigatePart(scorm).children(".nac_page").children(".nac_page_count");
}

NacLLScorm.setItemSize = function (scorm) {
    var items = NacLLScorm.items(scorm).css("position", "absolute");
    var container = NacLLScorm.contentPart(scorm);
    var paddingLeft = parseInt(container.css("padding-left"), 10);
    var paddingTop = parseInt(container.css("padding-top"), 10);
    var paddingRight = parseInt(container.css("padding-right"), 10);
    var paddingBottom = parseInt(container.css("padding-bottom"), 10);
    var borderLeft = parseInt(container.css("border-left"), 10);
    var borderTop = parseInt(container.css("border-top"), 10);
    var borderRight = parseInt(container.css("border-right"), 10);
    var borderBottom = parseInt(container.css("border-bottom"), 10);
    var containerWidth = parseInt(container.css("width"), 10);
    var containerHeight = parseInt(container.css("height"), 10);

    var left = paddingLeft;
    var top = paddingTop;
    var width = containerWidth - borderLeft - borderRight - paddingLeft - paddingRight;
    var height = containerHeight - borderTop - borderBottom - paddingTop - paddingBottom;

    items.css({
        "left": left + "px",
        "top": top + "px",
        "width": width + "px",
        "height": height + "px"
    });
}

NacLLScorm.toNext = function (scorm, duration) {
    var currentItem = NacLLScorm.activeItem(scorm);
    var newItem = currentItem.next(".nac_item");
    if (newItem.length == 0)
        return;

    var container = NacLLScorm.contentPart(scorm);
    var containerWidth = parseInt(container.css("width"), 10);
    var left = parseInt(currentItem.css("left"), 10);
    newItem.css("left", (left + containerWidth) + "px");
    newItem.removeClass("nac_display_none");
    NacLLScorm.selectionChanged(scorm, currentItem, newItem);

    NacLLScorm.animating = true;
    currentItem.animate({ "left": (left - containerWidth) + "px" }, duration, function () {
        currentItem.removeClass("nac_active");
        currentItem.addClass("nac_display_none");
    });
    newItem.animate({ "left": left + "px" }, duration, function () {
        newItem.addClass("nac_active");
        var nextItem = newItem.next(".nac_item");
        if (nextItem.length == 0) {
            var next = NacLLScorm.nextButton(scorm);
            next.removeClass("nac_enabled");
            next.addClass("nac_disabled");
        }
        var prev = NacLLScorm.prevButton(scorm);
        prev.removeClass("nac_disabled");
        prev.addClass("nac_enabled");
        NacLLScorm.animating = false;
    });
    NacLLScorm.setNavigateInfo(scorm, newItem[0]);
}

NacLLScorm.toPrev = function (scorm, duration) {
    var currentItem = NacLLScorm.activeItem(scorm);
    var newItem = currentItem.prev(".nac_item");
    if (newItem.length == 0)
        return;

    var container = NacLLScorm.contentPart(scorm);
    var containerWidth = parseInt(container.css("width"), 10);
    var left = parseInt(currentItem.css("left"), 10);
    newItem.css("left", (left - containerWidth) + "px");
    newItem.removeClass("nac_display_none");
    NacLLScorm.selectionChanged(scorm, currentItem, newItem);

    NacLLScorm.animating = true;
    currentItem.animate({ "left": (left + containerWidth) + "px" }, duration, function () {
        currentItem.removeClass("nac_active");
        currentItem.addClass("nac_display_none");
    });
    newItem.animate({ "left": left + "px" }, duration, function () {
        newItem.addClass("nac_active");
        var prevItem = newItem.prev(".nac_item");
        if (prevItem.length == 0) {
            var prev = NacLLScorm.prevButton(scorm);
            prev.removeClass("nac_enabled");
            prev.addClass("nac_disabled");
        }
        var next = NacLLScorm.nextButton(scorm);
        next.removeClass("nac_disabled");
        next.addClass("nac_enabled");
        NacLLScorm.animating = false;
    });
    NacLLScorm.setNavigateInfo(scorm, newItem[0]);
}

NacLLScorm.setNavigateInfo = function (scorm, item) {
    var items = NacLLScorm.items(scorm);
    var index = items.index(item);
    NacLLScorm.pageIndex(scorm).html(index + 1);
}

NacLLScorm.onPrev = function () {
    if (NacLLScorm.animating)
        return;
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    NacLLScorm.toPrev(scorm, NacLLScorm.duration);
}

NacLLScorm.onNext = function () {
    if (NacLLScorm.animating)
        return;
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    NacLLScorm.toNext(scorm, NacLLScorm.duration);
}

NacLLScorm.onPopup = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    if (scorm.hasClass("nac_popup_closed")) {
        scorm.removeClass("nac_popup_closed");
        NacLLScorm.pause();
    }
    else {
        scorm.addClass("nac_popup_closed");
        NacLLScorm.playIfPossible();
    }
}

NacLLScorm.onClosePopup = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    scorm.addClass("nac_popup_closed");
    NacLLScorm.playIfPossible();
}

// control bar
NacLLScorm.setTime = function (node, time) {
    var hour = Math.floor(time / 3600);
    var min = Math.floor((time % 3600) / 60);
    var sec = Math.floor((time % 3600) % 60);
    var value = "";
    if (hour > 0)
        value = hour + ":";
    if (min <= 9)
        value += "0";
    if (min <= 0)
        value += "0:";
    else
        value += min + ":";
    if (sec <= 9)
        value += "0";
    value += sec;
    node.html(value);
}

NacLLScorm.setThumbPosition = function (node, ratio) {
    var thumb = node.find(".nac_thumb");
    var currentBar = node.find(".nac_current_bar");
    var bufferBarWidth = node.find(".nac_buffer_bar").outerWidth();
    
    var thumbSize = thumb.outerHeight();
    var thumbLeft = (bufferBarWidth - thumbSize) * ratio;
    var currentBarWidth = thumbLeft + thumbSize / 2;
    thumb.css("left", thumbLeft + "px");
    currentBar.css("width", currentBarWidth + "px");
}

NacLLScorm.update = function () {
    if (!NacLLScorm.playingVideo)
        return;

    var duration = NacLLScorm.playingVideo.duration;
    var currentTime = NacLLScorm.playingVideo.currentTime;
    if (isNaN(duration) || isNaN(currentTime))
        duration = currentTime = 0;
    var position = duration == 0 ? 0 : currentTime / duration;

    var scorm = NacLLScorm.parentLayerListScormElement($(NacLLScorm.playingVideo));
    var navigate = NacLLScorm.navigatePart(scorm);
    NacLLScorm.setTime(navigate.find(".nac_time1"), Math.round(currentTime));
    NacLLScorm.setTime(navigate.find(".nac_time2"), Math.round(duration - currentTime));
    NacLLScorm.setThumbPosition(navigate.find(".nac_current_time"), position);
}

NacLLScorm.play = function (item, time) {
    NacLLScorm.playingVideo = null;
    var video = item.children(".nac_scorm_video");
    if (video.length > 0) {
        NacLLScorm.playingVideo = video[0];
        if (time >= 0) {
            NacLLScorm.playingVideo.currentTime = time;
            NacLLScorm.playingVideo.volume = NacLLScorm.volume;
        }
        NacLLScorm.playingVideo.play();
    }
}

NacLLScorm.playIfPossible = function () {
    if (NacLLScorm.playingVideo)
        NacLLScorm.playingVideo.play();
}

NacLLScorm.pause = function () {
    if (NacLLScorm.playingVideo)
        NacLLScorm.playingVideo.pause();
}

NacLLScorm.handleVideoPlay = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    var navigate = NacLLScorm.navigatePart(scorm);
    navigate.find(".nac_play").addClass("nac_display_none");
    navigate.find(".nac_pause").removeClass("nac_display_none");
}

NacLLScorm.handleVideoPause = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    var navigate = NacLLScorm.navigatePart(scorm);
    navigate.find(".nac_play").removeClass("nac_display_none");
    navigate.find(".nac_pause").addClass("nac_display_none");
}

NacLLScorm.handleVideoEnded = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    NacLLScorm.applyNextPageEffect(scorm);
}

NacLLScorm.handleVideoSeeking = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    if (!NacLLScorm.nextButton(scorm).hasClass("nac_disabled"))
        NacLLScorm.unapplyNextPageEffect(scorm);
}

NacLLScorm.applyNextPageEffect = function (scorm) {
    //var item = NacLLScorm.activeItem(scorm);
    //if (item.next(".nac_item").length > 0)
    if (!NacLLScorm.nextButton(scorm).hasClass("nac_disabled"))
        scorm.addClass("nac_animation_next");
}

NacLLScorm.unapplyNextPageEffect = function (scorm) {
    scorm.removeClass("nac_animation_next");
}

NacLLScorm.handleChildLayerPageChanged = function (event, pageCount, oldIndex, newIndex) {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    if (newIndex == pageCount - 1)
        NacLLScorm.applyNextPageEffect(scorm);
    else
        NacLLScorm.unapplyNextPageEffect(scorm);
    event.stopPropagation();
}

NacLLScorm.onPlay = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    NacLLScorm.play(NacLLScorm.activeItem(scorm), -1);
    scorm.addClass("nac_popup_closed");
}

NacLLScorm.onPause = function () {
    NacLLScorm.pause();
}

NacLLScorm.onReset = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    NacLLScorm.play(NacLLScorm.activeItem(scorm), 0);
}

NacLLScorm.onSubtitle = function () {
}

NacLLScorm.onVolume = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    var navigate = NacLLScorm.navigatePart(scorm);
    navigate.find(".nac_volume").addClass("nac_display_none");
    navigate.find(".nac_mute").removeClass("nac_display_none");
    NacLLScorm.setThumbPosition(navigate.find(".nac_current_volume"), 0);
    if (NacLLScorm.playingVideo)
        NacLLScorm.playingVideo.muted = true;
}

NacLLScorm.onMute = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    var navigate = NacLLScorm.navigatePart(scorm);
    navigate.find(".nac_volume").removeClass("nac_display_none");
    navigate.find(".nac_mute").addClass("nac_display_none");
    if (NacLLScorm.playingVideo) {
        NacLLScorm.playingVideo.muted = false;
        NacLLScorm.setThumbPosition(navigate.find(".nac_current_volume"), NacLLScorm.playingVideo.volume);
    }
}

NacLLScorm.initFullScreen = function (scorm) {
    if (NacLLScorm.fullScreenScaleFactor != -1)
        return;

    var width = scorm[0].offsetWidth;
    var height = scorm[0].offsetHeight;
    var screenWidth = screen.width;
    var screenHeight = screen.height;
    var ratioX = screenWidth / width;
    var ratioY = screenHeight / height;
    if (ratioX > ratioY) {
        NacLLScorm.fullScreenScaleFactor = ratioY;
        NacLLScorm.fullScreenOffsetX = (screenWidth - (width * ratioY)) / 2;
        NacLLScorm.fullScreenOffsetY = 0;
    }
    else {
        NacLLScorm.fullScreenScaleFactor = ratioX;
        NacLLScorm.fullScreenOffsetX = 0;
        NacLLScorm.fullScreenOffsetY = (screenHeight - (height * ratioX)) / 2;
    }
}

NacLLScorm.applyFullScreen = function (scorm) {
    var offsetX = NacLLScorm.fullScreenOffsetX - scorm[0].offsetLeft;
    var offsetY = NacLLScorm.fullScreenOffsetY - scorm[0].offsetTop;
    scorm.css("transform-origin", "top left");
    scorm.css("transform", "translate(" + offsetX + "px, " + offsetY + "px) " + "scale(" + NacLLScorm.fullScreenScaleFactor + ")");
}

NacLLScorm.unapplyFullScreen = function (scorm) {
    scorm.css("transform-origin", "");
    scorm.css("transform", "");
}

NacLLScorm.showFullScreenButton = function (scorm, isEnter) {
    var navigate = NacLLScorm.navigatePart(scorm);
    var enter = navigate.find(".nac_enterfullscreen");
    var exit = navigate.find(".nac_exitfullscreen");
    if (isEnter) {
        enter.addClass("nac_display_none");
        exit.removeClass("nac_display_none");
        NacLLScorm.initFullScreen(scorm);
    }
    else {
        enter.removeClass("nac_display_none");
        exit.addClass("nac_display_none");
    }
}

NacLLScorm.onEnterFullScreen = function () {
    var scorm = NacLLScorm.parentLayerListScormElement($(this));
    NacLLScorm.showFullScreenButton(scorm, true);
    NacLLScorm.setItemSize(scorm);
    NacLLScorm.applyFullScreen(scorm);
    document.documentElement.requestFullscreen();
}

NacLLScorm.onExitFullScreen = function () {
    document.exitFullscreen();
}

NacLLScorm.onFullScreenChange = function () {
    if (document.fullscreenElement)
        return;

    var scorm = $(".nac_layerlist_scorm");
    NacLLScorm.showFullScreenButton(scorm, false);
    NacLLScorm.setItemSize(scorm);
    NacLLScorm.unapplyFullScreen(scorm);
}

NacLLScorm.thumbSize = function (node) {
    return node.find(".nac_thumb")[0].getBoundingClientRect().height;
}

NacLLScorm.updateTimeBar = function (node, x) {
    if (!NacLLScorm.playingVideo)
        return;

    var rect = node[0].getBoundingClientRect();
    var thumbSize = NacLLScorm.thumbSize(node);
    var width = rect.width - thumbSize;
    var position = x - (rect.left + thumbSize / 2);
    if (position < 0)
        position = 0;
    else if (position > width)
        position = width;

    var ratio = position / width;
    var duration = NacLLScorm.playingVideo.duration;
    var currentTime = ratio * duration;
    var scorm = NacLLScorm.parentLayerListScormElement(node);
    var navigate = NacLLScorm.navigatePart(scorm);
    NacLLScorm.playingVideo.currentTime = currentTime;
    NacLLScorm.setTime(navigate.find(".nac_time1"), Math.round(currentTime));
    NacLLScorm.setTime(navigate.find(".nac_time2"), Math.round(duration - currentTime));
    NacLLScorm.setThumbPosition(node, ratio);
}

NacLLScorm.updateVolumeBar = function (node, x) {
    if (!NacLLScorm.playingVideo)
        return;

    var rect = node[0].getBoundingClientRect();
    var thumbSize = NacLLScorm.thumbSize(node);
    var width = rect.width - thumbSize;
    var position = x - (rect.left + thumbSize / 2);
    if (position < 0)
        position = 0;
    else if (position > width)
        position = width;

    NacLLScorm.volume = position / width;
    NacLLScorm.playingVideo.volume = NacLLScorm.volume;
    NacLLScorm.setThumbPosition(node, NacLLScorm.volume);
}

NacLLScorm.handleDown = function (x, y) {
    if (NacLLScorm.mouseDownState == 1)
        NacLLScorm.updateTimeBar($(NacLLScorm.mouseDownObject), x);
    else if (NacLLScorm.mouseDownState == 2)
        NacLLScorm.updateVolumeBar($(NacLLScorm.mouseDownObject), x);
}

NacLLScorm.handleMove = function (x, y, gap) {
    if (NacLLScorm.mouseDownState == 1)
        NacLLScorm.updateTimeBar($(NacLLScorm.mouseDownObject), x);
    else if (NacLLScorm.mouseDownState == 2)
        NacLLScorm.updateVolumeBar($(NacLLScorm.mouseDownObject), x);
}

NacLLScorm.handleUp = function () {
    NacLLScorm.mouseDownState = 0;
    NacLLScorm.mouseDownObject = null;
}

NacLLScorm.prevent = function (event) {
    event.stopPropagation();
    event.preventDefault();
}

NacLLScorm.onMouseDownTime = function (event) {
    NacLLScorm.mouseDownState = 1;
    NacLLScorm.mouseDownObject = this;
    NacLLScorm.handleDown(event.pageX, -1);
    NacLLScorm.prevent(event);
}

NacLLScorm.onMouseDownVolume = function (event) {
    NacLLScorm.mouseDownState = 2;
    NacLLScorm.mouseDownObject = this;
    NacLLScorm.handleDown(event.pageX, -1);
    NacLLScorm.prevent(event);
}

NacLLScorm.onMouseMove = function (event) {
    if (NacLLScorm.mouseDownState == 0)
        return;
    NacLLScorm.handleMove(event.pageX, event.pageY, -1);
    NacLLScorm.prevent(event);
}

NacLLScorm.onMouseUp = function (event) {
    if (NacLLScorm.mouseDownState == 0)
        return;
    NacLLScorm.handleUp();
    NacLLScorm.prevent(event);
}

NacLLScorm.onTouchTime = function (event) {
    var touches = event.originalEvent.touches;
    if (!touches || touches.length != 1) {
        NacLLScorm.handleUp();
        return;
    }

    NacLLScorm.mouseDownState = 1;
    NacLLScorm.mouseDownObject = this;
    NacLLScorm.handleDown(touches[0].pageX, -1);
    NacLLScorm.prevent(event);
}

NacLLScorm.onTouchVolume = function (event) {
    var touches = event.originalEvent.touches;
    if (!touches || touches.length != 1) {
        NacLLScorm.handleUp();
        return;
    }

    NacLLScorm.mouseDownState = 2;
    NacLLScorm.mouseDownObject = this;
    NacLLScorm.handleDown(touches[0].pageX, -1);
    NacLLScorm.prevent(event);
}

NacLLScorm.onTouchMove = function (event) {
    var touches = event.originalEvent.changedTouches;
    if (!touches || touches.length != 1) {
        NacLLTab.handleUp();
        return;
    }

    if (NacLLScorm.mouseDownState == 0)
        return;
    NacLLScorm.handleMove(touches[0].pageX, touches[0].pageY, -1);
    NacLLScorm.prevent(event);
}

NacLLScorm.onTouchEnd = function (event) {
    if (NacLLScorm.mouseDownState == 0)
        return;
    NacLLScorm.handleUp();
    NacLLScorm.prevent(event);
}

NacLLScorm.onShow = function (event) {
    if (event.target == this) {
        NacLLScorm.setItemSize($(this));
        NacLLScorm.playIfPossible();
    }
    event.stopPropagation();
}


