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
    $scope.orderForm={};

    $scope.orderForm.orderProductsInfo =JSON.parse(localDataStorage.getItem('orderProductsInfo'));


    $scope.userAddressesBeforeOr = {};

    $scope.defaultDisaplayAddress={};


    $scope.orderForm.comment='';

    $scope.changeOrderAddressForm={};

    $scope.costAll=0;

    for(var i=0;i<$scope.orderForm.orderProductsInfo.length;i++){
        $scope.costAll+=$scope.orderForm.orderProductsInfo[i].amount;
    }

    $scope.orderForm.payments ={};

    $scope.orderForm.deliverys={};


    //实现与页面交互的事件,如：button_click


    //保存更改收货地址
    $scope.saveChange=function(changeOrderAddressForm){
       $scope.defaultDisaplayAddress= changeOrderAddressForm.selectedAddress;
    }

    //结算

    $scope.balance=function(orderForm){
        balanceNeed.aId=$scope.defaultDisaplayAddress[0];

        balanceNeed.payment='';
        for(var i =0;i<$scope.orderForm.payments.length;i++){
            var a = $scope.orderForm.payments[i].$radioBox;
            if(typeof(a)!=='undefined'){
                balanceNeed.payment=$scope.orderForm.payments[i].$radioBox;
            }
        }

        balanceNeed.shipping='10';
        balanceNeed.freight= 10;
        balanceNeed.total= $scope.orderForm.orderProductsInfo.length;
        balanceNeed.amount=$scope.costAll;
        balanceNeed.comment=$scope.orderForm.comment;

        var orderProductsInfoForBalance=[];
        for(var i=0;i<$scope.orderForm.orderProductsInfo.length;i++){
            if($scope.orderForm.orderProductsInfo[i]['$selectedOrder']==true){
                var orderProductInfoForBalance={};

                orderProductInfoForBalance['pid']=$scope.orderForm.orderProductsInfo[i].pid;

                orderProductInfoForBalance['name']=$scope.orderForm.orderProductsInfo[i].name;


                orderProductInfoForBalance['pcode']=$scope.orderForm.orderProductsInfo[i].code;

                orderProductInfoForBalance['price']=$scope.orderForm.orderProductsInfo[i].currentPrice;

                orderProductInfoForBalance['oPrice']=$scope.orderForm.orderProductsInfo[i].originalPrice;

                orderProductInfoForBalance['number']=$scope.orderForm.orderProductsInfo[i].quantity;

                orderProductsInfoForBalance.push(orderProductInfoForBalance);
            }
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
        $scope.orderForm.payments=data['payment'];
        $scope.orderForm.deliverys;
    },errorOperate);

});
