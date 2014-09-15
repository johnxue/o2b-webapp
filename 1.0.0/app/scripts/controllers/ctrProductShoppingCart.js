/**
 * Created by yuzhenhan on 14-9-11.
 */

/**
 *
 *  @模块名称: ProductShoppingCart Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var ProductShoppingCartControllers = angular.module('ProductShoppingCartControllers', []);

/*定义 Controller: ProductShoppingCartCtrl  （购物车页面 productShoppingCart.html）*/
ProductShoppingCartControllers.controller('ProductShoppingCartCtrl', function ($scope, CommonService,$window) {

    var uriData = '';

    //初始化$scope中定义的变量

    $scope.allQuantity=0;

    $scope.allCost=0;

    $scope.cartProductForm={};



    //实现与页面交互的事件,如：button_click

    //全选
    $scope.cartProductForm.checkAll = function(checked) {
        angular.forEach($scope.cartProductForm.cartProducts, function(cartProduct) {
            cartProduct.checked = checked;
        });
    };

    //数量增加
    $scope.quantityPlus = function (cartProduct) {

        uriData ={id:cartProduct[0],number:++cartProduct[6]};

           CommonService.updatePartOne('shoppingcart',JSON.stringify(uriData),function(data){
            cartProduct[9] = cartProduct[6] * cartProduct[4];
            $scope.allCost+=cartProduct[4];
        },errorOperate);

    }

    //数量减少
    $scope.quantitySubtract = function (cartProduct) {
        if (cartProduct[6] > 1) {
            uriData ={id:cartProduct[0],number:--cartProduct[6]};
            CommonService.updatePartOne('shoppingcart',JSON.stringify(uriData),function(data){

                cartProduct[9] = cartProduct[6] * cartProduct[4];
                $scope.allCost-=cartProduct[4];
            },errorOperate);
        }
    }

    //删除购物车商品

    $scope.cartProductForm.delCartProduct = function(cartProducts){

        uriData ={};
        uriData.ids=cartProducts[0].toString();

        CommonService.deleteOne('shoppingcart',JSON.stringify(uriData),function(data){
           for(var i=0;i< $scope.cartProductForm.cartProducts.length;i++){
               if($scope.cartProductForm.cartProducts[i][0]==cartProducts[0]){
                  $scope.cartProductForm.cartProducts.splice(i,1);
               }
           }
            $scope.allQuantity--;
            $scope.allCost-=cartProduct[6]*cartProduct[4];
        },errorOperate);
    }

    //结算生成订单

    $scope.order=function(cartProductForm){

        var orderProductsInfoDataArray=[];

        for(var i=0;i<cartProductForm.cartProducts.length;i++){
            if(cartProductForm.cartProducts[i].checked==true){

                var orderProductsInfoData={};

                orderProductsInfoData.id=cartProductForm.cartProducts[i][0];
                orderProductsInfoData.pid=cartProductForm.cartProducts[i][1];
                orderProductsInfoData.code = cartProductForm.cartProducts[i][2];
                orderProductsInfoData.name=cartProductForm.cartProducts[i][3];
                orderProductsInfoData.originalPrice=cartProductForm.cartProducts[i][4];
                orderProductsInfoData.currentPrice=cartProductForm.cartProducts[i][5];
                orderProductsInfoData.quantity=cartProductForm.cartProducts[i][6];
                orderProductsInfoData.offLine=cartProductForm.cartProducts[i][7];
                if(cartProductForm.cartProducts[i][8]>0){
                    orderProductsInfoData.inventoryStatus='有货';
                }else{
                    orderProductsInfoData.inventoryStatus='无货'
                }
                orderProductsInfoData.amount=cartProductForm.cartProducts[i][9];;

                orderProductsInfoDataArray.push(orderProductsInfoData);
            }
        }

        localDataStorage.setItem('orderProductsInfo',JSON.stringify(orderProductsInfoDataArray));
        $window.location.href='#/productOrder';
    }


    //调用与后端的接口,如：CommonService.getAll(params)

    uriData = undefined;
    CommonService.getAll('shoppingcart', uriData, function (data) {
        $scope.cartProductForm.cartProducts = data;
        for(var i=0;i< $scope.cartProductForm.cartProducts.length;i++){
            $scope.allQuantity++;

            //增加总价字段
            $scope.cartProductForm.cartProducts[i].splice(9,0, $scope.cartProductForm.cartProducts[i][4]* $scope.cartProductForm.cartProducts[i][6]);
            $scope.allCost += $scope.cartProductForm.cartProducts[i][4]*$scope.cartProductForm.cartProducts[i][6];
        }
        localDataStorage.setItem('orderProductsInfo', JSON.stringify($scope.cartProductForm.cartProducts));
    }, errorOperate);


});
