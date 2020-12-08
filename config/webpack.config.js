const path=require('path');//加载path模块
module.exports={
    mode:'production',//默认模式：production 生产模式    development开发环境
    entry:{//多入口
        index:'./src/index.js',
        // product:'./src/product.js'
    },//入口  上一级一个点
    output:{//打包出口
        path:path.resolve(__dirname,'../dist/'),//打包文件输入路径 绝对路径 获取当前绝对路径
        // filename:'bundle.js'//打包文件输出名称.指定名称
        filename:'[name].[hash].js'//[name]  [hash] 
    }
}