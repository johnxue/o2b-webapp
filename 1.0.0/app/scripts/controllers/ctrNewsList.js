/*定义 Controller: NewsListCtrl  （新闻列表页面 newslist.html）*/

var NewsListControllers = angular.module('NewsListControllers',[]);

NewsListControllers.controller('NewsListCtrl',function($scope,CommonService) {

    var uriData = '';
    var nowPage = 0;  //当前页
    var pageNum = 5;  //每页显示条数

    /******************************  加载运行 *************************/
    var nowTime = new Date();
    var Year = nowTime.getFullYear();  //年
    var Month = nowTime.getMonth() + 1;   //月
    var Day = nowTime.getDate();     //日
    var Hours = nowTime.getHours();  //时
    var Minute = nowTime.getMinutes();  //分
    var Seconds = nowTime.getMinutes();  //秒
    var Time = Year + "-" + Month + "-" + Day + " " + Hours + ":" + Minute + ":" + Seconds;

    ctrInit();  //广告

    /*************************************************  页面交互事件  ********************************************/
    /**
     * 计算两日期时间差
     * interval 计算类型：D是按照天、H是按照小时、M是按照分钟、S是按照秒、T是按照毫秒
     * date1 起始日期  格式为年月格式 为2012-06-20
     * date2 结束日期
     */
    function timeDifference(interval, date1, date2) {
        var objInterval = {'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60, 'M': 1000 * 60, 'S': 1000, 'T': 1};
        interval = interval.toUpperCase();
        var dt1 = Date.parse(date1.replace(/-/g, "/"));
        var dt2 = Date.parse(date2.replace(/-/g, "/"));
        try {
            return ((dt2 - dt1) / objInterval[interval]).toFixed(0);//保留零位小数点
        } catch (e) {
            return e.message;
        }
    }

    //遍历数据
    $scope.newListPage = function() {
        uriData = "s=ok&r=" + pageNum + "&o=" + nowPage;
        CommonService.getAll('news', uriData, function (data) {
            for (var i = 0; i < data.news.length; i++) {
                var times = timeDifference("D", data.news[i][5], Time);
                if (times > 3.00 || times < 0) {
                    $("table tr:eq(0)").after("<tr><td><a href='#/news/" + data.news[i][0] + "/newList'>" + data.news[i][1] + "</a></td><td>来源：" + data.news[i][3] + "</td><td>作者：" + data.news[i][2] + "</td></td><td>" + data.news[i][5] + "</td></tr>");
                }else if(times == 0){
                    $("table tr:eq(0)").after("<tr><td><a href='#/news/" + data.news[i][0] + "/newList'>" + data.news[i][1] + "</a></td><td>来源：" + data.news[i][3] + "</td><td>作者：" + data.news[i][2] + "</td><td>今天</td></tr>");
                } else {
                    $("table tr:eq(0)").after("<tr><td><a href='#/news/" + data.news[i][0] + "/newList'>" + data.news[i][1] + "</a></td><td>来源：" + data.news[i][3] + "</td><td>作者：" + data.news[i][2] + "</td><td>" + times + "天</td></tr>");
                }
            }
        }, errorOperate);
    }
    $scope.newListPage();

    //查看更多
    $scope.newsLisPage = function(){
        nowPage = nowPage+1
        $scope.newListPage();
    }

});