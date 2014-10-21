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

    var localGroupInfo={};

   //初始化$scope中定义的变量

   $scope.groupTopicDetail={};

   $scope.groupInfo={};

    //实现与页面交互的事件,如：button_click





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
    }

    //通过帖子id查询帖子详情
    var uriData=undefined;
    CommonService.getAll('group/topics/'+topicId,'uriData',function(data){
        $scope.groupTopicDetail=data;
    },errorOperate);


});
