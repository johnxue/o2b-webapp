/**
 * Created by Administrator on 2014/9/4.
 */

/**
 *
 *  @模块名称: ReleaseProduct Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var ReleaseProductControllers = angular.module('ReleaseProductControllers',[]);

/*定义 Controller: ReleaseProduct  （主页面 releaseProduct.html）*/
ReleaseProductControllers.controller('ReleaseProductCtrl',function($scope,CommonService,$window,$fileUploader,UEditorService){
    ctrInit();

    var uriData='';

    //初始化UEditor(百度编辑器)
    var ue =UEditorService.getUEditor('editor','group','aa');

    //初始化$scope中定义的变量

    $scope.productInfoForm={};

    $scope.updateCover={};

    $scope.updateTop={};

    $scope.updateCenter={};

    $scope.coverState=false;

    $scope.topState=false;

    $scope.centerState=false;

  //实现与页面交互的事件,如：button_click

    //文件上传标签状态改变事件
    $scope.fileChanged=function(stateName){
        if(stateName=='coverState') {
            $scope.topState = true;
            $scope.centerState = true;
        }else if(stateName=='topState'){
            $scope.coverState=true;
            $scope.centerState = true;
        }else if(stateName=='centerState'){
            $scope.coverState=true;
            $scope.topState = true;
        }
    }

    //文件上传标签状态复原
    var fileTagStateReStore=$scope.fileTagStateReStore=function(){
        $scope.coverState=false;
        $scope.topState=false;
        $scope.centerState=false;
    }

    //文件上传(封面)
    $scope.updateCover= $fileUploader.create({
        scope: $scope,
        url: 'https://192.168.1.210/o2b/v1.0.0/user/header?type=userheader',
        method: 'POST',
        autoUpload: false,   // 自动上传
        alias: 'upfile',
        removeAfterUpload: true,
        headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}

    });

    $scope.updateCover.bind('success',function(event,xhr,item,response){
        document.getElementById('pCoverImgId')['src']=response.url;
        fileTagStateReStore();
        alert('上传成功!');
    });

    $scope.updateCover.bind('error',function(event,xhr,item,response){
        alert('上传失败,请清除后重新提交!');
    });

    //文件上传(顶部)
    $scope.updateTop= $fileUploader.create({
        scope: $scope,
        url: 'https://192.168.1.210/o2b/v1.0.0/user/header?type=header',
        method: 'POST',
        autoUpload: false,   // 自动上传
        alias: 'picture',
        headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}

    });

    $scope.updateTop.bind('success',function(event,xhr,item,response){
        document.getElementById('pTopImgId')['src']=response.url;
        fileTagStateReStore();
        alert('上传成功!');
    });

    $scope.updateTop.bind('error',function(event,xhr,item,response){
        alert('上传失败,请清除后重新提交!');
    });


    //文件上传(中间)
    $scope.updateCenter= $fileUploader.create({
        scope: $scope,
        url: 'https://192.168.1.210/o2b/v1.0.0/user/header?type=header',
        method: 'POST',
        autoUpload: false,   // 自动上传
        alias: 'picture',
        headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}

    });

    $scope.updateCenter.bind('success',function(event,xhr,item,response){
        document.getElementById('pCenterImgId')['src']=response.url;
        fileTagStateReStore();
        alert('上传成功!');
    });

    $scope.updateCenter.bind('error',function(event,xhr,item,response){
        alert('上传失败,请清除后重新提交!');
    });


   //调用与后端的接口,如：CommonService.getAll(params)

});