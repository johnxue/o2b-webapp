/**
 * Created by Administrator on 2014/9/4.
 */

/**
 *
 *  @模块名称: Main Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var MessageMainControllers = angular.module('MessageMainControllers',[]);

/*定义 Controller: MessageMainCtrl  （消息主页面 messageMain.html）*/
MessageMainControllers.controller('MessageMainCtrl',function($scope,CommonService,$window){
    ctrInit();

    var uriData='';

 //初始化$scope中定义的变量

    $scope.readMessageCount={};

    $scope.unReadMessageCount={};

    $scope.unReadMessages={};

 //实现与页面交互的事件,如：button_click

    //未读信息列表全选
    $scope.uRMessagesCheckAll = function(checked) {
        angular.forEach($scope.unReadMessages, function (unReadMessage) {
            unReadMessage.checked = checked;
        });
    }


 //调用与后端的接口,如：CommonService.getAll(params)

    //消息探测
    uriData=undefined;
    CommonService.getAll('message/sniffing',uriData,function(data){
        $scope.readMessageCount=data.read_count;
        $scope.unReadMessageCount=data.unread_count;

        //改变消息栏显示的未读消息数量
        $scope.$emit('changeURMessageCountOnIndex', $scope.unReadMessageCount);
    },errorOperate);

    //查询未读消息信息
    uriData='s=unread';
    CommonService.getAll('message',uriData,function(data){
        $scope.unReadMessages=data.msg_list_UNREAD;

    },errorOperate);

});