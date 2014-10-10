/**
 * Created by Administrator on 2014/9/30.
 */

/**
 *
 *  @模块名称: CreateGroup Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-09-30
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var CreateGroupControllers = angular.module('CreateGroupControllers',[]);

/*定义 Controller: CreateGroupCtrl  （创建圈子页面 createGroup.html）*/
CreateGroupControllers.controller('CreateGroupCtrl',function($scope,CommonService,$window){
    ctrInit();

    var uriData='';
   //初始化$scope中定义的变量

    $scope.createGroupForm={};

    $scope.categorys={};

    //实现与页面交互的事件,如：button_click

    //提交创建单击事件
    $scope.submitCreate=function(createGroupForm){
        uriData = {};
        uriData.name=createGroupForm.name;
        uriData.cat=createGroupForm.cat;
        uriData.join=createGroupForm.join;
        uriData.cnt= createGroupForm.cnt;

        CommonService.createOne('group',JSON.stringify(uriData),function(data){
                   console.info(data.group);
                   console.info(data.id);
                   alert('创建成功!');
                $window.location.href='#/groupMain';
        },errorOperate);
    }



    //调用与后端的接口,如：CommonService.getAll(params)
    uriData = undefined;
    CommonService.getAll('group/attribute',uriData,function(data){
        $scope.categorys=data.category;
    },errorOperate);


});
