// 创建相册相关的路由
const express = require('express');
const router = express.Router();
const file = require('../model/file.js');
const { SUCCESS,FAILED } = require('../status.js');

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
        res.render('index',{dirs:files});
    });
})

// 处理 get方式的 /dir/mkdir  请求,跳转到新建相册页面
router.get('/mkdir',function(req,res){
    // 跳转到创建页面
    // 该页面不需要渲染数据,所以不需要传递数据过去
    res.render('create');
})

// 处理post方式的 /dir/mkdir ,创建相册
router.post('/mkdir',function(req,res){
    // 获取请求参数dirName
    var dirName = req.body.dirName;
    // 检查dirName的合法性
    if(!dirName){
        res.send({status:FAILED,msg:'相册名不合法'});
        return ;
    }
    // 调用file的create方法来创建文件夹
    // 将文件夹创建在uploads文件夹里面
    dirName = 'uploads/'+dirName;
    file.create(dirName,function(err){
        if(err){
            console.log(err);
            res.send({status:FAILED,msg:'创建失败'});
            return ;
        }
        res.send({status:SUCCESS,msg:'创建成功'});
    })
})

// 处理 /dir/check 请求,获取传递过来的参数并检查文件夹名称是否已经存在
router.get('/check',function(req,res){
    // 获取参数
    var dirName = req.query.dirName;
    if(!dirName){
        // 如果没有数据,则返回状态1
        res.send({status:FAILED,msg:'文件夹名称不能为空'});
        return ;
    }
    // 获取所有文件夹,检查其中有没有该名称的文件夹
    file.getDirs('./uploads',function(err,files){
        if(err){
            console.log(err);
            res.send({status:FAILED,msg:'服务器网络故障,稍后再试'})
            return ;
        }
        // 读取成功,开始检查是否存在
        var result = files.find(function(val){
            return val == dirName;
        })
        if(result){/* 找到了 */
            res.send({status:FAILED,msg:'已存在'});
            return ;
        }
        // 没找到
        res.send({status:SUCCESS,msg:'可以使用'});
    })
})

// 处理 /dir/delete 请求,删除相册
router.get('/delete',function(req,res){
    // 获取参数
    var dirName = req.query.dirName.trim();
    if(!dirName){
        res.send({status:FAILED,msg:'参数不合法'});
        return ;
    }
    // 调用file的delete方法删除文件夹
    dirName = 'uploads/'+dirName;
    file.delete(dirName,function(err){
        if(err){
            console.log(err);
            res.send({status:FAILED,msg:'删除失败'});
            return ;
        }
        res.send({status:SUCCESS,msg:'删除成功'});
    })
})
// 暴露路由
module.exports = router;