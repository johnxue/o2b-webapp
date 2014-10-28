'use strict';

// 生成16位随机key
var randomKey = function (length) {
    //var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789`=//[];',./~!@#$%^&*()_+|{}:<>?";
    var chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ0123456789";

    var s = "";

    for (var i = 0; i < length; i++) {
        s += chars.charAt(Math.ceil(Math.random() * 1000) % chars.length);
    }
    return s;
};


//取得Request参数
var Request = {
    get: function (paras) {
        var url = location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {};
        var i, j;
        for (var i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    }
};

//字符串补零
var ZeroPadding = {
    left: function (str, length) {
        if (str.length >= length)
            return str;
        else
            return ZeroPadding.left("0" + str, length);
    },
    right: function (str, length) {
        if (str.length >= length)
            return str;
        else
            return ZeroPadding.right(str + "0", length);
    }
};


//获得URL相关
var URL = {
    getAll: function () {
        return window.location.href;
    },
    getProtocol: function () {
        return window.location.protocol;

    },
    getHost: function () {
        return window.location.host;
    },
    getPort: function () {
        return window.location.port;
    },
    getPathName: function () {
        return window.location.pathname;
    },
    getSearch: function () {
        return window.location.search
    },
    getHash: function () {
        return window.location.hash;
    }

};


//本地数据存储
var localDataStorage = {
    setItem: function (key, value) {
        localStorage.setItem(key, value);
    },
    getItem: function (key) {
        return localStorage.getItem(key);
    },
    removeItem: function (key) {
        return localStorage.removeItem(key);
    },
    clearItem: function () {
        localStorage.clear();
    }
};

//cookie操作
var cookieOperate = {
    setCookie: function (name, value) {
        document.cookie = name + "=" + escape(value) + ";";
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg))

            return (arr[2]);
        else
            return null;
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = cookieOperate.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }
};

//error处理
function errorOperate(response) {
   var errorCode=response.code;
    if(errorCode=='602'){
        $('#denglu').show();
    }else if(errorCode=='603'){
        alert('无法识别的用户名或密码!');
        $('#denglu').show();
    }
}

//controller init
function ctrInit(){
    //隐藏广告栏
    $('#banner').hide();
    //去除滚动条事件
    if(URL.getAll().match('/#/productDetail')==null){
          $(window).unbind('scroll');
    }
}

//check sql injection
function checkSqlInjection(inputStr){
    var resultStr = inputStr.toLowerCase();
    var alertStr = "";

    var vFit = "'|and|exec|insert|select|delete|update|count|*|%|chr|mid|master|truncate|char|declare|; |or|-|+|,";
    var vFitter = vFit.split("|");
    var vFitterLen = vFitter.length;
    for(var vi=0; vi<vFitterLen; vi++){
        if(resultStr.indexOf(vFitter[vi]) >= 0){
            alertStr += vFitter[vi] + " ";
        }
    }
    if(alertStr == ""){
        return true;
    }else{
        console.info("输入中不能包含如下字符：" + alertStr);
        return false;
    }
}

