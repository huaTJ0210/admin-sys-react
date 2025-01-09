import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      access: 'normalRouteFilter',
      routes: [
        {
          name: '子页面',
          path: '/home/home1',
          component: './Home/Home1',
        },
      ],
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
      access: 'normalRouteFilter',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      layout: false,
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
      access: 'normalRouteFilter',
    },
    {
      name: '模板列表',
      path: '/template',
      component: './TemplateList',
    },
  ],

  npmClient: 'pnpm',
  // 配置环境变量
  define: {
    'process.env.PORT': process.env.PORT,
  },
  proxy: {
    '/api': {
      target: '',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
  tailwindcss: {},
});
