/*定义 Controller: MyFormCtrl  （我的订单页面 dingdan.html）*/

var AdverControllers = angular.module('AdverControllers',[]);

AdverControllers.controller('AdverCtrl',function($scope,CommonService,$compile){

    var uriData = "";
    var sMenu = "";
    var sorting = "asc";    //排序
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
        uriData = "s="+sMenu+"&v="+sorting+"&r="+pageNum+"&o="+listNowPage;
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
            $scope.adMode = data.Mode;
            $scope.adType = data.Mode[0];  //设置下拉默认字段
            $scope.advLayout=data.Layout[0];
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
        },function(response){
            if(response.message=="没有找到数据"){
                alert("无数据！");
            }
        })
    }

   //排序切换
    var sorP = true;
    $scope.adverSor = function(menu,num){
        var sorIc;
        sMenu = menu;
        if(sorP){
            sorP = false;
            sorIc = "<i class='icon-caret-up'>"
            sorting = "asc";
        }else{
            sorP = true;
            sorIc = "<i class='icon-sort-down'>";
            sorting = "desc";
        }
        if(num == 1){
            $("#adIcon").html(sorIc);
        }else if(num == 2){
            $("#adIcons").html(sorIc);
        }
        $scope.getAdverList();
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

    //提交
    var adConJson = Object();
    $scope.addAverApply = function(subAdver,adNan){
       if(adNan == 0){
           adConJson.pid = JSON.stringify(subAdver[1]);
           adConJson.c = subAdver.Channel[1];
           adConJson.n = subAdver.adLevelAd;
           adConJson.l = subAdver.advLayout[1];
           adConJson.o = subAdver.original;
           adConJson.s = subAdver.adStartTime;
           adConJson.e = subAdver.adEndTime;
       }if(adNan == 1){
            adConJson.cn = subAdver.author;
            adConJson.m = subAdver.adType[1];
        }
        var subData = JSON.stringify(adConJson);
        if(subAdver.author != null && subAdver.adType[1] != null){
            if(confirm("确定提交吗？")){
                  CommonService.createOne('adSense', subData, function (data) {
                      adConJson = Object();
                 })
            }
        }
    }

    var pImg;
    //切换大小图按钮
    $scope.adSeleChange = function(position){
        pImg = position;
        var pHtml;
        if(position.advLayout[1] == "T00"){
            pHtml = "<a class='label label-info' data-toggle='modal' data-target='#previewA' ng-click='adPreview(1,"+position.original+")'>预览</a>";
        }else if(position.advLayout[1] == "C00"){
            pHtml = "<a class='label label-info' data-toggle='modal' data-target='#previewB' ng-click='adPreview(2,"+position.original+")'>预览</a>";
        }else{
            alert("开发中...");
            pHtml = "";
        }
        var pileAdver=$compile(pHtml)($scope);  //编译
        $("#operate"+position[0]).html(pileAdver);
    }

    //填充级别
    $scope.asGetLevel = function(leve){
        document.getElementById("levelad").options.length = 0;
        document.getElementById("levelad").options.add(new Option("请选择"));
        for(var i=1;i<=leve.Channel[2];i++){
            document.getElementById("levelad").options.add(new Option(i));
        }
    }

    //预览 大小图  图片位置
    $scope.adPreview = function(imgSize,picNum){
        var lPic;
        if(picNum == null){   //默认位置为1
            picNum = 1;
        }
        if(imgSize == 1){   //大图
            if(pImg[4] != null){
                if(picNum == 1){
                    lPic = "<div class='item active'><img src='http://192.168.1.210"+pImg[4]+"' class='bannerimg' style='height: 450px; width: 100%; background-position: center center;background-repeat: no-repeat; margin-top: -20px; cursor: pointer;'/></div>"+
                           "<div class='item'> <img src='images/big2.jpg' class='bannerimg' style='height: 450px; width: 100%; background-position: center center;background-repeat: no-repeat; margin-top: -20px; cursor: pointer;'/></div>"+
                           "<div class='item'> <img src='images/big3.png' class='bannerimg' style='height: 450px; width: 100%; background-position: center center;background-repeat: no-repeat; margin-top: -20px; cursor: pointer;'/></div>"
                }else if(picNum == 2){
                    lPic = "<div class='item active'><img src='images/big1.png' class='bannerimg' style='height: 450px; width: 100%; background-position: center center;background-repeat: no-repeat; margin-top: -20px; cursor: pointer;'/></div>"+
                           "<div class='item'> <img src='http://192.168.1.210"+pImg[4]+"' class='bannerimg' style='height: 450px; width: 100%; background-position: center center;background-repeat: no-repeat; margin-top: -20px; cursor: pointer;'/></div>"+
                           "<div class='item'> <img src='images/big3.png' class='bannerimg' style='height: 450px; width: 100%; background-position: center center;background-repeat: no-repeat; margin-top: -20px; cursor: pointer;'/></div>";
                }else if(picNum == 3){

                    lPic = "<div class='item active'><img src='images/big1.png' class='bannerimg' style='height: 450px; width: 100%; background-position: center center;background-repeat: no-repeat; margin-top: -20px; cursor: pointer;'/></div>"+
                           "<div class='item'> <img src='images/big2.jpg' class='bannerimg' style='height: 450px; width: 100%; background-position: center center;background-repeat: no-repeat; margin-top: -20px; cursor: pointer;'/></div>"+
                           "<div class='item'> <img src='http://192.168.1.210"+pImg[4]+"' class='bannerimg' style='height: 450px; width: 100%; background-position: center center;background-repeat: no-repeat; margin-top: -20px; cursor: pointer;'/></div>"
                }
            }else{   //无图显示
                lPic = "<div class='alert with-icon mp20 marginb'> <i class='icon-info-sign'></i>"+
                       "<div class='content'>亲,目前没有广告产品预览。</div></div>";
            }
            $("#bigPic").html(lPic);
        }else if(imgSize == 2) {  //小图
            if (pImg[3] != null) {
                var endTime = timeDifference("D",pImg[5],pImg[6]);
                var mlPic = "<img alt='First slide' src='images/img3.jpg' class='fl'><div  class='itemtext'>" +
                "<p class='listb'><a href='###' class='card-heading'><span>Kids Grow豆芽宝贝成长计划1</span></a></p>" +
                "<p class='lrp10'>贝虎环境卫士是全球第一款真正的六合一智能PM2.5环境检测设备，它能够精确地检测</p>" +
                "<P class='listp'><span class='hui'>27天20小时后结束</span><span class='label label-info pull-right' >即将开始</span></P>" +
                "<div class='col-md-4 ha20'>¥58</div><div class='col-md-4 ha20'>12</div><div class='col-md-4 pull-right ha20'>108人</div>" +
                "<div class='col-md-4 ha20 hui'>累计金额</div><div class='col-md-4 ha20 hui'>话题</div><div class='col-md-4 pull-right ha20 hui'>关注</div></div>";

                lPic = "<img alt='First slide' src='http://192.168.1.210"+pImg[3]+"' class='fl'><div  class='itemtext'>" +
                    "<p class='listb'><a href='###' class='card-heading'><span>"+pImg[2]+"</span></a></p>" +
                    "<p class='lrp10'>"+pImg[18].substring(0,40)+"</p>" +
                    "<P class='listp'><span class='hui'>"+endTime+"天20小时后结束</span><span class='label label-info pull-right' >"+pImg[8]+"</span></P>" +
                    "<div class='col-md-4 ha20'>¥"+pImg[21]+"</div><div class='col-md-4 ha20'>"+pImg[19]+"</div><div class='col-md-4 pull-right ha20'>"+pImg[20]+"人</div>" +
                    "<div class='col-md-4 ha20 hui'>累计金额</div><div class='col-md-4 ha20 hui'>话题</div><div class='col-md-4 pull-right ha20 hui'>关注</div></div>";
                if(picNum == 1){
                    $("#small1").html(lPic);
                    $("#small2").html(mlPic);
                    $("#small3").html(mlPic);
                }
                if(picNum == 2){
                    $("#small1").html(mlPic);
                    $("#small2").html(lPic);
                    $("#small3").html(mlPic);
                }
                if(picNum == 3){
                    $("#small1").html(mlPic);
                    $("#small2").html(mlPic);
                    $("#small3").html(lPic);
                }
            }else{
                lPic = "<div class='alert with-icon mp20 marginb'> <i class='icon-info-sign'></i>"+
                       "<div class='content'>亲,目前没有广告产品预览。</div></div>";
                $("#small1").html(lPic);
                $("#small2").html(lPic);
                $("#small3").html(lPic);
            }
        }
    }

    /******************************   调用方法   ***********************************/

    //广告列表
    $scope.addAverManger = function(data){
        var mHtml;
        $("#averList tr:gt(0)").remove();
        for(var i=0;i<data.list.length;i++){
            mHtml = "<tr><td><span class='ml15'><img src='https://192.168.1.210"+data.list[i][4]+"' class='prdouctimg'/></span></td><td width='180px;'><p class='ha20' style='margin-top:7px;'><a href='' class='blue'>"+ data.list[i][2] +"</a></p></td>" +
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
            eHtml = "<tr><td><span class='ml15'><img src='https://192.168.1.210"+data.list[i][4]+"' class='prdouctimg' /></span></td><td width='180px;'><p class='ha20' style='margin-top:7px;'><a href='' class='blue'>" +data.list[i][2]+ "</a></p></td>" +
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
            eHtml = "<tr><td><span class='ml15'><img src='https://192.168.1.210"+data.list[i][4]+"' class='prdouctimg' /></span></td><td width='180px;'><p class='ha20' style='margin-top:7px;'><a href='' class='blue'>" +data.list[i][2]+ "</a></p></td>" +
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
    /**
     * 计算两日期时间差
     * interval 计算类型：D是按照天、H是按照小时、M是按照分钟、S是按照秒、T是按照毫秒
     * date1 起始日期  格式为年月格式 为2012-06-20
     * date2 结束日期
     */
    function timeDifference(interval, date1, date2) {
        var objInterval = {'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60, 'M': 1000 * 60, 'S': 1000, 'T': 1};
        interval = interval.toUpperCase();
        var dt1 = Date.parse(date1.replace(/-/g, "/"));
        var dt2 = Date.parse(date2.replace(/-/g, "/"));
        try {
            return ((dt2 - dt1) / objInterval[interval]).toFixed(0);//保留零位小数点
        } catch (e) {
            return e.message;
        }
    }

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
