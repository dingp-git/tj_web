
// 声明变量（鼠标点击监听）
let clickValue = ''

$(function () {
    // 关联率
    var bar1 = echarts.init(document.getElementById('bar1'));
    var option = {
        tooltip: {
            trigger: 'axis',

        },

        grid: [{
            left: "0%",
            top: "10px",
            right: "0%",
            bottom: "4%",
            containLabel: true

        }],
        xAxis: [{
            type: 'category',
            // data: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx','xxx','xxx','xxx','xxx','xxx',],
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                },
                axisLine: {
                    lineStyle: {
                        width: '2px',
                        color: '#3366d2',

                    },
                },
            },
        }],
        yAxis: [{
            type: 'value',

            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#3366d2',
                },
            },
            splitLine: {
                lineStyle: {
                    color: '#030f5c',
                },

            },
        }],
        series: [{
            // data: [300, 23, 150, 80, 70, 110, 130,800,300,230,930,123],
            name: '关联率',
            type: 'bar',
            barWidth: "30%",
            itemStyle: {

                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(113, 127, 244)'
                }, {
                    offset: 1,
                    color: 'rgba(51, 102, 210)'

                }]),
                barBorderRadius: [15, 15, 0, 0]
            },
        }]
    };
    bar1.setOption(option);
    bar1.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });    //数据加载完之前先显示一段简单的loading动画

    var gll_values = [];  // 关联率率
    var gll_locations = [];  // 机房名称

    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'system_603/relation/location/new?' + time_parameter,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var i = 0; i < result.data.length; i++) {
                    gll_values.push(result.data[i].value)
                    gll_locations.push(result.data[i].location.replace('_', '\n'))
                }
                bar1.hideLoading();    //隐藏加载动画
                bar1.setOption({        //加载数据图表
                    xAxis: {
                        data: gll_locations
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '关联率',
                        data: gll_values
                    }
                    ]
                });

            }

        },
        error: function (errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            bar1.hideLoading();
        }
    })
    window.addEventListener("resize", function () {
        bar1.resize();
    });

    // 点击事件触发--关联率(bar1)
    bar1.on('click', function (params){
        publicLayer.title = "详细数据查询（关联率）";
        publicLayer.content = $('#relation_layer');
        $("#server-room-select").val(params.name.replace('\n', '_'))
        let thisLocation = 'location=' + params.name.replace('\n', '_')
        // 获取当前时间
        let currentTime = (new Date()).Format("yyyy-MM-dd hh:mm:ss")
        let currentTimeBefore = currentTime.slice(0,11)+"00:00:00"
        $("#relation_date_input").val(currentTimeBefore + " -- " +currentTime);
        // 时间范围是当天零点到当前时间
        let thisTimeParam = 'start_time='+currentTimeBefore+"&"+'end_time='+currentTime
        layer.open(publicLayer);
        // 其他时间有数据时取消注释
        // RelationQuery(thisLocation, thisTimeParam)
        RelationQuery(thisLocation, time_parameter)
    });

    window.addEventListener("resize",function(){
        MSLine.resize();
    });

