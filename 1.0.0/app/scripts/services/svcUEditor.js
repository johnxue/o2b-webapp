/**
 * Created by Administrator on 2014/10/17.
 */
var UEditorServices = angular.module('UEditorServices',[]);

UEditorServices.factory('UEditorService',  function () {

        function getTime(){
            var nowTime = new Date();
            var mytime=nowTime.getFullYear().toString();
            var Year = nowTime.getFullYear().toString();  //年
            var Month = nowTime.getMonth() + 1;          //月
            var Day = nowTime.getDate().toString();     //日
            var nowDaty=Year + Month + Day;
            return(nowDaty);
        };

        return {

            //初始化百度编辑器
            getUEditor:  function (editorId,type,gid) {
                var editor = new UE.ui.Editor();
                    editor.render(editorId);
                //设置编辑器上传参数 token验证
                editor.ready(function() {
                    editor.execCommand('serverparam', {
                        'type' : type,
                        'groupid' : gid,
                        'Authorization':cookieOperate.getCookie('token'),
                        'app-key':'fb98ab9159f51fd0'
                    });
                });

               return editor;
            },
            //获取编辑器图片url列表
            getImgUrlList: function(ue){
                var uContent = ue.getContent();
                var re = /title="([^"]*)"/g;
                var nowTim = getTime();
                var img = null;
                var arr=[];
                while (arr = re.exec(uContent)) {
                    if(img==null){
                        img="/images/tmp/"+nowTim+"/"+arr[1];
                    }else{
                        img=img+","+"/images/tmp/"+nowTim+"/"+arr[1];
                    }
                }
                return img;
            },

            //获取编辑器纯文本截取值，sta开始位置、end结束位置
            getCutText: function(ue,sta,end){
                var uContentTxt = ue.getContentTxt();
                var cutOutTxt=uContentTxt.substring(sta,end);
                return cutOutTxt;
            }

        };
    }
);
