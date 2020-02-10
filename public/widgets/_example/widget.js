/* 2017-9-26 17:04:22 | 修改 木遥（QQ：346819890） */
//模块：
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "window",
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
    viewWindow:null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result; 
    },
    //打开激活
    activate: function () {

        //测试:调用【view.html弹窗页面】中的方法
        this.viewWindow.testIframeFun();

    },
    //关闭释放
    disable: function () {
        this.viewWindow = null;


    },


    //测试: 用于被【view.html弹窗页面】中调用
    testFun: function () {
        toastr.info('我是index页面中widget定义的测试方法');
    }


}));

