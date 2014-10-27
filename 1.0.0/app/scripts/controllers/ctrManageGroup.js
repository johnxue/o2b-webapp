/**
 * Created by yuzhenhan on 14-10-10.
 */

/**
 *
 *  @模块名称: ManagerGroup Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var ManageGroupControllers = angular.module('ManageGroupControllers',[]);

/*定义 Controller: ManageGroupCtrl  （管理圈子页面 manageGroup.html）*/
ManageGroupControllers.controller('ManageGroupCtrl',function($scope,CommonService,$window,$fileUploader,$routeParams,$compile){
    ctrInit();

    var uriData='';

    //分页信息(圈子下用户)
    var page=0;
    var pageSize=10;

    //分页信息(圈子下待审核用户)
    var waitPage=0;
    var waitPageSize=10;

    //分页信息(圈子下黑名单用户)
    var holdPage=0;
    var holdPageSize=10;


    //分页信息(圈子下话题)
    var groupAllTopicsCount=0;
    var topicsMaxPage=0;
    var topicsPage=0;
    var topicsPageSize=6;
    //分页器可显示页数
    var bursterMaxPage=6;

    //当前用户是否为圈主
    var isRoleOorS=true;

   //初始化$scope中定义的变量

    $scope.vm={};

    $scope.manageGroupForm={};

    //圈子下所有用户信息
    $scope.groupUsers=[];

    $scope.groupUsersNextPageState=false;

    $scope.groupWaitUsers=[];

    $scope.waitUsersNextPageState=false;

    $scope.multiAgreedToJoinState=true;

    $scope.multiRefuseToJoinState=true;

    $scope.groupHoldUsers={};

    $scope.holdUsersNextPageState=false;

    $scope.multiDeleteFromHoldState=true;

    $scope.groupTopics={};

    $scope.topicsPageSize=topicsPageSize;

    $scope.queryTopicTitle='';

    $scope.deleteTopicIds ='';

    $scope.multiDeleteTopicsState = true;

    //初始化分页器样式
    $scope.$on('ngRepeatFinished', function () {
        angular.element('.bursterPageLis').removeClass('active');
        angular.element('#pageLi0').addClass('active');
    });

    //实现与页面交互的事件,如：button_click

    //提交修改单击事件
    $scope.updateGroup=function(manageGroupForm){
        uriData={};
        uriData['gid']=manageGroupForm['gid'];
        uriData['join']=manageGroupForm['join'];
        uriData['cnt']=manageGroupForm['cnt'];
        uriData['ntc']=manageGroupForm['ntc'];

        CommonService.updateOne('group',JSON.stringify(uriData),function(data){
            alert('设置成功!');
        },errorOperate);
    }

    //圈子头像上传
    $scope.uploader=$fileUploader.create({
        scope: $scope,
        url: 'https://192.168.1.210/o2b/v1.0.0/group/header?type=groupheader&gid='+$routeParams.groupId,
        method: 'PATCH',
        autoUpload: false,   // 是否自动上传
        alias: 'picture',
        headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}

    });

    $scope.uploader.bind('success',function(event,xhr,item,response){
        document.getElementById('giId')['src']=response.url+'/'+response.filename;
        alert('上传成功!');
    });

    $scope.uploader.bind('error',function(event,xhr,item,response){
        alert('上传失败,请清除后重新提交!');
    });

    //显示成员管理
    $scope.showUserManage=function(){
        $scope.vm.activeTab = 2;

        findGroupById(0,pageSize);
    }

    //设为或取消管理员
    $scope.setManager=function(guid,role){
        uriData={};
        uriData.guids=String(guid);
        uriData.role=role;
        CommonService.updatePartOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.groupUsers.length;i++){
                if($scope.groupUsers[i].id==guid){
                    $scope.groupUsers[i].roleC=role;
                    if($scope.groupUsers[i].roleC=='S'){
                        $scope.groupUsers[i].roleN='管理员';
                    }else{
                        $scope.groupUsers[i].roleN='普通成员';
                    }
                    break;
                }
            }
            showGroupUsersHtml($scope.groupUsers);
        },errorOperate);
    }

    //踢出圈子
    $scope.kickOut=function(guid){
        uriData={};
        uriData.guid=String(guid);
        uriData.cmt='被踢出';
        CommonService.deleteOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.groupUsers.length;i++){
                if($scope.groupUsers[i].id==guid){
                    $scope.groupUsers.splice(i, 1);
                    break;
                }
            }
            showGroupUsersHtml($scope.groupUsers);
        },errorOperate);
    }

    //设置或取消禁言
    $scope.setGag=function(guid,state){
        uriData={};
        uriData.guids=String(guid);
        uriData.st=state;
       CommonService.updatePartOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
           for(var i=0;i<$scope.groupUsers.length;i++){
               if($scope.groupUsers[i].id==guid){
                   $scope.groupUsers[i].state=state;
                   break;
               }
           }
           showGroupUsersHtml($scope.groupUsers);
       },errorOperate);
    }

    //单个加入黑名单
    $scope.addToHold=function(guid,role){
        uriData={};
        uriData.guids=String(guid);
        uriData.role=role;
        CommonService.updatePartOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.groupUsers.length;i++){
                if($scope.groupUsers[i].id==guid){
                    $scope.groupUsers.splice(i, 1);
                    break;
                }
            }
            showGroupUsersHtml($scope.groupUsers);
        },errorOperate);
    }

    //成员管理-用户列表分页
    $scope.groupUsersNextPage=function(){
        findGroupById(++page,pageSize);
    }

    $scope.groupUsersLastPage=function(){
        $scope.groupUsersNextPageState=false;
        if(page>0){
            findGroupById(--page,pageSize);
        }
    }

    //显示加入审核管理
    $scope.showWTUserManage=function(){
        $scope.vm.activeTab = 4;

        findWaitUsers(0,waitPageSize);
    }

    //待审核用户列表全选
    $scope.gWUCheckAll = function(checked) {
        angular.forEach($scope.groupWaitUsers, function(groupWaitUser) {
            groupWaitUser.checked = checked;
        });
        $scope.multiAgreedToJoinState=true;
        $scope.multiRefuseToJoinState=true;
        for(var i=0;i<$scope.groupWaitUsers.length;i++){
            if($scope.groupWaitUsers[i].checked==true){
                $scope.multiAgreedToJoinState=false;
                $scope.multiRefuseToJoinState=false;
                break;
            }
        }
    }

    //待审核用户列表复选框状态改变事件
    $scope.gWUCheckBoxChange=function(){
        $scope.multiAgreedToJoinState=true;
        $scope.multiRefuseToJoinState=true;
        for(var i=0;i<$scope.groupWaitUsers.length;i++){
            if($scope.groupWaitUsers[i].checked==true){
                $scope.multiAgreedToJoinState=false;
                $scope.multiRefuseToJoinState=false;
                break;
            }
        }
    }

    //加入审核-待审核用户列表分页
    $scope.waitUsersNextPage=function(){
        findWaitUsers(++waitPage,waitPageSize);
    }

    $scope.waitUsersLastPage=function(){
        $scope.waitUsersNextPageState=false;
        if(waitPage>0){
            findWaitUsers(--waitPage,waitPageSize);
        }
    }

    //同意加入单击事件
    $scope.agreedToJoin =function(groupWaitUser){
        uriData = {};
        uriData.vids=String(groupWaitUser.id);
        uriData.role='U';
        uriData.st='OK';
        CommonService.updatePartOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
             for(var i=0;i<$scope.groupWaitUsers.length;i++){
                 if($scope.groupWaitUsers[i].id==groupWaitUser.id){
                     $scope.groupWaitUsers.splice(i, 1);
                     break;
                 }
             }
        },errorOperate);
    }

    //拒绝加入单击事件
    $scope.refuseToJoin =function(groupWaitUser){
        uriData = {};
        uriData.vids=String(groupWaitUser.id);
        uriData.role='U';
        uriData.st='NP';
        CommonService.updatePartOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.groupWaitUsers.length;i++){
                if($scope.groupWaitUsers[i].id==groupWaitUser.id){
                    $scope.groupWaitUsers.splice(i, 1);
                    break;
                }
            }
        },errorOperate);
    }

    //批量同意加入单击事件
    $scope.multiAgreedToJoin=function(){
        var ids =[]
        for(var i=0;i<$scope.groupWaitUsers.length;i++){
            if($scope.groupWaitUsers[i].checked==true){
                ids.push($scope.groupWaitUsers[i].id);
            }
        }
        uriData = {};
        uriData.vids=ids.join(',');
        uriData.role='U';
        uriData.st='OK';
        CommonService.updatePartOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.groupWaitUsers.length;i++){
              for(var j=0;j<ids.length;j++){
                if($scope.groupWaitUsers[i].id==ids[j]){
                    $scope.groupWaitUsers.splice(i, 1);
                }
              }
            }
            $scope.multiAgreedToJoinState=true;
            $scope.multiRefuseToJoinState=true;
        },errorOperate);
    }

    //批量拒绝加入单击事件
    $scope.multiRefuseToJoin=function(){
        var ids =[]
        for(var i=0;i<$scope.groupWaitUsers.length;i++){
            if($scope.groupWaitUsers[i].checked==true){
                ids.push($scope.groupWaitUsers[i].id);
            }
        }
        uriData = {};
        uriData.vids=ids.join(',');
        uriData.role='U';
        uriData.st='NP';
        CommonService.updatePartOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.groupWaitUsers.length;i++){
                for(var j=0;j<ids.length;j++){
                    if($scope.groupWaitUsers[i].id==ids[j]){
                        $scope.groupWaitUsers.splice(i, 1);
                    }
                }
            }
            $scope.multiAgreedToJoinState=true;
            $scope.multiRefuseToJoinState=true;
        },errorOperate);
    }

    //显示黑名单
    $scope.showHUserManage=function(){
        $scope.vm.activeTab = 5;

        findHoldUsers(0,holdPageSize);
    }


    //黑名单用户列表全选
    $scope.gHUCheckAll=function(checked){
        angular.forEach($scope.groupHoldUsers, function(groupHoldUser) {
            groupHoldUser.checked = checked;
        });
        $scope.multiDeleteFromHoldState=true;
        for(var i=0;i<$scope.groupHoldUsers.length;i++){
            if($scope.groupHoldUsers[i].checked==true){
                $scope.multiDeleteFromHoldState=false;
                break;
            }
        }
    }

    //黑名单用户列表复选框状态改变事件
    $scope.gHUCheckBoxChange=function(){
        $scope.multiDeleteFromHoldState=true;
        for(var i=0;i<$scope.groupHoldUsers.length;i++){
            if($scope.groupHoldUsers[i].checked==true){
                $scope.multiDeleteFromHoldState=false;
                break;
            }
        }
    }

    //黑名单-用户列表分页
    $scope.holdUsersNextPage=function(){
        findHoldUsers(++holdPage,holdPageSize);
    }

    $scope.holdUsersLastPage=function(){
        $scope.holdUsersNextPageState=false;
        if(holdPage>0){
            findHoldUsers(--holdPage,holdPageSize);
        }
    }

    //单个从黑名单中删除
    $scope.deleteFromHold=function(guid,role){
        uriData={};
        uriData.guids=String(guid);
        uriData.role=role;
        CommonService.updatePartOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.groupHoldUsers.length;i++){
                if($scope.groupHoldUsers[i].id==guid){
                    $scope.groupHoldUsers.splice(i, 1);
                    break;
                }
            }
            $scope.multiDeleteFromHoldState=true;
        },errorOperate);
    }

    //多个从黑名单中删除
    $scope.multiDeleteFromHold=function(){
        var ids =[]
        for(var i=0;i<$scope.groupHoldUsers.length;i++){
            if($scope.groupHoldUsers[i].checked==true){
                ids.push($scope.groupHoldUsers[i].id);
            }
        }
        uriData = {};
        uriData.guids=ids.join(',');
        uriData.role='U';
        CommonService.updatePartOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.groupHoldUsers.length;i++){
                for(var j=0;j<ids.length;j++){
                    if($scope.groupHoldUsers[i].id==ids[j]){
                        $scope.groupHoldUsers.splice(i, 1);
                    }
                }
            }
            $scope.multiDeleteFromHoldState=true;
        },errorOperate);
    }

    //显示话题管理
    $scope.showTopicsManage=function(){
        $scope.vm.activeTab = 3;

        findTopicsOfGroup(0,topicsPageSize,$scope.queryTopicTitle);
    }

    //圈子的话题信息分页
    $scope.groupTopicsNextPage=function(){
        if(topicsPage<topicsMaxPage-1){
            findTopicsOfGroup(++topicsPage,topicsPageSize,$scope.queryTopicTitle);
        }else{
            angular.element('#NextPageLi').addClass('disabled');
        }
    }

    $scope.groupTopicsLastPage=function(){
        if(topicsPage>0){
            findTopicsOfGroup(--topicsPage,topicsPageSize,$scope.queryTopicTitle);
        }else{
            angular.element('#LastPageLi').addClass('disabled');
        }
    }

    //圈子的话题信息列表全选
    $scope.gTopicsCheckAll = function(checked) {
        angular.forEach($scope.groupTopics, function (groupTopic) {
            groupTopic.checked = checked;
        });

        $scope.multiDeleteTopicsState=true;
        for(var i=0;i<$scope.groupTopics.length;i++){
            if($scope.groupTopics[i].checked==true){
                $scope.multiDeleteTopicsState=false;
                break;
            }
        }
    }

    //圈子的话题信息列表复选框状态改变事件
    $scope.gTopicsCheckBoxChange=function(){
        $scope.multiDeleteTopicsState=true;
        for(var i=0;i<$scope.groupTopics.length;i++){
            if($scope.groupTopics[i].checked==true){
                $scope.multiDeleteTopicsState=false;
                break;
            }
        }
    }

    //话题查询单击事件
    $scope.queryTopicsByTitle=function(queryTopicTitle){
        findTopicsOfGroup(0,1,queryTopicTitle);
    }

    //话题置顶
    $scope.topTopic=function(tId,option){
         uriData={};
         uriData.top=option;
        CommonService.updatePartOne('group/topics/'+tId,JSON.stringify(uriData),function(data){

            for(var i=0;i<$scope.groupTopics.length;i++){
                if($scope.groupTopics[i][0]==tId){
                    $scope.groupTopics[i][10]=option;
                    break;
                }
            }
        },errorOperate);

    }

    //话题精华
    $scope.essenceTopic=function(tId,option){
        uriData={};
        uriData.essence=option;
        CommonService.updatePartOne('group/topics/'+tId,JSON.stringify(uriData),function(data){

            for(var i=0;i<$scope.groupTopics.length;i++){
                if($scope.groupTopics[i][0]==tId){
                    $scope.groupTopics[i][11]=option;
                    break;
                }
            }
        },errorOperate);
    }

    //话题禁止评论
    $scope.forbidCommentTopic=function(tId,option){
        uriData={};
        uriData.status=option;
        CommonService.updatePartOne('group/topics/'+tId,JSON.stringify(uriData),function(data){

            for(var i=0;i<$scope.groupTopics.length;i++){
                if($scope.groupTopics[i][0]==tId){
                    $scope.groupTopics[i][12]=option;
                    break;
                }
            }
        },errorOperate);
    }

    //显示删除提示框(单个话题)
    $scope.showDeleteTopicFormSingle=function(tId){
        $scope.deleteTopicIds=tId;
        $('#delTopicSingle').modal('show');
    }

    //单个话题删除
    $scope.deleteTopic=function(tId){
        uriData=undefined;
        CommonService.deleteOne('group/topics/'+String(tId),uriData,function(data){

            for(var i=0;i<$scope.groupTopics.length;i++){
                if($scope.groupTopics[i][0]==tId){
                    $scope.groupTopics.splice(i, 1);
                    break;
                }
            }

            $('#delTopicSingle').modal('hide');
        },errorOperate);
    }

    //显示删除提示框(多个话题)
    $scope.showDeleteTopicFormMulti=function(){
        var tIds =[]
        for(var i=0;i<$scope.groupTopics.length;i++){
            if($scope.groupTopics[i].checked==true){
                tIds.push($scope.groupTopics[i][0]);
            }
        }

        $scope.deleteTopicIds=tIds.join(',');

        $('#delTopicMulti').modal('show');
    }

    //多个话题删除
    $scope.multiDeleteTopics=function(tIds){
        uriData={};
        uriData.ids=tIds;
        CommonService.deleteOne('group/'+$routeParams.groupId+'/topics',uriData,function(data){

            var tIdArray =tIds.split(',');
            for(var i=0;i<$scope.groupTopics.length;i++){
               for(var j=0;j<tIdArray.length;j++){
                 if($scope.groupTopics[i][0]==tIdArray[j]){
                     $scope.groupTopics.splice(i, 1);
                 }
               }
            }

            $('#delTopicMulti').modal('hide');
            $scope.multiDeleteTopicsState = true;
        },errorOperate);
    }

   //调用与后端的接口,如：CommonService.getAll(params)

    //根据圈子id返回要修改的圈子信息
    uriData ='g='+$routeParams.groupId;
    CommonService.getAll('group',uriData,function(data){
        $scope.manageGroupForm.gid=data.MyGroup[0][0];
        $scope.manageGroupForm.name=data.MyGroup[0][1];
        $scope.manageGroupForm.cat = data.MyGroup[0][2];
        $scope.manageGroupForm.state=data.MyGroup[0][6];
        $scope.manageGroupForm.join=data.MyGroup[0][7];
        $scope.manageGroupForm.cnt=data.MyGroup[0][8];
        $scope.manageGroupForm.header=data.MyGroup[0][9];
        $scope.manageGroupForm.ntc=data.MyGroup[0][10];
    },errorOperate);

    //根据圈子id返回该圈子下的所有用户(圈子就是一群用户)
    var findGroupById=function(page,pageSize){
          uriData ='o='+page+'&r='+pageSize;
         CommonService.getAll('group/'+$routeParams.groupId,uriData,function(data){
             $scope.groupUsers=[];
           //判断当前用户是不是群主
           if(cookieOperate.getCookie('userName')!=data.GroupUsers[0][1]){
                 isRoleOorS=false;
           }

           for(var i=0;i<data.GroupUsers.length;i++){
                var groupUser = {};
                groupUser.id=data.GroupUsers[i][0];
                groupUser.name=data.GroupUsers[i][1];
                groupUser.roleC=data.GroupUsers[i][2];
                groupUser.roleN=data.GroupUsers[i][3];
                groupUser.joinTime=data.GroupUsers[i][4];
                groupUser.lastTime=data.GroupUsers[i][5];
                groupUser.totaltopic=data.GroupUsers[i][6];
                groupUser.state=data.GroupUsers[i][7];
               $scope.groupUsers.push(groupUser);
           }

           showGroupUsersHtml($scope.groupUsers);
        },function(response){
             if(response.code=="802"){
                 $scope.groupUsersNextPageState=true;
             }
         });
    }

    //根据条件显示用户信息
    var showGroupUsersHtml=function(groupUsers){

        angular.element('#guTbId tr:not(:eq(0))').remove();

        for(var i=groupUsers.length-1;i>=0;i--){
            var groupUser = groupUsers[i];
            if (groupUser.roleC == 'O') {
                var groupUserHtml = [];
                groupUserHtml.push("<tr>");
                groupUserHtml.push("<td></td>");
                groupUserHtml.push("<td>" + groupUser.name + "</td>");
                groupUserHtml.push("<td>" + groupUser.roleN + "</td>");
                groupUserHtml.push("<td>" + groupUser.joinTime + "</td>");
                groupUserHtml.push("<td><span class=\"blue\">" + groupUser.totaltopic + "</span></td>");
                groupUserHtml.push("<td>" + groupUser.lastTime + "</td>");
                groupUserHtml.push("<td></td>");
                groupUserHtml.push("</tr>");
                groupUserHtml = $compile(groupUserHtml.join())($scope);
                angular.element('#guTbId tr:eq(0)').after(groupUserHtml);
            } else if (isRoleOorS && groupUser.roleC == 'S' && groupUser.state == 'OK') {
                var groupUserHtml = [];
                groupUserHtml.push("<tr>");
                groupUserHtml.push("<td></td>");
                groupUserHtml.push("<td>" + groupUser.name + "</td>");
                groupUserHtml.push("<td>" + groupUser.roleN + "</td>");
                groupUserHtml.push("<td>" + groupUser.joinTime + "</td>");
                groupUserHtml.push("<td><span class=\"blue\">" + groupUser.totaltopic + "</span></td>");
                groupUserHtml.push("<td>" + groupUser.lastTime + "</td>");
                groupUserHtml.push("<td><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"setManager("+groupUser.id+",'U');\"><i class=\"icon-cog\"></i> 取消管理员</a></span> <span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"kickOut("+groupUser.id+");\"><i class=\"icon-ban-circle\"></i> 踢出圈子</a></span><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"setGag("+groupUser.id+",'NO');\" ><i class=\"icon-volume-off\"></i> 禁言</a></span><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"addToHold("+groupUser.id+",'H');\"><i class=\"icon-remove-sign\"></i> 加入黑名单</a></span></td>");
                groupUserHtml.push("</tr>");
                groupUserHtml = $compile(groupUserHtml.join())($scope);
                angular.element('#guTbId tr:eq(0)').after(groupUserHtml);
            } else if (isRoleOorS && groupUser.roleC == 'S' && groupUser.state == 'NO') {
                var groupUserHtml = [];
                groupUserHtml.push("<tr>");
                groupUserHtml.push("<td></td>");
                groupUserHtml.push("<td>" + groupUser.name + "</td>");
                groupUserHtml.push("<td>" + groupUser.roleN + "</td>");
                groupUserHtml.push("<td>" + groupUser.joinTime + "</td>");
                groupUserHtml.push("<td><span class=\"blue\">" + groupUser.totaltopic + "</span></td>");
                groupUserHtml.push("<td>" + groupUser.lastTime + "</td>");
                groupUserHtml.push("<td><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"setManager("+groupUser.id+",'U');\"><i class=\"icon-cog\"></i> 取消管理员</a></span> <span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"kickOut("+groupUser.id+");\"><i class=\"icon-ban-circle\"></i> 踢出圈子</a></span><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"setGag("+groupUser.id+",'OK');\" ><i class=\"icon-volume-off\"></i> 解除禁言</a></span><span><a href=\"javascript:;\" class=\"blue ml10\"  ng-click=\"addToHold("+groupUser.id+",'H');\"><i class=\"icon-remove-sign\"></i> 加入黑名单</a></span></td>");
                groupUserHtml.push("</tr>");
                groupUserHtml = $compile(groupUserHtml.join())($scope);
                angular.element('#guTbId tr:eq(0)').after(groupUserHtml);
            } else if (isRoleOorS && groupUser.roleC == 'U' && groupUser.state == 'OK') {
                var groupUserHtml = [];
                groupUserHtml.push("<tr>");
                groupUserHtml.push("<td></td>");
                groupUserHtml.push("<td>" + groupUser.name + "</td>");
                groupUserHtml.push("<td>" + groupUser.roleN + "</td>");
                groupUserHtml.push("<td>" + groupUser.joinTime + "</td>");
                groupUserHtml.push("<td><span class=\"blue\">" + groupUser.totaltopic + "</span></td>");
                groupUserHtml.push("<td>" + groupUser.lastTime + "</td>");
                groupUserHtml.push("<td><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"setManager("+groupUser.id+",'S');\"><i class=\"icon-cog\"></i> 设为管理员</a></span> <span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"kickOut("+groupUser.id+");\"><i class=\"icon-ban-circle\"></i> 踢出圈子</a></span><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"setGag("+groupUser.id+",'NO');\" ><i class=\"icon-volume-off\"></i> 禁言</a></span><span><a href=\"javascript:;\" class=\"blue ml10\"  ng-click=\"addToHold("+groupUser.id+",'H');\"><i class=\"icon-remove-sign\"></i> 加入黑名单</a></span></td>");
                groupUserHtml.push("</tr>");
                groupUserHtml = $compile(groupUserHtml.join())($scope);
                angular.element('#guTbId tr:eq(0)').after(groupUserHtml);
            } else if (isRoleOorS && groupUser.roleC == 'U' && groupUser.state == 'NO') {
                var groupUserHtml = [];
                groupUserHtml.push("<tr>");
                groupUserHtml.push("<td></td>");
                groupUserHtml.push("<td>" + groupUser.name + "</td>");
                groupUserHtml.push("<td>" + groupUser.roleN + "</td>");
                groupUserHtml.push("<td>" + groupUser.joinTime + "</td>");
                groupUserHtml.push("<td><span class=\"blue\">" + groupUser.totaltopic + "</span></td>");
                groupUserHtml.push("<td>" + groupUser.lastTime + "</td>");
                groupUserHtml.push("<td><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"setManager("+groupUser.id+",'S');\"><i class=\"icon-cog\"></i> 设为管理员</a></span> <span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"kickOut("+groupUser.id+");\"><i class=\"icon-ban-circle\"></i> 踢出圈子</a></span><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"setGag("+groupUser.id+",'OK');\" ><i class=\"icon-volume-off\"></i> 解除禁言</a></span><span><a href=\"javascript:;\" class=\"blue ml10\"  ng-click=\"addToHold("+groupUser.id+",'H');\"><i class=\"icon-remove-sign\"></i> 加入黑名单</a></span></td>");
                groupUserHtml.push("</tr>");
                groupUserHtml = $compile(groupUserHtml.join())($scope);
                angular.element('#guTbId tr:eq(0)').after(groupUserHtml);
            } else if (!isRoleOorS && groupUser.roleC == 'S') {
                var groupUserHtml = [];
                groupUserHtml.push("<tr>");
                groupUserHtml.push("<td></td>");
                groupUserHtml.push("<td>" + groupUser.name + "</td>");
                groupUserHtml.push("<td>" + groupUser.roleN + "</td>");
                groupUserHtml.push("<td>" + groupUser.joinTime + "</td>");
                groupUserHtml.push("<td><span class=\"blue\">" + groupUser.totaltopic + "</span></td>");
                groupUserHtml.push("<td>" + groupUser.lastTime + "</td>");
                groupUserHtml.push("<td></td>");
                groupUserHtml.push("</tr>");
                groupUserHtml = $compile(groupUserHtml.join())($scope);
                angular.element('#guTbId tr:eq(0)').after(groupUserHtml);
            } else if (!isRoleOorS && groupUser.roleC == 'U' && groupUser.state == 'OK') {
                var groupUserHtml = [];
                groupUserHtml.push("<tr>");
                groupUserHtml.push("<td></td>");
                groupUserHtml.push("<td>" + groupUser.name + "</td>");
                groupUserHtml.push("<td>" + groupUser.roleN + "</td>");
                groupUserHtml.push("<td>" + groupUser.joinTime + "</td>");
                groupUserHtml.push("<td><span class=\"blue\">" + groupUser.totaltopic + "</span></td>");
                groupUserHtml.push("<td>" + groupUser.lastTime + "</td>");
                groupUserHtml.push("<td><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"kickOut("+groupUser.id+");\"><i class=\"icon-ban-circle\"></i> 踢出圈子</a></span><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"setGag("+groupUser.id+",'NO');\" ><i class=\"icon-volume-off\"></i> 禁言</a></span><span><a href=\"javascript:;\" class=\"blue ml10\"  ng-click=\"addToHold("+groupUser.id+",'H');\" ><i class=\"icon-remove-sign\"></i> 加入黑名单</a></span></td>");
                groupUserHtml.push("</tr>");
                groupUserHtml = $compile(groupUserHtml.join())($scope);
                angular.element('#guTbId tr:eq(0)').after(groupUserHtml);
            } else if (!isRoleOorS && groupUser.roleC == 'U' && groupUser.state == 'NO') {
                var groupUserHtml = [];
                groupUserHtml.push("<tr>");
                groupUserHtml.push("<td></td>");
                groupUserHtml.push("<td>" + groupUser.name + "</td>");
                groupUserHtml.push("<td>" + groupUser.roleN + "</td>");
                groupUserHtml.push("<td>" + groupUser.joinTime + "</td>");
                groupUserHtml.push("<td><span class=\"blue\">" + groupUser.totaltopic + "</span></td>");
                groupUserHtml.push("<td>" + groupUser.lastTime + "</td>");
                groupUserHtml.push("<td><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"kickOut("+groupUser.id+");\"><i class=\"icon-ban-circle\"></i> 踢出圈子</a></span><span><a href=\"javascript:;\" class=\"blue ml10\" ng-click=\"setGag("+groupUser.id+",'OK');\" ><i class=\"icon-volume-off\"></i> 解除禁言</a></span><span><a href=\"javascript:;\" class=\"blue ml10\"  ng-click=\"addToHold("+groupUser.id+",'H');\" ><i class=\"icon-remove-sign\"></i> 加入黑名单</a></span></td>");
                groupUserHtml.push("</tr>");
                groupUserHtml = $compile(groupUserHtml.join())($scope);
                angular.element('#guTbId tr:eq(0)').after(groupUserHtml);
            }
        }
    }

    //通过圈子id查询该圈子下待审核的用户信息
    var findWaitUsers=function(waitPage,waitPageSize) {
        uriData = 'o=' + waitPage + '&r=' + waitPageSize + '&role=W';
        CommonService.getAll('group/' + $routeParams.groupId, uriData, function (data) {
              $scope.groupWaitUsers=[];
            for (var i = 0; i < data.GroupUsers.length; i++) {
                var waitGroupUser = {};
                waitGroupUser.id = data.GroupUsers[i][0];
                waitGroupUser.name = data.GroupUsers[i][1];
                waitGroupUser.roleC = data.GroupUsers[i][2];
                waitGroupUser.roleN = data.GroupUsers[i][3];
                waitGroupUser.joinTime = data.GroupUsers[i][4];
                waitGroupUser.lastTime = data.GroupUsers[i][5];
                waitGroupUser.totaltopic = data.GroupUsers[i][6];
                waitGroupUser.state = data.GroupUsers[i][7];
                waitGroupUser.vm = data.GroupUsers[i][8];
                $scope.groupWaitUsers.push(waitGroupUser);
            }
        }, function (response) {
            if(response.code=="802"){
                $scope.waitUsersNextPageState=true;
            }
        });
    }

    //通过圈子id查询该圈子下黑名单的用户信息
    var findHoldUsers=function(holdPage,holdPageSize){
        uriData = 'o=' + holdPage + '&r=' + holdPageSize + '&role=H';
        CommonService.getAll('group/' + $routeParams.groupId, uriData, function (data) {
            $scope.groupHoldUsers=[];
            for (var i = 0; i < data.GroupUsers.length; i++) {
                var holdGroupUser = {};
                holdGroupUser.id = data.GroupUsers[i][0];
                holdGroupUser.name = data.GroupUsers[i][1];
                holdGroupUser.roleC = data.GroupUsers[i][2];
                holdGroupUser.roleN = data.GroupUsers[i][3];
                holdGroupUser.joinTime = data.GroupUsers[i][4];
                holdGroupUser.lastTime = data.GroupUsers[i][5];
                holdGroupUser.totaltopic = data.GroupUsers[i][6];
                holdGroupUser.state = data.GroupUsers[i][7];
                holdGroupUser.vm = data.GroupUsers[i][8];
                $scope.groupHoldUsers.push(holdGroupUser);
            }
        }, function (response) {
            if(response.code=="802"){
                $scope.holdUsersNextPageState=true;
            }
        });
    }

    //查询圈子下的所有话题
    var findTopicsOfGroup=$scope.findTopicsOfGroup=function(page,pageSize,queryCondition) {
        if(queryCondition==''){
            uriData = 'o='+page+'&r='+pageSize;
        }else{
            uriData = 'o='+page+'&r='+pageSize+'&q='+queryCondition;
        }
        CommonService.getAll('group/' + $routeParams.groupId + '/topics', uriData, function (data) {
            $scope.groupTopics = data.Topics;
            groupAllTopicsCount = data.count;

            //记录查询页号,连接点击页号查询和点击上一页或下一页查询
            topicsPage=page;

            //分页器显示
            topicsMaxPage=Math.ceil(groupAllTopicsCount/topicsPageSize);
            $scope.bursterPageNumbers =[];
            if(bursterMaxPage>topicsMaxPage){
                for(var i=0;i<topicsMaxPage;i++){
                    $scope.bursterPageNumbers[i] = i;
                }
            }else {
                if (page < Math.ceil(bursterMaxPage / 2)) {
                    for (var i = 0; i < bursterMaxPage; i++) {
                        $scope.bursterPageNumbers[i] = i;
                    }
                } else if (page < topicsMaxPage - Math.ceil(bursterMaxPage / 2)) {
                    for (var i = 0, j = -Math.floor(bursterMaxPage / 2); i < bursterMaxPage; i++, j++) {
                        $scope.bursterPageNumbers[i] = page + j;
                    }
                } else {
                    for (var i = 0, j = topicsMaxPage - bursterMaxPage; i < bursterMaxPage; i++, j++) {
                        $scope.bursterPageNumbers[i] = j;
                    }
                }
            }

            //设置分页器样式
            angular.element('.bursterPageLis').removeClass('active');
            angular.element('#pageLi'+page+'').addClass('active');

            //去除上一页,下一页禁用样式
            angular.element('#LastPageLi').removeClass('disabled');
            angular.element('#NextPageLi').removeClass('disabled');

        }, errorOperate);
    }
});