// 五码指标

    var bar2 = echarts.init(document.getElementById('bar2'));
    var option = {
        tooltip: {
            show: true,


        },

        grid: [{
            left: "0%",
            top: "10px",
            right: "0%",
            bottom: "4%",
            containLabel: true

        }],
        yAxis: [{
            type: 'value',

            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#3366d2',
                },
            },
            splitLine: {
                lineStyle: {
                    color: '#030f5c',
                },

            },
        }],
        xAxis: [{
            type: 'category',
            // data: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx','xxx','xxx','xxx','xxx','xxx',],
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                },
                axisLine: {
                    lineStyle: {
                        width: '2px',
                        color: '#3366d2',

                    },
                },
            },
        }],
        series: [
            {
                name: '移动',
                type: 'bar',
                barWidth: "20%",
                // stack: 'total',

                // emphasis: {
                //     focus: 'series'
                // },
                itemStyle: {

                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#69efff'
                    }, {
                        offset: 1,
                        color: '#06012b'

                    }]),

                },
                // data: [320, 302, 301, 334, 390, 330, 320,320, 302, 301, 334, 390,]
            },
            {
                name: '联通',
                type: 'bar',
                barWidth: "20%",
                // stack: 'total',

                // emphasis: {
                //     focus: 'series'
                // },
                itemStyle: {

                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#a478ff'
                    }, {
                        offset: 1,
                        color: '#3e4296'

                    }]),

                },
                // data: [120, 132, 101, 134, 90, 230, 210,301, 334, 390, 330, 320,]
            },
            {
                name: '电信',
                type: 'bar',
                barWidth: "20%",
                // stack: 'total',

                // emphasis: {
                //     focus: 'series'
                // },
                itemStyle: {

                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#fff9cc'
                    }, {
                        offset: 1,
                        color: '#ecdc9a'

                    }]),

                },
                // data: [220, 182, 191, 234, 290, 330, 310,301, 334, 390, 330, 320,]
            },

        ]
    };
    bar2.setOption(option);
    bar2.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });    //数据加载完之前先显示一段简单的loading动画

    var wm_dx_datas = [];  //  
    var wm_lt_datas = [];  //  
    var wm_yd_datas = [];  //  
    var wm_xAxis_data = []

    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'system_603/five_code/center/new?' + time_parameter,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var key in result.data) {
                    wm_xAxis_data.push(key)
                    var datas = result.data[key]
                    for (var key in datas) {
                        if (key == 1 && key != '2' && key != '3') {
                            wm_yd_datas.push(datas[key].value)
                        } else if (key == '2' && key != '1' && key != '3') {
                            wm_lt_datas.push(datas[key].value)
                        } else if (key == '3' && key != '2' && key != '1') {
                            wm_dx_datas.push(datas[key].value)
                        }
                    }
                }

                bar2.hideLoading();    //隐藏加载动画
                bar2.setOption({        //加载数据图表
                    xAxis: {
                        data: wm_xAxis_data
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '移动',
                        data: wm_yd_datas
                    }, {
                        // 根据名字对应到相应的系列
                        name: '联通',
                        data: wm_lt_datas
                    }, {
                        // 根据名字对应到相应的系列
                        name: '电信',
                        data: wm_dx_datas
                    }
                    ]
                });

            }

        },
        error: function (errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            bar2.hideLoading();
        }
    })
    window.addEventListener("resize", function () {
        bar2.resize();
    });

    // 点击事件触发--五码指标(bar2)
    bar2.on('click', function (params){
        publicLayer.title = "详细数据查询（五码指标）";
        publicLayer.content = $('#five_code_layer');
        $("#code-select").val(params.name)
        $("#five-code-isp-select").val(isp_dict[params.seriesName])
        // 获取当前时间
        let currentTime = (new Date()).Format("yyyy-MM-dd hh:mm:ss")
        let currentTimeBefore = currentTime.slice(0,11)+"00:00:00"
        $("#five_code_date_input").val(currentTimeBefore + " -- " +currentTime);
        // 时间范围是当天零点到当前时间
        let thisTimeParam = 'start_time='+currentTimeBefore+"&"+'end_time='+currentTime
        layer.open(publicLayer);
        // 其他时间有数据时取消注释
        // fiveCodeQuery(thisLocation, thisTimeParam)
        fiveCodeQuery(params.name, isp_dict[params.seriesName], time_parameter)

    });

    window.addEventListener("resize",function(){
        MSLine.resize();
    });

