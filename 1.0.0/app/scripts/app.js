'use strict';

var MainApp=angular.module('MainApp',['ngRoute','ngResource','ProductDetailControllers','ProductIndexControllers','ProductListControllers','ProductMainControllers','CommonServices','ProductFilters','LoginDirectives','LoginServices','LoginControllers','ProductOrderControllers','UserAddressControllers','NewsControllers','NewsListControllers','ProductShoppingCartControllers']);

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
        })
     	.otherwise({
            redirectTo: '/'
        });

    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');

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


