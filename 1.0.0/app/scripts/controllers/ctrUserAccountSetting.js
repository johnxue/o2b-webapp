/**
 * Created by yuzhenhan on 14-9-23.
 */

/**
 *
 *  @模块名称: UserAccountSetting Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var UserAccountSettingControllers = angular.module('UserAccountSettingControllers',[]);

/*定义 Controller: UserAccountSettingCtrl  （帐号设置页面 accountSetting.html）*/
UserAccountSettingControllers.controller('UserAccountSettingCtrl',function($scope,CommonService,$fileUploader){
    ctrInit();

    var uriData='';
    //初始化$scope中定义的变量

    $scope.personalDataForm={};

    $scope.updatePasswordForm={};


    //实现与页面交互的事件,如：button_click

    $scope.saveUpdatePwd=function(updatePasswordForm){

        var oPwd = updatePasswordForm['OPwd'];
        var nPwd = updatePasswordForm['NPwd'];

        uriData={};
        uriData['oldPwd']=CryptoJS.MD5(oPwd).toString();
        uriData['newPwd']=CryptoJS.MD5(nPwd).toString();

        CommonService.updatePartOne('user/info/pmssmed',JSON.stringify(uriData),function(data){
        },errorOperate);
    };

    //文件上传
   $scope.uploader=$fileUploader.create({
           scope: $scope,
           url: 'https://192.168.1.210/o2b/v1.0.0/user/header?type=userheader',
           method: 'POST',
           autoUpload: false,   // 自动上传
           alias: 'upfile',
           headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}

       });

    $scope.uploader.bind('success',function(event,xhr,item,response){
        document.getElementById('hiId')['src']=response.url;
        alert('上传成功!');
    });

    $scope.uploader.bind('error',function(event,xhr,item,response){
        alert('上传失败,请清除后重新提交!');
    });




    //调用与后端的接口,如：CommonService.getAll(params)

});