// 创建相册相关的路由
const express = require('express');
const router = express.Router();
const file = require('../model/file.js');

// 处理 /dir请求,显示服务器上所有的相册
router.get('/',function(req,res){
    // 将uploads里面的文件夹显示出来
    var dirs = file.getDirs('./uploads',function(err,files){
        if(err){
            console.log(err);
            res.render('error',{errMsg:'打开相册失败'});
            return ;
        }
        // 成功
        res.send(files);
    });
})


// 暴露路由
module.exports = router;