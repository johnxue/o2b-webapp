/*定义 Controller: NewsCtrl  （新闻详细页面 news.html）*/

var NewsControllers = angular.module('NewsControllers',[]);

NewsControllers.controller('NewsCtrl',function($scope,CommonService,$routeParams){

    ctrInit();  //广告
    var uriData ='';

    if($routeParams.is == "newList"){
        $("#Examine").hide();   //隐藏新闻审核
        $("#revokeNews").hide();   //隐藏撤销
        $("#deleNews").hide();   //隐藏删除
    }else if($routeParams.is == "showExa"){
        $("#revokeNews").hide();   //隐藏撤销
        $("#deleNews").hide();   //隐藏删除
    }else if($routeParams.is == "showRe"){
        $("#Examine").hide();   //隐藏新闻审核
        $("#deleNews").hide();   //隐藏删除
    }else if($routeParams.is == "shwoDel"){
        $("#Examine").hide();   //隐藏新闻审核
        $("#revokeNews").hide();   //隐藏撤销
    }

    //后退
    $scope.newBack = function(){
        window.history.back(-1)
    }

    CommonService.getAll('news/'+$routeParams.id,uriData,function (data) {
        $("#newTitle").html(data.title);                  //标题
        $("#newAuthor").html("作者："+data.author);     //作者
        $("#newSource").html("来源: "+data.source);     //来自于
        $("#newCreateTime").html(data.createTime);      //时间
        $("#content").html(data.htmlContent);           //内容
    },errorOperate);

    //通过，不通过，撤销，删除
    $scope.yesThrough = function(newId){
        var objYesThrough = Object();
        objYesThrough.st = newId;
        var data = JSON.stringify(objYesThrough);

        if(newId == "del"){
            if(confirm("确定删除吗？")){
                CommonService.deleteOne('news/'+$routeParams.id, uriData, function (data) {
                    window.location.href="#/releaseNews";
                });
            }
        }else{
            if(confirm("确定执行此操作吗？")) {
                CommonService.updatePartOne('news/' + $routeParams.id, data, function (data) {
                    window.location.href="#/releaseNews";
                });
            }
        }
    }

});