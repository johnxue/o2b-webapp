'use strict';

var MainApp=angular.module('MainApp',['ngRoute','ngResource','angularFileUpload','ProductDetailControllers','ProductIndexControllers','ProductListControllers','ProductMainControllers','CommonServices','CommonFilters','LoginServices','LoginControllers','ProductOrderControllers','UserAddressControllers','NewsControllers','NewsListControllers','ProductShoppingCartControllers','MyFormControllers','UserRegisterControllers','UserFollowControllers','ViewDetailsControllers','UserAccountSettingControllers','CommonDirectives']);


MainApp.config(['$routeProvider','$httpProvider','$locationProvider',function($routeProvider,$httpProvider,$locationProvider) {
    $routeProvider
        .when('/', {
            title: '主页',
            templateUrl: 'views/main.html',
            controller: 'ProductMainCtrl'
        }).when('/product', {
            title: '产品列表',
            templateUrl: 'views/productList.html',
            controller: 'ProductListCtrl'
        }).when('/productDetail/:code', {
            title: '产品详细',
            templateUrl: 'views/productDetail.html',
            controller: 'ProductDetailCtrl'
        }).when('/userAddress',{
            title: '收货地址',
            templateUrl: 'views/userAddress.html',
            controller: 'UserAddressCtrl'
        }).when('/newsList',{
            title: '新闻列表',
            templateUrl: 'views/newslist.html',
            controller: 'NewsListCtrl'
        }).when('/news/:id',{
            title: '新闻内容',
            templateUrl: 'views/news.html',
            controller: 'NewsCtrl'
        }).when('/productOrder',{
            title: '订单',
            templateUrl: 'views/productOrder.html',
            controller: 'ProductOrderCtrl'
        }).when('/productShoppingCart',{
            title: '购物车',
            templateUrl: 'views/productShoppingCart.html',
            controller: 'ProductShoppingCartCtrl'
        }).when('/myForm',{
            title:'我的订单',
            templateUrl:'views/dingdan.html',
            controller:'MyFormCtrl'
        }).when('/register',{
             title:'注册',
            templateUrl:'views/register.html',
            controller:'UserRegisterCtrl'
        }).when('/accountSetting',{
            title:'帐号设置',
            templateUrl:'views/accountSetting.html',
            controller:'UserAccountSettingCtrl'
        }).when('/follow',{
            title:'我的关注',
            templateUrl:'views/follow.html',
            controller:'UserFollowCtrl'
        }).when('/viewDetails/:userId',{
            title:'查看详情',
            templateUrl:'views/xiangqing.html',
            controller:'ViewDetailsCtrl'
        })
     	.otherwise({
            redirectTo: '/'
        });

    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');

    //跨域
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.defaults.headers.common['Content-Type']= 'application/json';
    $httpProvider.defaults.headers.common['app-key']='fb98ab9159f51fd0'; //(key)

}]);




MainApp.factory('mainAppInstance', function() {
    return {
        data:""
    }
});

MainApp.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function(currentRoute, previousRoute) {
        $rootScope.title = previousRoute.$$route.title;
    });
}]);






