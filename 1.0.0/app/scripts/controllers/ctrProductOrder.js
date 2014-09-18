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


//初始化$scope中定义的变量

    var balanceNeed = {};

    $scope.orderForm={};

    $scope.orderForm.orderProductsInfo =JSON.parse(localDataStorage.getItem('orderProductsInfo'));


    $scope.userAddressesBeforeOr = {};

    $scope.defaultDisaplayAddress={};

    $scope.updateAddressFormState=false;

    $scope.orderForm.comment='';

    $scope.changeOrderAddressForm={};

    $scope.costAll=0;

    $scope.allQuantity=0;

    /*for(var i=0;i<$scope.orderForm.orderProductsInfo.length;i++){
        $scope.allQuantity++;
        $scope.costAll+=$scope.orderForm.orderProductsInfo[i].amount;
    }*/

    $scope.orderForm.payments ={};

    $scope.orderForm.deliverys={};


    //实现与页面交互的事件,如：button_click



    //保存更改收货地
    $scope.saveChange=function(changeOrderAddressForm){
       $scope.defaultDisaplayAddress= changeOrderAddressForm.selectedAddress;
    }

    //结算

    $scope.balance=function(orderForm){
        balanceNeed.aId=$scope.defaultDisaplayAddress[0];

        balanceNeed.payment='';
        for(var i =0;i<orderForm.payments.length;i++){
            if(typeof(orderForm.payments[i].$radioBox)!=='undefined'){
                balanceNeed.payment=orderForm.payments[i].$radioBox;
            }
        }

        balanceNeed.shipping='10';
        balanceNeed.freight= 10;
        balanceNeed.total= $scope.allQuantity;
        balanceNeed.amount=$scope.costAll;
        balanceNeed.comment=orderForm.comment;

        var orderProductsInfoForBalance=[];
        for(var i=0;i<orderForm.orderProductsInfo.length;i++){
            if(orderForm.orderProductsInfo[i]['$selectedOrder']==true){
                var orderProductInfoForBalance={};

                orderProductInfoForBalance['pid']=orderForm.orderProductsInfo[i].pid;

                orderProductInfoForBalance['name']=orderForm.orderProductsInfo[i].name;


                orderProductInfoForBalance['pcode']=orderForm.orderProductsInfo[i].code;

                orderProductInfoForBalance['price']=orderForm.orderProductsInfo[i].currentPrice;

                orderProductInfoForBalance['oPrice']=orderForm.orderProductsInfo[i].originalPrice;

                orderProductInfoForBalance['number']=orderForm.orderProductsInfo[i].quantity;

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

    //复选框状态改变事件

    $scope.checkBoxChange=function(orderForm){
        $scope.costAll=0;
        $scope.allQuantity=0;

        for(var i=0;i<orderForm.orderProductsInfo.length;i++){
            if(orderForm.orderProductsInfo[i]['$selectedOrder']==true){
                $scope.costAll+=orderForm.orderProductsInfo[i].amount;
                $scope.allQuantity++;
            }
        }

    }

    //弹出修改收获地址栏单击事件
    $scope.updateAddress=function(){
        $scope.updateAddressFormState=!$scope.updateAddressFormState;
    }

    //修改默认收获地址单击事件
    $scope.updateDefaultInOrder=function(id) {
        uriData = undefined;
        CommonService.updatePartOne('address/' + id, uriData, function (data) {

            //改变UserAddressCtrl中的默认地址
            $scope.$broadcast("userDefaultAddressesChange", id);

            //改变当前控制器下的默认地址
            for (var i = 0; i < $scope.userAddressesBeforeOr.length; i++) {
                if ($scope.userAddressesBeforeOr[i][11] == 'Y') {
                    $scope.userAddressesBeforeOr[i][11] = 'N';
                }
            }
            for (var i = 0; i < $scope.userAddressesBeforeOr.length; i++) {
                if ($scope.userAddressesBeforeOr[i][0] == id) {
                    $scope.userAddressesBeforeOr[i][11] = 'Y';
                    $scope.defaultDisaplayAddress=$scope.userAddressesBeforeOr[i];
                }
            }
        }, errorOperate);
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