// 信令上下行

    var bar3 = echarts.init(document.getElementById('bar3'));
    var option = {
        tooltip: {
            trigger: 'axis',
            confine: true,
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            data: ['移动上行', '移动下行', '联通上行', '联通下行', '电信上行', '电信下行'],
            right: 0,
            top: 50,
            textStyle: {
                color: '#fff',
                fontSize: '14'
            },
        },
        yAxis: [{
            type: 'value',

            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                },
            },
            axisLine: {
                lineStyle: {
                    color: '#3366d2',
                },
            },
            splitLine: {
                lineStyle: {
                    color: '#030f5c',
                },

            },
        }],
        xAxis: [{
            type: 'category',
            // data: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx',],
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                },

            },
        }],
        series: [{
            name: '移动上行',
            // data: [235, 200, 138,650, 70, 910, 140],
            type: 'bar',
            barWidth: "10%",
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#547cff'
                }, {
                    offset: 1,
                    color: '#010180'

                }]),
                barBorderRadius: [15, 15, 0, 0]
            },
        },
        {
            name: '移动下行',
            // data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            barWidth: "10%",
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#8498ff'
                }, {
                    offset: 1,
                    color: '#1b0069'

                }]),
                barBorderRadius: [15, 15, 0, 0]
            },

        },
        {
            name: '联通上行',
            // data: [320, 78, 157, 586, 700, 10, 150],
            type: 'bar',
            barWidth: "10%",
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#abffaf'
                }, {
                    offset: 1,
                    color: '#003e44'

                }]),
                barBorderRadius: [15, 15, 0, 0]
            },
        },
        {
            name: '联通下行',
            // data: [130, 400, 140, 180, 70, 310, 130],
            type: 'bar',
            barWidth: "10%",
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#cafffe'
                }, {
                    offset: 1,
                    color: '#005950'

                }]),
                barBorderRadius: [15, 15, 0, 0]
            },
        }
            , {
            name: '电信上行',
            // data: [220, 400,550, 30, 770, 130, 320],
            type: 'bar',
            barWidth: "10%",
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#ffe1c9'
                }, {
                    offset: 1,
                    color: '#44220d'

                }]),
                barBorderRadius: [15, 15, 0, 0]
            },
        },
        {
            name: '电信下行',
            // data: [230, 20, 140, 30, 980, 210, 150],
            type: 'bar',
            barWidth: "10%",
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#fffeee'
                }, {
                    offset: 1,
                    color: '#000715'

                }]),
                barBorderRadius: [15, 15, 0, 0]
            },
        }]
    };
    bar3.setOption(option);
    bar3.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });    //数据加载完之前先显示一段简单的loading动画

    var xl_dx_up = [];  // 
    var xl_dx_down = [];  // 
    var xl_lt_up = [];  // 
    var xl_lt_down = [];  // 
    var xl_yd_up = [];  // 
    var xl_yd_down = [];  // 
    var xl_xAxis_data = []

    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'system_603/up_down/new?' + time_parameter,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var key in result.data) {
                    xl_xAxis_data.push(key)
                    var datas = result.data[key]
                    for (var key in datas) {
                        if (key.indexOf('1') != -1 && key.indexOf('2') == -1 && key.indexOf('3') == -1) {
                            xl_yd_up.push(datas[key].req)
                            xl_yd_down.push(datas[key].rsp)
                        } else if (key.indexOf('2') != -1 && key.indexOf('1') == -1 && key.indexOf('3') == -1) {
                            xl_lt_up.push(datas[key].req)
                            xl_lt_down.push(datas[key].rsp)
                        } else if (key.indexOf('3') != -1 && key.indexOf('2') == -1 && key.indexOf('1') == -1) {
                            xl_dx_up.push(datas[key].req)
                            xl_dx_down.push(datas[key].rsp)
                        }
                    }
                }


                bar3.hideLoading();    //隐藏加载动画
                bar3.setOption({        //加载数据图表
                    xAxis: {
                        data: xl_xAxis_data
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '移动上行',
                        data: xl_yd_up
                    }, {
                        // 根据名字对应到相应的系列
                        name: '移动下行',
                        data: xl_yd_down
                    }, {
                        // 根据名字对应到相应的系列
                        name: '联通上行',
                        data: xl_lt_up
                    }, {
                        // 根据名字对应到相应的系列
                        name: '联通下行',
                        data: xl_lt_down
                    }, {
                        // 根据名字对应到相应的系列
                        name: '电信上行',
                        data: xl_dx_up
                    }, {
                        // 根据名字对应到相应的系列
                        name: '电信下行',
                        data: xl_dx_down
                    }
                    ]
                });

            }

        },
        error: function (errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            bar3.hideLoading();
        }
    })
    window.addEventListener("resize", function () {
        bar3.resize();
    });

    // 点击事件触发--信令上下行(bar3)
    bar3.on('click', function (params){
        publicLayer.title = "详细数据查询（信令上下行）";
        publicLayer.content = $('#up_down_layer');
        $("#protocol-select").val(params.name)
        $("#up-down-isp-select").val(isp_dict[params.seriesName.slice(0,2)])
        // 获取当前时间
        let currentTime = (new Date()).Format("yyyy-MM-dd hh:mm:ss")
        let currentTimeBefore = currentTime.slice(0,11)+"00:00:00"
        $("#up_down_date_input").val(currentTimeBefore + " -- " +currentTime);
        // 时间范围是当天零点到当前时间
        let thisTimeParam = 'start_time='+currentTimeBefore+"&"+'end_time='+currentTime
        layer.open(publicLayer);
        // 其他时间有数据时取消注释
        // upDownQuery(thisLocation, thisTimeParam)
        upDownQuery(params.name, isp_dict[params.seriesName.slice(0,2)], time_parameter)
    });

    window.addEventListener("resize",function(){
        MSLine.resize();
    });

    // 获取数据短信相关数据
    var line1 = echarts.init(document.querySelector('#line1'));

       var line1Option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                if(params[0].axisValue != null){
                    clickValue = params[0].axisValue
                }
                let str = params[0].axisValue + "<br />";
                params.forEach((item) => {
                    str += '<span style="display:inline-block;' +
                        'margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;' +
                        'background-color:'+item.color+'"></span>' +
                        item.seriesName + " : " +
                        '<span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">'+
                        item.data+'</span>'+ "<br />";
                });
                return str;
            }
        },


        grid: {
            top: "10px",
            left: '0%',
            right: '1%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                // data: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx','xxx', ],
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                        fontSize: '16'
                    },
                },
                axisLine: {
                    lineStyle: {
                        width: '2px',
                        color: '#3366d2',

                    },
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                        fontSize: '16'
                    },
                },
                axisLine: {
                    lineStyle: {
                        width: '2px',
                        color: '#3366d2',

                    },
                },
                splitLine: {
                    lineStyle: {
                        color: '#030f5c',
                    },
                },
            }
        ],
        series: [
            {
                name: '前端',
                type: 'line',
                smooth: true,
                stack: '总量',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(29,170,222,1)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(7,1,15,0)'
                    }],
                    ),
                    shadowColor: "rgba(0,0,0,0.1)"
                },
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: "2", color: "#1daade",
                },
                // data: [520, 432,  90, 230, 710,910]
            },
            {
                name: '后端',
                type: 'line',
                smooth: true,
                stack: '总量',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(0,255,198,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(7,1,15,0)'

                    }]),
                },
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: "2", color: "#36f0b2",

                },
                // data: [153, 982, 121, 34, 290, 330,]
            },

        ]
    };
    line1.setOption(line1Option);

    line1.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });    //数据加载完之前先显示一段简单的loading动画

    var dx_dates = [];  // 日期
    var dx_rcvs = [];  // 前端数据集
    var dx_loads = [];  // 后端数据集

    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'system_603/sms/datas?' + time_parameter,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var i = 0; i < result.data.length; i++) {
                    datas = result.data[i]
                    dx_dates.push(datas.date.replace(' ', '\n'))
                    dx_rcvs.push(datas.rcv)
                    dx_loads.push(datas.load)
                }
                line1.hideLoading();    //隐藏加载动画
                line1.setOption({        //加载数据图表
                    xAxis: {
                        data: dx_dates
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '前端',
                        data: dx_rcvs
                    }, {
                        // 根据名字对应到相应的系列
                        name: '后端',
                        data: dx_loads
                    }
                    ]
                });

            }

        },
        error: function (errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            line1.hideLoading();
        }
    })
    window.addEventListener("resize", function () {
        line1.resize();
    });

    // 点击事件触发--短信（line1）
    $('#line1').click(function(){
        publicLayer.title = "详细数据查询（短信）";
        publicLayer.content = $('#message_layer');
        clickValue =  clickValue.replace("\n", " ")
        let clickValueBefore = clickValue.slice(0,11)+"00:00:00"
        $("#message_date_input").val(clickValueBefore + " -- " +clickValue);
        layer.open(publicLayer);
        let thisTimeParam = 'start_time='+clickValueBefore+"&"+'end_time='+clickValue
        SMSQuery(thisTimeParam)
    });

    window.addEventListener("resize",function(){
        MSLine.resize();
    });

    // 彩信
    var line2 = echarts.init(document.querySelector('#line2'));

       var line2Option = {
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                if(params[0].axisValue != null){
                    clickValue = params[0].axisValue
                }
                let str = params[0].axisValue + "<br />";
                params.forEach((item) => {
                    str += '<span style="display:inline-block;' +
                        'margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;' +
                        'background-color:'+item.color+'"></span>' +
                        item.seriesName + " : " +
                        '<span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">'+
                        item.data+'</span>'+ "<br />";
                });
                return str;
            }
        },


        grid: {
            top: "10px",
            left: '0%',
            right: '1%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx',],
                axisLine: {
                    lineStyle: {
                        width: '2px',
                        color: '#3366d2',

                    },
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                        fontSize: '16'
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: '#030f5c',
                    },

                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                        fontSize: '16'
                    },
                },
                axisLine: {
                    lineStyle: {
                        width: '2px',
                        color: '#3366d2',

                    },
                },
                splitLine: {
                    lineStyle: {
                        color: '#030f5c',
                    },
                },
            }
        ],
        series: [
            {
                name: '前端',
                type: 'line',
                smooth: true,
                stack: '总量',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(255,237,154,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(7,1,15,0)'

                    }]),
                },
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: "2", color: "#ffed9a",

                },
                // data: [420, 132, 101, 134, 90, 230, ]
            },
            {
                name: '后端',
                type: 'line',
                smooth: true,
                stack: '总量',
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(114,224,255,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(7,1,15,0)'

                    }]),
                },
                emphasis: {
                    focus: 'series'
                },
                lineStyle: {
                    width: "2", color: "#72e0ff",

                },
                // data: [220, 812, 191, 234, 290, 330, ]
            },

        ]
    };
    line2.setOption(line2Option);
    line2.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });    //数据加载完之前先显示一段简单的loading动画

    var cx_dates = [];  // 日期
    var cx_rcvs = [];  // 前端数据集
    var cx_loads = [];  // 后端数据集

    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'system_603/mms/datas?' + time_parameter,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var i = 0; i < result.data.length; i++) {
                    cx_dates.push(result.data[i].date.replace(' ', '\n'))
                    cx_rcvs.push(result.data[i].rcv)
                    cx_loads.push(result.data[i].load)
                }
                line2.hideLoading();    //隐藏加载动画
                line2.setOption({        //加载数据图表
                    xAxis: {
                        data: cx_dates
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '前端',
                        data: cx_rcvs
                    }, {
                        // 根据名字对应到相应的系列
                        name: '后端',
                        data: cx_loads
                    }
                    ]
                });

            }

        },
        error: function (errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            line2.hideLoading();
        }
    })
    window.addEventListener("resize", function () {
        line2.resize();
    });

    // 点击事件触发--彩信（line2）
    $('#line2').click(function(){
        publicLayer.title = "详细数据查询（彩信）";
        publicLayer.content = $('#message_layer');
        clickValue =  clickValue.replace("\n", " ")
        let clickValueBefore = clickValue.slice(0,11)+"00:00:00"
        $("#message_date_input").val(clickValueBefore + " -- " +clickValue);
        layer.open(publicLayer);
        let thisTimeParam = 'start_time='+clickValueBefore+"&"+'end_time='+clickValue
        MMSQuery(thisTimeParam)
    });



