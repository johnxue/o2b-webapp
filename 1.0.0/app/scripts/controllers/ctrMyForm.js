/**
 * Created by Administrator on 2014/9/11.
 */
var MyFormControllers = angular.module('MyFormControllers',[]);

MyFormControllers.controller('MyFormCtrl',function($scope,CommonService){

    var uriData = '';
    var nowPage = 0;  //当前页

    //加载运行
    $scope.seleAllGoods = function(){   //获取数据
    uriData = undefined;
     CommonService.getAll('order?o='+nowPage+'&&r=10', uriData, function (data) {
        if(data.OrderList.length==0){      //判断是否有记录
            $("#Prompt").html("<div class='col-md-9'><div class='container'><div class='col-md-12'><div class='alert with-icon mp10'>" +
                               "<i class='icon-info-sign'></i><div class='content'>没有符合条件的订单记录。</div></div></div></div></div>");
        }else{
            for(var i=0;i<data.OrderList.length;i++){
               $("table tr:eq(0)").after("<tr><td><img src='images/products/"+data.OrderList[0][1][0]+"' class='prdouctimg ml10 mr10'/><img src='images/products/"+data.OrderList[0][1][0]+"' class='prdouctimg ml10 mr10'/></td><img src='images/products/"+data.OrderList[0][1][0]+"' class='prdouctimg ml10 mr10'/></td><img src='images/products/"+data.OrderList[0][1][0]+"' class='prdouctimg ml10 mr10'/></td><img src='images/products/"+data.OrderList[0][1][0]+"' class='prdouctimg ml10 mr10'/></td></td>"+
               "<td>"+data.OrderList[i][0][3]+"</td><td><strong>"+data.OrderList[i][0][4]+"</strong></td><td><strong class='blue'>￥"+data.OrderList[i][0][5]+"</strong></td><td><a class='label label-info'>立即付款</a></td><td><p class='ha20'>"+data.OrderList[i][2]+"</p><p class='ha20'>11:00:39 </p></td>"+
               "<td><p class='ha20'><a href='javascript:void(0)'>详情</a></p><p class='ha20'><a data-toggle='modal' data-target='#delproduct'>删除</a></p></td></tr>");
            }
        }
     });
        $scope.seleAllTime();
    }

    //获取查询时间
    $scope.seleAllTime = function(){
        CommonService.getAll('order/attribute',uriData,function(data){
            $scope.selectTime = data.period;
            $scope.dataTime = data.period[0];
        });
    }

   // $scope.seleAllGoods();  //调用获取数据方法

    //页面交互事件
     //时间段查询 下拉列表
    $scope.$watch('dataTime', function (dataTime){
        if(dataTime == null){
            $scope.seleAllTime();
        }else{
            CommonService.getAll('order?o='+nowPage+'&r=10&s=period&v='+dataTime[1],uriData,function(data){
                if(data.OrderList.length==0){      //判断是否有记录
                    $("#Prompt").html("<div class='col-md-9'><div class='container'><div class='col-md-12'><div class='alert with-icon mp10'>" +
                        "<i class='icon-info-sign'></i><div class='content'>没有符合条件的订单记录。</div></div></div></div></div>");
                }else{
                    for(var i=0;i<data.OrderList.length;i++){
                        $("table tr:eq(0)").after("<tr><td><img src='images/products/"+data.OrderList[0][1][0]+"' class='prdouctimg ml10 mr10'/><img src='images/products/"+data.OrderList[0][1][1]+"' class='prdouctimg ml10 mr10'/></td><img src='images/products/"+data.OrderList[0][1][2]+"' class='prdouctimg ml10 mr10'/></td><img src='images/products/"+data.OrderList[0][1][3]+"' class='prdouctimg ml10 mr10'/></td><img src='images/products/"+data.OrderList[0][1][4]+"' class='prdouctimg ml10 mr10'/></td></td>"+
                            "<td>"+data.OrderList[i][0][3]+"</td><td><strong>"+data.OrderList[i][0][4]+"</strong></td><td><strong class='blue'>￥"+data.OrderList[i][0][5]+"</strong></td><td><a class='label label-info'>"+data.OrderList[i][0][7]+"</a></td><td><p class='ha20'>"+data.OrderList[i][0][2].substring(0,10)+"</p><p class='ha20'>"+data.OrderList[i][0][2].substring(11,19)+"</p></td>"+
                            "<td><p class='ha20'><a href='javascript:void(0)'>详情</a></p><p class='ha20'><a data-toggle='modal' data-target='#delproduct'>删除</a></p></td></tr>");
                    }
                }
            });
        }
    });

    //查看更多
    $scope.Page = function(){
        nowPage = nowPage+1;
        $scope.seleAllGoods();
    }

    //删除事件
    $scope.deleGoods = function(){
        var delIds = new Object();
        delIds.ids="50";
        uriData = JSON.stringify(delIds);
        CommonService.deleteOne('order',uriData,function(data){

        });
    }

    //模糊查询
    $scope.fuzzyQuery = function(){
       var textCon = $scope.seleContent;  //获取查询内容
        CommonService.getAll('order?q='+textCon,uriData,function(data){

        });
    }

});
