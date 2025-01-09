import { InitialStateType } from './app';

export default (initialState: InitialStateType) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  const { menus } = initialState;
  return {
    normalRouteFilter: (route: { name: string; path: string }) => {
      return menus.some((item) => item.path === route.path);
    },
    canSeeAdmin: true,
  };
};
