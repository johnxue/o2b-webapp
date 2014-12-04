/**
 * Created by Administrator on 2014/9/4.
 */

/**
 *
 *  @模块名称: ReleaseProduct Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var MyProductsControllers = angular.module('MyProductsControllers',[]);

/*定义 Controller: MyProducts  （我的产品页面 myProducts.html）*/
MyProductsControllers.controller('MyProductsCtrl',function($scope,CommonService,$window,FileUploader,UEditorService){
    ctrInit();

    var uriData='';

    //上传产品图片所需产品编码(如无产品编码为"000000")
    var productCode = '000000';

    var productId ='';

    var needToSubmitPInfo=[];

    var needToSubmitPDetail=[];

    var productInfoPreview={};

    var productDetailPreview={};

    //初始化UEditor(百度编辑器)
    var ue = new UE.ui.Editor();
    ue.render('editor');
    ue.ready(function () {
        ue.execCommand('serverparam', {
            'type': 'product.detail',
            'code': productCode,
            'Authorization': cookieOperate.getCookie('token'),
            'app-key': 'fb98ab9159f51fd0'
        });
    });
    ue.addListener("contentChange",function(){
        $scope.productDetailChange('html');
        productDetailPreview.html=ue.getContent();
    });

    //修改产品详细信息时,产品原始的详细信息中的图片信息
    var oldImgFiles=null;

    //分页信息(我的产品)
    var myProductsAllCount=0;
    var myProductsMaxPage=0;
    var myProductsPage=0;
    var myProductsPageSize=6;
    //分页器可显示的页数
    var myProductsBursterMaxPage=6;

    //是否为修改产品信息
    var isEdit=false;

    //产品详细信息ID(修改产品详细信息)
    var productDetailId='';

  //初始化$scope中定义的变量

    $scope.vm={};

    $scope.productInfoForm={};

    $scope.updateCover={};

    $scope.updateTop={};

    $scope.updateCenter={};

    $scope.updateMini={};

    $scope.productCategorys={};

    $scope.productStates={};

    $scope.statesObj={};

    $scope.submitPInfoState=false;

    $scope.inputDetailFormState=false;

    $scope.productDetailForm={};

    $scope.submitPDetailState=false;

    $scope.showNoMyProductsDiv=false;

    $scope.myProducts=[];

    $scope.myProductsBursterPageNumbers=[];

    $scope.myProductsPageSize=myProductsPageSize;

    $scope.selectMyProductsForm={};

    $scope.selectProductManageStatuses={};

    $scope.productInfoShowForm={};

    $scope.delProductId='';

    $scope.reReleaseProductId='';

    $scope.reReleaseProductForm={};

    $scope.productManageStatesObj={};

    //初始化分页器样式
    $scope.$on('ngRepeatFinished', function () {

        //我的产品分页器初始化样式
        angular.element('.myProductsBursterPageLis').removeClass('active');
        angular.element('#myProductsPageLi'+myProductsPage).addClass('active');

    });

  //实现与页面交互的事件,如：button_click

    //显示发布我的产品
    $scope.showReleaseMyProduct=function(){
        $scope.vm.activeTab = 1;
        $scope.vm.activeTabs = 1;
        findProductAttribute();
    }

    //文件上传(封面)
    $scope.updateCover= new FileUploader({
        scope: $scope,
        //url: 'http://192.168.1.110:8081/o2b/v1.0.0/product/images?type=product.medium&code='+productCode,
        url: 'https://192.168.1.210/o2b/v1.0.0/product/images?type=product.medium&code='+productCode,
        method: 'POST',
        autoUpload: false,   // 自动上传
        alias: 'upfile',
        queueLimit:1,
        removeAfterUpload: true,
        headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}
    });

    $scope.updateCover.onSuccessItem = function(fileItem, response, status, headers) {
        document.getElementById('pCoverImgId')['src']=response.url;
        $scope.productInfoForm.img =response.url;
        $scope.productInfoChange('img');
        alert('上传成功!');
    };

    $scope.updateCover.onErrorItem = function(fileItem, response, status, headers) {
        alert('上传失败,请清除后重新提交!');
    };

    //文件上传(顶部)
    $scope.updateTop= new FileUploader({
        scope: $scope,
        //url: 'http://192.168.1.110:8081/o2b/v1.0.0/product/images?type=product.large&code='+productCode,
        url: 'https://192.168.1.210/o2b/v1.0.0/product/images?type=product.large&code='+productCode,
        method: 'POST',
        autoUpload: false,   // 自动上传
        alias: 'upfile',
        queueLimit:1,
        removeAfterUpload: true,
        headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}

    });

    $scope.updateTop.onSuccessItem = function(fileItem, response, status, headers) {
        document.getElementById('pTopImgId')['src']=response.url;
        $scope.productInfoForm.imgl=response.url;
        $scope.productInfoChange('imgl');
        alert('上传成功!');
    };

    $scope.updateTop.onErrorItem = function(fileItem, response, status, headers) {
        alert('上传失败,请清除后重新提交!');
    };

    //文件上传(广告条图)
    $scope.updateCenter= new FileUploader({
        scope: $scope,
        //url: 'http://192.168.1.110:8081/o2b/v1.0.0/product/images?type=product.banner&code='+productCode,
        url: 'https://192.168.1.210/o2b/v1.0.0/product/images?type=product.banner&code='+productCode,
        method: 'POST',
        autoUpload: false,   // 自动上传
        alias: 'upfile',
        queueLimit:1,
        removeAfterUpload: true,
        headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}

    });

    $scope.updateCenter.onSuccessItem = function(fileItem, response, status, headers) {
        document.getElementById('pCenterImgId')['src']=response.url;
        $scope.productInfoForm.imgb=response.url;
        $scope.productInfoChange('imgb');
        alert('上传成功!');
    };

    $scope.updateCenter.onErrorItem = function(fileItem, response, status, headers) {
        alert('上传失败,请清除后重新提交!');
    };

    //文件上传(小)
    $scope.updateMini= new FileUploader({
        scope: $scope,
        //url: 'http://192.168.1.110:8081/o2b/v1.0.0/product/images?type=product.small&code='+productCode,
        url: 'https://192.168.1.210/o2b/v1.0.0/product/images?type=product.small&code='+productCode,
        method: 'POST',
        autoUpload: false,   // 自动上传
        alias: 'upfile',
        queueLimit:1,
        removeAfterUpload: true,
        headers: {'Authorization': cookieOperate.getCookie('token'), 'app-key': 'fb98ab9159f51fd0'}

    });

    $scope.updateMini.onSuccessItem = function(fileItem, response, status, headers) {
        document.getElementById('pMiniImgId')['src']=response.url;
        $scope.productInfoForm.imgs=response.url;
        $scope.productInfoChange('imgs');
        alert('上传成功!');
    };

    $scope.updateMini.onErrorItem = function(fileItem, response, status, headers) {
        alert('上传失败,请清除后重新提交!');
    };

    //产品基本信息状态改变事件
    $scope.productInfoChange=function(optionName){
        var flag = true;
        for(var i=0;i<needToSubmitPInfo.length;i++){
            if(needToSubmitPInfo[i]==optionName){
                flag = false;
                break;
            }
        }
        if(flag){
            needToSubmitPInfo.push(optionName);
        }
    }

    //提交产品基本信息
    $scope.submitProductInfo=function(productInfoForm){
        $scope.submitPInfoState=true;

        if(isEdit){
            uriData = {};
            for (var i = 0; i < needToSubmitPInfo.length; i++) {
                uriData[needToSubmitPInfo[i]] = productInfoForm[needToSubmitPInfo[i]];
            }

            uriData.c=productInfoForm.c;

            CommonService.updateOne('product', JSON.stringify(uriData), function (data) {
                productId = data.pid;
                productCode = data.code;
                $scope.productInfoForm.img =  data.Image;
                $scope.productInfoForm.imgl = data.imagelarge;
                $scope.productInfoForm.supplierName = data.supplierName;
                $scope.submitPInfoState=false;
                alert('提交成功!');
            }, errorOperate);
        }else {
            uriData = {};
            for (var i = 0; i < needToSubmitPInfo.length; i++) {
                uriData[needToSubmitPInfo[i]] = productInfoForm[needToSubmitPInfo[i]];
            }

            uriData.ta = 0;
            uriData.tt = 0;
            uriData.tf = 0;
            uriData.ts = 0;

            CommonService.createOne('product', JSON.stringify(uriData), function (data) {
                productId = data.pid;
                productCode = data.code;
                $scope.productInfoForm.img =  data.Image;
                $scope.productInfoForm.imgl =  data.imagelarge;
                $scope.productInfoForm.supplierName = data.supplierName;
                $scope.submitPInfoState=false;
                alert('提交成功!');
            }, errorOperate);
        }
    }

    //显示产品详细描述
    $scope.showProductDetailForm=function(){
        if(productId!=''){
            $scope.vm.activeTab = 1;
            $scope.vm.activeTabs=2;
        }else{
            alert('请先提交产品基本信息!');
        }
    }

    //产品详细信息状态改变事件
    $scope.productDetailChange=function(optionName){
        var flag = true;
        for(var i=0;i<needToSubmitPDetail.length;i++){
            if(needToSubmitPDetail[i]==optionName){
                flag = false;
                break;
            }
        }
        if(flag){
            needToSubmitPDetail.push(optionName);
        }
    }

    //提交产品详细信息
    $scope.submitProductDetail=function(productDetailForm){
        $scope.submitPDetailState=true;

       if(isEdit) {
           uriData = {};
           if (needToSubmitPDetail.indexOf('desc') != -1) {
               uriData.desc = productDetailForm.desc;
           }

           if (needToSubmitPDetail.indexOf('html') != -1) {

               uriData.html = ue.getContent();

               var imgFiles = UEditorService.getImgUrlList(ue);

               var afterChangeImgFiles=UEditorService.getAddAndRemoveImgs(oldImgFiles,imgFiles);

               if(afterChangeImgFiles.addImgFiles!=null){
                   uriData.imgFiles=afterChangeImgFiles.addImgFiles;
               }
               if(afterChangeImgFiles.removeImgFiles!=null){
                   uriData.rImgFiles=afterChangeImgFiles.removeImgFiles;
               }

           }

           uriData.code = productCode;

           uriData.id=productDetailId;

           CommonService.updateOne('product/' +productId, JSON.stringify(uriData), function (data) {
               productDetailPreview.html = data.html;
               $scope.submitPDetailState=false;
               alert('提交成功!');
           }, errorOperate);

       }else {
           uriData = {};
           if (needToSubmitPDetail.indexOf('desc') != -1) {
               uriData.desc = productDetailForm.desc;
           }

           if (needToSubmitPDetail.indexOf('html') != -1) {
               uriData.html = ue.getContent();
               uriData.imgFiles = UEditorService.getImgUrlList(ue);
           }
           uriData.code = productCode;

           CommonService.createOne('product/' + productId, JSON.stringify(uriData), function (data) {
               productDetailPreview.html = data.html;
               $scope.submitPDetailState=false;
               alert('提交成功!');
           }, errorOperate);
       }

    }

    //预览产品详细信息
    $scope.previewProductDetail=function(productInfoForm,productDetailForm){

        productInfoPreview.starttime=productInfoForm.stm;
        productInfoPreview.endtime=productInfoForm.etm;
        productInfoPreview.totalAmount=0;
        productInfoPreview.limit=productInfoForm.lmt;
        productInfoPreview.totalSold=0;
        productInfoPreview.currentPrice=productInfoForm.cp;
        productInfoPreview.originalPrice=productInfoForm.op;
        productInfoPreview.image=productInfoForm.img;
        productInfoPreview.description=productInfoForm.desc;
        productInfoPreview.imageBanners=productInfoForm.imgl;
        productInfoPreview.supplierName=productInfoForm.supplierName;

        localDataStorage.setItem('productInfoPreview',JSON.stringify(productInfoPreview));

        localDataStorage.setItem('productDetailPreview',JSON.stringify(productDetailPreview));

        $window.open('#/previewProductDetail');
    }

    //显示产品管理
    $scope.showMyProductsManage=function(){
        $scope.vm.activeTab = 2;
        findMyProducts(0,myProductsPageSize);
        getProductManageStatus();
    }

    //我的产品信息列表分页
    $scope.myProductsNextPage=function(){
        if(myProductsPage<myProductsMaxPage-1){
            findMyProducts(++myProductsPage,myProductsPageSize);
        }else{
            angular.element('#myProductsNextPageLi').addClass('disabled');
        }
    }

    $scope.myProductsLastPage=function(){
        if(myProductsPage>0){
            findMyProducts(--myProductsPage,myProductsPageSize);
        }else{
            angular.element('#myProductsLastPageLi').addClass('disabled');
        }
    }

    //条件查询我的产品信息
    $scope.selectMyProductsByCondition=function(selectMyProductsForm){
        findMyProducts(0,myProductsPageSize);
    }

    //显示产品信息框
    $scope.showProductInfoDiv=function(myProduct){
        $scope.productInfoShowForm={};
        $scope.productInfoShowForm.code=myProduct.code;
        $scope.productInfoShowForm.name=myProduct.name;
        $scope.productInfoShowForm.starttime=myProduct.starttime;
        $scope.productInfoShowForm.endTime=myProduct.endTime;
        $scope.productInfoShowForm.totalAmount=myProduct.totalAmount;

        $('#showProductInfo').modal('show');
    }

    //暂停产品
    $scope.pauseProduct=function(id){
        uriData={};
        uriData.st='PAUSE';
        uriData.cm='暂停';
        CommonService.updatePartOne('product/'+id,JSON.stringify(uriData),function(data){
                    for(var i=0;i<$scope.myProducts.length;i++){
                        if($scope.myProducts[i].pid==id){
                            $scope.myProducts[i].p_status_code='PAUSE';
                            $scope.myProducts[i].p_status=$scope.productManageStatesObj['PAUSE'];
                            break;
                        }
                    }
        },errorOperate);
    }

    //下线产品
    $scope.offlineProduct=function(id){
        uriData={};
        uriData.st='OFFLINE';
        uriData.cm='下线';
        CommonService.updatePartOne('product/'+id,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.myProducts.length;i++){
                if($scope.myProducts[i].pid==id){
                    $scope.myProducts[i].p_status_code='OFFLINE';
                    $scope.myProducts[i].p_status=$scope.productManageStatesObj['OFFLINE'];
                    break;
                }
            }
        },errorOperate);
    }

    //显示删除产品提示框
    $scope.showDelProductDiv=function(id){
        $scope.delProductId=id;
        $('#delProduct').modal('show');
    }

    //删除产品
    $scope.delProduct=function(id){
        uriData=undefined;
        CommonService.deleteOne('product/'+id,uriData,function(data){
            for(var i=0;i<$scope.myProducts.length;i++){
                if($scope.myProducts[i].pid==id){
                    $scope.myProducts.splice(i, 1);
                    break;
                }
            }
            $('#delProduct').modal('hide');
        },errorOperate);
    }

    //显示更改批次号提示框
    $scope.showUpdateBatchNumberDiv=function(id){
        $scope.reReleaseProductId=id;
        $('#updateBatchNumber').modal('show');
    }

    //重新发布产品
    $scope.reReleaseProduct=function(id,reReleaseProductForm){
        uriData={};
        uriData.bn=reReleaseProductForm.btn;
        CommonService.updatePartOne('product/'+id,JSON.stringify(uriData),function(data){
            $scope.reReleaseProductForm={};
            for(var i=0;i<$scope.myProducts.length;i++){
                if($scope.myProducts[i].pid==id){
                    $scope.myProducts[i].p_status_code='WAIT';
                    $scope.myProducts[i].p_status=$scope.productManageStatesObj['WAIT'];
                    break;
                }
            }
            $('#updateBatchNumber').modal('hide');
        },errorOperate);
    }

    //恢复发布产品
    $scope.okProduct=function(id){
        uriData={};
        uriData.st='OK';
        uriData.cm='恢复发布';
        CommonService.updatePartOne('product/'+id,JSON.stringify(uriData),function(data){
            for(var i=0;i<$scope.myProducts.length;i++){
                if($scope.myProducts[i].pid==id){
                    $scope.myProducts[i].p_status_code='OK';
                    $scope.myProducts[i].p_status=$scope.productManageStatesObj['OK'];
                    break;
                }
            }
        },errorOperate);
    }

    //跳转到修改产品页面
    $scope.editProduct=function(code){

        isEdit=true;

        $scope.submitPInfoState=false;

        $scope.submitPDetailState=false;

        $scope.showReleaseMyProduct();

        uriData=undefined;
        CommonService.getAll('product/'+code,uriData,function(data){
            console.info(data);
            var productDetailBasic=data.basic;
            productCode = productDetailBasic.code;;
            productId =productDetailBasic.pid;
            $scope.productInfoForm.c= productDetailBasic.code;
            $scope.productInfoForm.bn= productDetailBasic.batchNo;
            $scope.productInfoForm.name= productDetailBasic.name;
            $scope.productInfoForm.spec= productDetailBasic.specification;
            $scope.productInfoForm.desc= productDetailBasic.description;
            $scope.productInfoForm.img= productDetailBasic.image;
            $scope.productInfoForm.imgl= productDetailBasic.imagelarge;
            $scope.productInfoForm.imgb= productDetailBasic.imageBanners;
            $scope.productInfoForm.imgs= productDetailBasic.imageSmall;
            $scope.productInfoForm.sc= productDetailBasic.supplierCode;
            $scope.productInfoForm.cat= productDetailBasic.categoryCode;
            $scope.productInfoForm.st= productDetailBasic.statusCode;
            $scope.productInfoForm.stm= productDetailBasic.starttime;
            $scope.productInfoForm.etm= productDetailBasic.endtime;
            $scope.productInfoForm.cp= productDetailBasic.currentPrice;
            $scope.productInfoForm.op= productDetailBasic.originalPrice;
            $scope.productInfoForm.ta= productDetailBasic.totalAmount;
            $scope.productInfoForm.tt= productDetailBasic.totalTopic;
            $scope.productInfoForm.tf= productDetailBasic.totalFollow;
            $scope.productInfoForm.ts= productDetailBasic.totalSold;
            $scope.productInfoForm.lmt= productDetailBasic.limit;

            var productDetailhtmls=data.html.list;
            productDetailId=productDetailhtmls[0][0];
            $scope.productDetailForm.desc=productDetailhtmls[0][1];
            ue.setContent(productDetailhtmls[0][2]);
            productDetailPreview.html=ue.getContent();
            oldImgFiles=UEditorService.getImgUrlList(ue);

        },errorOperate);

    }

  //调用与后端的接口,如：CommonService.getAll(params)

    //获取产品属性信息
    var findProductAttribute=function() {
        uriData = undefined;
        CommonService.getAll('product/attribute', uriData, function (data) {
            $scope.productCategorys = data.category;
            $scope.productStates = data.attribute;
            for (var i = 0; i < $scope.productStates.length; i++) {
                $scope.statesObj[$scope.productStates[i][1]] = $scope.productStates[i][0];
            }
        }, errorOperate);
    }

    //获取我的产品信息
    var findMyProducts= $scope.findMyProducts = function(page,pageSize) {
        uriData = 'o=' + page + '&r=' + pageSize;
        if($scope.selectMyProductsForm.status!=undefined){
           uriData+='&mt='+$scope.selectMyProductsForm.status;
        }
        if($scope.selectMyProductsForm.name!=undefined){
            uriData+='&q='+$scope.selectMyProductsForm.name.replace(' ','+');
        }
        CommonService.getAll('my/product', uriData, function (data) {
            $scope.myProducts=[];

            var rows = data.rows;
            for(var i=0;i<rows.length;i++){
               var myProduct={};
                myProduct.pid=rows[i][0];
                myProduct.code=rows[i][1];
                myProduct.categoryCode=rows[i][2];
                myProduct.name=rows[i][3];
                myProduct.image=rows[i][4];
                myProduct.starttime=rows[i][5];
                myProduct.endTime=rows[i][6];
                myProduct.statusCode=rows[i][7];
                myProduct.status=rows[i][8];
                myProduct.totalTopic=rows[i][9];
                myProduct.totalFollow=rows[i][10];
                myProduct.totalSold=rows[i][11];
                myProduct.totalAmount=rows[i][12];
                myProduct.p_status_code=rows[i][13];
                myProduct.p_status=rows[i][14];
                myProduct.supplierName=rows[i][15];
                myProduct.nickname=rows[i][16];

               $scope.myProducts.push(myProduct);
            }

            myProductsAllCount = data.count;

            //记录查询页号,连接点击页号查询和点击上一页或下一页查询
            myProductsPage=page;

            myProductsMaxPage=Math.ceil(myProductsAllCount/myProductsPageSize);

            //分页器显示
            $scope.myProductsBursterPageNumbers =_produceBurster(page,pageSize,myProductsAllCount,myProductsBursterMaxPage);

            //设置分页器样式
            angular.element('.myProductsBursterPageLis').removeClass('active');
            angular.element('#myProductsPageLi'+page+'').addClass('active');

            //去除上一页,下一页禁用样式
            angular.element('#myProductsLastPageLi').removeClass('disabled');
            angular.element('#myProductsNextPageLi').removeClass('disabled');

        }, function (response) {
            if(response.code=="802"){
                $scope.showNoMyProductsDiv=true;
            }
        });
    }

    //获取产品管理状态
    var getProductManageStatus=function(){
        uriData='pms=attribute';
        CommonService.getAll('my/product',uriData,function(data){
            $scope.selectProductManageStatuses=data.status;
            for(var i=0;i<$scope.selectProductManageStatuses.length;i++){
                $scope.productManageStatesObj[$scope.selectProductManageStatuses[i][1]]=$scope.selectProductManageStatuses[i][0];
            }
        },errorOperate);
    }

});