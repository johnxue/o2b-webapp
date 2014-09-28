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
     ctrInit();

     var uriData ='';

     var page =0;
     var pageSize=24;
     var querySort=undefined;
     var queryValue=undefined;

   //初始化$scope中定义的变量
    $scope.products = {};

    $scope.attributes={};


  $scope.$on('newProductsByQuery',function(event,data){
         $scope.products=data.rows;
   });

    
   //实现与页面交互的事件,如：button_click

     //按条件查询点击事件
     $scope.queryBySth = function(sort,value){
        // $('.active').removeClass('active');

         $scope.products = {};
         querySort=sort;
         queryValue=value;
          page=0;
          uriData = 'o='+page+'&r='+pageSize+'&s='+sort+'&v='+value;
         CommonService.getAll('product',uriData,function (data){
             $scope.products=data.rows;
         },errorOperate);
     }

     //查看更多点击事件（分页）
     $scope.nextPage=function(){

       if(querySort==undefined && queryValue==undefined){
         uriData = 'o='+(++page)+'&r='+pageSize;

         CommonService.getAll('product',uriData,function(data){
             var newProductsByPage =data.rows;

             for(var i=0;i<newProductsByPage.length;i++){
             $scope.products.splice($scope.products.length,0,newProductsByPage[i]);
             }

         },errorOperate);

       }else{
             uriData = 'o='+(++page)+'&r='+pageSize+'&s='+querySort+'&v='+queryValue;

             CommonService.getAll('product',uriData,function(data){
                 var newProductsByPage =data.rows;

                 for(var i=0;i<newProductsByPage.length;i++){
                     $scope.products.splice($scope.products.length,0,newProductsByPage[i]);
                 }

             },errorOperate);
         }

     }

    //调用与后端的接口,如：CommonService.getAll(params)

     uriData = undefined;
     CommonService.getAll('product/attribute',uriData,function(data){

         $scope.attributes=data.attribute;
         $scope.sorts = data.sort;
         $scope.categorys = data.category;
     },errorOperate);


     uriData = 'o=0&r='+pageSize;
     CommonService.getAll('product',uriData,function(data){
         $scope.products=data.rows;
     },errorOperate);

 });












