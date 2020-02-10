//地图创建处理js


//地图创建 
export function createMap(id, config) {
    var map = L.mars.createMap({
        id: id, //地图Div容器的id，
        data: config.map,
        layerToMap: layerToMap,
    });
    return map;
}

//自定义图层添加方法
function layerToMap(config, layer) {
    if (config.type == "wfs") {
        layer = L.wfsLayer(config);//wfs插件
        return layer;
    }
};


//初始化外部静态widget功能（兼容使用传统模式开发的一些widget）
export function initStaticWidget(map, widget) {

    //初始化widget管理器
    L.widget.init(map, widget);  //tip: 此方法有第3个参数支持定义父目录。

    //绑定图层管理
    window.bindToLayerControl = bindToLayerControl 
    window.unbindLayerControl = unbindLayerControl
}



//绑定图层管理
function bindToLayerControl(name, layer) {
    if (map.gisdata.controls && map.gisdata.controls.layers) {
        map.gisdata.controls.layers.addOverlay(layer, name);
    }

    var childitem = {
        name: name,
        _layer: layer
    };
    layer.config = childitem;

    var manageLayersWidget = L.widget.getClass('widgets/manageLayers/widget.js');
    if (manageLayersWidget) {
        manageLayersWidget.addOverlay(childitem);
    }
    else {
        map.gisdata.config.operationallayers.push(childitem);
    }
}
function unbindLayerControl(name) {
    if (map.gisdata.controls && map.gisdata.controls.layers) {


        var operationallayersCfg = map.gisdata.config.operationallayers;
        for (var i = 0; i < operationallayersCfg.length; i++) {
            var item = operationallayersCfg[i];
            if (item.name == name) {
                map.gisdata.controls.layers.removeLayer(item._layer);
                break;
            }
        }
    }

    var manageLayersWidget = L.widget.getClass('widgets/manageLayers/widget.js');
    if (manageLayersWidget) {
        manageLayersWidget.removeLayer(name);
    } else {
        var operationallayersCfg = map.gisdata.config.operationallayers;
        for (var i = 0; i < operationallayersCfg.length; i++) {
            var item = operationallayersCfg[i];
            if (item.name == name) {
                operationallayersCfg.splice(i, 1);
                break;
            }
        }
    }
}
