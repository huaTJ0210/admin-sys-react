// 运行时配置

import { AxiosResponse, RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { message as MessageBox } from 'antd';
import JSEncrypt from 'jsencrypt';
import { getToken } from './utils/token';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate

export interface InitialStateType {
  name: string;
  token: string;
  menus: Array<IMenu>;
}

interface IMenu {
  id: string;
  parentId: string;
  name: string;
  path: string;
  children?: Array<IMenu>;
  [key: string]: string | Array<IMenu> | undefined | number;
}

export async function getInitialState(): Promise<InitialStateType> {
  const token = getToken();
  // TODO: 返回权限菜单
  let menus: Array<IMenu> = [];
  if (token) {
    menus = [
      {
        id: '1',
        parentId: '0',
        name: '首页',
        path: '/home',
      },
      {
        id: '2',
        parentId: '0',
        name: '权限',
        path: '/access',
      },
      {
        id: '3',
        parentId: '0',
        name: '表格',
        path: '/table',
      },
    ];
  }
  return { name: 'admin', token, menus };
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    title: 'admin',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};

// 设置网络请求拦截器
export const request: RequestConfig = {
  requestInterceptors: [
    (url, options) => {
      const token = getToken();
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: token,
        };
      }
      // api安全信息
      const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCo+pGcOYV/NzPQDaOVZ+mEXERpr1MWc4auQrqWurLPLpsPKsXGSuFmdRQdppoRnUuHfKnHJtCDXh8U28EHzLWYzuHOWyeYroBcLD5glYZw3n2mDJFW9G61nxyfuyPVyqeE7sM9siRHqEXSDQjUjk/7+84FULjoFpI/uRBv+XIPcQIDAQAB`;
      const timer = Date.now();
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey);

      options.headers = {
        ...options.headers,
        ['api-encrypt-str']: encrypt.encrypt(`${timer}`),
      };

      return { url, options };
    },
  ],
  responseInterceptors: [
    [
      (response: AxiosResponse) => {
        return response;
      },
      (error: any) => {
        let message = '';
        switch (error.response.status) {
          case 400:
            message = '请求错误(400)';
            break;
          case 401:
            message = '未授权，请重新登录(401)';
            // 这里可以做清空storage并跳转到登录页的操作
            break;
          case 403:
            message = '拒绝访问(403)';
            break;
          case 404:
            message = '请求出错(404)';
            break;
          case 408:
            message = '请求超时(408)';
            break;
          case 500:
            message = '服务器错误(500)';
            break;
          case 501:
            message = '服务未实现(501)';
            break;
          case 502:
            message = '网络错误(502)';
            break;
          case 503:
            message = '服务不可用(503)';
            break;
          case 504:
            message = '网络超时(504)';
            break;
          case 505:
            message = 'HTTP版本不受支持(505)';
            break;
          default:
            message = `连接出错(${error.response.status})!`;
        }
        // 这里错误消息可以使用全局弹框展示出来
        MessageBox.error(message);
        return Promise.reject(error.response);
      },
    ],
  ],
};
