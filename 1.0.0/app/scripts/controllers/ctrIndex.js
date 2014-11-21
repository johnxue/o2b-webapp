/**
 * Created by Administrator on 2014/9/4.
 */


/**
 *
 *  @模块名称: Index Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var IndexControllers = angular.module('IndexControllers',[]);


/*定义 Controller: IndexCtrl  （首页面 index.html）*/
IndexControllers.controller('IndexCtrl',function($scope,CommonService,$window){
    var uriData ='';
//初始化$scope中定义的变量
    $scope.beforeLogin = null;
    $scope.afterLogin = null;
    $scope.loginedName={};

    if(cookieOperate.getCookie("token")==null){
        $scope.beforeLogin = true;
        $scope.afterLogin = false;
    }else{
        $scope.beforeLogin = false;
        $scope.afterLogin = true;
    }

    $scope.cartProductsTotal=JSON.parse(localDataStorage.getItem('cartProductsTotalOnIndex'));
    if($scope.cartProductsTotal==null){
        $scope.cartProductsTotal=0
    }

    if(cookieOperate.getCookie("userName")==null){
        $scope.loginedName = {};
    }else{
        $scope.loginedName =cookieOperate.getCookie("userName");
    }

    $scope.unReadMessageCountOnIndex=JSON.parse(localDataStorage.getItem('unReadMessageCountOnIndex'));
    if($scope.unReadMessageCountOnIndex==null){
        $scope.unReadMessageCountOnIndex=0
    }

    /*注册事件*/
    $scope.$on("logined",function (event, strUserName,cartProductsTotal) {
        $scope.beforeLogin = false;
        $scope.afterLogin = true;
        $scope.loginedName=strUserName;
        if(cartProductsTotal==null){
            cartProductsTotal=0;
        }
        $scope.cartProductsTotal=cartProductsTotal;
    });

    $scope.$on("logouted",function (event) {
        $scope.afterLogin = false;
        $scope.beforeLogin = true;
        $scope.cartProductsTotal=0;
    });

    $scope.$on("totalAfterAddShoppingCart",function(event,cartProductsTotal){
        $scope.cartProductsTotal=cartProductsTotal;
        localDataStorage.setItem('cartProductsTotalOnIndex',JSON.stringify(cartProductsTotal));
    });

    $scope.$on("changeURMessageCountOnIndex",function(event,unReadMessageCount){
        $scope.unReadMessageCountOnIndex=unReadMessageCount;
        localDataStorage.setItem('unReadMessageCountOnIndex',JSON.stringify(unReadMessageCount));
    });

    //实现与页面交互的事件,如：button_click
    //产品模糊查询
    $scope.query = function(queryCondition){
        if(queryCondition==undefined){
            queryCondition='';
        }
        queryCondition.replace(' ','+');
        uriData = 'q='+queryCondition;
        CommonService.getAll('product',uriData,function(data){

           if($window.location.href.substring($window.location.href.length-9,$window.location.href.length)!='#/product'){
               $window.location.href='#/productList';
               $scope.$broadcast("newProductsByQuery",data);

           }else{
               $scope.$broadcast("newProductsByQuery",data);
           }

        },errorOperate);
    };

    //页面跳转
    $scope.goTo=function(url,event){
        //更改选项样式
        $('.activeIndex').removeClass('activeIndex');
        event.target.setAttribute('class','activeIndex');
        $window.location.href=url;

    }

    //调用与后端的接口,如：CommonService.getAll(params)
    uriData = undefined;
    CommonService.getAll('adSense/main/1',uriData,function(data){
        $scope.mainOneT00s=data.T00;
    },errorOperate);

});