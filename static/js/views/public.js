api_url = 'http://1.62.188.204:8000/api/v1.0/'
time_parameter = 'start_time=2021-03-12%2011%3A12%3A01&end_time=2021-03-14%2011%3A12%3A01'
isp_dict = { "移动": 1, "联通": 2, "电信": 3 }
isp_dict_reversion = { 1: "移动", 2: "联通", 3: "电信" }

// 实时告警获取
$(function () {
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


// 拓扑移入移出显示
var li = $('.center-top div')
var detaildiv = document.createElement("div");
detaildiv.style.width = "200px";
detaildiv.id = "detail";
detaildiv.style.backgroundColor = "#0B0B3B"
detaildiv.style.height = "300px";
detaildiv.style.border = "2px solid #6c9bd0";
detaildiv.style.position = "absolute";
function mouseover(demo) {
    detaildiv.innerHTML = demo.innerHTML;
    document.body.appendChild(detaildiv);
    document.getElementById("detail").style.display = "";
    detaildiv.style.left = event.clientX + "px";
    detaildiv.style.top = event.clientY + "px";
    $('#detail').text(demo.id);
    switch (demo.id) {
        case 'dx1':
            $('#detail').html('当前节点为短信运营商节点<br>当前拥有运营商3个<br>1、移动<br>2、联通<br>3、电信');
            break;
        case 'dx2':
            $('#detail').html('当前节点为短信采集机节点<br>当前拥有服务器2个<br>1、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx<br>2、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx');
            break;
        case 'dx3':
            $('#detail').html('当前节点为短信处理机节点<br>当前拥有服务器2个<br>1、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx<br>2、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx');
            break;
        case 'dx4':
            $('#detail').html('当前节点为短信加载机节点<br>当前拥有服务器2个<br>1、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx<br>2、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx');
            break;
        case 'cx1':
            $('#detail').html('当前节点为彩信运营商节点<br>当前拥有运营商3个<br>1、移动<br>2、联通<br>3、电信');
            break;
        case 'cx2':
            $('#detail').html('当前节点为彩信采集机节点<br>当前拥有服务器2个<br>1、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx<br>2、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx');
            break;
        case 'cx3':
            $('#detail').html('当前节点为彩信处理机节点<br>当前拥有服务器2个<br>1、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx<br>2、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx');
            break;
        case 'cx4':
            $('#detail').html('当前节点为彩信加载机节点<br>当前拥有服务器2个<br>1、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx<br>2、ip:1.1.1.1<br>所在网段:X网<br>服务器名:测试服务器<br>负责人:xxx');
            break;
    }
}

function mouseout() {
    document.getElementById("detail").style.display = "none";
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18

Date.prototype.Format = function (fmt) { // author: meizz
    let o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
