'use strict';

/**
 *
 *  @模块名称: Common Services
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *  
 */

var CommonServices = angular.module('CommonServices', []);
//定义通用服务：CommonService
CommonServices.factory('CommonService', ['$http', function ($http) {

    //var baseUrl='http://192.168.1.110:8081/o2b/v1.0.0/';
	var baseUrl = 'https://192.168.1.210/o2b/v1.0.0/';

    //定义通用服务CommonService提供的方法
    return {
        
		//1.Get all obj
        getAll: function (uri,data,funSuccess,funError) {
            if(data!=undefined){
            return $http({
                method: "GET",
                headers:{'Authorization':cookieOperate.getCookie('token')},
                url: baseUrl+uri+'?'+data
            }).success(funSuccess).error(funError);
            }else{
                return $http({
                    method: "GET",
                    headers:{'Authorization':cookieOperate.getCookie('token')},
                    url: baseUrl+uri
                }).success(funSuccess).error(funError);
            }
        },

        //2.Get one obj
        getOne: function (uri,data,funSuccess,funError) {
            if(data!=undefined){
            return $http({
                method: "GET",
                headers:{'Authorization':cookieOperate.getCookie('token')},
                url: baseUrl+uri+'?'+data
            }).success(funSuccess).error(funError);
            }else{
                return $http({
                    method: "GET",
                    headers:{'Authorization':cookieOperate.getCookie('token')},
                    url: baseUrl+uri
                }).success(funSuccess).error(funError);
            }
        },

        //3.Update one obj
        updateOne: function (uri,data,funSuccess,funError) {

            return $http({
                method: "PUT",
                url: baseUrl + uri,
                headers: {'Authorization': cookieOperate.getCookie('token')},
                data: data    /*从页面提交的数据，保存在http data域*/
            }).success(funSuccess).error(funError);
        },
        //4.Update part of one obj
        updatePartOne: function (uri,data,funSuccess,funError) {

            return $http({
                method: "patch",
                url: baseUrl + uri,
                headers: {'Authorization': cookieOperate.getCookie('token')},
                data: data    /*从页面提交的数据，保存在http data域*/
            }).success(funSuccess).error(funError);
        },

        //5.Delete one
        deleteOne: function (uri,data,funSuccess,funError) {
            if(data!=undefined){
            return $http({
                method: "DELETE",
                headers:{'Authorization':cookieOperate.getCookie('token')},
                url: baseUrl+uri,
                data:data
            }).success(funSuccess).error(funError);
            }else{
                return $http({
                    method: "DELETE",
                    headers:{'Authorization':cookieOperate.getCookie('token')},
                    url: baseUrl+uri
                }).success(funSuccess).error(funError);
            }
        },

        //6.Add new one
        createOne: function (uri, data,funSuccess,funError) {
            return $http({
                method: "POST",
                headers:{'Authorization':cookieOperate.getCookie('token')},
                url: baseUrl+uri,
                data: data        /*从页面提交的数据，保存在http data域*/
            }).success(funSuccess).error(funError);
        }
    };
}
]);


