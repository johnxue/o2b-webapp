/**
 * Created by Administrator on 2014/9/30.
 */

/**
 *
 *  @模块名称: GroupMain Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-09-30
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var GroupMainControllers = angular.module('GroupMainControllers',[]);

/*定义 Controller: GroupMainCtrl  （圈子主页面 groupMain.html）*/
GroupMainControllers.controller('GroupMainCtrl',function($scope,CommonService,$window){
    ctrInit();

    var uriData='';
    var page=0;
    var pageSize=6;
   //初始化$scope中定义的变量

    $scope.myGroups={};

    $scope.hotGroups={};

    /*$scope.myJoinGroups={};

    $scope.joinGroupsNextPageState=false;

    $scope.$watch('myJoinGroups', function(myJoinGroups) {
       if(myJoinGroups.size<6){
           $scope.joinGroupsNextPageState=true;
         }
      });*/

    //实现与页面交互的事件,如：button_click

    //显示我的圈子
    $scope.showMyGroup=function(){

        if(cookieOperate.getCookie('token')==null){
            $('#denglu').show();
        }else{
            uriData =undefined;
            CommonService.getAll('group',uriData,function(data){
                $scope.myGroups=data.MyGroups;
            },errorOperate);
            $scope.vm.activeTab = 3
        }
    }


    /*//我加入的圈子分页显示
    $scope.joinGroupsNextPage=function(){
        uriData='o='+(++page)+'&r=6';
        CommonService.getAll('',uriData,function(data){
            $scope.myJoinGroups=data;
        },errorOperate);
    }

    $scope.joinGroupsLastPage=function(){
        if(page>0){
         uriData='o='+(--page)+'&r=6';
         CommonService.getAll('group',uriData,function(data){
             $scope.myJoinGroups=data;
         },errorOperate);
       }
    }*/




    //调用与后端的接口,如：CommonService.getAll(params)

    uriData ='u=hot';
    CommonService.getAll('group',uriData,function(data){
        $scope.hotGroups=data.HotGroups;
    },errorOperate);

});
