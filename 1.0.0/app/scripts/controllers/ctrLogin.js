'use strict';

//App_Key=fb98ab9159f51fd0          (key)
//App_Secret=09f7c8cba635f7616bc131b0d8e25947  (安全码)

/**
 *
 *  @模块名称: Login Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */
var LoginControllers = angular.module('LoginControllers', []);

/*定义 Controller: loginCtrl  （登录）*/
LoginControllers.controller('loginCtrl', function ($scope,$window,loginService,CommonService,$interval) {

    var uriData='';

    var stop=undefined;
    //初始化$scope中定义的变量

    $scope.master= {};

    $scope.objLoginInfo={};

//实现与页面交互的事件,如：button_click

// 点击提交
    $scope.update = function(objLoginInfo) {
        // 得到Key及iv
        var strMD5Passwd = CryptoJS.MD5(objLoginInfo.password).toString();
        var strRandomIV = randomKey(16);
        // var strData = URL.getHost();
        var strData = '192.168.1.210';
        var key = CryptoJS.enc.Utf8.parse(strMD5Passwd);
        var iv = CryptoJS.enc.Utf8.parse(strRandomIV);


        var strAesEncrypted = CryptoJS.AES.encrypt(strData, key,
            { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding});

        var strUserName = objLoginInfo.username;
        var strUserNameLength = ZeroPadding.left(strUserName.length, 3);

        var strDataPacket = strRandomIV + strUserNameLength + strAesEncrypted + strUserName;

        var url = '192.168.1.210';

        strDataPacket = url + "/" + Base64.encode(strDataPacket);


        loginService.getToken(strDataPacket, function (response, status, headers, config) {

            //初始化本地数据
            cookieOperate.delCookie('token');
            cookieOperate.delCookie('userName');
            localDataStorage.removeItem('cartProductsInfoArray');
            localDataStorage.removeItem('cartProductsTotal');
            localDataStorage.removeItem('orderProductsInfo');
            localDataStorage.removeItem('cartProductsTotalOnIndex');
            localDataStorage.removeItem('groupInfo');
            localDataStorage.removeItem('groupTopicDetail');
            localDataStorage.removeItem('unReadMessageCountOnIndex');
            localDataStorage.removeItem('messageSniffInterval');

            cookieOperate.setCookie('token', headers('Authorization'));
            cookieOperate.setCookie('userName', strUserName);

            //获取用户登录之后的购物车商品商品信息
            uriData=undefined;
            CommonService.getAll('shoppingcart',uriData,function(data){
                var cartProducts = data.ShoppingCart;

                //得到用户登录之前的购物车商品信息
                var cartProductsTotal = JSON.parse(localDataStorage.getItem('cartProductsTotal'));
                if(cartProductsTotal==null){
                    cartProductsTotal=0;
                }
                var cartProductsInfoArray=JSON.parse(localDataStorage.getItem('cartProductsInfoArray'));
                if(cartProductsInfoArray==null){
                    cartProductsInfoArray=[];
                }

                //将用户登录之前的购物车商品信息添加到服务器
                for(var i=0;i<cartProductsInfoArray.length;i++){

                    var addCartNeed = {};
                    addCartNeed.pid = cartProductsInfoArray[i]['pid'];
                    addCartNeed.pcode = cartProductsInfoArray[i]['code'];
                    addCartNeed.number = cartProductsInfoArray[i]['quantity'];
                    CommonService.createOne('shoppingcart', JSON.stringify(addCartNeed), function (data) {
                },errorOperate);

                }

                //将用户登录前后的购物车商品个数合并
                cartProductsTotal+=cartProducts.length;

                localDataStorage.setItem('cartProductsTotalOnIndex',JSON.stringify(cartProductsTotal));
                localDataStorage.removeItem('cartProductsTotal');
                localDataStorage.removeItem('cartProductsInfoArray');

                //改变购物车栏显示的商品数量
                $scope.$emit('logined', strUserName,cartProductsTotal);

                $scope.objLoginInfo={};

                //如果发起登录请求的是购物车页面,则重新加载该页
                if($window.location.href.substring($window.location.href.length-21,$window.location.href.length)=='#/productShoppingCart'){
                    document.location.reload();
                }

            },function(response){
                if(response.code=='802'){
                    //改变购物车栏显示的商品数量
                    $scope.$emit('logined', strUserName,0);

                    $scope.objLoginInfo={};
                }
            });

            //消息探测(首次)
            uriData = undefined;
            CommonService.getAll('message/sniffing', uriData, function (data) {
               var unReadMessageCount = data.unread_count;

               //改变消息栏显示的未读消息数量
               $scope.$emit('changeURMessageCountOnIndex', unReadMessageCount);

               //消息探测(间隔器)
               stop=$interval(function () {
                   uriData = undefined;
                   CommonService.getAll('message/sniffing', uriData, function (data) {
                      var unReadMessageCount = data.unread_count;

                      //改变消息栏显示的未读消息数量
                      $scope.$emit('changeURMessageCountOnIndex', unReadMessageCount);

                   }, errorOperate);

               },120000);

              //存储当前运行的间隔器
              localDataStorage.setItem('messageSniffInterval',JSON.stringify(stop));

            }, errorOperate);


            $('#denglu').modal('hide');


        },errorOperate);

    }


    $scope.reset = function() {
    	$scope.objLoginInfo = {};
    };

    $scope.isUnchanged = function(objLoginInfo) {
    	return angular.equals(objLoginInfo, $scope.master);
    };

    $scope.close=function(){
        $('#denglu').hide();
    }


    //调用与后端的接口,如：CommonService.getAll(params)


});

/*定义 Controller: logoutCtrl  （登出）*/
LoginControllers.controller('logoutCtrl', function ($scope,CommonService,$window,$interval) {
    ///初始化$scope中定义的变量
     var uriData=undefined;
    //实现与页面交互的事件,如：button_click
    $scope.logout=function(){

        CommonService.deleteOne('logout',uriData,function(data){

            cookieOperate.delCookie('token');
            cookieOperate.delCookie('userName');
            localDataStorage.removeItem('cartProductsInfoArray');
            localDataStorage.removeItem('cartProductsTotal');
            localDataStorage.removeItem('orderProductsInfo');
            localDataStorage.removeItem('cartProductsTotalOnIndex');
            localDataStorage.removeItem('groupInfo');
            localDataStorage.removeItem('groupTopicDetail');
            localDataStorage.removeItem('unReadMessageCountOnIndex');

            //停止消息探寻间隔器
            if(JSON.parse(localDataStorage.getItem('messageSniffInterval'))!=null){
               $interval.cancel(JSON.parse(localDataStorage.getItem('messageSniffInterval')));
               localDataStorage.removeItem('messageSniffInterval');
            }

            $window.location.href='/';

            $scope.$emit('logouted');

        },errorOperate);

    }

    //调用与后端的接口,如：CommonService.getAll(params)

});

