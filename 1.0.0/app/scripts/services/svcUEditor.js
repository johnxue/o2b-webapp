/**
 * Created by Administrator on 2014/10/17.
 */
var EditorServices = angular.module('EditorServices',[]);

EditorServices.factory('EditorServices', ['$http', function ($http) {

    var editor;

        return {

            //实例化编辑器
            getUEditor:  function () {
                 editor = new UE.ui.Editor();
                 editor.render("editor");
                return editor;
            },

            //设置编辑器上传参数 token验证
            passArgument: function(){
                editor.ready(function() {
                    editor.execCommand('serverparam', {
                        'type' : 'group',
                        'groupid' : 'gid',
                        'Authorization':cookieOperate.getCookie('token'),
                        'app-key':'fb98ab9159f51fd0'
                    });
                });
            },

            //获取编辑器图片url列表
            listImgUrl: function(){
                var uContent = UE.getEditor('editor').getContent();
                var re = /title="([^"]*)"/g;
                var nowTim = getTime();
                var img = null;
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
            cutOutText: function(sta,end){
                var uContentTxt = UE.getEditor('editor').getContentTxt();
                var cutOutTxt=uContentTxt.substring(sta,end);
                return cutOutTxt;
            }



        };

            function getTime(){
                 var nowTime = new Date();
                 var mytime=nowTime.getFullYear().toString();
                 var Year = nowTime.getFullYear().toString();  //年
                 var Month = nowTime.getMonth() + 1;          //月
                 var Day = nowTime.getDate().toString();     //日
                 var nowDaty=Year + Month + Day;
                return(nowDaty);
            }

    }
]);