/**
 * Created by Administrator on 2014/10/17.
 */
var UEditorServices = angular.module('UEditorServices', []);

UEditorServices.factory('UEditorService', function () {

        return {

            //初始化百度编辑器
            getUEditor: function (editorId, type, gid) {
                var editor = new UE.ui.Editor();
                editor.render(editorId);
                //设置编辑器上传参数 token验证
                editor.ready(function () {
                    editor.execCommand('serverparam', {
                        'type': type,
                        'groupid': gid,
                        'Authorization': cookieOperate.getCookie('token'),
                        'app-key': 'fb98ab9159f51fd0'
                    });
                });

                return editor;
            },

            //获取编辑器图片url列表
            getImgUrlList: function (ue) {
                var uContent = ue.getContent();
                var re = /src="([^"]*)"/g;
                var img = null;
                var arr = [];
                while (arr = re.exec(uContent)) {
                    var imgSrc = /^(http){1}(s)?:\/\/[^\/]*(\/){1}(.*)$/;
                    if (imgSrc.test(arr[1])) {
                        if (img == null) {
                            img = RegExp.$3 + RegExp.$4;
                        } else {
                            img = img + "," + RegExp.$3 + RegExp.$4;
                        }
                    }
                }

                return img;
            },

            //获取编辑器纯文本截取值，sta开始位置、end结束位置
            getCutText: function (ue, sta, end) {
                var uContentTxt = ue.getContentTxt();
                var cutOutTxt = uContentTxt.substring(sta, end);

                return cutOutTxt;
            },

            /**
             * 获取修改UEditor内容后的新增和删除图片的信息
             * @param oldImgFiles  修改前的UEditor内容中的图片列表
             * @param imgFiles    修改后的UEditor内容中的图片列表
             * @returns {addImgFiles:新增的图片信息,removeImgFiles:删除的图片信息}
             */
            getAddAndRemoveImgs: function (oldImgFiles, imgFiles) {

                var addAndRemoveImgs = {}

                var oldImgFiles = oldImgFiles == null ? [] : oldImgFiles.split(',');

                var imgFiles = imgFiles == null ? [] : imgFiles.split(',');

                //find  add imgFiles
                var addImgFiles = [];

                for (var i = 0; i < imgFiles.length; i++) {
                    var flag = true;

                    for (var j = 0; j < oldImgFiles.length; j++) {
                        if (imgFiles[i] == oldImgFiles[j]) {
                            flag = false;
                            break;
                        }
                    }

                    if (flag) {
                        addImgFiles.push(imgFiles[i]);
                    }

                }

                //find remove imgFiles
                addAndRemoveImgs.addImgFiles = addImgFiles.length == 0 ? null : addImgFiles.join(',');

                var removeImgFiles = [];

                for (var i = 0; i < oldImgFiles.length; i++) {
                    var flag = true;

                    for (var j = 0; j < imgFiles.length; j++) {
                        if (oldImgFiles[i] == imgFiles[j]) {
                            flag = false;
                            break;
                        }
                    }

                    if (flag) {
                        removeImgFiles.push(oldImgFiles[i]);
                    }
                }

                addAndRemoveImgs.removeImgFiles = removeImgFiles.length == 0 ? null : removeImgFiles.join(',');

                return addAndRemoveImgs;
            }


        };

    }
);
