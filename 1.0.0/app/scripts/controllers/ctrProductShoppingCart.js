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

    $scope.toDelTheCartProduct=undefined;

    $scope.delCartProductForm=false;

    $scope.cartProductForm={};

    $scope.cartProductForm.cartProducts = JSON.parse(localDataStorage.getItem('cartProductsInfoArray'));
     if($scope.cartProductForm.cartProducts==null){
         $scope.cartProductForm.cartProducts=[];
     }

    for(var i=0;i< $scope.cartProductForm.cartProducts.length;i++){
        $scope.allQuantity++;
        //增加总价字段
        $scope.cartProductForm.cartProducts[i].amount=$scope.cartProductForm.cartProducts[i].currentPrice* $scope.cartProductForm.cartProducts[i].quantity;
        $scope.allCost += $scope.cartProductForm.cartProducts[i].currentPrice* $scope.cartProductForm.cartProducts[i].quantity;
    }

    localDataStorage.setItem('cartProductsInfoArray',JSON.stringify($scope.cartProductForm.cartProducts));
    localDataStorage.setItem('cartProductsTotal',JSON.stringify($scope.cartProductForm.cartProducts.length));




    //实现与页面交互的事件,如：button_click

    //全选
    $scope.cartProductForm.checkAll = function(checked) {
        angular.forEach($scope.cartProductForm.cartProducts, function(cartProduct) {
            cartProduct.checked = checked;
        });
    };

    //数量增加
    $scope.quantityPlus = function (cartProduct) {

        uriData ={id:cartProduct.id,number:++cartProduct.quantity};

           CommonService.updatePartOne('shoppingcart',JSON.stringify(uriData),function(data){
            cartProduct.amount = cartProduct.currentPrice * cartProduct.quantity;
            $scope.allCost+=cartProduct.currentPrice;

               localDataStorage.setItem('cartProductsInfoArray',JSON.stringify($scope.cartProductForm.cartProducts));
               localDataStorage.setItem('cartProductsTotal',JSON.stringify($scope.cartProductForm.cartProducts.length));

           },errorOperate);

    }

    //数量减少
    $scope.quantitySubtract = function (cartProduct) {
        if (cartProduct.quantity > 1) {
            uriData ={id:cartProduct.id,number:--cartProduct.quantity};
            CommonService.updatePartOne('shoppingcart',JSON.stringify(uriData),function(data){

                cartProduct.amount = cartProduct.currentPrice * cartProduct.quantity;
                $scope.allCost-=cartProduct.currentPrice;

                localDataStorage.setItem('cartProductsInfoArray',JSON.stringify($scope.cartProductForm.cartProducts));
                localDataStorage.setItem('cartProductsTotal',JSON.stringify($scope.cartProductForm.cartProducts.length));

            },errorOperate);
        }
    }

    //显示单个删除购物车商品提示框
    $scope.showDeleteAlterForm=function(cartProduct){
        $scope.toDelTheCartProduct=cartProduct;
        $scope.delCartProductForm=true;
    }

    //单个删除购物车商品

    $scope.delCartProduct = function(cartProduct){

        uriData ={};
        uriData.ids=cartProduct['id'].toString();

        CommonService.deleteOne('shoppingcart',JSON.stringify(uriData),function(data){
           for(var i=0;i< $scope.cartProductForm.cartProducts.length;i++){
               if($scope.cartProductForm.cartProducts[i]['id']==cartProduct['id']){

                   $scope.allQuantity--;
                   $scope.allCost-=cartProduct['currentPrice']*cartProduct['quantity'];

                   $scope.cartProductForm.cartProducts.splice(i,1);

               }
           }

            localDataStorage.setItem('cartProductsInfoArray',JSON.stringify($scope.cartProductForm.cartProducts));
            localDataStorage.setItem('cartProductsTotal',JSON.stringify($scope.cartProductForm.cartProducts.length));

        },errorOperate);

        $scope.delCartProductForm=false;
    }

    //多个删除购物车商品

    $scope.multipleDelCartProduct=function(cartProductForm){
        uriData={};
        var ids='';
        var idsArray=[];
        for(var i=0;i<cartProductForm.cartProducts.length;i++){
           if(cartProductForm.cartProducts[i]['checked']==true){

               idsArray.push(cartProductForm.cartProducts[i]['id']);
               ids+=cartProductForm.cartProducts[i]['id'].toString()+',';
           }
        }
        uriData.ids=ids.substring(0,ids.length-1);

        CommonService.deleteOne('shoppingcart',JSON.stringify(uriData),function(data){
            for(var i=0;i< $scope.cartProductForm.cartProducts.length;i++){
                for(var j=0;j<idsArray.length;j++){
                   if($scope.cartProductForm.cartProducts[i]['id']==idsArray[j]){

                       $scope.allQuantity--;
                       $scope.allCost-=$scope.cartProductForm.cartProducts[i]['currentPrice']*$scope.cartProductForm.cartProducts[i]['quantity'];

                    $scope.cartProductForm.cartProducts.splice(i,1);

                    }
                }
            }

            localDataStorage.setItem('cartProductsInfoArray',JSON.stringify($scope.cartProductForm.cartProducts));
            localDataStorage.setItem('cartProductsTotal',JSON.stringify($scope.cartProductForm.cartProducts.length));

        },errorOperate);

    }


    //购买
    $scope.order=function(cartProductForm){

        var orderProductsInfoDataArray=[];
        var cartProductsForm_cartProducts=cartProductForm.cartProducts;

        if(cookieOperate.getCookie("token")==null) {
              $('#denglu').show();
        }else {
            for (var i = 0; i < cartProductsForm_cartProducts.length; i++) {
                if (cartProductsForm_cartProducts[i].checked == true) {

                    var orderProductsInfoData = {};

                    orderProductsInfoData.id = cartProductsForm_cartProducts[i].id;
                    orderProductsInfoData.pid = cartProductsForm_cartProducts[i].pid;
                    orderProductsInfoData.code = cartProductsForm_cartProducts[i].code;
                    orderProductsInfoData.name = cartProductsForm_cartProducts[i].name;
                    orderProductsInfoData.originalPrice = cartProductsForm_cartProducts[i].originalPrice;
                    orderProductsInfoData.currentPrice = cartProductsForm_cartProducts[i].currentPrice;
                    orderProductsInfoData.quantity = cartProductsForm_cartProducts[i].quantity;
                    orderProductsInfoData.offLine = cartProductsForm_cartProducts[i].offLine;
                    orderProductsInfoData.inventoryStatus = cartProductsForm_cartProducts[i].inventoryStatus;

                    orderProductsInfoData.amount = cartProductsForm_cartProducts[i]['amount'];


                    orderProductsInfoDataArray.push(orderProductsInfoData);
                }
            }

            localDataStorage.setItem('orderProductsInfo', JSON.stringify(orderProductsInfoDataArray));
            $window.location.href = '#/productOrder';
        }

        }



    //调用与后端的接口,如：CommonService.getAll(params)


});
