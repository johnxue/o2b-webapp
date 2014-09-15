/**
 * Created by Administrator on 2014/9/5.
 */

/**
 *
 *  @模块名称: ProductReserve Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var ProductOrderControllers = angular.module('ProductOrderControllers',[]);

/*定义 Controller: ProductOrderCtrl  （订购页面 productOrder.html）*/
ProductOrderControllers.controller('ProductOrderCtrl',function($scope,CommonService){

    var uriData ='';
    var balanceNeed = {};
//初始化$scope中定义的变量
    $scope.orderProductsInfo =JSON.parse(localDataStorage.getItem('orderProductsInfo'));


    $scope.userAddressesBeforeOr = {};

    $scope.defaultDisaplayAddress={};


    $scope.comment='';

    $scope.changeOrderAddressForm={};

    $scope.costAll=0;

    for(var i=0;i<$scope.orderProductsInfo.length;i++){
        $scope.costAll+=$scope.orderProductsInfo[i].amount;
    }

    $scope.payments ={};

    $scope.deliverys={};


    //实现与页面交互的事件,如：button_click


    //保存更改收货地址
    $scope.saveChange=function(changeOrderAddressForm){
       $scope.defaultDisaplayAddress= changeOrderAddressForm.selectedAddress;
    }

    //结算

    $scope.balance=function(){
        balanceNeed.aId=$scope.defaultDisaplayAddress[0];
        balanceNeed.payment='20';
        balanceNeed.shipping='10';
        balanceNeed.freight= 10;
        balanceNeed.total= $scope.orderProductsInfo.length;
        balanceNeed.amount=$scope.costAll;
        balanceNeed.comment=$scope.comment;

        var orderProductsInfoForBalance=$scope.orderProductsInfo;
        for(var i=0;i<orderProductsInfoForBalance.length;i++){
            orderProductsInfoForBalance[i].wouldOrder=undefined;
            orderProductsInfoForBalance[i].amount=undefined;
            orderProductsInfoForBalance[i].id=undefined;
            orderProductsInfoForBalance[i].pcode=orderProductsInfoForBalance[i].code;
            orderProductsInfoForBalance[i].code=undefined;
            orderProductsInfoForBalance[i].price=orderProductsInfoForBalance[i].currentPrice;
            orderProductsInfoForBalance[i].currentPrice=undefined;
            orderProductsInfoForBalance[i].oPrice=orderProductsInfoForBalance[i].originalPrice;
            orderProductsInfoForBalance[i].originalPrice=undefined;
            orderProductsInfoForBalance[i].number=orderProductsInfoForBalance[i].quantity;
            orderProductsInfoForBalance[i].quantity=undefined;
            orderProductsInfoForBalance[i].$$hashKey=undefined;
        }
        balanceNeed.orders=orderProductsInfoForBalance;

        CommonService.createOne('order',JSON.stringify(balanceNeed),function(data){
            console.info(data.user);
            console.info(data.orderId);
            console.info(data.orderNo);
            console.info(data.amount);
            console.info(data.payment);

        },errorOperate);
    }


    //调用与后端的接口,如：CommonService.getAll(params)

    uriData = undefined;
    CommonService.getAll('address',uriData,function(data){

        $scope.userAddressesBeforeOr=data;

        for(var i=0;i<$scope.userAddressesBeforeOr.length;i++){
            if($scope.userAddressesBeforeOr[i][11]=='Y'){
                $scope.defaultDisaplayAddress=$scope.userAddressesBeforeOr[i];
            }
        }

    },errorOperate);

    uriData = undefined;
    CommonService.getAll('order/attribute',uriData,function(data){
        $scope.payments
        $scope.deliverys
    },errorOperate);

});
