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

var ReleaseProductControllers = angular.module('ReleaseProductControllers',[]);

/*定义 Controller: ReleaseProduct  （主页面 releaseProduct.html）*/
ReleaseProductControllers.controller('ReleaseProductCtrl',function($scope,CommonService,$window,FileUploader,UEditorService){
    ctrInit();

    var uriData='';

    //初始化UEditor(百度编辑器)
    var ue =UEditorService.getUEditor('editor','group','aa');

    //上传产品图片所需产品编码(如无产品编码为"000000")
    var productCode = '000000';

    //文件名(封面图)
    var img = '';
    //文件名(顶部大图)
    var imgl='';
    //文件名(广告条图)
    var imgb='';
    //文件名(小图)
    var imgs ='';

  //初始化$scope中定义的变量

    $scope.productInfoForm={};

    $scope.updateCover={};

    $scope.updateTop={};

    $scope.updateCenter={};

    $scope.updateMini={};

    $scope.productCategorys={};

    $scope.productStates={};

    $scope.coverImgUrl='';

    $scope.statesObj={};

  //实现与页面交互的事件,如：button_click

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
        $scope.coverImgUrl=response.url;
        img=response.url;
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
        imgl=response.url;
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
        imgb=response.url;
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
        imgs=response.url;
        alert('上传成功!');
    };

    $scope.updateMini.onErrorItem = function(fileItem, response, status, headers) {
        alert('上传失败,请清除后重新提交!');
    };

    //提交产品基本信息
    $scope.submitProductInfo=function(productInfoForm){
       uriData ={};
        uriData.c= productInfoForm.c;
        uriData.bn= productInfoForm.bn;
        uriData.name= productInfoForm.name;
        uriData.spec= productInfoForm.spec;
        uriData.desc= productInfoForm.desc;
        uriData.img= img;
        uriData.imgl= imgl;
        uriData.imgb= imgb;
        uriData.imgs= imgs;
        uriData.sc= productInfoForm.sc;
        uriData.cat= productInfoForm.cat;
        uriData.st= productInfoForm.st;
        uriData.stm= productInfoForm.stm;
        uriData.etm= productInfoForm.etm;
        uriData.cp= productInfoForm.cp;
        uriData.op= productInfoForm.op;
        uriData.ta= 0;
        uriData.tt= 0;
        uriData.tf= 0;
        uriData.ts= 0;
        uriData.lmt=productInfoForm.lmt;

       CommonService.createOne('product',JSON.stringify(uriData),function(data){
             console.info(data.pid);
       },errorOperate);
    }


   //调用与后端的接口,如：CommonService.getAll(params)
    uriData=undefined;
    CommonService.getAll('product/attribute',uriData,function(data){
        $scope.productCategorys=data.category;
        $scope.productStates=data.attribute;
        for(var i=0;i<$scope.productStates.length;i++){
            $scope.statesObj[$scope.productStates[i][1]]=$scope.productStates[i][0];
        }
    },errorOperate)

});