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

var MessageMainControllers = angular.module('MessageMainControllers', []);

/*定义 Controller: MessageMainCtrl  （消息主页面 messageMain.html）*/
MessageMainControllers.controller('MessageMainCtrl', function ($scope, CommonService, $window) {
    ctrInit();

    var uriData = '';

    //分页信息(未读消息)
    var unReadMessagesPage = 0;
    var unReadMessagesPageSize = 2;
    var unReadAllMessagesCount=0;
    var unReadMessagesMaxPage=0;
    //分页器可显示页数(未读消息)
    var unRMBursterMaxPage=6;

    //分页信息(已读消息)
    var readMessagesPage = 0;
    var readMessagesPageSize = 2;
    var readAllMessagesCount=0;
    var readMessagesMaxPage=0;
    //分页器可显示页数(已读消息)
    var rMBursterMaxPage=6;

    //初始化$scope中定义的变量
    $scope.vm = {};

    $scope.readMessageCount = 0;

    $scope.unReadMessageCount = 0;

    $scope.unReadMessages = {};

    $scope.unRMBursterNumbers=[];

    $scope.unReadMessagesPageSize=unReadMessagesPageSize;

    $scope.unReadMessagesNextPageState = false;

    $scope.multiDeleteURMState = true;

    $scope.removeURMessageIds = '';

    $scope.readMessages={};

	$scope.rMBursterNumbers=[];

    $scope.readMessagesPageSize=readMessagesPageSize;

    $scope.multiDeleteRMState = true;

    $scope.removeRMessageIds='';

    $scope.sendMessageForm={};

    //初始化分页器样式
    $scope.$on('ngRepeatFinished', function () {
		//未读信息分页器初始化样式	
        angular.element('.unRMBursterPageLis').removeClass('active');
        angular.element('#unRMBPageLi0').addClass('active');

        //已读信息分页器初始化样式
        angular.element('.rMBursterPageLis').removeClass('active');
        angular.element('#rMBPageLi0').addClass('active');
    });
    //实现与页面交互的事件,如：button_click

    //显示未读消息
    $scope.showUnReadMessages = function () {
        $scope.vm.activeTab = 1;

        findUnReadMessages(0,unReadMessagesPageSize);
    }

    //未读消息信息分页显示
    $scope.unReadMessagesNextPage=function(){
        if(unReadMessagesPage<unReadMessagesMaxPage-1){
            findUnReadMessages(++unReadMessagesPage,unReadMessagesPageSize);
        }else{
            angular.element('#unRMNextPageLi').addClass('disabled');
        }
    }

    $scope.unReadMessagesLastPage=function(){
        if(unReadMessagesPage>0){
            findUnReadMessages(--unReadMessagesPage,unReadMessagesPageSize);
        }else{
            angular.element('#unRMLastPageLi').addClass('disabled');
        }
    }

    //未读消息信息列表全选
    $scope.uRMessagesCheckAll = function (checked) {
        angular.forEach($scope.unReadMessages, function (unReadMessage) {
            unReadMessage.checked = checked;
        });

        $scope.multiDeleteURMState = true;
        for (var i = 0; i < $scope.unReadMessages.length; i++) {
            if ($scope.unReadMessages[i].checked == true) {
                $scope.multiDeleteURMState = false;
                break;
            }
        }
    }

    //未读消息信息列表复选框状态改变事件
    $scope.uRMessagesCheckBoxChange = function () {
        $scope.multiDeleteURMState = true;
        for (var i = 0; i < $scope.unReadMessages.length; i++) {
            if ($scope.unReadMessages[i].checked == true) {
                $scope.multiDeleteURMState = false;
                break;
            }
        }
    }

    //显示删除提示框(单个未读信息)
    $scope.showRemoveURMessageForm = function (messageId) {
        $scope.removeURMessageIds = messageId;
        angular.element('#delMessage').modal('show');
    }

    //单个删除未读消息
    $scope.removeURMessage = function (messageId) {
        uriData = undefined;
        CommonService.deleteOne('message/' + messageId, uriData, function (data) {
            for (var i = 0; i < $scope.unReadMessages.length; i++) {
                if ($scope.unReadMessages[i].id == messageId) {
                    $scope.unReadMessages.splice(i, 1);
                    break;
                }
            }

            //改变消息主页上显示的未读消息数量
            $scope.unReadMessageCount--;

            //改变消息栏显示的未读消息数量
            $scope.$emit('changeURMessageCountOnIndex', $scope.unReadMessageCount);

            angular.element('#delMessage').modal('hide');
        }, errorOperate);
    }

    //显示删除提示框(多个未读信息)
    $scope.showRemoveURMessagesForm = function () {

        var unReadMessagesIds = []
        for (var i = 0; i < $scope.unReadMessages.length; i++) {
            if ($scope.unReadMessages[i].checked == true) {
                unReadMessagesIds.push($scope.unReadMessages[i].id);
            }
        }
        $scope.removeURMessageIds = unReadMessagesIds.join(',');

        angular.element('#delMessageMulti').modal('show');
    }

    //多个删除未读消息
    $scope.removeURMessages = function (messageIds) {
        uriData = {};
        uriData.ids = messageIds;
        CommonService.deleteOne('message', JSON.stringify(uriData), function (data) {
            var unReadMessagesIdArray = messageIds.split(',');
            var afterMultiDeleteUnReadMessages = [];
            for (var i = 0; i < $scope.unReadMessages.length; i++) {

                var flag = true;

                for (var j = 0; j < unReadMessagesIdArray.length; j++) {
                    if ($scope.unReadMessages[i].id == unReadMessagesIdArray[j]) {

                        flag = false;

                        //改变消息主页上显示的未读消息数量
                        $scope.unReadMessageCount--;

                        break;
                    }
                }

                if (flag) {
                    afterMultiDeleteUnReadMessages.push($scope.unReadMessages[i]) ;
                }
            }
            $scope.unReadMessages=afterMultiDeleteUnReadMessages;

            //改变消息栏显示的未读消息数量
            $scope.$emit('changeURMessageCountOnIndex', $scope.unReadMessageCount);

            $scope.multiDeleteURMState = true;

            angular.element('#delMessageMulti').modal('hide');
        }, errorOperate);
    }

    //显示已读消息
    $scope.showReadMessages = function () {
        $scope.vm.activeTab = 2;

        findReadMessages(0,readMessagesPageSize);
    }

    //已读消息信息分页显示
    $scope.readMessagesNextPage=function(){
        if(readMessagesPage<readMessagesMaxPage-1){
            findReadMessages(++readMessagesPage,readMessagesPageSize);
        }else{
            angular.element('#rMNextPageLi').addClass('disabled');
        }
    }

    $scope.readMessagesLastPage=function(){
        if(readMessagesPage>0){
            findReadMessages(--readMessagesPage,readMessagesPageSize);
        }else{
            angular.element('#rMLastPageLi').addClass('disabled');
        }
    }

    //已读消息信息列表全选
    $scope.rMessagesCheckAll = function (checked) {
        angular.forEach($scope.readMessages, function (readMessage) {
            readMessage.checked = checked;
        });

        $scope.multiDeleteRMState = true;
        for (var i = 0; i < $scope.readMessages.length; i++) {
            if ($scope.readMessages[i].checked == true) {
                $scope.multiDeleteRMState = false;
                break;
            }
        }
    }

    //已读消息信息列表复选框状态改变事件
    $scope.rMessagesCheckBoxChange = function () {
        $scope.multiDeleteRMState = true;
        for (var i = 0; i < $scope.readMessages.length; i++) {
            if ($scope.readMessages[i].checked == true) {
                $scope.multiDeleteRMState = false;
                break;
            }
        }
    }

    //显示删除提示框(单个已读信息)
    $scope.showRemoveRMessageForm = function (messageId) {
        $scope.removeRMessageIds = messageId;
        angular.element('#delRMessage').modal('show');
    }

    //单个删除已读消息
    $scope.removeRMessage = function (messageId) {
        uriData = undefined;
        CommonService.deleteOne('message/' + messageId, uriData, function (data) {
            for (var i = 0; i < $scope.readMessages.length; i++) {
                if ($scope.readMessages[i].id == messageId) {
                    $scope.readMessages.splice(i, 1);
                    break;
                }
            }

            //改变消息主页上显示的已读消息数量
            $scope.readMessageCount--;

            angular.element('#delRMessage').modal('hide');
        }, errorOperate);
    }

    //显示删除提示框(多个已读信息)
    $scope.showRemoveRMessagesForm = function () {

        var readMessagesIds = []
        for (var i = 0; i < $scope.readMessages.length; i++) {
            if ($scope.readMessages[i].checked == true) {
                readMessagesIds.push($scope.readMessages[i].id);
            }
        }
        $scope.removeRMessageIds = readMessagesIds.join(',');


        angular.element('#delRMessageMulti').modal('show');
    }

    //多个删除已读消息
    $scope.removeRMessages = function (messageIds) {
        uriData = {};
        uriData.ids = messageIds;
        CommonService.deleteOne('message', JSON.stringify(uriData), function (data) {
            var readMessagesIdArray = messageIds.split(',');
            var afterMultiDeleteReadMessages = [];
            for (var i = 0; i < $scope.readMessages.length; i++) {

                var flag = true;

                for (var j = 0; j < readMessagesIdArray.length; j++) {
                    if ($scope.readMessages[i].id == readMessagesIdArray[j]) {

                        flag = false;

                        //改变消息主页上显示的已读消息数量
                        $scope.readMessageCount--;

                        break;
                    }
                }

                if (flag) {
                    afterMultiDeleteReadMessages.push($scope.readMessages[i]) ;
                }
            }
            $scope.readMessages=afterMultiDeleteReadMessages;

            $scope.multiDeleteRMState = true;

            angular.element('#delRMessageMulti').modal('hide');

        }, errorOperate);
    }

    //发送消息
    $scope.sendMessage=function(sendMessageForm){
        uriData={};
        uriData.to = sendMessageForm.userName;
        uriData.title = sendMessageForm.title;
        uriData.msg = sendMessageForm.content;

        CommonService.createOne('message',JSON.stringify(uriData),function(data){
              alert('发送成功!');
            $scope.sendMessageForm={};
        },errorOperate);
    }



    //调用与后端的接口,如：CommonService.getAll(params)

    //消息探测
    uriData = undefined;
    CommonService.getAll('message/sniffing', uriData, function (data) {
        $scope.readMessageCount = data.read_count;
        $scope.unReadMessageCount = data.unread_count;

        //改变消息栏显示的未读消息数量
        $scope.$emit('changeURMessageCountOnIndex', $scope.unReadMessageCount);
    }, errorOperate);

    //查询未读消息信息
    var findUnReadMessages =$scope.findUnReadMessages= function (page,pageSize) {
        uriData = 's=unread&o='+page+'&r=' + pageSize;
        CommonService.getAll('message', uriData, function (data) {
            $scope.unReadMessages = data.msg_list_UNREAD.list;
            $scope.unReadMessageCount =data.msg_list_UNREAD.count;
            unReadAllMessagesCount=data.msg_list_UNREAD.count;

           //改变消息栏显示的未读消息数量
            $scope.$emit('changeURMessageCountOnIndex', $scope.unReadMessageCount);

            unReadMessagesPage=page;

            unReadMessagesMaxPage=Math.ceil(unReadAllMessagesCount/pageSize);

            //分页器显示
            $scope.unRMBursterNumbers=_produceBurster(page,pageSize,unReadAllMessagesCount,unRMBursterMaxPage);

            //设置分页器样式
            angular.element('.unRMBursterPageLis').removeClass('active');
            angular.element('#unRMBPageLi'+page+'').addClass('active');

            //去除上一页,下一页禁用样式
            angular.element('#unRMLastPageLi').removeClass('disabled');
            angular.element('#unRMNextPageLi').removeClass('disabled');

        }, errorOperate);
    }

    //查询已读消息信息
    var findReadMessages=$scope.findReadMessages=function(page,pageSize){
        uriData ='s=read&o='+page+'&r=' + pageSize;
        CommonService.getAll('message', uriData, function (data) {
            $scope.readMessages=data.msg_list_READ.list;
            $scope.readMessageCount=data.msg_list_READ.count;
            readAllMessagesCount=data.msg_list_READ.count;

            readMessagesPage=page;

            readMessagesMaxPage=Math.ceil(readAllMessagesCount/pageSize);

            //分页器显示
            $scope.rMBursterNumbers=_produceBurster(page,pageSize,readAllMessagesCount,rMBursterMaxPage);

            //设置分页器样式
            angular.element('.rMBursterPageLis').removeClass('active');
            angular.element('#rMBPageLi'+page+'').addClass('active');

            //去除上一页,下一页禁用样式
            angular.element('#rMLastPageLi').removeClass('disabled');
            angular.element('#rMNextPageLi').removeClass('disabled');

        },errorOperate);
    }

    /*增加
     uriData={};
     uriData.to="test@163.com";
     uriData.title="tile3";
     uriData.msg="msg3";

     CommonService.createOne('message', JSON.stringify(uriData), function (data) {
     $scope.unReadMessages = data.msg_list_UNREAD;

     }, errorOperate);*/

});
