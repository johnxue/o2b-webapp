/*定义 Controller: ReleaseNewCtrl  （发布新闻页面 releaseNews.html）*/

var ReleaseControllers = angular.module('ReleaseControllers',[]);

ReleaseControllers.controller('ReleaseNewCtrl',function($scope,CommonService,$compile,UEditorService) {

    var isDiscuss = "N";  //是否允许评论, Y|N '， [可选，默认为Y]
    var isStatus = "NO";  //状态 NO-只保存不提交审核|WT-提交审核’ [可选，默认值为 NO]

    var uriData = '';
    var nowPage = 0;  //当前页
    var pageNum = 5;  //每页显示条数

    /******************************   加载运行   ***********************************/

    var edReleaseNews = UEditorService.getUEditor("editor","group","gid");

    /*****************************  页面交互事件  ***********************************/

    //管理新闻
    $scope.manageNews = function(){
        uriData = "r=" + pageNum + "&o=" + nowPage;
        CommonService.getAll('news', uriData, function (data) {
            $scope.mangerHtml(data);
        },function(response){
            if(response.message=="没有找到数据"){
                $scope.judge();
            }
        });
    }

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
        objNews.imgFiles = UEditorService.getImgUrlList(edReleaseNews);
        objNews.summary = UEditorService.getCutText(edReleaseNews,0,199);
        var uriData = JSON.stringify(objNews);

        CommonService.createOne('news', uriData, function (data) {

        });
    }


    /**
     * 管理新闻
     */
    //单条删除
    $scope.singerDele = function(deleNews){
        if(confirm("确定删除吗")){
            uriData = deleNews;
            CommonService.deleteOne('news/', uriData, function (data) {

            });
        }
    }

    //批量删除
    $scope.batchDele = function(){

    }

    //判断是否有内容
    $scope.judge = function(){
        var newsPrompt = "<div class='col-md-12 marginb'><div class='alert with-icon mp10'> <i class='icon-info-sign'></i>"+
                         "<div class='content'>您还没有发布过新闻内容。 </div></div></div>";
        $("#mangerNewPrompt").html(newsPrompt);
    }

    $scope.mangerHtml = function(data){
        $("#manageTab tr:gt(0)").remove();
        for(var i=0;i<data.news.length;i++){
            var mHtml = "<tr><td ><input name='check' type='checkbox' style='margin-left:10px;'/></td>"+
                "<td><span ><a href='' class='blue'>" + data.news[i][1] + "</a></span></td><td>" + data.news[i][5] + "</td>"+
                "<td><span class='blue'>" + data.news[i][2] + "</span></td><td><span><a href='#/editNews' class='blue' ><i class='icon-pencil'></i> 编辑</a></span>"+
                "<span><a data-toggle='modal' class='blue ml10' data-ng-click='singerDele("+ data.news[i][0] +")'> 删除</a></span></td></tr>";
            var cHtml=$compile(mHtml)($scope);  //编译
            $("#manageTab tr:eq(0)").after(cHtml);
        }
    }

});