// 实时告警获取
    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'public/alarm/real_time?' + time_parameter,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var i = 0; i < result.data.length; i++) {
                    var datas = result.data[i];
                    $('#alarm').append(
                        '<li><div class="fontInner clearfix"><span style="width: 8%;"><b>' + (1 + i) + '</b></span><span style="width: 25%;">'
                        + datas.alarm_location + '</span><span style="width: 8%;">'
                        + datas.alarm_level + '</span><span style="width: 25%;">'
                        + datas.alarm_text + '</span><span style="width: 8%;">'
                        + datas.happen_times + '</span><span style="width: 26%;">'
                        + datas.happen_d_time.substr(datas.happen_d_time.lastIndexOf(' ') + 1) + '</span></div></li>'
                    );
                }
            }

        },
        error: function (errorMsg) {
            //请求失败时执行该函数
            alert("实时告警数据失败!");
        }
    })
});

// 设置弹窗格式
let publicLayer = {
    type: 1,
    title: '详细数据查询',
    content: ' ',
    area: '800px',
    // maxmin: true
    // btn: ['关闭']
    // ,btn1: function(){
    //     layer.closeAll();
    // }
};


// 日期选择器
layui.use('laydate', function() {
    let laydate = layui.laydate;
    laydate.render({
        elem: '#message_date_input',
        type: 'datetime',
        range: '--',
        format: 'yyyy-MM-dd HH:mm:ss',
        theme: '#393D49'
    });

    laydate.render({
        elem: '#relation_date_input',
        type: 'datetime',
        range: '--',
        format: 'yyyy-MM-dd HH:mm:ss',
        theme: '#393D49'
    });

    laydate.render({
        elem: '#five_code_date_input',
        type: 'datetime',
        range: '--',
        format: 'yyyy-MM-dd HH:mm:ss',
        theme: '#393D49'
    });

    laydate.render({
        elem: '#up_down_date_input',
        type: 'datetime',
        range: '--',
        format: 'yyyy-MM-dd HH:mm:ss',
        theme: '#393D49'
    });
})

