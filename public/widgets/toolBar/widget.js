/* 2017-12-5 14:28:44 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//此方式：弹窗非iframe模式
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        resources: ['view.css'],
        view: [
            { type: "append", url: "view.html", parent: '#centerDiv' }
        ],
    },
    //初始化[仅执行1次]
    create: function () {

    },
    //每个窗口创建完成后调用
    winCreateOK: function (viewopt, html) {
        if (viewopt.type != "append") return;
         
        $(".toolBar").css(this.config.style || { top: '10px', right: '10px', });

        var inhtml = "";
        var arr = this.config.data;
        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            if (item.hasOwnProperty("visible") && !item.visible) continue;
            if (item.children) { //分组

                inhtml += '<div class="btn-group">\
                                <button type="button" class="btn btn-link toolBar-btn dropdown-toggle" data-toggle="dropdown" aria-expanded="false">\
                                    <i class="' + item.icon + '"></i>' + item.name + ' <span class="caret"></span>\
                                </button>\
                                <ul class="dropdown-menu dropdown-menu-right" style="min-width: 110px;">';
                for (var j = 0, jlen = item.children.length; j < jlen; j++) {
                    var children_item = item.children[j];
                    if (children_item.hasOwnProperty("visible") && !children_item.visible) continue;

                    var ex = "";
                    if (children_item.onclick)
                        ex = 'onclick="' + children_item.onclick + '"';
                    else if (children_item.widget)
                        ex = 'data-widget="' + children_item.widget + '"';

                    inhtml += '<li class="widget-btn" ' + ex + '><a href="javascript:void(0)"><i class="' + children_item.icon + '"></i>' + children_item.name + '</a></li>';
                }
                inhtml += ' </ul></div>';
            }
            else {//不是分组
                var ex = "";
                if (item.onclick)
                    ex = 'onclick="' + item.onclick + '"';
                else if (item.widget)
                    ex = 'data-widget="' + item.widget + '"';

                inhtml += '<button type="button" class="widget-btn btn btn-link toolBar-btn " ' + ex + '>\
                            <i class="' + item.icon + '"></i>' + item.name + '\
                        </button>';
            }
        }
        $(".toolBar").html(inhtml);


        var that = this;
        $(".toolBar .widget-btn").each(function () {
            $(this).click(function (e) {
                var uri = $(this).attr('data-widget');
                if (haoutil.isutil.isNull(uri)) return;

                if (L.widget.isActivate(uri)) {
                    L.widget.disable(uri);
                }
                else {
                    var name1 = $(this).attr('data-name');
                    var name2 = $(this).html().replace('<a href="javascript:void(0)">', '').replace('</a>', ''); //会覆盖config中配置的名称

                    L.widget.activate({ uri: uri, name: name1 || name2 });
                }
            });
        });
    },
    //激活插件
    activate: function () {


    },
    //释放插件
    disable: function () {

    },


}));
