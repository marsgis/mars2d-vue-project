/* 2017-9-26 17:28:19 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//模块：
var manageLayersWidget = L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 200,
                height: 500
            }
        }
    },
    //初始化[仅执行1次]
    create: function () {

    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        //地图图层添加移除监听，自动勾选
        //this.map.on("layeradd", this._map_layeraddremoveHnadler, this);
        //this.map.on("layerremove", this._map_layeraddremoveHnadler, this); 
        this.map.on("changeForManageLayers", this._map_changeFormanageLayersHnadler, this);
    },
    //关闭释放
    disable: function () {
        this.viewWindow = null;
        //this.map.off("layeradd", this._map_layeraddremoveHnadler, this);
        //this.map.off("layerremove", this._map_layeraddremoveHnadler, this);
        this.map.off("changeForManageLayers", this._map_changeFormanageLayersHnadler, this);
    },
    //_map_layeraddremoveHnadler: function (e) {
    //    var layer = e.layer;
    //    if (layer.config && layer.config.name) {
    //        this.viewWindow.updateCheckd(layer.config.name, (e.type == 'layeradd'));
    //    }
    //},
    _map_changeFormanageLayersHnadler: function (e) {
        var layer = e.layer;
        var children = layer.getFeaturesManage();
        var pid = layer.config.id;
        var layers = [];

        for (var idx = 0; idx < children.length; idx++) {
            var childlayer = children[idx];
            var childitem = {
                pid: pid,
                id: this.getNextId(),
                name: childlayer.name,
                _layer: childlayer,
                type: "feature"
            };
            if (!childitem.name)
                childitem.name = item.name + '-' + (idx + 1);

            //计算层次顺序
            var order = Number(childlayer.order);
            if (isNaN(order))
                order = this._layers.length + 1;

            childlayer.config = childitem;


            //主键，用于存储取图层用，防止有重复
            childitem._key = this._layers.length + "_" + childitem.id + "_" + childitem.name;
            this._layers.push(childitem);
            layers.push(childitem);
        }

        if (this.isActivate && this.viewWindow) {
            this.viewWindow.addNodes(pid, layers, true);
        }
    },

    //数据初始化处理
    _tempIdx: 1,
    arrIdx: [],
    //没有id的图层，进行id赋值处理
    getNextId: function () {
        while (this.arrIdx.indexOf(this._tempIdx) != -1) {
            this._tempIdx++;
        }
        this.arrIdx.push(this._tempIdx);
        return this._tempIdx;
    },
    _layers: null,
    //绑定自定义的非配置图层到图层控制控件中
    addOverlay: function (item) {
        if (!item.name)
            item.name = "未命名";
        if (!item.id)
            item.id = this.getNextId();
        if (!item.pid)
            item.pid = -1;

        //计算层次顺序
        var order = Number(item.order);
        if (isNaN(order))
            order = this._layers.length + 1;
        item.order = order;

        //主键，用于存储取图层用，防止有重复
        item._key = this._layers.length + "_" + item.id + "_" + item.name;

        this._layers.push(item);

        if (this.isActivate && this.viewWindow) {
            this.viewWindow.addNode(item);
        }
    },
    //从图层控制控件中删除指定的图层
    removeLayer: function (name) {
        for (var i = 0; i < this._layers.length; i++) {
            var item = this._layers[i];

            if (item.name == name) {
                this._layers.splice(i, 1);

                if (this.isActivate && this.viewWindow) {
                    this.viewWindow.removeNode(item);
                }
                break;
            }
        }
    },

    getLayers: function () {
        //if (this._layers == null) {
        var layers = [];
        var basemapsCfg = this.config.basemaps ? this.map.gisdata.config.basemaps : [];//是否对基础底图做做控制
        var operationallayersCfg = this.map.gisdata.config.operationallayers || [];

        //记录所有id，方便计算nextid
        this._tempIdx = 1;
        this.arrIdx = [];
        for (var i = 0; i < basemapsCfg.length; i++) {
            var item = basemapsCfg[i];

            if (item.id)
                this.arrIdx.push(item.id);
        }
        for (var i = 0; i < operationallayersCfg.length; i++) {
            var item = operationallayersCfg[i];
            if (item.id)
                this.arrIdx.push(item.id);
        }



        //构建集合，预处理相关数据  
        for (var i = 0; i < basemapsCfg.length; i++) {
            var item = basemapsCfg[i];

            if (!item.name)
                item.name = "未命名";
            if (!item.id)
                item.id = this.getNextId();
            if (!item.pid)
                item.pid = -1;

            layers.push(item);

            if (item.type == "group" && item.layers) {
                for (var idx = 0; idx < item.layers.length; idx++) {
                    var childitem = item.layers[idx];

                    childitem.pid = item.id;
                    childitem.id = this.getNextId();
                    if (!childitem.name)
                        childitem.name = item.name + '-' + (idx + 1);

                    childitem._parent = item;
                    if (childitem._layer) {
                        childitem._layer.hasOpacity = true;
                        childitem._layer.hasZIndex = true;
                    }
                    layers.push(childitem);
                }
            }
            else {
                if (item._layer) {
                    item._layer.hasOpacity = true;
                    item._layer.hasZIndex = true;
                }

                var children = this.getChildLayers(item._layer);
                if (children && children.length > 0) {
                    for (var idx = 0; idx < children.length; idx++) {
                        var childlayer = children[idx];
                        childlayer.hasOpacity = true;
                        childlayer.hasZIndex = true;

                        var childitem = {
                            pid: item.id,
                            id: this.getNextId(),
                            name: childlayer.options.name,
                            _layer: childlayer
                        };
                        if (!childitem.name)
                            childitem.name = item.name + '-' + (idx + 1);

                        childitem._parent = item;
                        childlayer.config = childitem;

                        layers.push(childitem);
                    }
                }
            }

        }
        for (var i = 0; i < operationallayersCfg.length; i++) {
            var item = operationallayersCfg[i];
            if (!item.name)
                item.name = "未命名";
            if (!item.id)
                item.id = this.getNextId();
            if (!item.pid)
                item.pid = -1;

            if (item._layer)
                item._layer.hasOpacity = true;

            layers.push(item);

            //加图层内数据的控制 
            if (item._layer && item._layer.getFeaturesManage) {
                var children = item._layer.getFeaturesManage();
                for (var idx = 0; idx < children.length; idx++) {
                    var childlayer = children[idx];
                    var childitem = {
                        pid: item.id,
                        id: this.getNextId(),
                        name: childlayer.name,
                        _layer: childlayer,
                        type: "feature"
                    };
                    if (!childitem.name)
                        childitem.name = item.name + '-' + (idx + 1);

                    childlayer.config = childitem;

                    layers.push(childitem);
                }
            }
        }

        //初始化顺序字段,
        for (var i = 0, len = layers.length; i < len; i++) {
            var item = layers[i];

            //计算层次顺序
            var order = Number(item.order);
            if (isNaN(order))
                order = i + 1;
            item.order = order;

            //主键，用于存储取图层用，防止有重复
            item._key = i + "_" + item.id + "_" + item.name;

            //图层的处理
            if (item._layer != null) {
                this.udpateLayerZIndex(item._layer, order);
            }
        }
        this._layers = layers;
        //}
        return this._layers;
    },
    //定位
    centerAt: function (layer) {
        if (layer && layer.centerAt) {
            return layer.centerAt();
        }

        if (layer && layer.getBounds) {
            map.fitBounds(layer.getBounds());
        }
    },
    getLayerVisible: function (layer) {
        if (layer && layer.getVisible)
            return layer.getVisible();

        return this.map.hasLayer(layer);
    },
    getChildLayers: function (_layer) {
        if (_layer instanceof L.LayerGroup || _layer instanceof L.FeatureGroup) {
            return _layer.getLayers();
        }
        else {
            return null;
        }
    },
    //更新图层:显示隐藏状态
    updateLayerVisible: function (layer, visible, parentLayer) {
        if (visible) this.centerAt(layer);

        layer.config.visible = visible; //修改配置中的值

        if (layer && layer.setVisible) {
            layer.setVisible(visible);
            return;
        }

        var that = this;
        if (parentLayer) {
            if (visible) {
                parentLayer.addLayer(layer);
                parentLayer.eachLayer(function (clayer) {
                    that.udpateLayerZIndex(clayer, clayer.config.order);
                });
            }
            else
                parentLayer.removeLayer(layer);

        }
        else {
            if (visible) {
                this.map.addLayer(layer);
                if (layer.config && layer.config.order) {
                    this.udpateLayerZIndex(layer, layer.config.order);
                }
            }
            else
                this.map.removeLayer(layer);
        }


        //更新到分屏对比
        var mapCompare = L.widget.getClass('widgets/mapCompare/widget.js');
        if (mapCompare) {
            mapCompare.updateLayerVisible(layer.config, visible);
        }
    },
    //更新图层:透明度
    udpateLayerOpacity: function (layer, opacity) {
        var that = this;
        if (layer instanceof L.LayerGroup || layer instanceof L.FeatureGroup) {
            if (layer.setOpacity) layer.setOpacity(opacity);

            layer.eachLayer(function (childlayer) {
                that.udpateLayerOpacity(childlayer, opacity);
            });
        }
        else {
            if (layer.setOpacity)  layer.setOpacity(opacity);

            if (layer instanceof L.Path) {
                layer.options.opacity = opacity;
                layer.setStyle(layer.options);
            }
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
