/* 2017-11-25 14:19:42 | 修改 木遥（QQ：346819890） */
//模块： 
L.widget.bindClass(L.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "divwindow",
            url: "view.html",
            windowOptions: {
                width: 255,
                height: 150
            }
        }
    },
    measureTool: null,
    //初始化[仅执行1次]
    create: function () {
        this.measureTool = new L.mars.MeasureTool({ map: this.map, isactivate: false });
    },
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        var that = this;

        $("#measure_length_danwei").selectpicker({
            container: 'body', showTick: true,  width: '120px'
        });
        $("#measure_area_danwei").selectpicker({
            container: 'body', showTick: true,  width: '120px'
        }).selectpicker('hide');


        $('#btn_measure_length').bind('click', function () {
            $('#measure_length_danwei').selectpicker('show');
            $('#measure_area_danwei').selectpicker('hide');

            that.showResult('');
            that.drawPolyline();
        });

        $('#btn_measure_area').bind('click', function () {
            $('#measure_length_danwei').selectpicker('hide');
            $('#measure_area_danwei').selectpicker('show');

            that.showResult('');
            that.drawPolygon();
        });


        $('#btn_measure_clear').bind('click', function () {
            $('#measure_length_danwei').selectpicker('show');
            $('#measure_area_danwei').selectpicker('hide');

            that.showResult('');
            that.clearDraw();
        });


        $("#measure_length_danwei").change(function (e) {
            that.updateResultLengthByDw(true);
        });
        $("#measure_area_danwei").change(function (e) {
            that.updateResultAreaByDw(true);
        });

    },
    getLengtchDanWei: function () {
        return $("#measure_length_danwei").val();
    },
    getAreaDanWei: function () {
        return $("#measure_area_danwei").val();
    },
    showResult: function (val) {
        $("#lbl_measure_result").html(val);
    },

    //激活插件
    activate: function () {
        this.measureTool.activate();
    },
    //释放插件
    disable: function () {
        this.measureTool.disable();
    },

    clearDraw: function () {
        this.showResult('');
        this.measureTool.clear();
    },
    drawPolyline: function () {
        var that = this;

        this.measureTool.measureLength({
            unit: function () {
                return that.getLengtchDanWei();
            },
            showResult: function (text, value) {
                that.showResult(text);
            }
        });
    },
    drawPolygon: function () {
        var that = this;

        this.measureTool.measureArea({
            unit: function () {
                return that.getAreaDanWei();
            },
            showResult: function (text, value) {
                that.showResult(text);
            }
        });
    },
    updateResultLengthByDw: function () {
        var danwei = this.getLengtchDanWei();
        this.measureTool.updateLengthUnit(danwei);
        return this;
    },
    updateResultAreaByDw: function () {
        var danwei = this.getAreaDanWei();
        this.measureTool.updateAreaUnit(danwei);
        return this;
    },



}));