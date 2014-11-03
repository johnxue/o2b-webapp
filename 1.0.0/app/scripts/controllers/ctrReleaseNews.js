/*定义 Controller: ReleaseNewCtrl  （发布新闻页面 releaseNews.html）*/

var ReleaseControllers = angular.module('ReleaseControllers',[]);

ReleaseControllers.controller('ReleaseNewCtrl',function($scope,CommonService,$compile,UEditorService) {

    var isDiscuss = "N";  //是否允许评论, Y|N '， [可选，默认为Y]
    var isStatus = "NO";  //状态 NO-只保存不提交审核|WT-提交审核’ [可选，默认值为 NO]
    var checkFlag = true;
    var liHtml = null;

    var uriData = '';
    var nowPage = 0;     //管理当前页
    var nowWaitPage = 0;  //待审核当前页
    var nowAlrePage = 0;  //已审核当前页
    var pageNum = 5;  //每页显示条数

    /******************************   加载运行   ***********************************/
    ctrInit();  //广告
    var edReleaseNews = UEditorService.getUEditor("editor","group","gid");
    //初始化分页器样式
    $scope.$on('ngRepeatFinished', function () {
        //待审核
        angular.element('.exPageLis').removeClass('active');
        angular.element('#exPageLi0').addClass('active');
        //已审核
        angular.element('.alPageLis').removeClass('active');
        angular.element('#alPageLi0').addClass('active');
        //管理新闻
        angular.element('.mangerPageLis').removeClass('active');
        angular.element('#magPageLi0').addClass('active');
    });

    /*****************************  页面交互事件  ***********************************/

    /**
     * 发布新闻
     */
    //评论复选框 Click
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

        if(newsContent == null ||newsContent == ""){      //判断内容不能为空
            alert("请填写内容！");
            return false;
        }

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
     // 查找数据
    $scope.manageNews = function(){
        $("#manageTab tr:gt(0)").remove();
        $("#mangerNewPrompt").html("");
        uriData = "r=" + pageNum + "&o=" + nowPage;
        CommonService.getAll('news', uriData, function (data) {
            $scope.mangerPageNumbers = _produceBurster(nowPage,pageNum,data.count,5,$scope);
            for(var i=0;i<data.news.length;i++){
                var mHtml = "<tr><td ><input name='mangeCheck' type='checkbox' value=" + data.news[i][0] + " style='margin-left:10px;'/></td>"+
                    "<td><span ><a href='#/news/" + data.news[i][0] + "/shwoDel'>" + data.news[i][1] + "</a></span></td><td>" + data.news[i][5] + "</td>"+
                    "<td><span class='blue'>" + data.news[i][2] + "</span></td>" +
                    "<td><span><a href='#/editNews/" + data.news[i][0] + "' class='blue' >编辑</a></span>"+
                    "<span><a data-toggle='modal' class='blue ml10' data-ng-click='singerDele("+ data.news[i][0] +")'> 删除</a></span></td></tr>";
                var cHtml=$compile(mHtml)($scope);  //编译
                $("#manageTab tr:eq(0)").after(cHtml);
            }
            //设置分页器样式
            angular.element('.mangerPageLis').removeClass('active');
            angular.element('#magPageLi'+nowPage+'').addClass('active');
        },function(response){
            if(response.message=="没有找到数据"){
                $scope.judge();
            }
        });
    }

    //全选
    $scope.allCheck = function(){
        var maCheck = document.getElementsByName("mangeCheck");
        if (checkFlag) {
            for(var i=0; i<maCheck.length; i++){
                maCheck[i].checked = true;
            }
            checkFlag = false;
        }else{
            for(var i=0; i<maCheck.length; i++){
                maCheck[i].checked = false;
            }
            checkFlag = true;
        }
    }

    //单条删除
    $scope.singerDele = function(deleNews){
        if(confirm("确定删除吗？")){
            CommonService.deleteOne('news/'+deleNews, uriData, function (data) {
                $scope.manageNews();
            });
        }
    }

    //批量删除
    $scope.batchDele = function(){
        var ar=[];
        var maCheck = document.getElementsByName("mangeCheck");
        for(var i=0; i<maCheck.length; i++){
            if(maCheck[i].checked){
               ar.push(maCheck[i].value);
            }
        }
        var objDele = Object();
        objDele.ids = ar.toString();
        var data = JSON.stringify(objDele);
        if(confirm("确定删除吗？")) {
            CommonService.deleteOne('news', data, function (data) {
                $scope.manageNews();
            });
        }
    }

    //判断是否有内容
    $scope.judge = function(newId){
        var newsPrompt = "<div class='col-md-12 marginb'><div class='alert with-icon mp10'> <i class='icon-info-sign'></i>"+
            "<div class='content'>您还没有发布过新闻内容。 </div></div></div>";
        $("#mangerNewPrompt").html(newsPrompt);
    }

    /**
     * 新闻审核
     */
    $scope.tabSelect = function(){
        $scope.waitAuditingNews();
        $scope.tbNewsAlreadyAuditingNews();
    }

    //待审核新闻
    $scope.waitAuditingNews = function(){
        $("#tbNewsExamine tr:gt(0)").remove();
        $("#examineNews").html("");
        uriData = "s=WT&r="+pageNum+"&o="+nowWaitPage
        CommonService.getAll('news', uriData, function (data) {
           $scope.tbExPage = _produceBurster(nowWaitPage,pageNum,data.count,5,$scope);
            for(var i=0;i<data.news.length;i++){
                var tbAuditingHtml = "<tr><td><span class='ml15'><a href='#/news/" + data.news[i][0] + "/showExa' class='blue'>" + data.news[i][1] + "</a></span></td>"+
                    "<td>" + data.news[i][5] + "</td><td><span class='blue'>" + data.news[i][2] + "</span></td>"+
                    "<td><span><a class='blue' data-ng-click='yesThrough("+ data.news[i][0] +")'><i class='icon-pencil' ></i> 确认通过</a></span><span><a class='blue ml10' data-ng-click='noThrough("+ data.news[i][0] +")'><i class='icon-remove'></i> 不予通过</a></span></td>"+
                    "<td><span class='blue'>" + data.news[i][9] + "</span></td></tr>";
                     var wHtml=$compile(tbAuditingHtml)($scope);  //编译
                   $("#tbNewsExamine tr:eq(0)").after(wHtml);  //待审核新闻
            }
            angular.element('.exPageLis').removeClass('active');
            angular.element('#exPageLi'+ nowWaitPage +'').addClass('active');
        },function(response){
            if(response.message=="没有找到数据"){
                $("#examineNews").html("<div class='col-md-12 marginb'>"+
                    "<div class='alert with-icon mp10'><i class='icon-info-sign'></i>"+
                    "<div class='content'>目前没有需要审核的新闻。 </div></div></div>");
            }
        })
    }

    //已审核新闻
    $scope.tbNewsAlreadyAuditingNews = function(){
        $("#tbNewsAlready tr:gt(0)").remove();
        $("#alreadyNews").html("");
        uriData = "s=OK&r="+ pageNum +"&o=" + nowAlrePage
        CommonService.getAll('news', uriData, function (data) {
            $scope.tbAlPage = _produceBurster(nowAlrePage,pageNum,data.count,5,$scope);
            for(var i=0;i<data.news.length;i++){
                var tbAlreadyHtml = "<tr><td><span class='ml15'><a href='#/news/" + data.news[i][0] + "/showRe' class='blue'>" + data.news[i][1] + "</a></span></td>"+
                    "<td>" + data.news[i][5] + "</td><td><span class='blue'>" + data.news[i][2] + "</span></td>"+
                    "<td><span><a href='' data-toggle='modal' data-target='#delnewsfabu' class='blue'  data-ng-click='revokeThrough("+ data.news[i][0] +")'> 撤消发布</a></span></td>"+
                    "<td><span class='blue'>" + data.news[i][9] + "</span></td></tr>";
                    var aHtml=$compile(tbAlreadyHtml)($scope);  //编译
                $("#tbNewsAlready tr:eq(0)").after(aHtml);  //待审核新闻
            }
            angular.element('.alPageLis').removeClass('active');
            angular.element('#alPageLi'+ nowAlrePage +'').addClass('active');
        },function(response){
            if(response.message=="没有找到数据"){
                $("#alreadyNews").html("<div class='col-md-12 marginb'>"+
                    "<div class='alert with-icon mp10'><i class='icon-info-sign'></i>"+
                    "<div class='content'>目前没有已审核的新闻。 </div></div></div>");
            }
        })
    }

    //确认通过
    $scope.yesThrough = function(newId){
        var objYesThrough = Object();
        objYesThrough.st = "OK";
        var data = JSON.stringify(objYesThrough);
        if(confirm("确定通过吗？")) {
            CommonService.updatePartOne('news/' + newId, data, function (data) {
                $scope.waitAuditingNews();
            });
        }
    }

    //不予通过
    $scope.noThrough = function(newId){
        var objYesThrough = Object();
        objYesThrough.st = "NP";
        var data = JSON.stringify(objYesThrough);
        if(confirm("确定不通过吗？")) {
            CommonService.updatePartOne('news/' + newId, data, function (data) {
                $scope.waitAuditingNews();
            });
        }
    }

    //撤销发布
    $scope.revokeThrough = function(newId){
        var objYesThrough = Object();
        objYesThrough.st = "NO";
        var data = JSON.stringify(objYesThrough);
        if(confirm("确定撤销吗？")) {
            CommonService.updatePartOne('news/' + newId, data, function (data) {
                $scope.tbNewsAlreadyAuditingNews();
            });
        }
    }

    /******************************   分页   ***********************************/

    //跳转页
    $scope.nPage = function(viewName,page){
        if(viewName == "waitExPage"){
            nowWaitPage = page;
            $scope.waitAuditingNews();
        }else if(viewName == "alrExPage"){
            nowAlrePage = page;
            $scope.tbNewsAlreadyAuditingNews();
        }else if(viewName == "magePage"){
            nowPage = page;
            $scope.manageNews();
        }
    }

    //下一页
    $scope.addPage = function(viewName){
        if(viewName == "waitExPage"){
            nowWaitPage = ++nowWaitPage;
            $scope.waitAuditingNews();
        }else if(viewName == "alrExPage"){
            nowAlrePage == ++nowAlrePage;
            $scope.tbNewsAlreadyAuditingNews();
        }else if(viewName == "magePage"){
            nowPage = ++nowPage;
            $scope.manageNews();
        }
    }

    //上一页
    $scope.redPage = function(viewName){
        if(viewName == "waitExPage"){
            nowWaitPage = --nowWaitPage;
            $scope.waitAuditingNews();
        }else if(viewName == "alrExPage"){
            nowAlrePage = --nowAlrePage;
            $scope.tbNewsAlreadyAuditingNews();
        }else if(viewName == "magePage"){
            nowPage = --nowPage;
            $scope.manageNews();
        }
    }

});