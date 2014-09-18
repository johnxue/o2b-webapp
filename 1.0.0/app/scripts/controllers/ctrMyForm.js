/**
 * Created by Administrator on 2014/9/11.
 */
var MyFormControllers = angular.module('MyFormControllers',[]);

MyFormControllers.controller('MyFormCtrl',function($scope,$compile,CommonService){

    var uriData = '';
    var nowPage = 0;  //当前页

    //加载运行
    $scope.seleAllGoods = function(){   //获取数据
    uriData = undefined;
    CommonService.getAll('order?o='+nowPage+'&&r=10', uriData, function (data) {
     //   alert(data.OrderList[0][0][8]);
     /*   if(data.OrderList.length==0){      //判断是否有记录
            $("#Prompt").html("<div class='col-md-9'><div class='container'><div class='col-md-12'><div class='alert with-icon mp10'>" +
                               "<i class='icon-info-sign'></i><div class='content'>没有符合条件的订单记录。</div></div></div></div></div>");
        }else{
            for(var i=0;i<data.OrderList.length;i++){
                var dealStatus = data.OrderList[i][0][8]; //交易状态
                var delteNum = data.OrderList[i][0][0]; //删除记录ID
                var HTML = "<tr><td><img src='images/products/"+data.OrderList[i][1][0]+"' class='prdouctimg ml10 mr10'/><img src='images/prducttu.jpg"+data.OrderList[i][1][1]+"' class='prdouctimg ml10 mr10'/><img src='images/prducttu.jpg"+data.OrderList[i][1][2]+"' class='prdouctimg ml10 mr10'/></td>"+
                "<td>"+data.OrderList[i][0][3]+"</td><td><strong>"+data.OrderList[i][0][4]+"</strong></td><td><strong class='blue'>￥"+data.OrderList[i][0][5]+"</strong></td><td><a class='label label-info'>"+data.OrderList[i][0][7]+"</a></td><td><p class='ha20'>"+data.OrderList[i][0][2].substring(0,10)+"</p><p class='ha20'>"+data.OrderList[i][0][2].substring(11,19)+" </p></td>"+
                "<td><p class='ha20'><a href='javascript:void(0)'>详情</a></p><p class='ha20'><a data-toggle='modal' data-ng-click='deleGoods("+delteNum+","+dealStatus+")'>删除</a></p></td></tr>";
                var cHTML=$compile(HTML)($scope);  //编译
                $("table tr:eq(0)").after(cHTML);  //添加至页面
            }

        }*/
    });
    }
   // $scope.seleAllGoods();  //调用获取数据方法

    //页面交互事件
    //下拉时间段
    $scope.$watch('seleDataTime', function(onVal) {

        if(onVal == null){
            CommonService.getAll('order/attribute', uriData, function (data) {
                $scope.selectTime = data.period;
                $scope.seleDataTime = data.period[0]; //设置默认值
            });
        }else{  //根据选项查询获取相应数据
            uriData = "s=period&v="+onVal[1];
            CommonService.getAll('order', uriData, function (data) {
                $scope.sendHtml(data);
            });
        }
    });

    //查询
    $scope.seleBtn = function(){
        var seleCon = $scope.seleVal;  //获取输入内容
        if(seleCon == null){
           uriData = "q=ALL"
        }else{
            uriData = "q="+seleCon;
            CommonService.getAll('order', uriData, function (data) {
                $scope.sendHtml(data);
            });
        }
    }

    //查看更多
    $scope.Page = function(){
        nowPage = nowPage+1;
        $scope.seleAllGoods();
    }

    //删除事件
    $scope.deleGoods = function(delNum,Status){
        //判断是否交易成功||交易关闭||已退款  否不可删
       if(Status=="910"||Status=="920"||Status=="930"){
           var delObj = new Object();
           delObj.ids = delNum;
           uriData = JSON.stringify(delObj);  //删除ids为JSON格式
           CommonService.deleteOne('order', uriData, function (data) { });
        }else{
           alert("当前状态不可删除!");
       }
    }

    //添加数据到页面
    $scope.sendHtml = function(data){
        $("table tr:gt(0)").remove();  //清空数据
        $("#Prompt").html(null);
        if(data.OrderList.length==0){      //判断是否有记录
            $("#Prompt").html("<div class='col-md-9'><div class='container'><div class='col-md-12'><div class='alert with-icon mp10'>" +
                "<i class='icon-info-sign'></i><div class='content'>没有符合条件的订单记录。</div></div></div></div></div>");
        }else{
            for(var i=0;i<data.OrderList.length;i++){
                var dealStatus = data.OrderList[i][0][8]; //交易状态
                var delteNum = data.OrderList[i][0][0]; //删除记录ID
                var HTML = "<tr><td><img src='images/products/"+data.OrderList[i][1][0]+"' class='prdouctimg ml10 mr10'/><img src='images/products/"+data.OrderList[i][1][1]+"' class='prdouctimg ml10 mr10'/><img src='images/products/"+data.OrderList[i][1][2]+"' class='prdouctimg ml10 mr10'/></td>"+
                "<td>"+data.OrderList[i][0][3]+"</td><td><strong>"+data.OrderList[i][0][4]+"</strong></td><td><strong class='blue'>￥"+data.OrderList[i][0][5]+"</strong></td><td><a class='label label-info'>"+data.OrderList[i][0][7]+"</a></td><td><p class='ha20'>"+data.OrderList[i][0][2].substring(0,10)+"</p><p class='ha20'>"+data.OrderList[i][0][2].substring(11,19)+" </p></td>"+
                "<td><p class='ha20'><a href='javascript:void(0)'>详情</a></p><p class='ha20'><a data-toggle='modal' data-ng-click='deleGoods("+delteNum+","+dealStatus+")'>删除</a></p></td></tr>";
                var cHTML=$compile(HTML)($scope);  //编译
                $("table tr:eq(0)").after(cHTML);  //添加至页面
            }
        }
    }

});
