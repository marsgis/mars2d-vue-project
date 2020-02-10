/* 2017-9-26 17:04:25 | 修改 木遥（QQ：346819890） */
//此方式：弹窗非iframe模式
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: { 
        resources: ['view.css'],
        view: [
            { type: "append", url: "view.html" }
        ],
    },
    //初始化[仅执行1次]
    create: function () {

    },
    //每个窗口创建完成后调用
    winCreateOK: function (viewopt, html) {
        //此处可以绑定页面dom事件

    },
    //激活插件
    activate: function () {
         

        toastr.success('成功激活插件', '_example_append');

    },
    //释放插件
    disable: function () { 
        toastr.warning('释放插件_example_append');

    },




}));
