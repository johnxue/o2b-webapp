'use strict';

/* Filters */
/*自定义过滤器*/

var ProductFilters = angular.module('ProductFilters',[]);

/*将输入的时间字符串与当前时间做对比，显示是否开始多长时间*/
ProductFilters.filter('datemark', function() {
    return function(input) {

        var  startOrEnd ='';
        /* 处理字符串*/
        input = input.replace(/-/g,"/");
        /* 将字符串转换为Date*/
        var date = new Date(input);

        var sysDate = new Date();

        var dateDiff = date-sysDate;

        if(dateDiff>=0){
            var days = parseInt(dateDiff / (1000 * 60 * 60 * 24));
            var hours =  parseInt(dateDiff %(1000 * 60 * 60 * 24)/(1000 * 60 * 60));
            startOrEnd= days+'天'+hours+'小时后结束';
        }else if(dateDiff<0){
            startOrEnd ='';
        }

        return startOrEnd;
        }
});

/*如果输入字符串的长度超过46 截断到46后加'...'*/
ProductFilters.filter('longmark', function() {
    return function(input) {
        if(input.length>46){
            input=input.substring(0,46)+'...';
        }
        return input;
    }
});

/*如果输入字符串为null 将把它变成'无'*/
ProductFilters.filter('nullmark', function() {
    return function(input) {
        if(input==null){
            input='无';
        }
        return input;
    }
});

/*将字符串转换成HTML*/
ProductFilters.filter('to_trusted',['$sce',function($sce){

    return function(input){
        input = input[1];
        input= $sce.trustAsHtml(input);
        return input;
    }
}]);

ProductFilters.filter('detailDateMark',function(){

    return function(input){
        var startTime =input.substring(0,input.indexOf('&'));
        startTime = startTime.replace(/-/g,"/");
        startTime = new Date(startTime);
       var endTime = input.substring(input.indexOf('&')+1);
        endTime = endTime.replace(/-/g,"/");
        endTime = new Date(endTime);
       var currentTime =new Date();
        var year ='';
        var month='';
        var date = '';
        var hours='';
        if(currentTime<startTime){
             year =  startTime.getFullYear();
             month =startTime.getMonth()+1;
             date = startTime.getDate();
             hours = startTime.getHours();
            input=year+'年'+month+'月'+date+'日'+hours+'点开始';
        }else if(currentTime<endTime){
             year =  endTime.getFullYear();
             month =endTime.getMonth()+1;
            date = endTime.getDate();
             hours = endTime.getHours();
            input=year+'年'+month+'月'+date+'日'+hours+'点结束';
        }else if(currentTime>endTime){
             year =  endTime.getFullYear();
             month =endTime.getMonth()+1;
            date = endTime.getDate();
             hours = endTime.getHours();
            input=year+'年'+month+'月'+date+'日'+hours+'点预订结束';
        }
        return input;
    }
});

