/*定义 Controller: MyFormCtrl  （我的订单页面 dingdan.html）*/

var MyFormControllers = angular.module('MyFormControllers',[]);

MyFormControllers.controller('MyFormCtrl',function($scope,FileUploader,$compile,CommonService){

    var uriData = '';
    var nowPage = 0;         //当前页
    var pageNum = 10;       //每页显示条数
    var empty = true;      //是否清空数据  true是||false否
    var contentTab = "";   //Html Table_ID
    var rGoodsHtml = '';   //js拼接Html

    var oid = '';
    var orderNo = '';
    var pcode = '';
    var pname = '';

    var picName = '';     //上传图片名称
    var static = true;  //是否显示退货

    /******************************   加载运行   ***********************************/
    ctrInit();  //广告
    $scope.returnFrom = false;   //隐藏退货表单

     /*****************************  页面交互事件  ***********************************/
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
        static = true;
        $scope.tabClear();
        $scope.switchTab();
    }

    //未付款
    $scope.order = function(){
        uriData = "s=status&v=110&r="+pageNum+"&o=";
        contentTab = "content2";
        static = false;
        $scope.tabClear();
        $scope.switchTab();
    }

    //待发货
    $scope.waitShipped = function(){
        uriData = "s=status&v=130&r="+pageNum+"&o=";
        contentTab = "content3";
        static = true;
        $scope.tabClear();
        $scope.switchTab();
    }

    //已发货
    $scope.shipped = function(){
        uriData = "s=status&v=210&r="+pageNum+"&o=";
        contentTab = "content4";
        static = true;
        $scope.tabClear();
        $scope.switchTab();
    }

    //退货
    $scope.return = function(rou){
        uriData = "s=status&v=310&r="+pageNum+"&o=";
        contentTab = "content5";
        static=false;
        $scope.tabClear();
        $scope.switchTab();
    }

    //模糊查询
    $scope.seleBtn = function(){
        var seleCon = $scope.seleVal;  //获取输入内容
        uriData = "q="+seleCon+"&r="+pageNum+"&o=";
        $scope.tabClear();
        $scope.switchTab();
    }

    //切换选项卡查询
    $scope.switchTab = function(){
       var aa= CommonService.getAll('order', uriData+nowPage, function (data) {
            $scope.sendHtml(contentTab ,data);
        },function(response){
            if(response.message=="没有找到数据"){
                $scope.sendHtml(contentTab,null);
            }
       });
    }

    //查看更多
    $scope.Page = function(){
        nowPage = nowPage+1
        empty = false;
        $scope.switchTab();
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

    //显示订单中商品
    $scope.returnGoods = function(rData){
        $scope.returnFrom=true;
        $("#content5 tr:gt(0)").remove();
        $scope.Number="1";  //退货数量赋值
        uriData = '';
        CommonService.getAll('order', uriData, function (data) {
            for(var i=0;i<data.OrderList.length;i++){
                if(data.OrderList[i][0][0]==rData){
                    for(var s=0;s<data.OrderList[i][1].length;s++){
                        rGoodsHtml = "<tr><td><img src='images/products/"+data.OrderList[i][1][s][1]+"' class='prdouctimg ml10 mr10'/></td>"+
                            "<td>"+data.OrderList[i][0][3]+"</td><td><strong>"+data.OrderList[i][0][4]+"</strong></td><td><strong class='blue'>￥"+data.OrderList[i][1][s][5]+"</strong></td><td><a class='label label-info'>"+data.OrderList[i][0][7]+"</a></td><td><p class='ha20'>"+data.OrderList[i][0][2].substring(0,10)+"</p><p class='ha20'>"+data.OrderList[i][0][2].substring(11,19)+" </p></td>"+
                            "<td><p class='ha20'><a data-ng-click='apply("+data.OrderList[i][1][s][0]+","+data.OrderList[i][0][1]+","+data.OrderList[i][1][s][2]+","+JSON.stringify(data.OrderList[i][1][s][3])+")'>申请</a></p></td></tr>";
                        var cHTML=$compile(rGoodsHtml)($scope);  //编译
                        $("#content5 tr:eq(0)").after(cHTML);  //添加至页面
                    }
                }
            }
        });
    }

    //申请退货
    $scope.apply = function(rOid,rOrderNo,rPcode,rPname){
         oid = JSON.stringify(rOid);
         orderNo = JSON.stringify(rOrderNo);
         pcode = JSON.stringify(rPcode);
         pname = rPname;
        $("#retGoodsFrom tr:eq(0)").after(rGoodsHtml);  //添加至页面
    }

    //提交退货单
    $scope.conReturn = function(goods){
        var goodsType = goods.Type;    //退货类型
        var goodsNum = goods.Number;       //退货数量
        var goodsDescribe = goods.Describe;   //问题描述

        var objGoods = Object();
        objGoods.oid = oid;    //订单ID
        objGoods.orderNo = orderNo;    //订单号
        objGoods.pcode = pcode;  //产品编码
        objGoods.pname = pname;  //产品名称
        objGoods.number = JSON.stringify(goodsNum);     //退货数量
        objGoods.mode = goodsType;   //类型
        objGoods.description = goodsDescribe;    //产品缺陷说明
        objGoods.imgProblem = picName;     //上传图片
        uriData = JSON.stringify(objGoods);

        CommonService.createOne('order/returns', uriData, function (data) {
                alert("退货信息已提交");
        });
    }



    //文件上传
 /*   var orderUploader = $scope.uploader = $fileUploader.create({   //添加附件
        scope: $scope,                          // to automatically update the html. Default: $rootScope
        url:"https://192.168.1.210/o2b/v1.0.0/order/returns/upload?type=order.returns",
        headers:{'Authorization':cookieOperate.getCookie('token'),'app-key':'fb98ab9159f51fd0'},
        method: "POST",
        alias:"upfile",
        autoUpload: true       //是否自动上传
    });

   uploader.bind('success', function (event, xhr, item, response) {  //添加成功处理
      //  console.info('Success', xhr, item, response);
       picName = response.filename;
       $scope.phones = [
           {"picUrl": response.url,
            "picFileName": response.filename}
       ];
   });

    uploader.bind('error', function (event, xhr, item, response) {  //添加失败处理

    });*/

    //文件上传(封面)
    $scope.orderUploader= new FileUploader({
        scope: $scope,
        url: 'https://192.168.1.210/o2b/v1.0.0/order/returns/upload?type=order.returns',
        method: 'POST',
        autoUpload: true,   // 自动上传
        alias: 'upfile',
        queueLimit:1,
        removeAfterUpload: true,
        headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}
    });

    $scope.orderUploader.onSuccessItem = function(fileItem, response, status, headers) {
        picName = response.url;
        $scope.phones = [
            {"picUrl": response.url,
                "picFileName": response.filename}
        ];
        alert('上传成功!');
    };

    $scope.orderUploader.onErrorItem = function(fileItem, response, status, headers) {
        alert('上传失败,请清除后重新提交!');
    };

    /******************************   调用方法   ***********************************/
     //重置
    $scope.tabClear = function(){
        nowPage = 0;
        empty = true;
        $scope.returnFrom = false;
    }

    //添加数据到页面
    $scope.sendHtml = function(cid,data){
        if(empty){  //是否清空数据
            $("#"+cid+" tr:gt(0)").remove();
            $("#Prompt").html(null);
        }
        if(data==null){      //判断是否有记录
            $("#Prompt").html("<div class='row'><div class='container'><div class='col-md-12'><div class='alert with-icon mp10'>" +
                "<i class='icon-info-sign'></i><div class='content'>没有符合条件的订单记录。</div></div></div></div></div>");
        }else{
            for(var i=0;i<data.OrderList.length;i++){
                var Status = data.OrderList[i][0][8]; //交易状态
                var recordId = data.OrderList[i][0][0]; //记录ID
                var HTML;
                if(static){  //未付款、退货 无退货功能
                    HTML = "<tr><td><img src='images/products/"+data.OrderList[i][1][0][1]+"' class='prdouctimg ml10 mr10'/></td>"+
                        "<td>"+data.OrderList[i][0][3]+"</td><td><strong>"+data.OrderList[i][0][4]+"</strong></td><td><strong class='blue'>￥"+data.OrderList[i][0][5]+"</strong></td><td><a class='label label-info'>"+data.OrderList[i][0][7]+"</a></td><td><p class='ha20'>"+data.OrderList[i][0][2].substring(0,10)+"</p><p class='ha20'>"+data.OrderList[i][0][2].substring(11,19)+" </p></td>"+
                        "<td><p class='ha20'><a href='#/viewDetails/"+data.OrderList[i][0][0]+"'>详情</a></p><p class='ha20'><a data-toggle='modal' data-ng-click='deleGoods("+recordId+","+Status+")'>删除</a></p><p class='ha20'><a data-toggle='modal' data-ng-click='vm.activeTab = 5;returnGoods("+data.OrderList[i][0][0]+")'>退货</a></p></td></tr>";
                }else{
                    HTML = "<tr><td><img src='images/products/"+data.OrderList[i][1][0][1]+"' class='prdouctimg ml10 mr10'/></td>"+
                        "<td>"+data.OrderList[i][0][3]+"</td><td><strong>"+data.OrderList[i][0][4]+"</strong></td><td><strong class='blue'>￥"+data.OrderList[i][0][5]+"</strong></td><td><a class='label label-info'>"+data.OrderList[i][0][7]+"</a></td><td><p class='ha20'>"+data.OrderList[i][0][2].substring(0,10)+"</p><p class='ha20'>"+data.OrderList[i][0][2].substring(11,19)+" </p></td>"+
                        "<td><p class='ha20'><a href='#/viewDetails/"+data.OrderList[i][0][0]+"'>详情</a></p><p class='ha20'><a data-toggle='modal' data-ng-click='deleGoods("+recordId+","+Status+")'>删除</a></p></td></tr>";
                }
                var cHTML=$compile(HTML)($scope);  //编译
                $("#"+cid+" tr:eq(0)").after(cHTML);  //添加至页面
            }
        }
    }

});
