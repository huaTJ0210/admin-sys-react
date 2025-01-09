import { IResponseList } from '@/types';
import { httpGet, httpPost } from '@/utils/request';
import { IApp, ICategory, ITemplate, ITemplateDTO } from './type';

export async function getTemplateList(params: any) {
  return httpPost<IResponseList<ITemplate>>(
    '/api/trace/trace_template/list_page',
    {
      ...params,
    },
  );
}

export async function getBaseTemplateList() {
  return httpPost<IResponseList<ITemplate>>(
    '/api/trace/trace_base_template/list',
    {
      pageSize: 4,
      pageNum: 1,
    },
  );
}

export async function getCategoryList() {
  return httpPost<Array<ICategory>>('/api/trace/trace_category/query_tree');
}

export async function getAppList() {
  return httpGet<Array<IApp>>('/api/sys/dicapp/noPageAll');
}

export async function getTemplateInfo(templateName: string) {
  return httpPost<ITemplate>('/api/trace/trace_template/info', {
    templateName,
  });
}

export async function addOrEditTemplate(
  template: ITemplateDTO,
  isEdit: boolean,
) {
  const api = isEdit
    ? '/api/trace/trace_template/update'
    : '/api/trace/trace_template/save';
  return httpPost(api, {
    ...template,
  });
}

export async function deleteTemplate(id: string) {
  return httpPost('/api/trace/trace_template/delete', { templateName: id });
}
