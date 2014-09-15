/**
 * Created by Administrator on 2014/9/10.
 */
var NewsControllers = angular.module('NewsControllers',[]);

/*定义 Controller: ProductReserveCtrl  （订购页面 productReserve.html）*/
NewsControllers.controller('NewsCtrl',function($scope,CommonService,$routeParams){

    var uriData ='';

    uriData = undefined;
    CommonService.getAll('news/'+$routeParams.id,uriData,function (data) {
        $("#content").html(data.htmlContent);
    },errorOperate);
});