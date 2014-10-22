/**
 * Created by Administrator on 2014/9/30.
 */

/**
 *
 *  @模块名称: GroupPostDetail Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-09-30
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var GroupTopicDetailControllers = angular.module('GroupTopicDetailControllers',[]);

/*定义 Controller: GroupTopicDetailCtrl  （帖子详情页面 groupTopicDetail.html）*/
GroupTopicDetailControllers.controller('GroupTopicDetailCtrl',function($scope,CommonService,$window,$routeParams){
    ctrInit();

    var uriData='';

    var groupId=$routeParams.groupId;

    var topicId=$routeParams.topicId;

    //本地存储的圈子信息
    var localGroupInfo={};

   //初始化$scope中定义的变量

   $scope.groupTopicDetail={};

   $scope.groupInfo={};

    $scope.ifIsVerifyJoin=false;

    $scope.UserGroupRole={};

   $scope.showJoinGroup=false;

   $scope.showQuitGroup=false;

   $scope.groupTopicComments={};

    //实现与页面交互的事件,如：button_click


    //加入不需要验证的圈子单击事件
    $scope.joinDNVGroup=function(){
        var uriData = {};
        uriData.st='OK';
        CommonService.createOne('group/'+ groupId+'/user', JSON.stringify(uriData), function (data) {
            console.info(data.id);
            console.info(data.name);
            console.info(data.membership);
            $scope.showJoinGroup=false;
            $scope.showQuitGroup=true;
        }, errorOperate);
    }

    //弹出加入验证框
    $scope.showVMForm=function() {
        CommonService.getAll('group/' + groupId + '/user', uriData, function (data) {
            if (data.UserGroupRole.status == 'WT') {
                alert('加入请求已发出,等待管理员审核');
            }
        }, function (response) {
            if (response.code == '802') {
                $('#joinNVMModal').modal('show');
            }
        });
    }

    //加入需要验证的圈子单击事件
    $scope.joinNVGroup=function(validateMessage){
        var uriData = {};
        uriData.st='WT';
        uriData.vm=validateMessage;
        CommonService.createOne('group/'+ groupId+'/user', JSON.stringify(uriData), function (data) {
            console.info(data.id);
            console.info(data.name);
            console.info(data.membership);
            $('#joinNVMModal').modal('hide');
            alert('加入成功,等待管理员验证');
        }, errorOperate);

    }
    //退出圈子单击事件
    $scope.quitGroup=function(){
        var uriData = undefined;
        CommonService.deleteOne('group/'+ groupId+'/user', uriData, function (data) {
            console.info(data.id);
            console.info(data.name);
            console.info(data.membership);
            $scope.showJoinGroup=true;
            $scope.showQuitGroup=false;
        }, errorOperate);
    }



    //调用与后端的接口,如：CommonService.getAll(params)

    //通过圈子id查询圈子详情
    localGroupInfo=JSON.parse(localDataStorage.getItem('groupInfo'));
    if(localGroupInfo!=null){
        if(groupId==localGroupInfo.gid){
            $scope.groupInfo=localGroupInfo;
        }else{
            uriData=undefined;
            CommonService.getAll('group/'+groupId+'/info',uriData,function(data){
                $scope.groupInfo=data.Group;
            },errorOperate);
        }
    }else{
        uriData=undefined;
        CommonService.getAll('group/'+groupId+'/info',uriData,function(data){
            $scope.groupInfo=data.Group;
        },errorOperate);
    }

    //判断加入圈子是否需要验证信息
    if($scope.groupInfo.isVerifyJoin=='Y'){
        $scope.ifIsVerifyJoin=true;
    }

    //用户在某圈子中的权限
    if(cookieOperate.getCookie('token')!=null){
        uriData = undefined;
        CommonService.getAll('group/'+groupId+'/user',uriData,function(data){
            $scope.UserGroupRole=data.UserGroupRole;

            if($scope.UserGroupRole.role=='S'){
                $scope.showQuitGroup=true;
            }else if($scope.UserGroupRole.role=='U'){
                $scope.showQuitGroup=true;
            }else if($scope.UserGroupRole.role=='W'){
                $scope.showJoinGroup=true;
            }
        },function(response){
            if(response.code=='802'){
                $scope.showJoinGroup=true;
            }
        });
    }

    //通过帖子id查询帖子详情
    uriData=undefined;
    CommonService.getAll('group/topics/'+topicId,uriData,function(data){
        $scope.groupTopicDetail=data;
    },errorOperate);

    //通过话题id查看该话题的评论(含回复)
    uriData=undefined;
    CommonService.getAll('group/topics/'+topicId+'/comment',uriData,function(data){
        $scope.groupTopicComments=data.comments;
    },errorOperate);
});
