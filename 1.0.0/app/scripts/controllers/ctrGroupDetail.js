/**
 * Created by Administrator on 2014/9/30.
 */

/**
 *
 *  @模块名称: GroupDetail Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-09-30
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var GroupDetailControllers = angular.module('GroupDetailControllers',[]);

/*定义 Controller: GroupDetailCtrl  （圈子详情页面 groupDetail.html）*/
GroupDetailControllers.controller('GroupDetailCtrl',function($scope,CommonService,$window,$routeParams){
    ctrInit();

    var uriData='';
   //初始化$scope中定义的变量

    //管理圈子需要的id临时从$routeParams里取
    $scope.groupId=$routeParams.groupId;

    $scope.groupDetailInfo={};

    $scope.UserGroupRole={};

    $scope.showJoinGroup=false;

    $scope.showQuitGroup=false;

    $scope.showMyGroup=false;

    $scope.showManageGroup=false;


    //实现与页面交互的事件,如：button_click

    //加入圈子单击事件
    $scope.joinGroup=function(validateMessage){
            var uriData = {};
            uriData.vm=validateMessage;
            CommonService.createOne('group/'+ $routeParams.groupId+'/user', JSON.stringify(uriData), function (data) {
                console.info(data.id);
                console.info(data.name);
                console.info(data.membership);
                $scope.showJoinGroup=false;
                $scope.showQuitGroup=true;
            }, errorOperate);
    }

   //退出圈子单击事件
    $scope.quitGroup=function(){
            var uriData = undefined;
            CommonService.deleteOne('group/'+ $routeParams.groupId+'/user', uriData, function (data) {
                console.info(data.id);
                console.info(data.name);
                console.info(data.membership);
                $scope.showJoinGroup=true;
                $scope.showQuitGroup=false;
            }, errorOperate);
    }


    //调用与后端的接口,如：CommonService.getAll(params)

    /*uriData='g='+$scope.groupId;
    CommonService.getAll('group',uriData,function(data){
        $scope.groupDetailInfo.gid=data.MyGroup[0][0];
        $scope.groupDetailInfo.name=data.MyGroup[0][1];
        $scope.groupDetailInfo.cat = data.MyGroup[0][2];
        $scope.groupDetailInfo.state=data.MyGroup[0][6];
        $scope.groupDetailInfo.join=data.MyGroup[0][7];
        $scope.groupDetailInfo.cnt=data.MyGroup[0][8];
        $scope.groupDetailInfo.header=data.MyGroup[0][9];
        $scope.groupDetailInfo.ntc=data.MyGroup[0][10];
    },errorOperate);*/

    //用户在某圈子中的权限
    if(cookieOperate.getCookie('token')!=null){
         uriData = undefined;
         CommonService.getAll('group/'+$scope.groupId+'/user',uriData,function(data){
                  $scope.UserGroupRole=data.UserGroupRole;
                     if($scope.UserGroupRole.role=='O'){
                         $scope.showMyGroup=true;
                         $scope.showManageGroup=true;
                     }else if($scope.UserGroupRole.role=='S'){
                         $scope.showQuitGroup=true;
                         $scope.showManageGroup=true;
                     }else if($scope.UserGroupRole.role=='U'){
                         $scope.showQuitGroup=true;
                     }
         },function(response){
              if(response.code=='802'){
                 $scope.showJoinGroup=true;
              }
         });
    }

});
