$('#alarm_history').bootstrapTable({
    url: api_url + 'public/alarm/history?' + time_parameter,
    method: 'GET',
    uniqueId: 'id',                        // 绑定ID，不显示
    striped: true,                         //是否显示行间隔色
    cache: false,                          //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    sortable: true,                        //是否启用排序
    sortOrder: "asc",                      //排序方式
    sidePagination: "client",              //分页方式：client客户端分页，server服务端分页（*）
    undefinedText: '--',
    //singleSelect: true,                  // 单选checkbox，默认为复选
    showRefresh   : true,                  // 显示刷新按钮
    showColumns   : true,                  // 选择显示的列
    toolbar: '#item_info_toolbar',         // 搜索框位置
    search: true,                          // 搜索开启,
    strictSearch: true,
    clickToSelect: true,                   // 点击选中行
    pagination: true,                      //是否显示分页
    pageNumber:1,                          //初始化加载第一页，默认第一页,并记录
    pageSize:5,//每页显示的数量
    pageList: [5, 10, 20, 50, 100],//设置每页显示的数量
    paginationPreText:"上一页",
    paginationNextText:"下一页",
    paginationLoop:false,
    //showToggle: true,                   //是否显示详细视图和列表视图的切换按钮
    //cardView: false,                    //是否显示详细视图
    //detailView: false,                  //是否显示父子表
    //showPaginationSwitch: true,
    //得到查询的参数
    queryParams : function (params) {
        //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        var temp = {
            rows: params.limit,                         //页面大小
            page: (params.offset / params.limit) + 1,   //页码
            sort: params.sort,      //排序列名
            sortOrder: params.order //排位命令（desc，asc）
        };
        return temp;
    },
    columns: [
        // {
        //  checkbox: true
        // },
        {
        field: 'alarm_location',
        title:'告警ip',
        valign: 'middle',
        width: '16%',
        sortable: true
        },{
        field: 'alarm_system',
        title:'告警系统',
        width: '16%'
        },{
        field: 'alarm_level',
        title:'告警等级',
        width: '16%'
        },{
        field: 'alarm_text',
        title:'告警文字',
        valign: 'middle',
        width: '16%'
        },{
        field: 'happen_times',
        title:'发生次数',
        width: '16%'
        },{
        field: 'happen_d_time',
        title:'发生时间',
        },{
        field: 'end_d_time',
        title:'结束时间',
        }
    ],
    onLoadSuccess: function () {
        alert('表格加载成功！');
    },
    onLoadError: function () {
        showTips("数据加载失败！");
    },
    onDblClickRow: function (row, $element) {
        var id = row.ID;
        //EditViewById(id, 'view');
    },
    rowStyle: function (row, index) { //设置行的特殊样式
        //这里有5个取值颜色['active', 'success', 'info', 'warning', 'danger'];
        var strclass = "";
        if (index == 1) {
            strclass = "warning";
            console.log(row);
        }
        return { classes: strclass }
    }
});