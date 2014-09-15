/**
 * Created by Administrator on 2014/9/4.
 */

/**
 *
 *  @模块名称: ProductDetail Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var ProductDetailControllers = angular.module('ProductDetailControllers', []);

/*定义 Controller: ProductDetailCtrl  （产品详细页面 productDetail.html）*/
ProductDetailControllers.controller('ProductDetailCtrl',function($scope,$routeParams,CommonService,$window){
    var uriData ='';
    var starttime='';
    var endtime='';
    var currentPrice ='';
    var addCartNeed ={};
    var inventoryStatus='';
    //初始化$scope中定义的变量
    $scope.guanZhu=true;
    $scope.yiGuanZhu = false;

    $scope.productDetailBasic = {};
    $scope.productDetailhtmls ={};

    $scope.quantity=1;

    $scope.cost = 0;

    $scope.reserverState=true;

    if($scope.reserverState){
        inventoryStatus='无货';
    }else{
        inventoryStatus='有货';
    }

    //实现与页面交互的事件,如：button_click

    // 点击关注单击事件

    $scope.guanZhuFun = function(code){

        $scope.guanZhu=! $scope.guanZhu;
        $scope.yiGuanZhu=!$scope.yiGuanZhu;

        uriData = undefined;
        CommonService.createOne('product/'+code+'/follow',uriData,function(data){
            var code = data.code;
            var totalFollow = data.totalFollow;
            console.info(code+','+totalFollow);
        },errorOperate);
    }

    $scope.yiGuanZhuFun = function(code){
        $scope.guanZhu=! $scope.guanZhu;
        $scope.yiGuanZhu=!$scope.yiGuanZhu;

        uriData = undefined;
        CommonService.deleteOne('product/'+code+'/follow',uriData,function(data){
            var code = data.code;
            var totalFollow = data.totalFollow;
            console.info(code+','+totalFollow);
        },errorOperate);
    }

    //点击订购点击事件
    $scope.order=function(){

        var orderProductsInfoDataArray=[];
        var orderProductsInfoData={};

        orderProductsInfoData.pid=$scope.productDetailBasic.pid;
        orderProductsInfoData.code = $scope.productDetailBasic.code;
        orderProductsInfoData.name=$scope.productDetailBasic.name;
        orderProductsInfoData.originalPrice=$scope.productDetailBasic.originalPrice;
        orderProductsInfoData.currentPrice=$scope.productDetailBasic.currentPrice;
        orderProductsInfoData.quantity=$scope.quantity;
        orderProductsInfoData.inventoryStatus= inventoryStatus;
        orderProductsInfoData.amount=$scope.quantity*$scope.productDetailBasic.currentPrice;

        addCartNeed.pid = $scope.productDetailBasic.pid;
        addCartNeed.pcode=$scope.productDetailBasic.code;
        addCartNeed.number=$scope.quantity;
        CommonService.createOne('shoppingcart',JSON.stringify(addCartNeed),function(data){
            orderProductsInfoData.id=data.shoppingCartId;
        },errorOperate);
        orderProductsInfoDataArray.push(orderProductsInfoData);
        localDataStorage.setItem('orderProductsInfo',JSON.stringify(orderProductsInfoDataArray));
        $window.location.href='#/productOrder';
    }

    //点击添加购物车点击事件

    $scope.addToShoppingCart=function(){
        addCartNeed.pid = $scope.productDetailBasic.pid;
        addCartNeed.pcode=$scope.productDetailBasic.code;
        addCartNeed.number=$scope.quantity;
        CommonService.createOne('shoppingcart',JSON.stringify(addCartNeed),function(data){
            console.info(data.user);
            console.info(data.shoppingCartId);
        },errorOperate);
    }


    //数量增加
    $scope.quantityPlus=function(limit,totalSold){
        if($scope.quantity<(limit-totalSold)){
            $scope.quantity++;
            $scope.cost=currentPrice*($scope.quantity);
        }
    }

    //数量减少
    $scope.quantitySubtract=function(){
        if($scope.quantity>0){
            $scope.quantity--;
            $scope.cost=currentPrice*($scope.quantity);
        }
    }


    //调用与后端的接口,如：CommonService.getAll(params)

    uriData = undefined;
    CommonService.getAll('product/'+$routeParams.code,uriData,function(data){

        $scope.productDetailBasic=data.basic;
        starttime = $scope.productDetailBasic.starttime;
        endtime = $scope.productDetailBasic.endtime;
        currentPrice=$scope.productDetailBasic.currentPrice;
        $scope.cost=$scope.quantity*currentPrice;
        $scope.productDetailhtmls=data.html;

        //判断能否预订

        var sysDate = new Date();
        var stime = new Date(starttime.replace(/-/g,"/"));
        var etime = new Date(endtime.replace(/-/g,"/"));
        var a = sysDate-stime;
        var b = sysDate-etime;
        if((sysDate-stime>0 )& (sysDate-etime<0)){
            $scope.reserverState=false;
        }

        //判断是否已经关注
        uriData = undefined;
        var pCode = $scope.productDetailBasic.code;

        CommonService.getAll('product/'+pCode+'/follow',uriData,function(data){
           if( data[cookieOperate.getCookie('userName')]=='YES'){
               $scope.guanZhu=! $scope.guanZhu;
               $scope.yiGuanZhu=!$scope.yiGuanZhu;
           }
        },errorOperate);


    },errorOperate);

});