var thisWidget;
var $table;

function getHeight() {
    return $(window).height() - 50;
}


//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;
    $("#btn_bookmark_Add").bind('click', function () {
        saveBookmark();
    });


    $table = $('#table');
    $table.bootstrapTable({
        height: getHeight(),
        singleSelect: true, //单选
        pagination: false,
        pageSize: 6,
        iconsPrefix: 'fa',
        columns: [
                {
                    field: 'name',
                    title: '名称',
                    sortable: true,
                    editable: false,
                    align: 'left'
                }, {
                    field: 'operate',
                    title: '操作',
                    align: 'center',
                    width: 50,
                    events: {
                        'click .remove': function (e, value, row, index) {
                            delBookMark(row.name);
                        }
                    },
                    formatter: function (value, row, index) {
                        return [
                            '<a class="remove" href="javascript:void(0)" title="删除">',
                            '<i class="fa fa-trash"></i>',
                            '</a>'
                        ].join('');
                    }
                }
        ],
        onClickRow: function (rowData, $element, field) {
            var location = rowData.data;
            thisWidget.showExtent(location);
        }
    });

    //读取cookie
    initBookMarkList();
}


var cookieName = "muyaogis_bookmark";
var arrBookmark = [];

function initBookMarkList() {
    var lastcookie = haoutil.cookie.get(cookieName); //读取cookie值
    if (lastcookie != null)
        arrBookmark = eval(lastcookie);

    if (arrBookmark == null || arrBookmark.length == 0) {
        arrBookmark = [];

        var bounds = thisWidget.getDefaultExtent();
        arrBookmark.push({ name: "默认位置", data: bounds });
    }

    $table.bootstrapTable("load", arrBookmark);
}

//添加
function saveBookmark() {
    if (arrBookmark == null)
        arrBookmark = [];

    var name = $.trim($("#txt_bookmark_name").val()).replace("'", "").replace('"', "");
    if (name.length == 0) {
        toastr.warning('请输入名称');
        return;
    }
    for (var index = arrBookmark.length - 1; index >= 0 ; index--) {
        if (arrBookmark[index].name == name) {
            toastr.warning('该名称已存在，请更换！');
            return;
        }
    }

    var bounds = thisWidget.getThisExtent();
    arrBookmark.push({ name: name, data: bounds });
    lastcookie = JSON.stringify(arrBookmark);
    haoutil.cookie.add(cookieName, lastcookie);

    $("#txt_bookmark_name").val("");
    initBookMarkList();
}

function delBookMark(name) {
    for (var index = arrBookmark.length - 1; index >= 0 ; index--) {
        if (arrBookmark[index].name == name) {
            arrBookmark.splice(index, 1);

            var lastcookie = JSON.stringify(arrBookmark);
            haoutil.cookie.add(cookieName, lastcookie);

            $table.bootstrapTable("load", arrBookmark);
            break;
        }
    }
}


