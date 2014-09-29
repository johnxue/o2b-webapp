/*定义 Controller: ViewDetailsCtrl  （订单详细页面 xiangqing.html）*/

var ViewDetailsControllers = angular.module('ViewDetailsControllers',[]);

ViewDetailsControllers.controller('ViewDetailsCtrl',function($scope,CommonService,$routeParams){

     var uriData = '';

     /************************************************  加载运行 ***********************************************/
     CommonService.getAll('order/'+$routeParams.userId, uriData, function (data) {
         $scope.addGoodsData(data);
     });

    /*************************************************  页面交互事件  ********************************************/
    //添加数据至页面
    $scope.addGoodsData = function(data){
        //收货人信息
        var receiptPersonHtml = "<div class='alert with-icon'> <strong>收货人信息</strong>"+
            "<div class='content'><div class='ha30'><span>"+data.AddressInfo.contact+"</span> <span>"+data.AddressInfo.tel+"</span><span>"+data.AddressInfo.email+"</span></div>"+
            "<div class='ha30'><span>"+data.AddressInfo.address+"</span></div></div></div>";
        $("#receiptInformation").html(receiptPersonHtml);
        //商品清单
        for(var i=0;i<data.OrderDetail.length;i++){
            var productHtml="<td><img src='images/products/"+data.OrderDetail[i][1]+"' class='prdouctimg'/></td><td>"+data.OrderDetail[i][3]+"</td>" +
                "<td><strong>"+data.OrderDetail[i][5]+"</strong></td><td><span> <span>"+data.OrderDetail[i][4]+"</span> </span></td><td><strong class='blue'>¥"+data.OrderDetail[i][6]+"</strong></td><td>有货</td>";
        $("table tr:eq(0)").after(productHtml);
        }
        //商品总额
        var payments = data.OrderInfo.amount+10;  //加10元邮费
        var totalHtml = "<div class='content'><div class='ha30 pull-right col-md-12'><span ><strong>总商品金额：</strong></span><span  style='width:100px; text-align:right'>￥"+data.OrderInfo.amount+"</span></div></div>"+
            "<div class='ha30 pull-right col-md-12'> <span class='mr40'><strong>运费：</strong></span> <span  style='width:100px; text-align:right'>￥10.00</span></div>"+
            "<div class='ha30 pull-right col-md-12'><strong class='ml10'>实付金额：￥</strong><strong class='blue'>"+payments+"</strong>元</div>";
        $("#Total").html(totalHtml);
        //支付方式
        var paymentHtml = "<div class='alert with-icon'><strong>支付方式 </strong><div class='content'>"+
            "<div class='ha30'><input name='radio' type='radio' ng-checked='true'>"+data.OrderInfo.payment+" <span class='ml20 blue'>货到付款 送货上门后再收款，支持现金、POS机刷卡、支票支付</span></div>";
        $("#payment").html(paymentHtml);
    }

})