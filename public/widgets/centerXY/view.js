
var thisWidget;

//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;
    var xy = thisWidget.getMapCenter();
    showLatlng(xy);
}

function showLatlng(xy) {
    $("#point_jd").val(xy.x.toFixed(6));
    $("#point_wd").val(xy.y.toFixed(6));
}


function submitXY() {
    //测量坐标转换
    var jd = Number($.trim($("#point_jd").val()));
    var wd = Number($.trim($("#point_wd").val()));

    thisWidget.centerAt({ lng: jd, lat: wd }, true);

}
