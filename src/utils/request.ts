import { request } from '@umijs/max';
import { message as MessageBox } from 'antd';

type Result<T> = {
  status?: number;
  message: string;
  success?: boolean;
  data?: T;
};

export async function httpRequest<T>(
  url: string,
  method: string,
  params?: any,
  body?: any,
  options?: { [key: string]: any },
) {
  try {
    const { status, message, data } = await request<Result<T>>(url, {
      method,
      params,
      data: body || {},
      ...(options || {}),
    });
    if (status !== 200) {
      MessageBox.error(message);
    }
    return { data, success: status === 200, message };
  } catch (error) {
    return { success: false };
  }
}

export async function httpGet<T>(
  url: string,
  params?: any,
  options?: { [key: string]: any },
) {
  return httpRequest<T>(url, 'GET', params, null, options);
}

export async function httpPost<T>(
  url: string,
  body?: any,
  options?: { [key: string]: any },
) {
  return httpRequest<T>(url, 'POST', null, body, options);
}

export async function getLoginPage() {
  return httpPost<{ name: string }>('/api/sys/t_sys_frontpage_config/list', {
    appCode: 'huantai',
  });
}
