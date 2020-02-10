/* 2017-9-26 17:24:33 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 210,
                height: 170
            }
        }
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    markerXY: null,
    //激活插件
    activate: function () {
        this.map.on('click', this.mouseClickHandler, this);

    },
    //释放插件
    disable: function () {
        this.viewWindow = null;
        this.map.off('click', this.mouseClickHandler, this);
        if (this.markerXY) {
            this.markerXY.remove();
            this.markerXY = null;
        }
    },
    mouseClickHandler: function (e) {
        var point = this.map.convert2wgs(e.latlng);
        this.viewWindow.showLatlng({ x: point[1], y: point[0] });

        this.centerAt(point, false);
    },
    getMapCenter: function () {
        var latlng = this.map.convert2wgs(this.map.getCenter());
        var jd = latlng[1];
        var wd = latlng[0];
        return { x: jd, y: wd };
    },
    centerAt: function (_latlng, setview) {
        var latlng = this.map.convert2map(_latlng);

        if (this.markerXY == null) {
            this.markerXY = L.marker(latlng);
            this.map.addLayer(this.markerXY);
        } else {
            this.markerXY.setLatLng(latlng);
        }
      
        this.map.centerAt(latlng);
    }



}));