// 弹出框
layui.use('layer', function(){
    let layer = layui.layer;
});

layer.config({
    skin: 'public-layer'
})

var MSLine = echarts.init(document.getElementById('ms_line'));

var MSLineOption = {
    tooltip: {
        trigger: 'axis',
    },

    grid: {
        top:"10px",
        left: '0%',
        right: '1%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            // data: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx','xxx', ],
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize:'16'
                }, },
            axisLine:{
                lineStyle: {
                    width:'2px',
                    color: '#3366d2',

                },
            },
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize:'16'
                }, },
            axisLine:{
                lineStyle: {
                    width:'2px',
                    color: '#3366d2',

                },
            },
            splitLine:{  lineStyle: {
                    color: '#030f5c',
                },
            },
        }
    ],
    series: [
        {
            name: '前端',
            type: 'line',
            smooth:true,
            stack: '总量',
            areaStyle: {
                color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(29,170,222,1)'
                    }, {
                        offset: 0.8,
                        color: 'rgba(7,1,15,0)'
                    }],
                ),
                shadowColor:"rgba(0,0,0,0.1)"
            },
            emphasis: {
                focus: 'series'
            },
        },
        {
            name: '后端',
            type: 'line',
            smooth:true,
            stack: '总量',
            areaStyle: {
                color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0,255,198,1)'
                }, {
                    offset: 1,
                    color: 'rgba(7,1,15,0)'
                }]),
            },
            emphasis: {
                focus: 'series'
            },
        },

    ]
};

