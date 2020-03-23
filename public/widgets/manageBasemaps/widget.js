/* 2017-10-26 11:30:57 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 190,
                height: 160
            }
        }
    },

    //初始化[仅执行1次]
    create: function () {
        var index = 0;
        var basemapsCfg = this.getBasemaps();
        for (var i = 0; i < basemapsCfg.length; i++) {
            var item = basemapsCfg[i];

            if (item.name == null || item.name == '' || item._layer == null)
                continue;
            index++;
        }

        if (index < 7) {
            this.options.view.windowOptions = {
                width: 190,
                height: Math.ceil(index / 2) * 100 + 60
            }
        }
        else {
            this.options.view.windowOptions = {
                width: 360,
                height: Math.ceil(index / 4) * 105 + 60
            }
        }

        //切换底图时更换坐标系、导航图、边界值
        L.Map.prototype.setCrs = function (newCrs) {
            this.options.crs = newCrs;
        }
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {

    },
    //关闭释放
    disable: function () {
        this.viewWindow = null;

    }, 
    getBasemaps: function () {
        return this.map.gisdata.config.basemaps;
    },
    getLayerVisible: function (layer) {
        return this.map.hasLayer(layer);
    },
    //树节点变化后调用
    updateLayerVisible: function (layer, visible) {
        if (visible) {
            if (layer.config.crs != null && this.map.gisdata.config.crs != layer.config.crs) {
                var center = this.map.convert2wgs(this.map.getCenter());
                var zoom = this.map.getZoom();

                //=================刷新页面方式切换不同坐标系的底图======================
                var lasturl = window.location.href;
                if (lasturl.lastIndexOf('#') != -1) {
                    lasturl = lasturl.replace(window.location.hash, "").replace("#", "");
                }
                var idx = lasturl.lastIndexOf('?');
                if (idx != -1) {
                    lasturl = lasturl.substring(0, idx);
                }
                this.map.remove();

                var bounds = center[0] + "," + center[1] + "," + zoom;
                var url = lasturl + "?center=" + bounds + "&baselayer=" + layer.config.name;
                var req = haoutil.system.getRequest();
                for (var key in req) {
                    if (key == "center" || key == "baselayer") continue;
                    url += "&" + key + "=" + req[key];
                } 
                window.location.href = url;
                return;

                //=================不刷新页面方式切换不同坐标系的底图====================== 
                //if (layer.config.crs == 'EPSG4326') {//影像底图
                //    map.setCrs(L.CRS.EPSG4326); //更改底图坐标系 
                //    map.setView(center, zoom - 1); //影像底图和海图由于切图标准不同，级别相差一级 
                //} else {
                //    map.setCrs(L.CRS.EPSG3857);
                //    map.setView(center, zoom + 1); 
                //}
                //this.map.gisdata.config.crs = layer.config.crs;
                //map.fire('zoomend', layer); //重新渲染,如果不重新渲染，由于坐标系发生变化，矢量数据错位
            }

            this.map.addLayer(layer);
            if (layer.config && layer.config.order) {
                this.udpateLayerZIndex(layer, layer.config.order);
            }

            this.map.fire("baselayerchange", { layer: layer });
        }
        else {
            this.map.removeLayer(layer);
        }
    },
    //更新图层:顺序
    udpateLayerZIndex: function (layer, order) {
        var that = this;

        if (layer.setZIndex)
            layer.setZIndex(order);
        else if (layer.bringToFront && this._layers) {

            //对数据进行排序 
            var compare = function (prop) {
                return function (obj1, obj2) {
                    var val1 = obj1[prop];
                    var val2 = obj2[prop];
                    if (val1 < val2) {
                        return -1;
                    } else if (val1 > val2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            };
            this._layers.sort(compare("order"));


            //初始化顺序字段,
            for (var i = 0; i < this._layers.length; i++) {
                var item = this._layers[i];
                if (item._layer && map.hasLayer(item._layer) && item._layer.bringToFront) {

                    item._layer.bringToFront();
                    if (item._layer.redraw)
                        item._layer.redraw()
                }
            }
        }
    }






}));

