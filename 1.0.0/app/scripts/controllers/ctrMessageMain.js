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

    //分页信息(未读消息)
    var unReadMessagesPage=0;
    var unReadMessagesPageSize=2;

   //初始化$scope中定义的变量

    $scope.vm={};

    $scope.readMessageCount={};

    $scope.unReadMessageCount={};

    $scope.unReadMessages={};

    $scope.unReadMessagesNextPageState=false;

    $scope.multiDeleteURMState=true;

    $scope.removeURMessageIds='';

   //实现与页面交互的事件,如：button_click

    //显示未读消息
    $scope.showUnReadMessages=function(){
        $scope.vm.activeTab = 1;

        findUnReadMessages();
    }

    //未读消息信息分页显示
    $scope.unReadMessagesNextPage=function(){
        uriData='s=unread&o='+(++unReadMessagesPage)+'&r='+unReadMessagesPageSize;
        CommonService.getAll('message',uriData,function(data){
            $scope.unReadMessages=data.msg_list_UNREAD;

        },function(response){
            if(response.code=="802"){
                $scope.unReadMessagesNextPageState=true;
            }
        });

    }

    $scope.unReadMessagesLastPage=function(){
        $scope.unReadMessagesNextPageState=false;
        if(unReadMessagesPage>0){
            uriData='s=unread&o='+(--unReadMessagesPage)+'&r='+unReadMessagesPageSize;
            CommonService.getAll('message',uriData,function(data){
                $scope.unReadMessages=data.msg_list_UNREAD;

            },errorOperate);
        }
    }

    //未读消息信息列表全选
    $scope.uRMessagesCheckAll = function(checked) {
        angular.forEach($scope.unReadMessages, function (unReadMessage) {
            unReadMessage.checked = checked;
        });

        $scope.multiDeleteURMState=true;
        for(var i=0;i<$scope.unReadMessages.length;i++){
            if($scope.unReadMessages[i].checked==true){
                $scope.multiDeleteURMState=false;
                break;
            }
        }
    }

    //未读消息信息列表复选框状态改变事件
    $scope.uRMessagesCheckBoxChange=function(){
        $scope.multiDeleteURMState=true;
        for(var i=0;i<$scope.unReadMessages.length;i++){
            if($scope.unReadMessages[i].checked==true){
                $scope.multiDeleteURMState=false;
                break;
            }
        }
    }

    //显示删除提示框(单个未读信息)
    $scope.showRemoveURMessageForm=function(messageId){
        $scope.removeURMessageIds=messageId;
        angular.element('#delMessage').modal('show');
    }

    //单个删除未读消息
    $scope.removeURMessage=function(messageId){
        uriData=undefined;
        CommonService.deleteOne('message/'+messageId,uriData,function(data){
            for(var i=0;i<$scope.unReadMessages.length;i++){
                if($scope.unReadMessages[i].id==messageId){
                    $scope.unReadMessages.splice(i,1);
                    break;
                }
            }

            //改变消息主页上显示的未读消息数量
            $scope.unReadMessageCount--;

            //改变消息栏显示的未读消息数量
            $scope.$emit('changeURMessageCountOnIndex', $scope.unReadMessageCount);

            angular.element('#delMessage').modal('hide');
        },errorOperate);
    }

    //显示删除提示框(多个未读信息)
    $scope.showRemoveURMessagesForm=function(){

        var unReadMessagesIds =[]
        for(var i=0;i<$scope.unReadMessages.length;i++){
            if($scope.unReadMessages[i].checked==true){
                unReadMessagesIds.push($scope.unReadMessages[i].id);
            }
        }
        $scope.removeURMessageIds=unReadMessagesIds.join(',');;

        angular.element('#delMessageMulti').modal('show');
    }

    //多个删除未读消息
    $scope.removeURMessages=function(messageIds){
        uriData={};
        uriData.ids=messageIds;
        CommonService.deleteOne('message',JSON.stringify(uriData),function(data){
            var unReadMessagesIdArray =messageIds.split(',');

            for(var i=0;i<$scope.unReadMessages.length;i++){
                for(var j=0;j<unReadMessagesIdArray.length;j++){
                    if($scope.unReadMessages[i].id==unReadMessagesIdArray[j]){

                        $scope.unReadMessages.splice(i, 1);

                        //改变消息主页上显示的未读消息数量
                        $scope.unReadMessageCount--;

                        break;
                    }
                }
            }

            //改变消息栏显示的未读消息数量
            $scope.$emit('changeURMessageCountOnIndex', $scope.unReadMessageCount);


            $scope.multiDeleteURMState=true;
            angular.element('#delMessageMulti').modal('hide');
        },errorOperate);
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
   var findUnReadMessages=function() {
       uriData = 's=unread&o=0&r=' + unReadMessagesPageSize;
       CommonService.getAll('message', uriData, function (data) {
           $scope.unReadMessages = data.msg_list_UNREAD;

       }, errorOperate);
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