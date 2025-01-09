import { ISelectOptionItem } from '@/types';

export interface ITemplate {
  appCode: string;
  appName: string;
  applyScopes: string;
  baseObsUrl?: string;
  baseTemplateCode?: string;
  baseTemplateName: string;
  categoryCode?: string;
  categoryName: string;
  createTime?: string;
  createUserId?: string;
  did?: string;
  id?: string;
  isDel?: string;
  templateName: string;
  updateTime?: string;
  updateUserId?: string;
  useNum: number;
}

export interface IApp {
  code: string;
  name: string;
  [key: string]: string | Array<IApp>;
}

export interface ICategory {
  categoryCode: string;
  categoryName: string;
  did: string;
  firstCategoryCode: string;
  id: string;
  name: string;
  parentCode: string;
  parentId: string;
  secondCategoryCode: string;
  thirdCategoryCode: string;
  weight: number;
  children: Array<ICategory>;
}

export interface ITemplateDTO {
  templateName: string;
  baseTemplateCode: ISelectOptionItem;
  baseTemplateName: string;
  appCode: ISelectOptionItem;
  appName: string;
  applyScopes: string | Array<string>;
  categoryCode: Array<ISelectOptionItem>;
}
