/* 2017-9-26 17:04:29 | 修改 木遥（微信:  http://marsgis.cn/weixin.html ） */
//此方式：弹窗非iframe模式
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        resources: ['view.css'],
        //弹窗
        view: {
            type: "divwindow",
            url: "view.html",
            windowOptions: {
                width: 250,
                height: 300
            }
        },
    },
    //初始化[仅执行1次]
    create: function () {

    },
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        //此处可以绑定页面dom事件

    },
    //激活插件
    activate: function () {


        toastr.info('激活插件_example_divwin');

    },
    //释放插件
    disable: function () {

        toastr.info('释放插件_example_divwin');

    },




}));
