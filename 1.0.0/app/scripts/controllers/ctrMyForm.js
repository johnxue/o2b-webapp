/**
 * Created by Administrator on 2014/9/11.
 */
var MyFormControllers = angular.module('MyFormControllers',[]);

MyFormControllers.controller('MyFormCtrl',function($scope,$compile,CommonService){

    var uriData = '';
    var nowPage = 0;  //当前页
    var pageNum = 1;  //每页显示条数
    var empty = true;    //是否清空数据  true是||false否
    var contentTab = ""; //Html Table_ID

    var oid = '';
    var orderNo = '';
    var pcode = '';
    var pname = '';

                 /******************************  加载运行 *************************/
    ctrInit();

     /*************************************************  页面交互事件  ********************************************/
     //下拉框
    $scope.$watch('seleDataTime', function(onVal) {
        if(onVal == null){
            CommonService.getAll('order/attribute', uriData, function (data) {   //下拉框填充数据
                $scope.selectTime = data.period;
                $scope.seleDataTime = data.period[0]; //设置默认值
            });
        }else{  //根据选项查询获取相应数据
            uriData = "s=period&v="+onVal[1]+"&r="+pageNum+"&o=";
            contentTab = "content1";
            $scope.tabClear();
            $scope.switchTab();
        }
    });

    //所有
    $scope.formAll = function(){
        uriData = "s=period&v=ALL&r="+pageNum+"&o=";
        contentTab = "content1";
        $scope.tabClear();
        $scope.switchTab();
    }

    //未付款
    $scope.order = function(){
        uriData = "s=status&v=110&r="+pageNum+"&o=";
        contentTab = "content2";
        $scope.tabClear();
        $scope.switchTab();
    }

    //待发货
    $scope.waitShipped = function(){
        uriData = "s=status&v=130&r="+pageNum+"&o=";
        contentTab = "content3";
        $scope.tabClear();
        $scope.switchTab();
    }

    //已发货
    $scope.shipped = function(){
        uriData = "s=status&v=210&r="+pageNum+"&o=";
        contentTab = "content4";
        $scope.tabClear();
        $scope.switchTab();
    }

    //退货
    $scope.return = function(rou){
        uriData = "s=status&v=310";
        CommonService.getAll('order', uriData, function (data) {
            $scope.sendHtml("content5",data);
        });
    }

    $scope.returnGoods = function(datas){
        alert(datas);
     /*   oid =
        orderNo =
        pcode =
        pname =*/
    }

    //重置
    $scope.tabClear = function(){
        nowPage = 0;
        empty = true;
    }

    //模糊查询
    $scope.seleBtn = function(){
        var seleCon = $scope.seleVal;  //获取输入内容
        uriData = "q="+seleCon+"&r="+pageNum+"&o=";
        $scope.tabClear();
        $scope.switchTab();
    }

    //查看更多
    $scope.Page = function(){
        nowPage = nowPage+1
        empty = false;
        $scope.switchTab();
    }

    //切换选项卡查询
    $scope.switchTab = function(){
        CommonService.getAll('order', uriData+nowPage, function (data) {
            $scope.sendHtml(contentTab ,data);
        });
    }

    //删除事件
    $scope.deleGoods = function(delNum,Status){
        //判断是否交易成功||交易关闭||已退款  否不可删
       if(Status=="910"||Status=="920"||Status=="930"){
           var delObj = new Object();
           delObj.ids = delNum;
           uriData = JSON.stringify(delObj);  //删除ids为JSON格式
           CommonService.deleteOne('o2b/v1.0.0/order/returns', uriData, function (data) { });
        }else{
           alert("当前状态不可删除!");
       }
    }

    //确认退货
    $scope.conReturn = function(goods){
        var goodsType = goods.Type;    //退货类型
        var goodsNum = goods.Number;       //退货数量
        var goodsDescribe = goods.Describe;   //问题描述

        var objGoods = Object();
        objGoods.number = goodsNum;     //退货数量
        objGoods.mode = goodsType;   //类型
        objGoods.description = goodsDescribe;    //产品缺陷说明
        objGoods.oid = oid;    //订单ID
        objGoods.orderNo = orderNo;    //订单号
        objGoods.pcode = pcode;  //产品编码
        objGoods.pname = pname;  //产品名称
        objGoods.imgProblem = "123";     //上传图片

        alert(goodsType+"@"+goodsNum+"@"+goodsDescribe);
     /*   var goodsPicUrl = ;     //图片路径
        CommonService.createOne('o2b/v1.0.0/order/returns', uriData, function (data) {

        });*/
    }

    //添加数据到页面
    $scope.sendHtml = function(cid,data){
        if(empty){  //是否清空数据
            $("#"+cid+" tr:gt(0)").remove();
            $("#Prompt").html(null);
        }
        if(data.OrderList.length==0){      //判断是否有记录
            $("#Prompt").html("<div class='row'><div class='container'><div class='col-md-12'><div class='alert with-icon mp10'>" +
                "<i class='icon-info-sign'></i><div class='content'>没有符合条件的订单记录。</div></div></div></div></div>");
        }else{
            for(var i=0;i<data.OrderList.length;i++){
                var num = data.OrderList;
                var Status = data.OrderList[i][0][8]; //交易状态
                var recordId = data.OrderList[i][0][0]; //记录ID
                var HTML = "<tr><td><img src='images/products/"+data.OrderList[i][1][0]+"' class='prdouctimg ml10 mr10'/><img src='images/products/"+data.OrderList[i][1][1]+"' class='prdouctimg ml10 mr10'/><img src='images/products/"+data.OrderList[i][1][2]+"' class='prdouctimg ml10 mr10'/></td>"+
                "<td>"+data.OrderList[i][0][3]+"</td><td><strong>"+data.OrderList[i][0][4]+"</strong></td><td><strong class='blue'>￥"+data.OrderList[i][0][5]+"</strong></td><td><a class='label label-info'>"+data.OrderList[i][0][7]+"</a></td><td><p class='ha20'>"+data.OrderList[i][0][2].substring(0,10)+"</p><p class='ha20'>"+data.OrderList[i][0][2].substring(11,19)+" </p></td>"+
                "<td><p class='ha20'><a href='#/viewDetails/"+data.OrderList[i][0][0]+"'>详情</a></p><p class='ha20'><a data-toggle='modal' data-ng-click='deleGoods("+recordId+","+Status+")'>删除</a></p><p class='ha20'><a data-toggle='modal' data-ng-click='vm.activeTab = 5;returnGoods()'>退货</a></p></td></tr>";
                var cHTML=$compile(HTML)($scope);  //编译
                $("#"+cid+" tr:eq(0)").after(cHTML);  //添加至页面
            }
        }
    }

});
