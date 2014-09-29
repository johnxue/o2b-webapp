/**
 * Created by Administrator on 2014/9/19.
 */

var ViewDetailsControllers = angular.module('ViewDetailsControllers',[]);

ViewDetailsControllers.controller('ViewDetailsCtrl',function($scope,CommonService,$routeParams){

    var uriData = '';
    var paymentStatus = '在线支付';
       // alert("详情"+$routeParams.userId);


     /************************************************  加载运行 ***********************************************/
     CommonService.getAll('order/'+$routeParams.userId, uriData, function (data) {
       //  alert(data.OrderDetail[0][1]);
         //收货人信息
        $("#receiptInformation").html("<div class='alert with-icon'> <strong>收货人信息</strong>"+
         "<div class='content'><div class='ha30'><span>"+data.AddressInfo.contact+"</span> <span>"+data.AddressInfo.tel+"</span><span>"+data.AddressInfo.email+"</span></div>"+
         "<div class='ha30'><span>"+data.AddressInfo.address+"</span></div></div></div>");
         //商品清单
         for(var i=0;i<data.OrderDetail.length;i++){
             var aa="<td><img src='images/products/"+data.OrderDetail[i][1]+"' class='prdouctimg'/></td><td>"+data.OrderDetail[i][3]+"</td>" +
                 "<td><strong>"+data.OrderDetail[i][5]+"</strong></td><td><span> <span>"+data.OrderDetail[i][4]+"</span> </span></td><td><strong class='blue'>¥"+data.OrderDetail[i][6]+"</strong></td><td>有货</td>";
             $("table tr:eq(0)").after(aa);
         }
         var payments = data.OrderInfo.amount+10;
         //商品总额
        $("#Total").html("<div class='content'><div class='ha30 pull-right col-md-12'><span ><strong>总商品金额：</strong></span><span  style='width:100px; text-align:right'>￥"+data.OrderInfo.amount+"</span></div></div>"+
             "<div class='ha30 pull-right col-md-12'> <span class='mr40'><strong>运费：</strong></span> <span  style='width:100px; text-align:right'>￥10.00</span></div>"+
             "<div class='ha30 pull-right col-md-12'><strong class='ml10'>实付金额：￥</strong><strong class='blue'>"+payments+"</strong>元</div>");

     });

    //获取支付方式
    CommonService.getAll('order/attribute',uriData, function (data) {
        for(var s=0;s<data.payment.length;s++){
            if(data.payment[s][0]==paymentStatus){
                $("#payment").html("<div class='alert with-icon'><strong>支付方式 </strong><div class='content'>"+
                    "<div class='ha30'><input name='radio' type='radio' ng-checked='true'>"+data.payment[s][0]+" <span class='ml20 blue'>"+data.payment[s][2]+"</span></div>");
            }
        }
    })


    /*************************************************  页面交互事件  ********************************************/
    //添加数据至页面


})