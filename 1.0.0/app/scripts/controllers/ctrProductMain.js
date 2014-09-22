/**
 * Created by Administrator on 2014/9/4.
 */

/**
 *
 *  @模块名称: ProductMain Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var ProductMainControllers = angular.module('ProductMainControllers',[]);

/*定义 Controller: ShowMainCtrl  （主页面 first.html）*/
ProductMainControllers.controller('ProductMainCtrl',function($scope,CommonService,$window){

    var uriData='';
//初始化$scope中定义的变量
    $scope.products = {};

    $scope.attributes={};

    $scope.adsLevelOne = {};

    $scope.adsLevelTwo ={};

    //实现与页面交互的事件,如：button_click

    $scope.queryBySth = function(sort,value){
        $scope.products = {};

         uriData = 'o=0&r=8&s='+sort+'&v='+value;

        CommonService.getAll('product',uriData,function (data){
            $scope.products=data.rows;
        },errorOperate);
    }



    //调用与后端的接口,如：CommonService.getAll(params)
    uriData = undefined;
    CommonService.getAll('product/attribute',uriData,function(data){
        $scope.attributes=data.attribute;
        $scope.sorts = data.sort;
        $scope.categorys = data.category;
    },errorOperate);

     uriData = 'o=0&r=8';

    CommonService.getAll('product',uriData,function(data){
        $scope.products=data.rows;
    },errorOperate);

    CommonService.getAll('adSense/main/1',undefined,function(data){
        $scope.adsLevelOnes=data.ads_level_01;
        $scope.adsLevelTwos=data.ads_level_02;
    },errorOperate);

});