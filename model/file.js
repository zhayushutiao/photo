// 用于直接操作相册和图片的模块

const fs = require('fs');
 
/**
 *@method 读取某个文件夹的内容
 *@param { String } dirName 被读取的文件夹或路径
 *@param { Function } cb 回调函数
*/ 
exports.getDirs = function(dirName,cb){
    fs.readdir(dirName,function(err,files){
        cb(err,files);
    })
}