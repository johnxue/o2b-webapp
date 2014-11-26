/**
 * Created by Administrator on 2014/9/4.
 */

/**
 *
 *  @模块名称: Main Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var PreviewProductDetailControllers = angular.module('PreviewProductDetailControllers',[]);

/*定义 Controller: PreviewProductDetailCtrl  （预览产品详情页面 previewProductDetail.html）*/
PreviewProductDetailControllers.controller('PreviewProductDetailCtrl',function($scope,CommonService,$window){
    ctrInit();

    var uriData='';

   //初始化$scope中定义的变量

    $scope.productInfoPreview=JSON.parse(localDataStorage.getItem('productInfoPreview'));

    $scope.productDetailPreview=JSON.parse(localDataStorage.getItem('productDetailPreview'));

    console.info($scope.productInfoPreview);
    console.info($scope.productDetailPreview);

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





    //调用与后端的接口,如：CommonService.getAll(params)


});