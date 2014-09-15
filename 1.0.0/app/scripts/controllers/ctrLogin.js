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
LoginControllers.controller('loginCtrl', function ($scope,$window,loginService,CommonService) {

    var uriData='';
    //初始化$scope中定义的变量

    $scope.master= {};



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

        var objResults = {
            error: {code: 0, message: ''},
            authcode: ''
        };


        loginService.getToken(strDataPacket, function (response, status, headers, config) {
            objResults.authcode = headers('Authorization');
            $scope.token = objResults.authcode;
            cookieOperate.setCookie('token', $scope.token);
            cookieOperate.setCookie('userName', strUserName);
            $scope.$emit('logined', strUserName);

            //获取用户购物车信息
            uriData=undefined;
            CommonService.getAll('shoppingcart',uriData,function(data){
                var cartProducts = data;
                var cartProductsTotal = cartProducts.length;
                var cartProductsInfoArray=[];

                for(var i=1;i<cartProducts.length;i++){
                    var cartProductsInfo={};

                    cartProductsInfo.id=cartProducts[i][0];
                    cartProductsInfo.pid=cartProducts[i][1];
                    cartProductsInfo.code = cartProducts[i][2];
                    cartProductsInfo.name=cartProducts[i][3];
                    cartProductsInfo.originalPrice=cartProducts[i][4];
                    cartProductsInfo.currentPrice=cartProducts[i][5];
                    cartProductsInfo.quantity=cartProducts[i][6];
                    cartProductsInfo.offLine=cartProducts[i][7];
                    if(cartProducts[i][8]>0){
                        cartProductsInfo.inventoryStatus='有货';
                    }else{
                        cartProductsInfo.inventoryStatus='无货'
                    }

                    cartProductsInfoArray.push(cartProductsInfo);
                }

                localDataStorage.setItem(JSON.stringify(cartProductsInfoArray));
                localDataStorage.setItem(cartProductsTotal);
            },errorOperate);


            // 调用回调连接
        }, function (response) {
            objResults.error.code = parseInt(response.code);
            objResults.error.message = response.message;
            $scope.xue = !$scope.xue;
            // 处理错误
        });

    }


    $scope.reset = function() {
    	$scope.objLoginInfo = {};
    };

    $scope.isUnchanged = function(objLoginInfo) {
    	return angular.equals(objLoginInfo, $scope.master);
    };


    //调用与后端的接口,如：CommonService.getAll(params)




});

/*定义 Controller: logoutCtrl  （登出）*/
LoginControllers.controller('logoutCtrl', function ($scope,CommonService) {
    ///初始化$scope中定义的变量
     var uriData=undefined;
    //实现与页面交互的事件,如：button_click
    $scope.logout=function(){

        CommonService.deleteOne('logout',uriData,function(){
            cookieOperate.delCookie('token');
            cookieOperate.delCookie('userName');
            var logoutedState =false;
            $scope.$emit('logouted',logoutedState);
        },errorOperate);
    }

    //调用与后端的接口,如：CommonService.getAll(params)

});

