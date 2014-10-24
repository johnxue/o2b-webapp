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
GroupTopicDetailControllers.controller('GroupTopicDetailCtrl',function($scope,CommonService,$window,$routeParams,UEditorService){
    ctrInit();

    var uriData='';

    //初始化UEditor(百度编辑器)
    var ue = UEditorService.getUEditor('editor','group',$routeParams.groupId);

    var groupId=$routeParams.groupId;

    var topicId=$routeParams.topicId;

    //本地存储的圈子信息
    var localGroupInfo={};

    var topicAllCommentsCount=0;
    var commentsMaxPage=0;
    var commentsPage=0;
    var commentsPageSize=1;
    //分页器可显示页数
    var bursterMaxPage=6;

   //初始化$scope中定义的变量

   $scope.groupTopicDetail={};

   $scope.groupInfo={};

    $scope.ifIsVerifyJoin=false;

    $scope.UserGroupRole={};

   $scope.showJoinGroup=false;

   $scope.showQuitGroup=false;

   $scope.showEditTopic=false;

    $scope.showDeleteTopic=false;

   $scope.groupTopicComments={};

   $scope.bursterPageNumbers=[];

   $scope.commentsPageSize=commentsPageSize;

   $scope.replyToCommentId='';

   $scope.replyToUserName='';

   $scope.replyToNickName='';

   $scope.replyContent='';

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

    //话题的评论信息分页
    $scope.topicCommentsNextPage=function(){
        if(commentsPage<commentsMaxPage-1){
            findCommentsOfTopic(++commentsPage,commentsPageSize);
        }else{
            angular.element('#NextPageLi').addClass('disabled');
        }
    }

    $scope.topicCommentsLastPage=function(){
        if(commentsPage>0){
            findCommentsOfTopic(--commentsPage,commentsPageSize);
        }else{
            angular.element('#LastPageLi').addClass('disabled');
        }
    }

    //发表话题评论
    $scope.releaseTopicComment=function(){
        if(ue.getContent()==''){
            alert('请输入评论内容!');
        }else {
            uriData = {};
            uriData.gid = groupId;
            uriData.content = ue.getContent();

            //获取评论内容中的图片列表
            uriData.imgFiles = UEditorService.getImgUrlList(ue);;

            CommonService.createOne('group/topics/' + topicId + '/comment', JSON.stringify(uriData), function (data) {
                console.info(data.cid);
                ue.setContent('');
                alert('发布成功!');
            }, errorOperate);
        }
    }

    //显示回复框
    $scope.showReplyForm=function(cid,user,nickName){
        $scope.replyToCommentId=cid;

        $scope.replyToUserName=user;

        $scope.replyToNickName=nickName;

        $('#reply'+String(cid)).show();
    }

    //发布回复
    $scope.releaseReply=function(replyContent){
        uriData={};
        uriData.gid=groupId;
        uriData.tid=topicId;
        uriData.touser=$scope.replyToUserName;
        uriData.tonick=$scope.replyToNickName;
        uriData.content=replyContent;
        CommonService.createOne('group/topics/comment/'+$scope.replyToCommentId+'/reply',JSON.stringify(uriData),function(data){
              console.info(data.rid);
            $scope.replyContent='';
            $('#reply'+String($scope.replyToCommentId)).hide();
            alert('回复成功!');
        },errorOperate);
    }

    //删除话题
    $scope.deleteTopic=function(){
        uriData=undefined;
        CommonService.deleteOne('group/topics/'+String(topicId),uriData,function(data){
              $('#delTopic').modal('hide');
              $window.location.href='#/groupDetail/'+String(groupId);
              alert('删除成功!');
        },errorOperate);
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

            if($scope.UserGroupRole.role=='O'){
                $scope.showEditTopic=true;
                $scope.showDeleteTopic=true;
            }else if($scope.UserGroupRole.role=='S'){
                $scope.showQuitGroup=true;
                $scope.showEditTopic=true;
                $scope.showDeleteTopic=true;
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

    //通过话题id查询话题详情
    uriData=undefined;
    CommonService.getAll('group/topics/'+topicId,uriData,function(data){
        $scope.groupTopicDetail=data;
        if($scope.groupTopicDetail.user==cookieOperate.getCookie('userName')){
            $scope.showEditTopic=true;
            $scope.showDeleteTopic=true;
        }
        localDataStorage.setItem('groupTopicDetail',JSON.stringify($scope.groupTopicDetail));
    },errorOperate);

    //通过话题id查看该话题的评论(含回复)
    var findCommentsOfTopic=$scope.findCommentsOfTopic=function(page,pageSize){
             uriData='o='+page+'&r='+pageSize;
             CommonService.getAll('group/topics/'+topicId+'/comment',uriData,function(data){
                  $scope.groupTopicComments=data.comments;
                  topicAllCommentsCount=data.count;

                  //记录查询页号,连接点击页号查询和点击上一页或下一页查询
                  commentsPage=page;

                  //分页器显示
                   commentsMaxPage=Math.ceil(topicAllCommentsCount/commentsPageSize);
                   $scope.bursterPageNumbers =[];
                   if(bursterMaxPage>commentsMaxPage){
                      for(var i=0;i<commentsMaxPage;i++){
                         $scope.bursterPageNumbers[i] = i;
                      }
                   }else {
                       if (page < Math.ceil(bursterMaxPage / 2)) {
                            for (var i = 0;  i < bursterMaxPage; i++) {
                                $scope.bursterPageNumbers[i] = i;
                            }
                       } else if (page < commentsMaxPage - Math.ceil(bursterMaxPage / 2)) {
                            for (var i = 0, j = -Math.floor(bursterMaxPage / 2); i < bursterMaxPage; i++, j++) {
                                $scope.bursterPageNumbers[i] = page + j;
                            }
                       } else {
                            for (var i = 0, j = commentsMaxPage - bursterMaxPage; i < bursterMaxPage; i++, j++) {
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

             },errorOperate);
    }

    findCommentsOfTopic(0,1);

});
