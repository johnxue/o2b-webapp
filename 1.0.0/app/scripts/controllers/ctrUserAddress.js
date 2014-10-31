/**
 * Created by Administrator on 2014/9/9.
 */
/**
 * Created by Administrator on 2014/9/4.
 */

/**
 *
 *  @模块名称: User Address Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var UserAddressControllers = angular.module('UserAddressControllers', []);

/*定义 Controller: UserAddressCtrl  （用户地址页面 userAddress.html）*/
UserAddressControllers.controller('UserAddressCtrl',function($scope,CommonService){

    ctrInit();

    var uriData ='';
    var provinceName='';
    var cityName='';
    var districtName='';
    //初始化$scope中定义的变量

    $scope.deliveryAddress={};

    $scope.selectProvinces={};

    $scope.selectCitys={};

    $scope.selectDistricts ={};


  $scope.userAddressesBefore = {};

    /*注册事件*/
    $scope.$on("userDefaultAddressesChange",function (event, id) {
        for(var i =0;i<$scope.userAddressesBefore.length;i++){
            if($scope.userAddressesBefore[i][11]=='Y'){
                $scope.userAddressesBefore[i][11]='N';
            }
        }
        for(var i =0;i<$scope.userAddressesBefore.length;i++){
            if($scope.userAddressesBefore[i][0]==id){
                $scope.userAddressesBefore[i][11]='Y';
            }
        }
    });

    //实现与页面交互的事件,如：button_click

    $scope.$watch('deliveryAddress.pi', function(selectedProvince) {
        if(selectedProvince!=undefined ){
        CommonService.getAll('area','p='+selectedProvince,function(data){
            $scope.selectCitys=data.city;

            for(var i=0;i<$scope.selectProvinces.length;i++){
                if($scope.selectProvinces[i][0]==selectedProvince){
                    provinceName=$scope.selectProvinces[i][1];
                }
            }
        },errorOperate);
        }
    });

    $scope.$watch('deliveryAddress.ci', function(selectedCity) {
        if(selectedCity!=undefined ){
            CommonService.getAll('area','c='+selectedCity,function(data){
                $scope.selectDistricts=data.district;

                for(var i =0;i<$scope.selectCitys.length;i++){
                    if($scope.selectCitys[i][0]==selectedCity){
                        cityName=$scope.selectCitys[i][1];
                    }
                }
            },errorOperate);
        }
    });

    $scope.$watch('deliveryAddress.ai',function(selectedDistrict){
        if(selectedDistrict!=undefined ){
            for(var i =0;i<$scope.selectDistricts.length;i++){
                if($scope.selectDistricts[i][0]==selectedDistrict){
                    districtName=$scope.selectDistricts[i][1];
                }
            }
        }
    });

    $scope.save=function(deliveryAddress){
        deliveryAddress.i='N';
        uriData = angular.toJson(deliveryAddress)
        CommonService.createOne('address',uriData,function(data){
            $scope.userAddressesBefore.splice(1,0,[data.address,data.user,deliveryAddress.c,deliveryAddress.t,deliveryAddress.m,deliveryAddress.e,provinceName,cityName,districtName,deliveryAddress.s,deliveryAddress.a,deliveryAddress.i]);
            $scope.deliveryAddress={};
        },errorOperate);
    }

    $scope.delete=function(id){

        uriData = undefined;
        CommonService.deleteOne('address/'+id,uriData,function(data){
            for(var i =0;i<$scope.userAddressesBefore.length;i++){
                if($scope.userAddressesBefore[i][0]==id){
                    $scope.userAddressesBefore.splice(i,1);
                    break;
                }
            }
        },errorOperate);
    }

    $scope.updateDefault=function(id){

        uriData = undefined;
        CommonService.updatePartOne('address/'+id,uriData,function(data){
            for(var i =0;i<$scope.userAddressesBefore.length;i++){
                if($scope.userAddressesBefore[i][11]=='Y'){
                    $scope.userAddressesBefore[i][11]='N';
                }
            }
            for(var i =0;i<$scope.userAddressesBefore.length;i++){
                if($scope.userAddressesBefore[i][0]==id){
                    $scope.userAddressesBefore[i][11]='Y';
                }
            }
        },errorOperate);
    }

    //调用与后端的接口,如：CommonService.getAll(params)

    uriData = undefined;
    CommonService.getAll('area',uriData,function(data){

        $scope.selectProvinces=data.province;

    },errorOperate);

    uriData = undefined;
   CommonService.getAll('address',uriData,function(data){

       $scope.userAddressesBefore=data;

   },errorOperate);



});