/**
 * Created by Administrator on 2014/9/4.
 */


/**
 *
 *  @模块名称: ProductIndex Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var ProductIndexControllers = angular.module('ProductIndexControllers',[]);


/*定义 Controller: ProductIndexCtrl  （首页面 index.html）*/
ProductIndexControllers.controller('ProductIndexCtrl',function($scope,CommonService,$window){
    var uriData ='';
//初始化$scope中定义的变量
    $scope.beforeLogin = null;
    $scope.afterLogin = null;
    $scope.loginedName={};
    $scope.showAdvert=false;

    if(cookieOperate.getCookie("token")==null){
        $scope.beforeLogin = true;
        $scope.afterLogin = false;
        localDataStorage.setItem('cartProductsInfoArray',JSON.stringify(null));
        localDataStorage.setItem('cartProductsTotal',JSON.stringify(null));
        localDataStorage.setItem('orderProductsInfo',JSON.stringify(null));

    }else{
        $scope.beforeLogin = false;
        $scope.afterLogin = true;
    }

    $scope.cartProductsTotal=JSON.parse(localDataStorage.getItem('cartProductsTotal'));
    if($scope.cartProductsTotal==null){
        $scope.cartProductsTotal=0
    }

    if(cookieOperate.getCookie("userName")==null){
        $scope.loginedName = {};
    }else{
        $scope.loginedName =cookieOperate.getCookie("userName");
    }

    if($window.location.href.substring($window.location.href.length-2,$window.location.href.length)=='#/'){
        $scope.showAdvert=true;
    }



    /*注册事件*/
    $scope.$on("logined",function (event, strUserName) {
        $scope.beforeLogin = false;
        $scope.afterLogin = true;
        $scope.loginedName=strUserName;
    });

    $scope.$on("logouted",function (event, logoutedState) {
        $scope.afterLogin = logoutedState;
        $scope.beforeLogin = !logoutedState;
    });



    //实现与页面交互的事件,如：button_click
    $scope.query = function(queryCondition){
        if(queryCondition==undefined){
            queryCondition='';
        }
        queryCondition.replace(' ','+');
        uriData = 'q='+queryCondition;
        CommonService.getAll('product',uriData,function(data){

           if($window.location.href.substring($window.location.href.length-9,$window.location.href.length)!='#/product'){
               $window.location.href='#/product';
               $scope.$broadcast("newProductsByQuery",data);

           }else{
               $scope.$broadcast("newProductsByQuery",data);
           }

        },errorOperate);
    }

    //调用与后端的接口,如：CommonService.getAll(params)

});