// 创建相册相关的路由
const express = require('express');
const router = express.Router();
const { Dir } = require('../model/db.js');
const fs = require('fs');
const rf = require('rimraf');
const status = require('../status.js');
const SUCCESS = status.SUCCESS;
const FAILED = status.FAILED;

// 处理 /dir请求,显示服务器上所有的相册
router.get('/',function(req,res){
    // 从数据库获取当前服务器有哪些文件夹
    Dir.find({},null,{sort:{name:1}},function(err,dirs){
        if(err){
            res.render('error',{errMsg:'获取文件夹失败'});
            return ;
        }
        // dirs是一个对象数组
        res.render('index',{dirs:dirs});
    })
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
    // fs模块创建文件夹,保存进数据库
    fs.mkdir('./uploads/'+dirName,function(err){
        if(err){
            console.log(err);
            res.send({status:FAILED,msg:'创建失败'});
            return ;
        }
        // 创建成功,保存数据库
        var o = new Dir({name:dirName});
        o.save(function(err,d){
            res.send({status:SUCCESS,msg:'创建成功'});
        })
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
    // 判断dirName是否已经存在
    Dir.find({name:dirName},function(err,dirs){
        if(err){
            console.log(err);
            res.send({status:FAILED,msg:'网络波动'});
            return ;
        }
        if(dirs.length>0){//找到了数据
            res.send({status:FAILED,msg:'文件夹已存在'});
        }else{
            res.send({status:SUCCESS,msg:'文件夹名称可以使用'});
        }
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
    rf('./uploads/'+dirName,function(err){
        if(err){
            res.send({status:FAILED,msg:'删除失败'});
            return ;
        }
        // 删除文件夹成功,去删除数据库中的记录
        Dir.deleteOne({name:dirName},function(err,raw){
            res.send({status:SUCCESS,msg:'删除成功'});
        })
    })
})
// 暴露路由
module.exports = router;