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

    $scope.myGroupsNextPageState=false;

    $scope.visitNeedJoinGp_GId='';

    $scope.ifBlackList=false;

    //实现与页面交互的事件,如：button_click

    //显示我的圈子
    $scope.showMyGroup=function(){

        if(cookieOperate.getCookie('token')==null){
            $('#denglu').modal('show');
        }else{
            uriData ='o=0&r=6';
            CommonService.getAll('user/group',uriData,function(data){
                $scope.myGroups=data.MyJoinGroups;
            },errorOperate);
            $scope.vm.activeTab = 3
        }
    }


    //我的圈子分页显示
    $scope.myGroupsNextPage=function(){
        uriData='o='+(++page)+'&r='+pageSize;
        CommonService.getAll('user/group',uriData,function(data){
            $scope.myGroups=data.MyJoinGroups;
        },function(response){
            if(response.code=="802"){
                $scope.myGroupsNextPageState=true;
            }
        });
    }

    $scope.myGroupsLastPage=function(){
        $scope.myGroupsNextPageState=false;
        if(page>0){
            uriData='o='+(--page)+'&r='+pageSize;
            CommonService.getAll('user/group',uriData,function(data){
                $scope.myGroups=data.MyJoinGroups;
            },errorOperate);
        }
    }

    //是否允许访问(访问内容需要加入,加入时需要验证的圈子,判断是否已经加入,若没加入就弹框加入)(在黑名单中的不允许访问)
    $scope.ifAllowVisit=function(groupId){

        if(cookieOperate.getCookie('token')==null){
            $('#denglu').modal('show');
        }else {
            uriData=undefined;
            CommonService.getAll('group/' + groupId + '/user', uriData, function (data) {
                 if (data.UserGroupRole.role == 'H') {
                      alert('拒绝访问!');
                 }else if (data.UserGroupRole.status == 'WT') {
                      alert('加入请求已发出,等待管理员审核');
                 }else{
                      $window.location.href = '#/groupDetail/' + groupId;
                 }
            }, function (response) {
                if (response.code == '802') {
                    for (var i = 0; i < $scope.hotGroups.length; i++) {
                        if($scope.hotGroups[i][0]==groupId){
                           if ($scope.hotGroups[i][8] == 'Y' && $scope.hotGroups[i][7] == 'Y') {
                                $scope.visitNeedJoinGp_GId = groupId;
                                $('#joinNVMModal').modal('show');
                           }else {
                                $window.location.href = '#/groupDetail/' + groupId;
                           }
                           break;
                        }
                    }
                }
            });
        }
    }

    //加入圈子单击事件
    $scope.joinGroup=function(validateMessage,gid){
        var uriData = {};
        uriData.st='WT'
        uriData.vm=validateMessage;
        CommonService.createOne('group/'+gid+'/user', JSON.stringify(uriData), function (data) {
            console.info(data.id);
            console.info(data.name);
            console.info(data.membership);
            $('#joinNVMModal').modal('hide');
            alert('加入成功,等待管理员验证');
        }, errorOperate);
    }




    //调用与后端的接口,如：CommonService.getAll(params)

    uriData ='s=hot';
    CommonService.getAll('group',uriData,function(data){
        $scope.hotGroups=data.HotGroups;
    },errorOperate);

});
