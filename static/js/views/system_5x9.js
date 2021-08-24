
// 声明变量（鼠标点击监听）
let clickValue = ''

$(function () {
    // 域名
    var bar1 = echarts.init(document.getElementById('bar1'));
    var option = {
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
                // data: ['xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx',],
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
                    },formatter: function (value) {
                        var res = value.toString();                                            
                        return res.replace('\n', ' ').substring(5,16)                                                                               
                    }
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
                    formatter: function (value) {
                        var res = value.toString();                                            
                        var numN1 = 0; 
                        var numN2 = 1;
                        var num1=0;
                        var num2=0;
                        var t1 = 1;
                        for(var k=0;k<res.length;k++){
                            if(res[k]==".")
                               t1 = 0;
                            if(t1)
                               num1++;
                            else
                               num2++;                                                                                              
                        }                                       
                        if(Math.abs(value)<1 && res.length>4)
                        {
                            for(var i=2; i<res.length; i++){                                              
                                if(res[i]=="0"){
                                    numN2++;
                                }else if(res[i]==".")
                                    continue;
                                else
                                    break;
                            }
                            var v = parseFloat(value);                                                
                            v = v * Math.pow(10,numN2);
                            return v.toString() + "e-" + numN2;
                        }else if(num1>4)
                        {
                            if(res[0]=="-")
                                numN1 = num1 - 2;
                            else
                                numN1 = num1 - 1;
                            var v = parseFloat(value);                                                
                            v = v / Math.pow(10,numN1);
                            if(num2 > 4)
                                v = v.toFixed(4);
                            return v.toString() + "e" + numN1;
                        }else
                            return parseFloat(value);                                                                                  
                    }
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
                name: '域名接收',
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
                name: '域名加载',
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
    bar1.setOption(option);
    bar1.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });    //数据加载完之前先显示一段简单的loading动画

    var ym_dates = [];  // 
    var ym_ibps = [];  // 
    var ym_obps = [];  // 

    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'system_509/collect_flow/new?' + time_parameter,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var i = 0; i < result.data.length; i++) {
                    ym_dates.push(result.data[i].date.replace(' ', '\n'))
                    ym_ibps.push(result.data[i].ibps)
                    ym_obps.push(result.data[i].obps)
                }
                bar1.hideLoading();    //隐藏加载动画
                bar1.setOption({        //加载数据图表
                    xAxis: {
                        data: ym_dates
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '域名接收',
                        data: ym_ibps
                    },{
                        // 根据名字对应到相应的系列
                        name: '域名加载',
                        data: ym_obps
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

    // 点击事件触发--域名(bar1)
    $('#bar1').click(function(){
        // publicLayer.title = "详细数据查询（域名）";
        // publicLayer.content = $('#relation_layer');
        // $("#server-room-select").val(params.name.replace('\n', '_'))
        // let thisLocation = 'location=' + params.name.replace('\n', '_')
        // // 获取当前时间
        // let currentTime = (new Date()).Format("yyyy-MM-dd hh:mm:ss")
        // let currentTimeBefore = currentTime.slice(0,11)+"00:00:00"
        // $("#relation_date_input").val(currentTimeBefore + " -- " +currentTime);
        // // 时间范围是当天零点到当前时间
        // let thisTimeParam = 'start_time='+currentTimeBefore+"&"+'end_time='+currentTime
        // layer.open(publicLayer);
        // // 其他时间有数据时取消注释
        // // RelationQuery(thisLocation, thisTimeParam)
        // RelationQuery(thisLocation, time_parameter)

        publicLayer.title = "详细数据查询（域名）";
        publicLayer.content = $('#relation_layer');
        clickValue =  clickValue.replace("\n", " ")
        let clickValueBefore = clickValue.slice(0,11)+"00:00:00"
        $("#relation_date_input").val(clickValueBefore + " -- " +clickValue);
        layer.open(publicLayer);
        let thisTimeParam = 'start_time='+clickValueBefore+"&"+'end_time='+clickValue
        RelationQuery(thisTimeParam)
    });

    window.addEventListener("resize",function(){
        MSLine.resize();
    });

// 加载率

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
                },formatter: function (value) {
                    var res = value.toString();                                            
                    var numN1 = 0; 
                    var numN2 = 1;
                    var num1=0;
                    var num2=0;
                    var t1 = 1;
                    for(var k=0;k<res.length;k++){
                        if(res[k]==".")
                           t1 = 0;
                        if(t1)
                           num1++;
                        else
                           num2++;                                                                                              
                    }                                       
                    if(Math.abs(value)<1 && res.length>4)
                    {
                        for(var i=2; i<res.length; i++){                                              
                            if(res[i]=="0"){
                                numN2++;
                            }else if(res[i]==".")
                                continue;
                            else
                                break;
                        }
                        var v = parseFloat(value);                                                
                        v = v * Math.pow(10,numN2);
                        return v.toString() + "e-" + numN2;
                    }else if(num1>4)
                    {
                        if(res[0]=="-")
                            numN1 = num1 - 2;
                        else
                            numN1 = num1 - 1;
                        var v = parseFloat(value);                                                
                        v = v / Math.pow(10,numN1);
                        if(num2 > 4)
                            v = v.toFixed(4);
                        return v.toString() + "e" + numN1;
                    }else
                        return parseFloat(value);                                                                                  
                }
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
                name: '加载率',
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

    var jzl_ip = [];  //  
    var jzl_values = [];  //  


    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'system_509/loading_rate/new?' + time_parameter,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var key in result.data) {
                    jzl_ip.push(key)
                    jzl_values.push(result.data[key].value)
                }

                bar2.hideLoading();    //隐藏加载动画
                bar2.setOption({        //加载数据图表
                    xAxis: {
                        data: jzl_ip
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '加载率',
                        data: jzl_values
                    },
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

    // 点击事件触发--加载率(bar2)
    bar2.on('click', function (params){
        publicLayer.title = "详细数据查询（加载率）";
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
        fiveCodeQuery(params.name, time_parameter)

    });

    window.addEventListener("resize",function(){
        MSLine.resize();
    });

// hive

    var bar3 = echarts.init(document.getElementById('bar3'));
    var option = {
        tooltip: {
            trigger: 'axis',
            confine: true,
            enterable:true,
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
                formatter: function (value) {
                    var res = value.toString();                                            
                    var numN1 = 0; 
                    var numN2 = 1;
                    var num1=0;
                    var num2=0;
                    var t1 = 1;
                    for(var k=0;k<res.length;k++){
                        if(res[k]==".")
                           t1 = 0;
                        if(t1)
                           num1++;
                        else
                           num2++;                                                                                              
                    }                                       
                    if(Math.abs(value)<1 && res.length>4)
                    {
                        for(var i=2; i<res.length; i++){                                              
                            if(res[i]=="0"){
                                numN2++;
                            }else if(res[i]==".")
                                continue;
                            else
                                break;
                        }
                        var v = parseFloat(value);                                                
                        v = v * Math.pow(10,numN2);
                        return v.toString() + "e-" + numN2;
                    }else if(num1>4)
                    {
                        if(res[0]=="-")
                            numN1 = num1 - 2;
                        else
                            numN1 = num1 - 1;
                        var v = parseFloat(value);                                                
                        v = v / Math.pow(10,numN1);
                        if(num2 > 4)
                            v = v.toFixed(4);
                        return v.toString() + "e" + numN1;
                    }else
                        return parseFloat(value);                                                                                  
                }
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
                    fontSize: '12'
                },
                interval:0,

            },
        }],
        series: [{
            name: '当前库表数据情况',
            // data: [235, 200, 138,650, 70, 910, 140],
            type: 'bar',
            barWidth: "50%",
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#547cff'
                }, {
                    offset: 1,
                    color: '#010180'

                }]),
                barBorderRadius: [5, 5, 0, 0]
            },
        },]
        
    };
    bar3.setOption(option);
    bar3.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });    //数据加载完之前先显示一段简单的loading动画

    var hive_values = [];  // 
    var hive_xAxis_datas = []

    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'system_509/hive/new?' + time_parameter,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var key in result.data) {
                    hive_xAxis_datas.push(key)
                    hive_values.push(result.data[key].value)
                }


                bar3.hideLoading();    //隐藏加载动画
                bar3.setOption({        //加载数据图表
                    xAxis: {
                        data: hive_xAxis_datas
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '当前库表数据情况',
                        data: hive_values
                    },
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

    // 点击事件触发--hive(bar3)
    bar3.on('click', function (params){
        publicLayer.title = "详细数据查询（hive）";
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
        upDownQuery(params.name, time_parameter)
    });

    window.addEventListener("resize",function(){
        MSLine.resize();
    });


    ysl_switch('移动')
    // 流监测
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
                    },formatter: function (value) {
                        var res = value.toString();                                            
                        return res.replace('\n', ' ').substring(5,16)                                                                               
                    }
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
                    formatter: function (value) {
                        var res = value.toString();                                            
                        var numN1 = 0; 
                        var numN2 = 1;
                        var num1=0;
                        var num2=0;
                        var t1 = 1;
                        for(var k=0;k<res.length;k++){
                            if(res[k]==".")
                               t1 = 0;
                            if(t1)
                               num1++;
                            else
                               num2++;                                                                                              
                        }                                       
                        if(Math.abs(value)<1 && res.length>4)
                        {
                            for(var i=2; i<res.length; i++){                                              
                                if(res[i]=="0"){
                                    numN2++;
                                }else if(res[i]==".")
                                    continue;
                                else
                                    break;
                            }
                            var v = parseFloat(value);                                                
                            v = v * Math.pow(10,numN2);
                            return v.toString() + "e-" + numN2;
                        }else if(num1>4)
                        {
                            if(res[0]=="-")
                                numN1 = num1 - 2;
                            else
                                numN1 = num1 - 1;
                            var v = parseFloat(value);                                                
                            v = v / Math.pow(10,numN1);
                            if(num2 > 4)
                                v = v.toFixed(4);
                            return v.toString() + "e" + numN1;
                        }else
                            return parseFloat(value);                                                                                  
                    }
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
                name: '接收',
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
                name: '加载',
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

    var ljc_dates = [];  // 日期
    var ljc_ibps = [];  // 前端数据集
    var ljc_obps = [];  // 后端数据集

    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'system_509/flow_monitoring/new?' + time_parameter,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var i = 0; i < result.data.length; i++) {
                    ljc_dates.push(result.data[i].date.replace(' ', '\n'))
                    ljc_ibps.push(result.data[i].ibps)
                    ljc_obps.push(result.data[i].obps)
                }
                line2.hideLoading();    //隐藏加载动画
                line2.setOption({        //加载数据图表
                    xAxis: {
                        data: ljc_dates
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '前端',
                        data: ljc_ibps
                    }, {
                        // 根据名字对应到相应的系列
                        name: '后端',
                        data: ljc_obps
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
        publicLayer.title = "详细数据查询（流监测）";
        publicLayer.content = $('#message_layer');
        clickValue =  clickValue.replace("\n", " ")
        let clickValueBefore = clickValue.slice(0,11)+"00:00:00"
        $("#message_date_input").val(clickValueBefore + " -- " +clickValue);
        layer.open(publicLayer);
        let thisTimeParam = 'start_time='+clickValueBefore+"&"+'end_time='+clickValue
        MMSQuery(thisTimeParam)
    });

        // 点击事件触发--原始流（line1）
        $('#line1').click(function(){
            publicLayer.title = "详细数据查询（原始流）";
            publicLayer.content = $('#message_layer');
            clickValue =  clickValue.replace("\n", " ")
            let clickValueBefore = clickValue.slice(0,11)+"00:00:00"
            $("#message_date_input").val(clickValueBefore + " -- " +clickValue);
            layer.open(publicLayer);
            let thisTimeParam = 'start_time='+clickValueBefore+"&"+'end_time='+clickValue
            SMSQuery(thisTimeParam)
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
            name: '移动加载',
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
            name: '移动采集',
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
            name: '联通加载',
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
            name: '联通采集',
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
            name: '电信加载',
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
            name: '电信采集',
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

// 原始流、彩信-查询按钮触发
$('#message_query_button').click(function(){
    let timeRange = $("#message_date_input").val().split(" -- ")
    let thisTimeParam = 'start_time='+timeRange[0]+"&"+'end_time='+timeRange[1]
    if(thisTimeParam === ""){
        alert("请选择时间范围!");
    }

    if(publicLayer.title.slice(7,10) === "原始流"){
        SMSQuery(thisTimeParam)
    }else if(publicLayer.title.slice(7,10) === "流监测"){
        MMSQuery(thisTimeParam)
    }else{
        alert("未知类型查询");
    }
})

// 域名-查询按钮触发
$('#relation_query_button').click(function(){
    let timeRange = $("#relation_date_input").val().split(" -- ")
    let thisTimeParam = 'start_time='+timeRange[0]+"&"+'end_time='+timeRange[1]
    if(thisTimeParam === ""){
        alert("请选择时间范围!");
    }
    let thisLocation = 'location=' + $("#server-room-select").val().replace('\n', '_')
    RelationQuery(thisLocation,thisTimeParam)
})

// 加载率-查询按钮触发
$('#five_code_query_button').click(function(){
    let timeRange = $("#five_code_date_input").val().split(" -- ")
    let thisTimeParam = 'start_time='+timeRange[0]+"&"+'end_time='+timeRange[1]
    if(thisTimeParam === ""){
        alert("请选择时间范围!");
    }
    console.log(thisTimeParam)
    fiveCodeQuery($("#code-select").val(), thisTimeParam)
})

// hive-查询按钮触发
$('#up_down_query_button').click(function(){
    let timeRange = $("#up_down_date_input").val().split(" -- ")
    let thisTimeParam = 'start_time='+timeRange[0]+"&"+'end_time='+timeRange[1]
    if(thisTimeParam === ""){
        alert("请选择时间范围!");
    }
    upDownQuery($("#protocol-select").val(), thisTimeParam)
})


// 域名查询
function RelationQuery(timeParam){

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
        url : api_url + 'system_509/collect_flow/location?'+timeParam,
        data : {},
        dataType : "json",  //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (Object.keys(result.data).length !== 0) {
                for(let key in result.data){
                    var temp_date = []
                    var ibps = []
                    var obps = []
                    for(var i=0;i<result.data[key].length;i++){
                        temp_date.push(result.data[key][0].date)
                        ibps.push(result.data[key][0].ibps)
                        obps.push(result.data[key][0].obps)
                    }
                    
                    relation_dates.push(temp_date)
                    relation_series.push({
                        name: key + ' ibps' ,
                        type: 'line',
                        smooth: true,
                        data: ibps},
                        {
                            name: key + ' obps' ,
                            type: 'line',
                            smooth: true,
                            data: obps});
                }
                relationLine.hideLoading();    //隐藏加载动画
                relationLine.setOption({        //加载数据图表
                    xAxis: {
                        data: relation_dates[0]
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

// 加载率查询
function fiveCodeQuery(ip_port,timeParam){
    fiveCodeLine.clear()
    fiveCodeLine.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });

    fiveCodeLine.setOption(fiveCodeLineOption);
    var jzl_dates = []
    var jzl_values = []
    $.ajax({
        type : "get",
        async : true,  //异步请求
        url : api_url + 'system_509/loading_rate/datas?ip_port=' + ip_port + '&' + timeParam,
        data : {},
        dataType : "json",  //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (Object.keys(result.data).length !== 0) {
                datas = result.data
                for (var i = 0; i < datas.length; i++) {
                    jzl_dates.push(datas[i].date)
                    jzl_values.push(datas[i].value)
                }
                fiveCodeLine.hideLoading();    //隐藏加载动画
                fiveCodeLine.setOption({        //加载数据图表
                    xAxis: {
                        data: jzl_dates
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                    name: '加载率',
                    type: 'line',
                    smooth: true,
                    stack: '总量',
                    data: jzl_values,
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
                }]
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

// hive查询
function upDownQuery(db_name, timeParam){
    upDownLine.clear()
    upDownLine.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });

    upDownLine.setOption(upDownLineOption);
    var hive_datas = []
    var hive_values = []
    $.ajax({
        type : "get",
        async : true,  //异步请求
        url : api_url + 'system_509/hive/datas?db_name=' + db_name + '&' +timeParam,
        data : {},
        dataType : "json",  //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (Object.keys(result.data).length !== 0) {
                datas = result.data
                for (var i = 0; i < datas.length; i++) {
                    hive_datas.push(datas[i].date)
                    hive_values.push(datas[i].value)
                }
                upDownLine.hideLoading();    //隐藏加载动画
                upDownLine.setOption({        //加载数据图表
                    xAxis: {
                        data: hive_datas
                    },
                        series: [{
                            // 根据名字对应到相应的系列
                        name: '数据量',
                        type: 'line',
                        smooth: true,
                        stack: '总量',
                        data: hive_values,
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

// 原始流查询
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


    var ysl_dates_sel = [];  // 日期
    var ysl_yd_ibps_sel = [];  // 前端数据集
    var ysl_yd_obps_sel = [];  // 后端数据集
    var ysl_lt_ibps_sel = [];  // 前端数据集
    var ysl_lt_obps_sel = [];  // 后端数据集
    var ysl_dx_ibps_sel = [];  // 前端数据集
    var ysl_dx_obps_sel = [];  // 后端数据集
    $.ajax({
        type: "get",
        async: false,  //异步请求
        url: api_url + 'system_509/row_flow/isp_data?' + timeParam + '&operator=移动',
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            datas = result.data['移动'];
            if (datas) {
                for (var i = 0; i < datas.length; i++) {
                    ysl_dates_sel.push(datas[i].date.replace(' ', '\n'))
                    ysl_yd_ibps_sel.push(datas[i].ibps)
                    ysl_yd_obps_sel.push(datas[i].obps)
                }
            }
        },
        error: function (errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            MSLine.hideLoading();
        }
    })
    var ysl_dates_sel = [];  // 日期
    $.ajax({
        type: "get",
        async: false,  //异步请求
        url: api_url + 'system_509/row_flow/isp_data?' + timeParam + '&operator=联通',
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            datas = result.data['联通'];
            if (datas) {
                for (var i = 0; i < datas.length; i++) {
                    ysl_dates_sel.push(datas[i].date.replace(' ', '\n'))
                    ysl_lt_ibps_sel.push(datas[i].ibps)
                    ysl_lt_obps_sel.push(datas[i].obps)
                }
            }
        },
        error: function (errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            MSLine.hideLoading();
        }
    })
    var ysl_dates_sel = [];  // 日期
    $.ajax({
        type: "get",
        async: false,  //异步请求
        url: api_url + 'system_509/row_flow/isp_data?' + timeParam + '&operator=电信',
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            datas = result.data['电信'];
            if (datas) {
                for (var i = 0; i < datas.length; i++) {
                    ysl_dates_sel.push(datas[i].date.replace(' ', '\n'))
                    ysl_dx_ibps_sel.push(datas[i].ibps)
                    ysl_dx_obps_sel.push(datas[i].obps)
                }
 
            }
        },
        error: function (errorMsg) {
            //请求失败时执行该函数
            alert("图表请求数据失败!");
            MSLine.hideLoading();
        }
    })
    MSLine.hideLoading();    //隐藏加载动画
    MSLine.setOption({        //加载数据图表
        xAxis: {
            data: ysl_dates_sel
        },
        series: [{
            // 根据名字对应到相应的系列
            name: '移动接收',
            data: ysl_yd_ibps_sel,
            lineStyle:{width:"2",color:"#ffed9a",},
        },{
            // 根据名字对应到相应的系列
            name: '移动加载',
            data: ysl_yd_obps_sel,
            lineStyle:{width:"2",color:"#72e0ff",},
        },{
            // 根据名字对应到相应的系列
            name: '联通接收',
            data: ysl_lt_ibps_sel,
            lineStyle:{width:"2",color:"#ffed9a",},
        },{
            // 根据名字对应到相应的系列
            name: '联通加载',
            data: ysl_lt_obps_sel,
            lineStyle:{width:"2",color:"#72e0ff",},
        },
        {
            // 根据名字对应到相应的系列
            name: '电信接收',
            data: ysl_dx_ibps_sel,
            lineStyle:{width:"2",color:"#ffed9a",},
        },{
            // 根据名字对应到相应的系列
            name: '电信加载',
            data: ysl_dx_obps_sel,
            lineStyle:{width:"2",color:"#72e0ff",},
        }
        ]
    });
    window.addEventListener("resize", function () {
        MSLine.resize();
    });

}

// 流监测查询
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

    let ljc_datas=[]; 
    let ljc_yd_ibps=[];  
    let ljc_dx_ibps=[]; 
    let ljc_lt_ibps=[]; 
    let ljc_yd_obps=[];
    let ljc_dx_obps=[];
    let ljc_lt_obps=[];

    $.ajax({
        type : "get",
        async : true,  //异步请求
        url : api_url + 'system_509/flow_monitoring/isp?' + timeParam,
        data : {},
        dataType : "json",  //返回数据形式为json
        success : function(result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            if (result.data) {
                for (var key in result.data) {
                    
                    // 1:移动  2：联通 3：电信
                    if (key == 1){
                        ljc_datas.splice(0,ljc_datas.length)
                        for(var i=0;i<result.data[key].length;i++){
                            ljc_datas.push(result.data[key][i].date)
                            ljc_yd_ibps.push(result.data[key][i].ibps)
                            ljc_yd_obps.push(result.data[key][i].obps)
                        }
                    }else if (key == 2){
                        ljc_datas.splice(0,ljc_datas.length)
                        for(var i=0;i<result.data[key].length;i++){
                            ljc_datas.push(result.data[key][i].date)
                            ljc_lt_ibps.push(result.data[key][i].ibps)
                            ljc_lt_obps.push(result.data[key][i].obps)
                        }
                    }else if (key == 3){
                        ljc_datas.splice(0,ljc_datas.length)
                        for(var i=0;i<result.data[key].length;i++){
                            ljc_datas.push(result.data[key][i].date)
                            ljc_dx_ibps.push(result.data[key][i].ibps)
                            ljc_dx_obps.push(result.data[key][i].obps)
                        }
                    }
                }

                MSLine.hideLoading();    //隐藏加载动画
                MSLine.setOption({        //加载数据图表
                    xAxis: {
                        data: ljc_datas
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '移动接收',
                        data: ljc_yd_ibps,
                        lineStyle:{width:"2",color:"#ffed9a",},
                    },{
                        // 根据名字对应到相应的系列
                        name: '移动加载',
                        data: ljc_yd_obps,
                        lineStyle:{width:"2",color:"#72e0ff",},
                    },
                    {
                        // 根据名字对应到相应的系列
                        name: '联通接收',
                        data: ljc_lt_ibps,
                        lineStyle:{width:"2",color:"#ffed9a",},
                    },{
                        // 根据名字对应到相应的系列
                        name: '联通加载',
                        data: ljc_lt_obps,
                        lineStyle:{width:"2",color:"#72e0ff",},
                    },
                    {
                        // 根据名字对应到相应的系列
                        name: '电信接收',
                        data: ljc_dx_ibps,
                        lineStyle:{width:"2",color:"#ffed9a",},
                    },{
                        // 根据名字对应到相应的系列
                        name: '电信加载',
                        data: ljc_dx_obps,
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


// 原始流切换
function ysl_switch(operator) {
    // 原始流
    var line1 = echarts.init(document.querySelector('#line1'));
    var option = {
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
                    },formatter: function (value) {
                        var res = value.toString();                                            
                        return res.replace('\n', ' ').substring(5,16)                                                                               
                    }
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
                    formatter: function (value) {
                        var res = value.toString();                                            
                        var numN1 = 0; 
                        var numN2 = 1;
                        var num1=0;
                        var num2=0;
                        var t1 = 1;
                        for(var k=0;k<res.length;k++){
                            if(res[k]==".")
                               t1 = 0;
                            if(t1)
                               num1++;
                            else
                               num2++;                                                                                              
                        }                                       
                        if(Math.abs(value)<1 && res.length>4)
                        {
                            for(var i=2; i<res.length; i++){                                              
                                if(res[i]=="0"){
                                    numN2++;
                                }else if(res[i]==".")
                                    continue;
                                else
                                    break;
                            }
                            var v = parseFloat(value);                                                
                            v = v * Math.pow(10,numN2);
                            return v.toString() + "e-" + numN2;
                        }else if(num1>4)
                        {
                            if(res[0]=="-")
                                numN1 = num1 - 2;
                            else
                                numN1 = num1 - 1;
                            var v = parseFloat(value);                                                
                            v = v / Math.pow(10,numN1);
                            if(num2 > 4)
                                v = v.toFixed(4);
                            return v.toString() + "e" + numN1;
                        }else
                            return parseFloat(value);                                                                                  
                    }
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
                name: '接收',
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
                name: '加载',
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
    line1.setOption(option);
    line1.showLoading({
        text: '数据加载中...',
        color: '#c23531',
        textColor: '#ffffc2',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
    });    //数据加载完之前先显示一段简单的loading动画

    var ysl_dates = [];  // 日期
    var ysl_ibps = [];  // 前端数据集
    var ysl_obps = [];  // 后端数据集

    $.ajax({
        type: "get",
        async: true,  //异步请求
        url: api_url + 'system_509/row_flow/isp_data?' + time_parameter + '&operator=' + operator,
        data: {},
        dataType: "json",  //返回数据形式为json
        success: function (result) {
            //请求成功时执行该函数内容，result即为服务器返回的json对象
            datas = result.data[operator];
            if (datas) {
                for (var i = 0; i < datas.length; i++) {
                    ysl_dates.push(datas[i].date.replace(' ', '\n'))
                    ysl_ibps.push(datas[i].ibps)
                    ysl_obps.push(datas[i].obps)
                }
                line1.hideLoading();    //隐藏加载动画
                line1.setOption({        //加载数据图表
                    xAxis: {
                        data: ysl_dates
                    },
                    series: [{
                        // 根据名字对应到相应的系列
                        name: '接收',
                        data: ysl_ibps
                    }, {
                        // 根据名字对应到相应的系列
                        name: '加载',
                        data: ysl_obps
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

}