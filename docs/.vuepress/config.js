module.exports = {
  title: 'xx前端组件库文档', // 设置网站标题
  base: '/zychooo/',
  description: 'for demo purpose', //描述
  dest: './dist',   // 设置输出目录
  port: 2233, //端口
  themeConfig: { //主题配置
    // 添加导航栏
    nav: [
      { text: '主页', link: '/' }, // 导航条
      { text: '组件', link: '/base/' },
      { text: '知识库', link: '/knowledge/' }
    ],
    // 为以下路由添加侧边栏
    sidebar:{
      '/base/': [
        '/base/',
        {
          title: '常用组件',
          collapsable: true,
          children: [
            // 'components/icon',
            'components/overflowTooltip',
            'components/editor'
          ]
        },
      ],
      '/knowledge/': [
        {
          title: 'CSS知识库',
          collapsable: false,
          children: [
          ]
        },
        {
          title: 'JS知识库',
          collapsable: false,
          children: [
          ]
        },
        {
          title: 'node知识库',
          collapsable: false,
          children: [
          ]
        },
        {
          title: 'vue知识库',
          collapsable: false,
          children: [
          ]
        }
      ]
    }
  }
}