var relationLine = echarts.init(document.getElementById('relation_line'));

var relationLineOption = {
    tooltip: {
        trigger: 'axis',
    },

    grid: {
        top:"10px",
        left: '0%',
        right: '1%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            // data: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx','xxx', ],
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize:'16'
                }, },
            axisLine:{
                lineStyle: {
                    width:'2px',
                    color: '#3366d2',

                },
            },
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize:'16'
                }, },
            axisLine:{
                lineStyle: {
                    width:'2px',
                    color: '#3366d2',

                },
            },
            splitLine:{  lineStyle: {
                    color: '#030f5c',
                },
            },
        }
    ],
    series: []
};

var fiveCodeLine = echarts.init(document.getElementById('five_code_line'));

var fiveCodeLineOption = {
    tooltip: {
        trigger: 'axis',
    },

    grid: {
        top:"10px",
        left: '0%',
        right: '1%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            // data: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx','xxx', ],
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize:'16'
                }, },
            axisLine:{
                lineStyle: {
                    width:'2px',
                    color: '#3366d2',

                },
            },
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize:'16'
                }, },
            axisLine:{
                lineStyle: {
                    width:'2px',
                    color: '#3366d2',

                },
            },
            splitLine:{  lineStyle: {
                    color: '#030f5c',
                },
            },
        }
    ],
    series: []
};

var upDownLine = echarts.init(document.getElementById('up_down_line'));

