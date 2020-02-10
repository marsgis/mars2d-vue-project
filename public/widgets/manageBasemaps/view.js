var thisWidget;

//配置信息
var basemapsCfg;
var lastLayer;

//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;
    basemapsCfg = thisWidget.getBasemaps();

    var inhtml = '';
    for (var i = 0; i < basemapsCfg.length; i++) {
        var item = basemapsCfg[i];

        if (item.name == null || item.name == '' || item._layer == null)
            continue;

        var vhtml = "";
        if (thisWidget.getLayerVisible(item._layer)) {
            vhtml = 'class="hover"';
            lastLayer = item._layer;
        }

        var imgsrc = item.icon || 'bingmap.png';
        if (imgsrc.indexOf("/") == -1)
            imgsrc = "img/basemaps/" + imgsrc;

        inhtml += '<li ' + vhtml + ' onclick="changeBaseMaps(this,' + i + ')"><div><img src="../../' + imgsrc + '" /></div><div>' + item.name + '</div></li>';

    }
    $("#basemaps").html(inhtml);

}

function changeBaseMaps(ele, id) {

    $("#basemaps").children().each(function () {
        $(this).removeClass('hover');
    });
    if (lastLayer != null) {
        thisWidget.updateLayerVisible(lastLayer, false);

    }

    $(ele).addClass('hover');

    var item = basemapsCfg[id];
    thisWidget.updateLayerVisible(item._layer, true);
    lastLayer = item._layer;

    thisWidget.disableBase();
}



