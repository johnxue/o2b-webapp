/**
 * Created by Administrator on 2014/9/30.
 */

/**
 *
 *  @模块名称: GroupMain Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-09-30
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var GroupMainControllers = angular.module('GroupMainControllers',[]);

/*定义 Controller: GroupMainCtrl  （圈子主页面 groupMain.html）*/
GroupMainControllers.controller('GroupMainCtrl',function($scope,CommonService,$window){
    ctrInit();

    var uriData='';

    //分页信息(我的圈子)
    var page=0;
    var pageSize=6;

    //分页信息(热门话题)
    var hotTopicsCount=0;
    var hotTopicsMaxPage=0;
    var hotTopicsPage=0;
    var hotTopicsPageSize=1;
    //分页器可显示页数
    var bursterMaxPage=6;

   //初始化$scope中定义的变量

    $scope.myGroups={};

    $scope.hotGroups={};

    $scope.hotTopics={};

    $scope.bursterPageNumbers =[];

    $scope.hotTopicsPageSize=hotTopicsPageSize;

    $scope.myGroupsNextPageState=false;

    $scope.visitNeedJoinGp_GId='';

    $scope.ifBlackList=false;

    //初始化分页器样式
    $scope.$on('ngRepeatFinished', function () {
        angular.element('.bursterPageLis').removeClass('active');
        angular.element('#pageLi'+hotTopicsPage).addClass('active');
    });

    //实现与页面交互的事件,如：button_click

    //显示我的圈子
    $scope.showMyGroup=function(){

        if(cookieOperate.getCookie('token')==null){
            $('#denglu').modal('show');
        }else{
            uriData ='o=0&r='+pageSize;
            CommonService.getAll('user/group',uriData,function(data){
                $scope.myGroups=data.MyJoinGroups;
            },errorOperate);
            $scope.vm.activeTab = 2;
        }
    }


    //我的圈子分页显示
    $scope.myGroupsNextPage=function(){
        uriData='o='+(++page)+'&r='+pageSize;
        CommonService.getAll('user/group',uriData,function(data){
            $scope.myGroups=data.MyJoinGroups;
        },function(response){
            if(response.code=="802"){
                $scope.myGroupsNextPageState=true;
            }
        });
    }

    $scope.myGroupsLastPage=function(){
        $scope.myGroupsNextPageState=false;
        if(page>0){
            uriData='o='+(--page)+'&r='+pageSize;
            CommonService.getAll('user/group',uriData,function(data){
                $scope.myGroups=data.MyJoinGroups;
            },errorOperate);
        }
    }

    //是否允许访问(访问内容需要加入,加入时需要验证的圈子,判断是否已经加入,若没加入就弹框加入)(在黑名单中的不允许访问)
    $scope.ifAllowVisit=function(groupId){

        if(cookieOperate.getCookie('token')==null){
            $('#denglu').modal('show');
        }else {
            uriData=undefined;
            CommonService.getAll('group/' + groupId + '/user', uriData, function (data) {
                 if (data.UserGroupRole.role == 'H') {
                      alert('拒绝访问!');
                 }else if (data.UserGroupRole.status == 'WT') {
                      alert('加入请求已发出,等待管理员审核');
                 }else{
                      $window.location.href = '#/groupDetail/' + groupId;
                 }
            }, function (response) {
                if (response.code == '802') {
                    for (var i = 0; i < $scope.hotGroups.length; i++) {
                        if($scope.hotGroups[i][0]==groupId){
                           if ($scope.hotGroups[i][8] == 'Y' && $scope.hotGroups[i][7] == 'Y') {
                                $scope.visitNeedJoinGp_GId = groupId;
                                $('#joinNVMModal').modal('show');
                           }else {
                                $window.location.href = '#/groupDetail/' + groupId;
                           }
                           break;
                        }
                    }
                }
            });
        }
    }

    //加入圈子单击事件
    $scope.joinGroup=function(validateMessage,gid){
        var uriData = {};
        uriData.st='WT'
        uriData.vm=validateMessage;
        CommonService.createOne('group/'+gid+'/user', JSON.stringify(uriData), function (data) {
            console.info(data.id);
            console.info(data.name);
            console.info(data.membership);
            $('#joinNVMModal').modal('hide');
            alert('加入成功,等待管理员验证');
        }, errorOperate);
    }

    //热门话题信息分页
    $scope.hotTopicsNextPage=function(){
        if(hotTopicsPage<hotTopicsMaxPage-1){
            findHotTopics(++hotTopicsPage,hotTopicsPageSize);
        }else{
            angular.element('#NextPageLi').addClass('disabled');
        }
    }

    $scope.hotTopicsLastPage=function(){
        if(hotTopicsPage>0){
            findHotTopics(--hotTopicsPage,hotTopicsPageSize);
        }else{
            angular.element('#LastPageLi').addClass('disabled');
        }
    }

  //调用与后端的接口,如：CommonService.getAll(params)

    //查询热门圈子
    uriData ='s=hot';
    CommonService.getAll('group',uriData,function(data){
        $scope.hotGroups=data.HotGroups;
    },errorOperate);

    //查询热门话题
    var findHotTopics = $scope.findHotTopics=function(page,pageSize){
        uriData = 'o='+page+'&r='+pageSize;
        CommonService.getAll('group/6/topics', uriData, function (data) {
            $scope.hotTopics = data.Topics;
            hotTopicsCount = data.count;

            //记录查询页号,连接点击页号查询和点击上一页或下一页查询
            hotTopicsPage=page;

            //分页器显示
            hotTopicsMaxPage=Math.ceil(hotTopicsCount/hotTopicsPageSize);
            $scope.bursterPageNumbers =[];
            if(bursterMaxPage>hotTopicsMaxPage){
                for(var i=0;i<hotTopicsMaxPage;i++){
                    $scope.bursterPageNumbers[i] = i;
                }
            }else {
                if (page < Math.ceil(bursterMaxPage / 2)) {
                    for (var i = 0; i < bursterMaxPage; i++) {
                        $scope.bursterPageNumbers[i] = i;
                    }
                } else if (page < hotTopicsMaxPage - Math.ceil(bursterMaxPage / 2)) {
                    for (var i = 0, j = -Math.floor(bursterMaxPage / 2); i < bursterMaxPage; i++, j++) {
                        $scope.bursterPageNumbers[i] = page + j;
                    }
                } else {
                    for (var i = 0, j = hotTopicsMaxPage - bursterMaxPage; i < bursterMaxPage; i++, j++) {
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

    findHotTopics(0,hotTopicsPageSize);

});
