/**
 * Created by yuzhenhan on 14-10-10.
 */

/**
 *
 *  @模块名称: ManagerGroup Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var ManageGroupControllers = angular.module('ManageGroupControllers',[]);

/*定义 Controller: ManageGroupCtrl  （管理圈子页面 manageGroup.html）*/
ManageGroupControllers.controller('ManageGroupCtrl',function($scope,CommonService,$window,$fileUploader,$routeParams){
    ctrInit();

    var uriData='';
//初始化$scope中定义的变量

    $scope.manageGroupForm={};


//实现与页面交互的事件,如：button_click

    //提交修改单击事件
    $scope.updateGroup=function(manageGroupForm){

    }

    //圈子头像上传
    $scope.uploader=$fileUploader.create({
        scope: $scope,
        url: 'https://192.168.1.210/o2b/v1.0.0/group/header?type=groupheader&groupid='+$routeParams.groupId,
        method: 'POST',
        autoUpload: false,   // 自动上传
        alias: 'picture',
        headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}

    });

    $scope.uploader.bind('success',function(event,xhr,item,response){
        document.getElementById('giId')['src']='https://192.168.1.210/'+response.url+'/'+response.filename;
        alert('上传成功!');
    });

    $scope.uploader.bind('error',function(event,xhr,item,response){
        alert('上传失败,请清除后重新提交!');
    });



//调用与后端的接口,如：CommonService.getAll(params)

    uriData ='g='+$routeParams.groupId;
    CommonService.getAll('group',uriData,function(data){
        $scope.manageGroupForm=data.MyGroup;
    },errorOperate);

});
