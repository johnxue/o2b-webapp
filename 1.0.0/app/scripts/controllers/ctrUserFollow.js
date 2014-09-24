/**
 * Created by yuzhenhan on 14-9-19.
 */

/**
 * Created by Administrator on 2014/9/4.
 */

/**
 *
 *  @模块名称: UserFollow Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var UserFollowControllers = angular.module('UserFollowControllers', []);

/*定义 Controller: UserFollowCtrl  （用户关注页面 follow.html）*/
UserFollowControllers.controller('UserFollowCtrl',function($scope,CommonService){

    ctrInit();

    var uriData='';
    //初始化$scope中定义的变量

    $scope.products={};
    $scope.productsTotal=0;
    $scope.showFollowProducts=false;

    //实现与页面交互的事件,如：button_click



    //调用与后端的接口,如：CommonService.getAll(params)

    uriData = undefined;
    CommonService.getAll('user/product/follow',uriData,function(data){
        $scope.products= data.rows;
        $scope.productsTotal=data.rows.length;
        if($scope.productsTotal>0){
            $scope.showFollowProducts=true;
        }

    },errorOperate);

});
