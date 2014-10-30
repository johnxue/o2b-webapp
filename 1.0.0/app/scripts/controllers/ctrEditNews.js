/*定义 Controller: MyFormCtrl  （编辑新闻页面 dingdan.html）*/

var EditNewsControllers = angular.module('EditNewsControllers',[]);

EditNewsControllers.controller('EditNewsCtrl',function($scope,CommonService,UEditorService,$routeParams) {

    var uriData = '';


    /******************************   加载运行   ***********************************/
    var editNewsEditor = UEditorService.getUEditor("editor","group","gid");

    CommonService.getAll('news/'+$routeParams.editNewsId, uriData, function (data) {
        $scope.editNewsTitle = data.title;   //新闻标题
        $scope.editNewsSource = data.source;  //新闻来源
        $scope.editNewsAuthor = data.author;  //作者
        editNewsEditor.setContent(data.htmlContent);  //内容
    });

   /*****************************  页面交互事件  ***********************************/

    //确定修改新闻
    $scope.updataNews = function(){
        var objUpNews = Object();
        objUpNews.title = $scope.editNewsTitle;
        objUpNews.author = $scope.editNewsAuthor;
        objUpNews.source = $scope.editNewsSource;
        objUpNews.summary = UEditorService.getCutText(editNewsEditor,0,199);
        objUpNews.content = editNewsEditor.getContent();
        objUpNews.iscomment = "N";
        objUpNews.status = "NO";
        objUpNews.imgFiles = null;
         uriData = JSON.stringify(objUpNews);
        CommonService.updateOne('news/'+$routeParams.editNewsId, uriData, function (data) {

        })
    }

});