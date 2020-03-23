/* 2017-11-11 11:16:08 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: { 
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 300,
                height: 450
            }
        }
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //激活插件
    activate: function () {


    },
    //释放插件
    disable: function () {
        this.viewWindow = null;

    },
    showExtent: function (location) {
        var arr = location.split(",");
        this.map.setView(L.latLng(arr[0], arr[1]), arr[2]);
    },
    getDefaultExtent: function () {
        var center = this.map.gisdata.config.center;
        var zoom = this.map.gisdata.config.zoom;
        var bounds = center[0] + "," + center[1] + "," + zoom;
        return bounds;
    },
    getThisExtent: function () {
        var center = this.map.getCenter();
        var zoom = this.map.getZoom();
        var bounds = center.lat + "," + center.lng + "," + zoom;
        return bounds;
    },



}));
