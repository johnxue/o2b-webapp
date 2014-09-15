'use strict';
             
/**  
 *   
 *  @模块名称: ProductList Controllers
 *  @版 本 号: V1.0.0 
 *  @作    者: Xu Kun
 *  @作者邮件: 
 *  @修改日期: 2014-08-15 
 *  @版本描述: 
 *   
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */  

 /*定义controllers module*/   
 var ProductListControllers = angular.module('ProductListControllers', []);
    
 /*定义 Controller: ProductListCtrl  （产品页面-productList.html）*/
 ProductListControllers.controller('ProductListCtrl', function ($scope,CommonService) {

     var uriData ='';
   //初始化$scope中定义的变量
    $scope.products = {};

    $scope.attributes={};

     /*注册事件*/
     $scope.$on("newProductsByQuery",function (event, data) {
         $scope.products = data.rows;
     });
    
   //实现与页面交互的事件,如：button_click

     $scope.queryBySth = function(offset,rowcount,sort,value){
         $scope.products = {};

          uriData = 'o='+offset+'&r='+rowcount+'&s='+sort+'&v='+value;
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

     uriData = 'o=0&r=48';
    CommonService.getAll('product',uriData,function(data){
        $scope.products=data.rows;
    },errorOperate);
 });