var upDownLineOption = {
    tooltip: {
        trigger: 'axis',
    },

    grid: {
        top:"10px",
        left: '0%',
        right: '1%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            // data: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx','xxx', ],
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize:'16'
                }, },
            axisLine:{
                lineStyle: {
                    width:'2px',
                    color: '#3366d2',

                },
            },
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize:'16'
                }, },
            axisLine:{
                lineStyle: {
                    width:'2px',
                    color: '#3366d2',

                },
            },
            splitLine:{  lineStyle: {
                    color: '#030f5c',
                },
            },
        }
    ],
    series: []
};

// 短信、彩信-查询按钮触发
$('#message_query_button').click(function(){
    let timeRange = $("#message_date_input").val().split(" -- ")
    let thisTimeParam = 'start_time='+timeRange[0]+"&"+'end_time='+timeRange[1]
    if(thisTimeParam === ""){
        alert("请选择时间范围!");
    }

    if(publicLayer.title.slice(7,9) === "短信"){
        SMSQuery(thisTimeParam)
    }else if(publicLayer.title.slice(7,9) === "彩信"){
        MMSQuery(thisTimeParam)
    }else{
        alert("未知类型查询");
    }
})

// 关联率-查询按钮触发
$('#relation_query_button').click(function(){
    let timeRange = $("#relation_date_input").val().split(" -- ")
    let thisTimeParam = 'start_time='+timeRange[0]+"&"+'end_time='+timeRange[1]
    if(thisTimeParam === ""){
        alert("请选择时间范围!");
    }
    let thisLocation = 'location=' + $("#server-room-select").val().replace('\n', '_')
    RelationQuery(thisLocation,thisTimeParam)
})

// 五码指标-查询按钮触发
$('#five_code_query_button').click(function(){
    let timeRange = $("#five_code_date_input").val().split(" -- ")
    let thisTimeParam = 'start_time='+timeRange[0]+"&"+'end_time='+timeRange[1]
    if(thisTimeParam === ""){
        alert("请选择时间范围!");
    }
    fiveCodeQuery($("#code-select").val(), $("#five-code-isp-select").val(), thisTimeParam)
})

// 信令上下行-查询按钮触发
$('#up_down_query_button').click(function(){
    let timeRange = $("#up_down_date_input").val().split(" -- ")
    let thisTimeParam = 'start_time='+timeRange[0]+"&"+'end_time='+timeRange[1]
    if(thisTimeParam === ""){
        alert("请选择时间范围!");
    }
    upDownQuery($("#protocol-select").val(), $("#five-code-isp-select").val(), thisTimeParam)
})


// 关联率查询
function RelationQuery(location,timeParam){

    relationLine.clear()
    relationLine.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });

    relationLine.setOption(relationLineOption);

    let relation_dates=[];  // 日期
    let relation_series=[];  // 获取到的数据级
    $.ajax({
        type : "get",
        async : true,  //异步请求
        url : api_url + 'system_603/relation/location/ip?' + location + '&' +timeParam,
        data : {},
        dataType : "json",  //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (Object.keys(result.data).length !== 0) {
                relation_dates = result.data[Object.keys(result.data)[0]].map(a =>
                    a.date.replace(' ', '\n'));
                for(let key in result.data){
                    relation_series.push({
                        name: key ,
                        type: 'line',
                        smooth: true,
                        data: result.data[key].map(a => a.value)});
                }

                relationLine.hideLoading();    //隐藏加载动画
                relationLine.setOption({        //加载数据图表
                    xAxis: {
                        data: relation_dates
                    },
                    series: relation_series
                });

            }else{
                relationLine.hideLoading();
                alert("无数据");
            }

        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            relationLine.hideLoading();
        }
    })

}

