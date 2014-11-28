﻿'use strict';

var MainApp=angular.module('MainApp',['ngRoute','ngResource','angularFileUpload','ProductDetailControllers',
    'IndexControllers','ProductListControllers','MainControllers','CommonServices','CommonFilters',
    'LoginServices','LoginControllers','ProductOrderControllers','UserAddressControllers','NewsControllers',
    'NewsListControllers','ProductShoppingCartControllers','MyFormControllers','UserRegisterControllers',
    'UserFollowControllers','ViewDetailsControllers','UserAccountSettingControllers','CommonDirectives',
    'GroupMainControllers','GroupDetailControllers','GroupTopicDetailControllers','CreateGroupControllers',
    'EditGroupTopicControllers','ManageGroupControllers','UEditorServices','ReleaseControllers',
    'EditNewsControllers','MessageMainControllers','MessageDetailControllers','AdverControllers',
    'ReleaseProductControllers','PreviewProductDetailControllers']);

MainApp.config(['$routeProvider','$httpProvider','$locationProvider',function($routeProvider,$httpProvider,$locationProvider) {
    $routeProvider
        .when('/', {
            title: '主页',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        }).when('/productList', {
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
        }).when('/news/:id/:is',{
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
            title:'查看订单详情',
            templateUrl:'views/xiangqing.html',
            controller:'ViewDetailsCtrl'
        }).when('/groupMain',{
            title:'圈子主页',
            templateUrl:'views/groupMain.html',
            controller:'GroupMainCtrl'
        }).when('/groupDetail/:groupId',{
            title:'圈子详情',
            templateUrl:'views/groupDetail.html',
            controller:'GroupDetailCtrl'
        }).when('/createGroup',{
            title:'新建圈子',
            templateUrl:'views/createGroup.html',
            controller:'CreateGroupCtrl'
        }).when('/manageGroup/:groupId',{
            title:'管理圈子',
            templateUrl:'views/manageGroup.html',
            controller:'ManageGroupCtrl'
        }).when('/group/:groupId/topic/:topicId',{
            title:'话题详情',
            templateUrl:'views/groupTopicDetail.html',
            controller:'GroupTopicDetailCtrl'
        }).when('/group/:groupId/topic/:topicId/edit',{
            title:'编辑话题',
            templateUrl:'views/editGroupTopic.html',
            controller:'EditGroupTopicCtrl'
        }).when('/messages',{
            title:'消息主页',
            templateUrl:'views/messageMain.html',
            controller:'MessageMainCtrl'
        }).when('/messages/:id',{
            title:'消息详情',
            templateUrl:'views/messageDetail.html',
            controller:'MessageDetailCtrl'
        }).when('/releaseProduct',{
            title:'发布产品',
            templateUrl:'views/releaseProduct.html',
            controller:'ReleaseProductCtrl'
        }).when('/previewProductDetail',{
            title:'预览产品详情',
            templateUrl:'views/previewProductDetail.html',
            controller:'PreviewProductDetailCtrl'
        }).when('/releaseNews',{
            title:'发布新闻',
            templateUrl:'views/releaseNews.html',
            controller:'ReleaseNewCtrl'
        }).when('/editNews/:editNewsId',{
            title:'编辑新闻',
            templateUrl:'views/editNews.html',
            controller:'EditNewsCtrl'
        }).when('/adver',{
            title:'广告',
            templateUrl:'views/advertising.html',
            controller:'AdverCtrl'
        }).otherwise({
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






