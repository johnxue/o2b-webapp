/**
 * Created by Administrator on 2014/9/11.
 */
var MyFormControllers = angular.module('MyFormControllers',[]);

MyFormControllers.controller('MyFormCtrl',function($scope,CommonService){

    var uriData = '';
    var nowPage = 0;  //当前页数

    //加载运行
    $scope.seleAllGoods = function(){   //获取数据
    uriData = undefined;
    CommonService.getAll('order?o='+nowPage+'&&r=10', uriData, function (data) {
        if(data.OrderList.length==0){      //判断是否有记录
            $("#Prompt").html("<div class='col-md-9'><div class='container'><div class='col-md-12'><div class='alert with-icon mp10'>" +
                               "<i class='icon-info-sign'></i><div class='content'>没有符合条件的订单记录。</div></div></div></div></div>");
        }else{
            for(var i=0;i<data.OrderList.length;i++){
               $("table tr:eq(0)").after("<tr><td><img src='images/prducttu.jpg' class='prdouctimg ml10 mr10'/><img src='images/prducttu.jpg' class='prdouctimg ml10 mr10'/><img src='images/prducttu.jpg' class='prdouctimg ml10 mr10'/></td>"+
               "<td>"+data.OrderList[i][3]+"</td><td><strong>"+data.OrderList[i][5]+"</strong></td><td><strong class='blue'>￥29,690</strong></td><td><a class='label label-info'>立即付款</a></td><td><p class='ha20'>"+data.OrderList[i][2]+"</p><p class='ha20'>11:00:39 </p></td>"+
               "<td><p class='ha20'><a href='javascript:void(0)'>详情</a></p><p class='ha20'><a data-toggle='modal' data-target='#delproduct'>删除</a></p></td></tr>");
            }
        }
    });
    }
    $scope.seleAllGoods();  //调用获取数据方法

    //页面交互事件

    //查看更多
    $scope.Page = function(){
        alert("查看更多");
        nowPage = nowPage+1;
        $scope.seleAllGoods();
    }

    //查看详情
    $scope.seleGoods = function(){
        alert("产看详情");
    }

    //删除事件
    $scope.deleGoods = function(){
            alert("删除");
    }

});
