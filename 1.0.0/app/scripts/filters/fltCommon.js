'use strict';

/* Filters */
/*自定义过滤器*/

var CommonFilters = angular.module('CommonFilters',[]);

/*将输入的时间字符串与当前时间做对比，显示是否开始多长时间*/
CommonFilters.filter('datemark', function() {
    return function(input) {

        var  startOrEnd ='';

        var startTime =input.substring(0,input.indexOf('&'));
        startTime = startTime.replace(/-/g,"/");
        startTime = new Date(startTime);
        var endTime = input.substring(input.indexOf('&')+1);
        endTime = endTime.replace(/-/g,"/");
        endTime = new Date(endTime);

        var sysDate = new Date();

        if((startTime-sysDate)>=0){
            var days = parseInt((endTime-sysDate) / (1000 * 60 * 60 * 24));
            var hours =  parseInt((endTime-sysDate) %(1000 * 60 * 60 * 24)/(1000 * 60 * 60));
            startOrEnd= days+'天'+hours+'小时后结束';
        }else if((startTime-sysDate)<0){
            startOrEnd ='';
        }
        return startOrEnd;
        }
});

/*如果输入字符串的长度超过46 截断到46后加'...'*/
CommonFilters.filter('longMarkDynamic', function() {
    return function(input,long) {
        if(input.length>long){
            input=input.substring(0,long)+'...';
        }
        return input;
    }
});

/*如果输入字符串的长度超过46 截断到46后加'...'*/
CommonFilters.filter('longmark', function() {
    return function(input) {
        if(input.length>46){
            input=input.substring(0,46)+'...';
        }
        return input;
    }
});

/*将字符串转换成HTML(多个)*/
CommonFilters.filter('to_trusted',['$sce',function($sce){

    return function(input){
        input = input[1];
        input= $sce.trustAsHtml(input);
        return input;
    }
}]);

/*将字符串转换成HTML(单个)*/
CommonFilters.filter('to_trusted_single',['$sce',function($sce){

    return function(input){
        input= $sce.trustAsHtml(input);
        return input;
    }
}]);

CommonFilters.filter('detailDateMark',function(){

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

/*将null转换成0*/
CommonFilters.filter('nullToZero',function(){

    return function(input){
       if(input==null){
           input=0;
       }
        return input;
    }
});

/*格式化时间,只显示年月日*/
CommonFilters.filter('showYMD',function(){

    return function(input){
        if(input!=undefined){
        var dateTime = new Date(input.replace(/-/g,"/")).format('yyyy-MM-dd');
        return dateTime;
        }
    }
});

/*格式化时间,根据当前时间(零点)判断是否为今天、昨天、前天,若不是,则直接显示时间(年月日)*/
CommonFilters.filter('showTime',function(){

    return function(input){
        if(input!=undefined){
            var dateTime = new Date(input.replace(/-/g,"/"));
            var sysTime = new Date();
            var sysDate = new Date(sysTime.getFullYear(),sysTime.getMonth(),sysTime.getDate());
            var yesterdayDate=new Date(sysTime.getFullYear(),sysTime.getMonth(),sysTime.getDate()-1);
            var tDBYesterdayDate=new Date(sysTime.getFullYear(),sysTime.getMonth(),sysTime.getDate()-2);
           if(dateTime>=sysDate){
                return '今天';
           }else if(dateTime>=yesterdayDate){
               return '昨天';
           }else if(dateTime>=tDBYesterdayDate){
               return '前天';
           }
            return dateTime.format('yyyy年MM月dd日');
        }
    }
});

