/**
 * Created by yuzhenhan on 14-9-18.
 */
/**
 *
 *  @模块名称: userRegister Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var UserRegisterControllers = angular.module('UserRegisterControllers', []);

/*定义 Controller: UserRegisterCtrl  （注册页面 register.html）*/
UserRegisterControllers.controller('UserRegisterCtrl', function ($scope, CommonService, $interval) {

    ctrInit();

    var stop = undefined;
    var time =60;
    //初始化$scope中定义的变量

    $scope.sendIdentifyingCodeButtonText ='发送验证码';
    $scope.sendIdentifyingCodeState = false;



    $scope.$on('$destroy', function () {
        // Make sure that the interval nis destroyed too
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    });

    //实现与页面交互的事件,如：button_click

    $scope.sendIdentifyingCode = function () {

        identifyingCodeTimepiece();

    }



    var identifyingCodeTimepiece= function() {

        if (angular.isDefined(stop)) {
            return;
        } else {

            $scope.sendIdentifyingCodeState = true;

            stop = $interval(function () {

                if (time > 0) {
                    time--;
                    $scope.sendIdentifyingCodeButtonText=time+'秒后重新发送';
                } else {
                    $interval.cancel(stop);
                    stop = undefined;
                    time = 60;
                    $scope.sendIdentifyingCodeButtonText='发送验证码';
                    $scope.sendIdentifyingCodeState = false;
                }
            }, 1000);
        }
    }


    //调用与后端的接口,如：CommonService.getAll(params)

});