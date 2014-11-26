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

    ctrInit();

    var uriData ='';
    var starttime='';
    var endtime='';
    var limit='';
    var totalSold='';
    var currentPrice ='';
    var addCartNeed ={};
    var inventoryStatus='';
    //初始化$scope中定义的变量
    $scope.vm = {};
    $scope.guanZhu=true;
    $scope.yiGuanZhu = false;

    $scope.productDetailBasic = {};
    $scope.productDetailhtmls ={};

    $scope.quantity=1;

    $scope.cost = 0;

    $scope.reserverState=true;


    $scope.$on('$viewContentLoaded', function() {

        //右侧div滚动

        $('#productFixed').css('position','relative');
        $('#productFixed').css("top",0);
        $('#productFixed').css("left",0);

        var ft = $('#productFixed').offset().top;

        $(window).scroll(function(e){
            var fh = $('#productFixed').outerHeight(true);

            var s = $(document).scrollTop();

            var ht =  $('#productDH').offset().top;
            var hh = $('#productDH').outerHeight(true);

            if(s > (ft -10)){
                if( s < (ht+hh-fh)){
                    $('#productFixed').css('position','fixed');
                    $('#productFixed').css("top",0);
                    $('#productFixed').css("left",900);
                }else{
                    $('#productFixed').css('position','fixed');
                    $('#productFixed').css("top",hh+ht-s-fh);
                    $('#productFixed').css("left",900);
                }
            }else{
                $('#productFixed').css('position','relative');
                $('#productFixed').css("top",0);
                $('#productFixed').css("left",0);
            }
        });
    });

    //实现与页面交互的事件,如：button_click

    // 点击关注单击事件
    $scope.guanZhuFun = function(code){

        if(cookieOperate.getCookie("token")==null) {
            $('#denglu').modal('show');
        }else {
            $scope.guanZhu = !$scope.guanZhu;
            $scope.yiGuanZhu = !$scope.yiGuanZhu;

            uriData = undefined;
            CommonService.createOne('product/' + code + '/follow', uriData, function (data) {
                var code = data.code;
                var totalFollow = data.totalFollow;
                console.info(code + ',' + totalFollow);
            }, errorOperate);
        }
    }

    $scope.yiGuanZhuFun = function(code){
        if(cookieOperate.getCookie("token")==null) {
            $('#denglu').modal('show');
        }else {
            $scope.guanZhu = !$scope.guanZhu;
            $scope.yiGuanZhu = !$scope.yiGuanZhu;

            uriData = undefined;
            CommonService.deleteOne('product/' + code + '/follow', uriData, function (data) {
                var code = data.code;
                var totalFollow = data.totalFollow;
                console.info(code + ',' + totalFollow);
            }, errorOperate);
        }
    }

    //点击购买点击事件
    $scope.order=function(){

        if(cookieOperate.getCookie("token")==null) {
            $('#denglu').modal('show');
        }else {
        var orderProductsInfoDataArray=[];
        var orderProductsInfoData={};

        orderProductsInfoData.pid=$scope.productDetailBasic.pid;
        orderProductsInfoData.code = $scope.productDetailBasic.code;
        orderProductsInfoData.name=$scope.productDetailBasic.name;
        orderProductsInfoData.originalPrice=$scope.productDetailBasic.originalPrice;
        orderProductsInfoData.currentPrice=$scope.productDetailBasic.currentPrice;
        orderProductsInfoData.quantity=$scope.quantity;
        if($scope.productDetailBasic['limit']-$scope.productDetailBasic['totalSold']>0){
            orderProductsInfoData.inventoryStatus='有货';
        }else{
            orderProductsInfoData.inventoryStatus='无货'
        }
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
    }

    //点击添加购物车点击事件

    $scope.addToShoppingCart=function(){

        if(cookieOperate.getCookie("token")!=null) {
            addCartNeed.pid = $scope.productDetailBasic.pid;
            addCartNeed.pcode = $scope.productDetailBasic.code;
            addCartNeed.number = $scope.quantity;
            CommonService.createOne('shoppingcart', JSON.stringify(addCartNeed), function (data) {

                var cartProductsTotalOnIndex=JSON.parse(localDataStorage.getItem('cartProductsTotalOnIndex'));
                if(cartProductsTotalOnIndex==null){
                    cartProductsTotalOnIndex=0;
                }

                //改变购物车栏显示的商品数量
                $scope.$emit('totalAfterAddShoppingCart', ++cartProductsTotalOnIndex);

            }, errorOperate);
        }else{
            //本地购物车增加商品
            var cartProductsInfoArray=JSON.parse(localDataStorage.getItem('cartProductsInfoArray'));
            if(cartProductsInfoArray==null){
                cartProductsInfoArray=[];
            }
            var cartProductsTotal = JSON.parse(localDataStorage.getItem('cartProductsTotal'));
            if(cartProductsTotal=null){
                cartProductsTotal=0;
            }
            var cartProductsInfo={};
            cartProductsInfo.pid=$scope.productDetailBasic['pid'];
            cartProductsInfo.code = $scope.productDetailBasic['code'];
            cartProductsInfo.name=$scope.productDetailBasic['name'];
            cartProductsInfo.originalPrice=$scope.productDetailBasic['originalPrice'];
            cartProductsInfo.currentPrice=$scope.productDetailBasic['currentPrice'];
            cartProductsInfo.quantity=$scope.quantity;
            cartProductsInfo.offLine=$scope.productDetailBasic['status'];
            if($scope.productDetailBasic['limit']-$scope.productDetailBasic['totalSold']>0){
                cartProductsInfo.inventoryStatus='有货';
            }else{
                cartProductsInfo.inventoryStatus='无货';
            }
            cartProductsInfo.image=$scope.productDetailBasic['image'];
            cartProductsInfoArray.push(cartProductsInfo);
            localDataStorage.setItem('cartProductsInfoArray',JSON.stringify(cartProductsInfoArray));
            cartProductsTotal=cartProductsInfoArray.length;
            localDataStorage.setItem('cartProductsTotal',JSON.stringify(cartProductsTotal));

            $scope.$emit('totalAfterAddShoppingCart', cartProductsTotal);

        }
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
        limit=$scope.productDetailBasic.limit;
        totalSold=$scope.productDetailBasic.totalSold;
        currentPrice=$scope.productDetailBasic.currentPrice;
        $scope.cost=$scope.quantity*currentPrice;
        $scope.productDetailhtmls=data.html;

        //判断能否预订

        var sysDate = new Date();
        var stime = new Date(starttime.replace(/-/g,"/"));
        var etime = new Date(endtime.replace(/-/g,"/"));
        if((sysDate-stime>0 )&& (sysDate-etime<0)&&(limit-totalSold)>0){
            $scope.reserverState=false;
        }

        //判断是否已经关注

        if(cookieOperate.getCookie("token")!=null) {
            uriData = undefined;
            var pCode = $scope.productDetailBasic.code;

            CommonService.getAll('product/' + pCode + '/follow', uriData, function (data) {
                if (data[cookieOperate.getCookie('userName')] == 'YES') {
                    $scope.guanZhu = !$scope.guanZhu;
                    $scope.yiGuanZhu = !$scope.yiGuanZhu;
                }
            }, errorOperate);
        }

    },errorOperate);

});