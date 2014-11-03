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

var MessageDetailControllers = angular.module('MessageDetailControllers',[]);

/*定义 Controller: MessageDetailCtrl  （消息详情页面 messageDetail.html）*/
MessageDetailControllers.controller('MessageDetailCtrl',function($scope,CommonService,$window,$routeParams){
    ctrInit();

    var uriData='';

    var messageId =$routeParams.id;

   //初始化$scope中定义的变量

    $scope.messageInfo={};

   //实现与页面交互的事件,如：button_click

    //删除消息
    $scope.removeMessage = function () {
        uriData = undefined;
        CommonService.deleteOne('message/' + messageId, uriData, function (data) {
            alert('删除成功!');
            //can not jump in modal window directly ,need by using href in anchor and reload in window
            $window.location.reload();
        }, errorOperate);
    }

    //发送消息
    $scope.sendMessage=function(replyMessageForm){
        uriData={};
        uriData.to = $scope.messageInfo.from;
        uriData.title = replyMessageForm.title;
        uriData.msg = replyMessageForm.content;

        CommonService.createOne('message',JSON.stringify(uriData),function(data){
            alert('发送成功!');
            $scope.sendMessageForm={};
            $('#replyFrom').modal('hide');
        },errorOperate);
    }


  //调用与后端的接口,如：CommonService.getAll(params)

   //查询消息详情
   uriData=undefined;
   CommonService.getAll('message/'+messageId,uriData,function(data){
       $scope.messageInfo=data;
   },errorOperate);



});