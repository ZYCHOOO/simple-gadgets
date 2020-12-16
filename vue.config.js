const path = require('path')
module.exports = {
  // 修改pages入口
  pages: {
    index: {
      entry: 'src/main.js', // 入口
      template: 'public/index.html', // 模版
      filename: 'index.html'
    }
  },
  // 扩展webpack配置
  chainWebpack: config => {
    // 默认指向src目录
    config.resolve.alias
      .set('~', path.resolve('plugins'))

    // 把plugins加入编译（新增文件默认不被webpack处理
    config.module
      .rule('js')
      .include.add(/plugins/).end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改选项
        return options
      })
  }
}