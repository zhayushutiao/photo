// 创建图片相关的路由
const express = require('express');
const router = express.Router();
const fd = require('formidable');
const file = require('../model/file.js');
const status = require('../status.js');
const SUCCESS = status.SUCCESS;
const FAILED = status.FAILED;

// 处理 /pic/show 请求,展示某个相册里面的内容
router.get('/show',function(req,res){
    // 获取请求参数得到被点击的相册名称
    var dirName = req.query.dirName;
    if(!dirName){
        res.render('error',{errMsg:'获取相册出错'});
        return ;
    }
    // 调用file里面的getDirs方法获取文件夹的内容
    var pics = file.getDirs('./uploads/'+dirName,function(err,files){
        if(err){
            console.log(err);
            res.render('error',{errMsg:'获取图片出错'});
            return ;
        }
        // 成功
        res.render('show',{pics:files,dir:dirName});
    });
})

// 处理 get方式的/pic/upload 请求,跳转到上传页面
router.get('/upload',function(req,res){
    // 在上传图片时需要知道将图片传到哪个相册中
    // 获取uploads下所有的相册名
    file.getDirs('./uploads',function(err,dirs){
        if(err){
            console.log(err);
            res.render('err',{errMsg:'获取相册出错'});
            return ;
        }
        // 获取到相册,将其传递给上传页面
        res.render('upload',{dirs:dirs});
    })
})
// 处理 post方式的/pic/upload 请求,上传图片
router.post('/upload',function(req,res){
    // 处理图片的上传
    // 创建表单对象
    var form = new fd.IncomingForm();
    // 设置上传临时保存路径
    form.uploadDir = './temp';
    // 解析请求
    form.parse(req,function(err,filds,files){
        if(err){
            console.log(err);
            res.render('error',{errMsg:'上传图片失败'});
            return ;
        }
        // 获取表单中的数据
        // 文本域数据:选择的文件夹名称
        var dirName = filds.dirName;
        // 获取图片对象
        var pic = files.pic;
        // 调用file处理图片
        file.rename(dirName,pic,function(err){
            if(err){
                console.log(err);
                res.render('error',{errMsg:'上传失败'});
                return ;
            }
            // 上传成功,跳转到上传图片的文件夹中
            res.redirect('/pic/show?dirName='+dirName);
        })
    })
})

// 暴露路由
module.exports = router;