/**
 * Created by Administrator on 2014/9/30.
 */

/**
 *
 *  @模块名称: EditGroupPost Controllers
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-09-30
 *  @版本描述:
 *
 *  @可以使用的与后端的接口：
 *  @服务：CommonService 提供接口方法：getAll,getOne,updateOne,deleteOne,createOne
 */

var EditGroupTopicControllers = angular.module('EditGroupTopicControllers',[]);

/*定义 Controller: EditGroupTopicCtrl  （编辑圈子帖子页面 editGroupTopic.html）*/
EditGroupTopicControllers.controller('EditGroupTopicCtrl',function($scope,CommonService,$window,$routeParams,UEditorService){
    ctrInit();

    var uriData='';

    //初始化UEditor(百度编辑器)
    var ue =UEditorService.getUEditor('editor','group',$routeParams.groupId);

    var groupId=$routeParams.groupId;
    var topicId=$routeParams.topicId;

    //备份原始的话题内容信息
    var groupTopicDetail=JSON.parse(localDataStorage.getItem('groupTopicDetail'));
    var oldTopicTitle =groupTopicDetail.topic;
    var oldSummary = '';
    var oldTopicContent = groupTopicDetail.contents;
    var oldImgFiles=[];

   //初始化$scope中定义的变量

    $scope.groupTopicDetail=JSON.parse(localDataStorage.getItem('groupTopicDetail'));

    $scope.topicTitle=$scope.groupTopicDetail.topic;

    if($scope.groupTopicDetail.status_code=='OK'){
        $scope.ifForbidComment=false;
    }else if($scope.groupTopicDetail.status_code=='NR'){
        $scope.ifForbidComment=true;
    }


    //UEditor初始化完成后操作
    ue.addListener("ready", function () {
        ue.setContent($scope.groupTopicDetail.contents);
        oldSummary=UEditorService.getCutText(ue,0,200);
        oldImgFiles=UEditorService.getImgUrlList(ue)==null ? [] :UEditorService.getImgUrlList(ue).split(',');
    });

    //实现与页面交互的事件,如：button_click

    //修改话题
    $scope.modifyTopic=function(topicTitle){
        uriData={};

        uriData.topic=topicTitle;

        if(uriData.topic == oldTopicTitle){
            uriData.topic=null;
        }

        uriData.summary=UEditorService.getCutText(ue,0,200);

        if(uriData.summary == oldSummary){
            uriData.summary=null;
        }

        uriData.content=ue.getContent();

        if(uriData.content == oldTopicContent){
            uriData.content=null;
        }

        //获取当前话题内容中的图片列表
        var imgFiles = UEditorService.getImgUrlList(ue)==null ? [] :UEditorService.getImgUrlList(ue).split(',');

        //获取话题内容中新增图片的列表
        var addImgFiles=[];

        for(var i=0;i<imgFiles.length;i++){
            var flag=true;

            for(var j=0;j<oldImgFiles.length;j++){
                if(imgFiles[i]==oldImgFiles[j]){
                    flag=false;
                    break;
                }
            }

            if(flag){
                addImgFiles.push(imgFiles[i]);
            }

        }

        uriData.imgFiles=addImgFiles.length==0 ? null :addImgFiles.join(',');


        //获取话题内容中删除图片的列表
        var removeImgFiles=[];

        for(var i=0;i<oldImgFiles.length;i++){
            var flag=true;

            for(var j=0;j<imgFiles.length;j++){
                if(oldImgFiles[i]==imgFiles[j]){
                    flag=false;
                    break;
                }
            }

            if(flag){
                removeImgFiles.push(oldImgFiles[i]);
            }
        }

        uriData.rImgFiles=removeImgFiles.length==0 ? null :removeImgFiles.join(',');


       console.info(getAddAndRemoveImgs(oldImgFiles,imgFiles));
        //是否禁止评论
        if($scope.ifForbidComment==true){
            uriData.status='NR';
        }else{
            uriData.status='OK';
        }

        CommonService.updateOne('group/topics/'+String(topicId),JSON.stringify(uriData),function(data){
            alert('修改成功!');
            $window.location.href='#/group/'+String(groupId)+'/topic/'+String(topicId);
        },errorOperate);

    }

    //调用与后端的接口,如：CommonService.getAll(params)



});
