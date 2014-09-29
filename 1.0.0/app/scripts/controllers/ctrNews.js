/*定义 Controller: NewsCtrl  （新闻详细页面 news.html）*/

var NewsControllers = angular.module('NewsControllers',[]);

NewsControllers.controller('NewsCtrl',function($scope,CommonService,$routeParams){

    var uriData ='';

    ctrInit();  //广告

    CommonService.getAll('news/'+$routeParams.id,uriData,function (data) {
        $("#newTitle").html(data.title);                  //标题
        $("#newAuthor").html("作者："+data.author);     //作者
        $("#newSource").html("来源: "+data.source);     //来自于
        $("#newCreateTime").html(data.createTime);      //时间
        $("#content").html(data.htmlContent);           //内容
    },errorOperate);

});