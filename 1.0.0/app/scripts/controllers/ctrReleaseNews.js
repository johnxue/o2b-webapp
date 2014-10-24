/*定义 Controller: ReleaseNewCtrl  （发布新闻页面 releaseNews.html）*/

var ReleaseControllers = angular.module('ReleaseControllers',[]);

ReleaseControllers.controller('ReleaseNewCtrl',function($scope,$compile,CommonService,UEditorServices) {

    var isDiscuss = "N";  //是否允许评论, Y|N '， [可选，默认为Y]
    var isStatus = "NO";  //状态 NO-只保存不提交审核|WT-提交审核’ [可选，默认值为 NO]

    /******************************   加载运行   ***********************************/

    var edReleaseNews = UEditorServices.getUEditor("editor","group","gid");

    /*****************************  页面交互事件  ***********************************/

    //发布新闻

    //管理新闻
    $scope.manageNews = function(){

    }
    //新闻审核

    /**
     * 发布新闻
     */

    //复选框 Click
    $scope.discuss = function(){
        if(isDiscuss=="N"){
            isDiscuss = "Y";
        }else{
            isDiscuss = "N";
        }
    }

    //提交新闻
    $scope.submit = function(publish){
        isStatus = "WT";
        var isPublish = publish;
        $scope.publishHtmlCommon(isPublish);
    }

    //保存新闻
    $scope.preserve = function(publish){
        isStatus = "NO";
        var isPublish = publish;
        $scope.publishHtmlCommon(isPublish);
    }

    //发布新闻， 提交、保存
    $scope.publishHtmlCommon= function(publish){
        var newsTitle = publish.nTitle;
        var newsSource = publish.Source;
        var newsAuthor = publish.nAutor;
        var newsContent = edReleaseNews.getContent();

        var objNews = Object();
        objNews.title = newsTitle;
        objNews.author = newsAuthor;
        objNews.source = newsSource;
        objNews.content = newsContent;
        objNews.iscomment = isDiscuss;
        objNews.status = isStatus;
        objNews.imgFiles = UEditorServices.getImgUrlList(edReleaseNews);
        objNews.summary = UEditorServices.getCutText(edReleaseNews,0,199);
        var uriData = JSON.stringify(objNews);

        CommonService.createOne('news', uriData, function (data) {

        });
    }


    /**
     * 管理新闻
     */
    //单条删除
    $scope.singerDele = function(){

    }

    //批量删除
    $scope.batchDele = function(){

    }

    //判断是否有内容
    $scope.judge = function(){

    }

});