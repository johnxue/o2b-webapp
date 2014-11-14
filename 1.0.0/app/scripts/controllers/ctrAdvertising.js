/*定义 Controller: MyFormCtrl  （我的订单页面 dingdan.html）*/

var AdverControllers = angular.module('AdverControllers',[]);

AdverControllers.controller('AdverCtrl',function($scope,CommonService,$compile){

    var uriData = "";
    var listNowPage = 0;     //广告当前页
    var exNowPage = 0;      //审核当前页
    var caNowPage = 0;     //取消展示当前页
    var pageNum = 5;      //每页显示条数

    /******************************   加载运行   ***********************************/
     ctrInit();  //广告
     $("#adSele").hide();  //隐藏搜索内容

    //初始化分页器样式
    $scope.$on('ngRepeatFinished', function () {
        //广告分页
        angular.element('.adlPageLis').removeClass('active');
        angular.element('#adlPageLi0').addClass('active');
        //审核分页
        angular.element('.exPageLis').removeClass('active');
        angular.element('#exPageLi0').addClass('active');
        //取消展示分页
        angular.element('.caPageLis').removeClass('active');
        angular.element('#caPageLi0').addClass('active');
    });

    /*****************************  页面交互事件  ***********************************/

    //获取广告列表
    $scope.getAdverList = function(){
        uriData = "r="+pageNum+"&o="+listNowPage;
        CommonService.getAll("adSense", uriData, function (data) {
            $scope.adListPageNumbers = _produceBurster(listNowPage,pageNum,data.count,5,$scope);

            $scope.addAverManger(data);
        },function(response){
            if(response.message=="没有找到数据"){
                alert("无数据！");
            }
        })
    }
    $scope.getAdverList();

    //获取广告相关代码对照表
    $scope.conTable = function(){
        uriData = null;
        CommonService.getAll("adSense/attribute", uriData, function (data) {
            $scope.adLayViewName = data.Layout;
            $scope.adChaViewName = data.Channel;
            $scope.advLayout=data.Layout[0];    //设置下拉默认字段
            $scope.Channel=data.Channel[0];
        })
    }

    //获取广告审核
    $scope.getAdverExa = function(){
        uriData = "st=WAIT&r="+pageNum+"&o="+exNowPage;
        CommonService.getAll("adSense", uriData, function (data) {
            $scope.adExPageNumbers = _produceBurster(exNowPage,pageNum,data.count,5,$scope);
            $scope.addAverExam(data);
        })
    }

    //获取取消展示列表
    $scope.getCancelShow = function(){
        uriData = "st=STOP&r="+pageNum+"&o="+caNowPage;
        CommonService.getAll("adSense", uriData, function (data) {
            $scope.adCaPageNumbers = _produceBurster(caNowPage,pageNum,data.count,5,$scope);
            $scope.adCancelShow(data);
        })
    }

    //查询
    $scope.adverSele = function(adSele){
        CommonService.getAll("adSense", "q="+adSele.seleCond, function (data) {
            $scope.adSeleContent = data.list;
            $scope.conTable();
            $("#adSele").show();
        },function(response){
            if(response.message=="没有找到数据"){
                alert("无数据！");
            }
        })
    }

    //清空查询
    $scope.adSeleClick = function(){
        $scope.adSeleContent = null;
        $scope.adList.seleCond = "";
        $("#adSele").hide();
    }

     //广告撤销
    $scope.adOperation =  function(adOperId){
        var oData = Object();
        oData.st = "STOP";
        oData.cm = "123";
        var operData = JSON.stringify(oData);
        if(confirm("确定执行该操作吗？")){
            CommonService.updatePartOne('adSense/'+adOperId, operData, function (data) {
                $scope.getAdverList();
            })
        }
    }

    //广告删除
    $scope.adDel = function(adId,refresh){
        uriData = null;
        if(confirm("确定删除吗？")){
            CommonService.deleteOne('adSense/'+adId, uriData, function (data) {
                if(refresh == "1"){
                    $scope.getAdverExa();
                }else if(refresh == "2"){
                    $scope.getAdverList();
                }
            });
        }
    }

    //给于通过
    $scope.adThrough = function(thId,thRefre){
        var oData = Object();
        oData.st = "OK";
        oData.cm = "123";
        var thData = JSON.stringify(oData);
        if(confirm("确定执行该操作吗？")){
            CommonService.updatePartOne('adSense/'+thId, thData, function (data) {
                if(thRefre == "1"){
                    $scope.getAdverExa();
                }else if(thRefre == "2"){
                    $scope.getCancelShow();
                }
            })
        }
    }

    //不予通过
    $scope.adNoThrough = function(nthId){
        var oData = Object();
        oData.st = "NOOK";
        oData.cm = "123";
        var nthData = JSON.stringify(oData);
        if(confirm("确定执行该操作吗？")){
            CommonService.updatePartOne('adSense/'+nthId, nthData, function (data) {
                $scope.getAdverExa();
            })
        }
    }

    //加入
    $scope.addAverApply = function(){
        //取消禁用状态
       /* document.getElementById('Channel').disabled=0;
        document.getElementById('level').disabled=0;
        document.getElementById('advLayout').disabled=0;
        document.getElementById('original').disabled=0;*/
        alert("提交");
    }

    //预览
    $scope.adPreview = function(preview){
        alert("预览"+preview.Channel);

    }


    /******************************   调用方法   ***********************************/

    //广告列表
    $scope.addAverManger = function(data){
        var mHtml;
        $("#averList tr:gt(0)").remove();
        for(var i=0;i<data.list.length;i++){
            mHtml = "<tr><td><span class='ml15'><img src='images/quanzibg.jpg' class='prdouctimg'/></span></td><td width='180px;'><p class='ha20' style='margin-top:7px;'><a href='' class='blue'>"+ data.list[i][2] +"</a></p></td>" +
                    "<td>"+ data.list[i][9] +"</td><td>"+ data.list[i][10] +"级</td><td>"+ data.list[i][11] +"</td><td><span class='blue'>第"+ data.list[i][12] +"张</span></td><td><p class='ha20' style='margin-top:7px;'>" +data.list[i][5].substring(0,10)+ "<br/>" +data.list[i][5].substring(11,19)+ "</p></td><td><p class='ha20' style='margin-top:7px;'>" +data.list[i][6].substring(0,10)+ "<br/>"+data.list[i][6].substring(11,19)+"</p></td>" +
                    "<td><a href='' data-toggle='modal' class='blue' title='取消展示' data-ng-click='adOperation(" +data.list[i][0]+ ")'><i class='icon-undo'></i></a><span class='ml10'><a href='' data-toggle='modal' class='blue' title='删除' data-ng-click='adDel(" +data.list[i][0]+ ","+2+")'><i class='icon-trash'></i></a></span></td></tr>";
            var manEHtml=$compile(mHtml)($scope);  //编译
            $("#averList tr:eq(0)").after(manEHtml);
        }
        //设置分页器样式
        angular.element('.adlPageLis').removeClass('active');
        angular.element('#adlPageLi'+listNowPage+'').addClass('active');
    }

    //广告审核列表
    $scope.addAverExam = function(data){
        var eHtml;
        $("#exAdverList tr:gt(0)").remove();
        for(var i=0;i<data.list.length;i++){
            eHtml = "<tr><td><span class='ml15'><img src='images/quanzibg.jpg' class='prdouctimg' /></span></td><td width='180px;'><p class='ha20' style='margin-top:7px;'><a href='' class='blue'>" +data.list[i][2]+ "</a></p></td>" +
                    "<td>" +data.list[i][9]+ "</td><td>" +data.list[i][10]+ "</td><td>" +data.list[i][11]+ "</td><td><span class='blue'>" +data.list[i][12]+ "张</span></td><td>" +data.list[i][5]+ "</td>" +
                    "<td>" +data.list[i][6]+ "</td><td><a class='blue' title='通过展示' data-ng-click='adThrough(" +data.list[i][0]+ ","+1+")'><i class='icon-ok'></i></a><a class='blue ml10' href='' title='不予通过' data-ng-click='adNoThrough(" +data.list[i][0]+ ")'><i class='icon-ban-circle'></i></a> <span class='ml10'><a class='blue' title='删除' data-ng-click='adDel(" +data.list[i][0]+ ","+1+")'><i class='icon-trash'></i></a></span></td></tr>";
        var comEHtml=$compile(eHtml)($scope);  //编译
        $("#exAdverList tr:eq(0)").after(comEHtml);
        }
        //设置分页器样式
        angular.element('.exPageLis').removeClass('active');
        angular.element('#exPageLi'+exNowPage+'').addClass('active');
    }

    //取消展示
    $scope.adCancelShow = function(data){
        var cHtml;
        $("#cancelShow tr:gt(0)").remove();
        for(var i=0;i<data.list.length;i++){
            eHtml = "<tr><td><span class='ml15'><img src='images/quanzibg.jpg' class='prdouctimg' /></span></td><td width='180px;'><p class='ha20' style='margin-top:7px;'><a href='' class='blue'>" +data.list[i][2]+ "</a></p></td>" +
                "<td>" +data.list[i][9]+ "</td><td>" +data.list[i][10]+ "</td><td>" +data.list[i][11]+ "</td><td><span class='blue'>" +data.list[i][12]+ "张</span></td><td>" +data.list[i][5]+ "</td>" +
                "<td>" +data.list[i][6]+ "</td><td><a class='blue' title='展示' data-ng-click='adThrough(" +data.list[i][0]+ ","+2+")'><i class='icon-ok'></i></a><span class='ml10'><a class='blue' title='删除' data-ng-click='adDel(" +data.list[i][0]+ ","+1+")'><i class='icon-trash'></i></a></span></td></tr>";
            var comEHtml=$compile(eHtml)($scope);  //编译
            $("#cancelShow tr:eq(0)").after(comEHtml);
        }
        //设置分页器样式
        angular.element('.caPageLis').removeClass('active');
        angular.element('#caPageLi'+exNowPage+'').addClass('active');
    }

    /******************************   调用方法   ***********************************/
    //跳转页
    $scope.adverPage = function(viewName,page){
        if(viewName == "adverList"){
            listNowPage = page;
            $scope.getAdverList();
        }else if(viewName == "adverExList"){
            exNowPage = page;
            $scope.getAdverExa();
        }
    }

    //下一页
    $scope.adlAddPage = function(viewName){
        if(viewName == "adverList"){
            listNowPage = ++listNowPage;
            $scope.getAdverList();
        }else if(viewName == "adverExList"){
            exNowPage == ++exNowPage;
            $scope.getAdverExa();
        }
    }

    //上一页
    $scope.adlRedPage = function(viewName){
        if(viewName == "adverList"){
            listNowPage = --listNowPage;
            $scope.getAdverList();
        }else if(viewName == "adverExList"){
            exNowPage = --exNowPage;
            $scope.getAdverExa();
        }
    }

})
