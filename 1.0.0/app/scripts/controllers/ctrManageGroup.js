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
ManageGroupControllers.controller('ManageGroupCtrl',function($scope,CommonService,$window,$fileUploader,$routeParams){
    ctrInit();

    var uriData='';
   //初始化$scope中定义的变量

    $scope.manageGroupForm={};

    $scope.groupUsers=[];

    $scope.isRoleOorS=true;

   //实现与页面交互的事件,如：button_click

    //设为或取消管理员
    $scope.setManager=function(guid,role){
        uriData={};
        uriData.guid=guid;
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
        },errorOperate);
    }

    //踢出圈子
    $scope.kickOut=function(guid){
        uriData={};
        uriData.guid=guid;
        uriData.cmt='被踢出';
        CommonService.deleteOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.groupUsers.length;i++){
                if($scope.groupUsers[i].id==guid){
                    $scope.groupUsers.splice(i, 1);
                    break;
                }
            }
        },errorOperate);
    }

    //设置或取消禁言
    $scope.setGag=function(guid,state){
        uriData={};
        uriData.guid=guid;
        uriData.st=state;
       CommonService.updatePartOne('group/'+$routeParams.groupId,JSON.stringify(uriData),function(data){
           for(var i=0;i<$scope.groupUsers.length;i++){
               if($scope.groupUsers[i].id==guid){
                   $scope.groupUsers[i].gag=state;
                   break;
               }
           }
       },errorOperate);
    }

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
    uriData ='o=0&r=10';
    CommonService.getAll('group/'+$routeParams.groupId,uriData,function(data){

        if(cookieOperate.getCookie('userName')!=data.GroupUsers[0][1]){
                $scope.isRoleOorS=false;
        }
        for(var i=0;i<data.GroupUsers.length;i++){
            var groupUser = {};
            groupUser.id=data.GroupUsers[i][0];
            groupUser.name=data.GroupUsers[i][1];
            groupUser.roleC=data.GroupUsers[i][2];
            groupUser.roleN=data.GroupUsers[i][3];
            groupUser.joinTime=data.GroupUsers[i][4];
            groupUser.lasttime=data.GroupUsers[i][5];
            groupUser.totaltopic=data.GroupUsers[i][6];
            groupUser.gag=data.GroupUsers[i][7];
            $scope.groupUsers.push(groupUser);
        }
    },errorOperate);

});
