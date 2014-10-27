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
GroupDetailControllers.controller('GroupDetailCtrl',function($scope,CommonService,$window,$routeParams,UEditorService){
    ctrInit();

    var uriData='';

    //初始化UEditor(百度编辑器)
    var ue =UEditorService.getUEditor('editor','group',$routeParams.groupId);

    var groupAllTopicsCount=0;
    var topicsMaxPage=0;
    var topicsPage=0;
    var topicsPageSize=6;
    //分页器可显示页数
    var bursterMaxPage=6;

   //初始化$scope中定义的变量

    //管理圈子需要的id
    $scope.groupId=$routeParams.groupId;

    $scope.UserGroupRole={};

    $scope.showJoinGroup=false;

    $scope.showQuitGroup=false;

    $scope.showMyGroup=false;

    $scope.showManageGroup=false;

    $scope.groupAdministrators={};

    $scope.groupInfo={};

    $scope.ifIsVerifyJoin=false;

    $scope.groupTopics={};

    $scope.bursterPageNumbers=[];

    $scope.topicsPageSize=topicsPageSize;

    $scope.releaseTopicTitle='';

    $scope.ifForbidComment=false;

    //初始化分页器样式
    $scope.$on('ngRepeatFinished', function () {
        angular.element('.bursterPageLis').removeClass('active');
        angular.element('#pageLi0').addClass('active');
    });

    //实现与页面交互的事件,如：button_click

    //加入不需要验证的圈子单击事件
    $scope.joinDNVGroup=function(){
            var uriData = {};
            uriData.st='OK';
            CommonService.createOne('group/'+ $routeParams.groupId+'/user', JSON.stringify(uriData), function (data) {
                console.info(data.id);
                console.info(data.name);
                console.info(data.membership);
                $scope.showJoinGroup=false;
                $scope.showQuitGroup=true;
            }, errorOperate);
    }

    //弹出加入验证框
    $scope.showVMForm=function() {
        CommonService.getAll('group/' + $routeParams.groupId + '/user', uriData, function (data) {
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
         CommonService.createOne('group/'+ $routeParams.groupId+'/user', JSON.stringify(uriData), function (data) {
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
            CommonService.deleteOne('group/'+ $routeParams.groupId+'/user', uriData, function (data) {
                console.info(data.id);
                console.info(data.name);
                console.info(data.membership);
                $scope.showJoinGroup=true;
                $scope.showQuitGroup=false;
            }, errorOperate);
    }

    //圈子的话题信息分页
    $scope.groupTopicsNextPage=function(){
        if(topicsPage<topicsMaxPage-1){
        findTopicsOfGroup(++topicsPage,topicsPageSize);
        }else{
            angular.element('#NextPageLi').addClass('disabled');
        }
    }

    $scope.groupTopicsLastPage=function(){
        if(topicsPage>0){
           findTopicsOfGroup(--topicsPage,topicsPageSize);
        }else{
            angular.element('#LastPageLi').addClass('disabled');
        }
    }

    //发布话题单击事件
    $scope.releaseTopic=function(releaseTopicTitle){
            uriData={};
            uriData.type='group';
            uriData.topic=releaseTopicTitle;
            uriData.summary=UEditorService.getCutText(ue,0,200);
            uriData.content=ue.getContent();

         //获取话题内容中的图片列表
           uriData.imgFiles=UEditorService.getImgUrlList(ue);
           console.info(uriData.imgFiles);

          //是否禁止评论
           if($scope.ifForbidComment==true){
              uriData.status='NR';
           }else{
              uriData.status='OK';
           }

          CommonService.createOne('group/'+$scope.groupId+'/topics',JSON.stringify(uriData),function(data){
               console.info(data.tid);
               ue.setContent('');
               $scope.releaseTopicTitle='';
               alert('发布成功!');
          },errorOperate);

    }

    //调用与后端的接口,如：CommonService.getAll(params)

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
                     }else if($scope.UserGroupRole.role=='W'){
                         $scope.showJoinGroup=true;
                     }
         },function(response){
              if(response.code=='802'){
                 $scope.showJoinGroup=true;
              }
         });
    }

    //通过圈子id查询圈子详情
    uriData=undefined;
    CommonService.getAll('group/'+$scope.groupId+'/info',uriData,function(data){
         $scope.groupAdministrators=data.Administrator;
         $scope.groupInfo=data.Group;

        localDataStorage.setItem('groupInfo',JSON.stringify($scope.groupInfo));

       if($scope.groupInfo.isVerifyJoin=='Y'){
          $scope.ifIsVerifyJoin=true;
       }
    },errorOperate);

    //查询圈子下的所有话题
    var findTopicsOfGroup=$scope.findTopicsOfGroup=function(page,pageSize) {
              uriData = 'o='+page+'&r='+pageSize;
              CommonService.getAll('group/' + $scope.groupId + '/topics', uriData, function (data) {
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

    findTopicsOfGroup(0,topicsPageSize);

});