// 五码指标查询
function fiveCodeQuery(code, isp, timeParam){
    fiveCodeLine.clear()
    fiveCodeLine.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });

    fiveCodeLine.setOption(fiveCodeLineOption);

    $.ajax({
        type : "get",
        async : true,  //异步请求
        url : api_url + 'system_603/five_code/chanct/datas?isp=' + isp + '&code=' +code + '&' + timeParam,
        data : {},
        dataType : "json",  //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (Object.keys(result.data).length !== 0) {

                fiveCodeLine.hideLoading();    //隐藏加载动画
                fiveCodeLine.setOption({        //加载数据图表
                    xAxis: {
                        data: result.data.map(a => a.date)
                    },
                    series: {
                        name: code + "-" + isp_dict_reversion[isp] ,
                        type: 'line',
                        smooth: true,
                        data: result.data.map(a => a.rate)
                    }
                });

            }else{
                fiveCodeLine.hideLoading();
                alert("无数据");
            }

        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            fiveCodeLine.hideLoading();
        }
    })
}

// 信令上下行查询
function upDownQuery(protocol, isp, timeParam){
    upDownLine.clear()
    upDownLine.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });

    upDownLine.setOption(upDownLineOption);

    $.ajax({
        type : "get",
        async : true,  //异步请求
        url : api_url + 'system_603/up_down/datas?isp=' + isp +'&protocol=' + protocol + '&' +timeParam,
        data : {},
        dataType : "json",  //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (Object.keys(result.data).length !== 0) {

                upDownLine.hideLoading();    //隐藏加载动画
                upDownLine.setOption({        //加载数据图表
                    xAxis: {
                        data: result.data.map(a => a.date)
                    },
                    series: [{
                        name: protocol + "-" + isp_dict_reversion[isp]+"上行" ,
                        type: 'line',
                        smooth: true,
                        data: result.data.map(a => a.req)
                    },{
                        name: protocol + "-" + isp_dict_reversion[isp]+"下行",
                        type: 'line',
                        smooth: true,
                        data: result.data.map(a => a.rsp)
                    }]
                });

            }else{
                upDownLine.hideLoading();
                alert("无数据");
            }

        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            upDownLine.hideLoading();
        }
    })
}

// 短信查询
function SMSQuery(timeParam){

    MSLine.clear()
    MSLine.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });

    MSLine.setOption(MSLineOption);

    let dx_dates=[];  // 日期
    let dx_rcvs=[];  // 前端数据集
    let dx_loads=[];  // 后端数据集
    $.ajax({
        type : "get",
        async : true,  //异步请求
        url : api_url + 'system_603/sms/datas?' + timeParam,
        data : {},
        dataType : "json",  //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for(var i=0;i<result.data.length;i++){
                    dx_dates.push(result.data[i].date.replace(' ', '\n'))
                    dx_rcvs.push(result.data[i].rcv)
                    dx_loads.push(result.data[i].load)
                }
                MSLine.hideLoading();    //隐藏加载动画
                MSLine.setOption({        //加载数据图表
                    xAxis: {
                        data: dx_dates
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '前端',
                        data: dx_rcvs,
                        lineStyle:{width:"2",color:"#1daade",},
                    },{
                        // 根据名字对应到相应的系列
                        name: '后端',
                        data: dx_loads,
                        lineStyle:{width:"2",color:"#36f0b2",},
                    }
                    ]
                });

            }

        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            MSLine.hideLoading();
        }
    })
}

// 彩信查询
function MMSQuery(timeParam){

    MSLine.clear()
    MSLine.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });

    MSLine.setOption(MSLineOption);

    let cx_dates=[];  // 日期
    let cx_rcvs=[];  // 前端数据集
    let cx_loads=[];  // 后端数据集

    $.ajax({
        type : "get",
        async : true,  //异步请求
        url : api_url + 'system_603/mms/datas?' + timeParam,
        data : {},
        dataType : "json",  //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for(var i=0;i<result.data.length;i++){
                    cx_dates.push(result.data[i].date.replace(' ', '\n'))
                    cx_rcvs.push(result.data[i].rcv)
                    cx_loads.push(result.data[i].load)
                }
                MSLine.hideLoading();    //隐藏加载动画
                MSLine.setOption({        //加载数据图表
                    xAxis: {
                        data: cx_dates
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '前端',
                        data: cx_rcvs,
                        lineStyle:{width:"2",color:"#ffed9a",},
                    },{
                        // 根据名字对应到相应的系列
                        name: '后端',
                        data: cx_loads,
                        lineStyle:{width:"2",color:"#72e0ff",},
                    }
                    ]
                });

            }

        },
        error : function(errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            MSLine.hideLoading();
        }
    })
}