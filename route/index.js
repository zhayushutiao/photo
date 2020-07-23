// 将dir和pic两个路由模块合并成一个模块并暴露出去
module.exports = {
    dir:require('./dir.js'),
    pic:require('./pic.js')
}