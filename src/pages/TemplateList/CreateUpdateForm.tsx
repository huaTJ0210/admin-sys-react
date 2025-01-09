import {
  ModalForm,
  ProForm,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import React, { useEffect, useMemo, useState } from 'react';

import {
  addOrEditTemplate,
  getAppList,
  getBaseTemplateList,
  getCategoryList,
  getTemplateInfo,
} from '@/services/template';
import { ICategory, ITemplateDTO } from '@/services/template/type';
import { flatArray, formatSelectOptions } from '@/utils/format';
import { useRequest } from '@umijs/max';
import { Form } from 'antd';

interface IProps {
  open: boolean;
  templateName?: string;
  closeFormModal: (refresh: boolean) => void;
}

export const CreateUpdateForm: React.FC<IProps> = (props) => {
  const { open, templateName, closeFormModal } = props;
  const isEdit = !!templateName; // 判断当前是否是编辑状态【字段通常是id】
  const [form] = Form.useForm<ITemplateDTO>();

  // 处理品类数据
  const [catagoryList, setCatagoryList] = useState<Array<ICategory>>([]);
  const catagoryFlatList = useMemo(() => {
    return flatArray<ICategory>(catagoryList, 'children');
  }, [catagoryList]);

  //#region -- 编辑状态请求详情数据
  const { run } = useRequest(
    (templateName: string) => getTemplateInfo(templateName),
    {
      onSuccess: (data) => {
        if (data) {
          const {
            templateName,
            baseTemplateCode,
            baseTemplateName,
            appCode,
            appName,
            applyScopes,
            categoryCode,
            categoryName,
          } = data;

          // 品类的默认选择处理
          const codes = categoryCode?.split(',') || [];
          const names = categoryName.split(',') || [];
          const categoryList = codes.map((code, index) => ({
            label: names[index],
            value: code,
          }));

          form.setFieldsValue({
            templateName,
            baseTemplateCode: {
              value: baseTemplateCode,
              label: baseTemplateName,
            },
            appCode: {
              value: appCode,
              label: appName,
            },
            applyScopes: Array.isArray(applyScopes)
              ? applyScopes.split(',')
              : ['2'], // 服务端info接口存在问题
            categoryCode: categoryList,
          });
        }
      },
      manual: true,
    },
  );

  useEffect(() => {
    if (templateName) {
      run(templateName);
    }
  }, [templateName]);
  //#endregion

  //#region -- 新增或者编辑表单
  const { run: addOrEditRun } = useRequest(
    (params) => addOrEditTemplate(params, isEdit),
    {
      onSuccess: () => {
        // 提交完毕，关闭modal，刷新列表
        closeFormModal(true);
      },
      manual: true,
    },
  );
  //#endregion

  return (
    <ModalForm<ITemplateDTO>
      form={form}
      title={isEdit ? '编辑' : '新增'}
      open={open}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => closeFormModal(false),
      }}
      onFinish={async (values) => {
        const {
          categoryCode,
          appCode,
          appName,
          templateName,
          baseTemplateCode,
          baseTemplateName,
        } = values;
        const categoryList = categoryCode.map((item) => {
          return catagoryFlatList.find((e) => e.categoryCode === item.value);
        });
        const appCodeList = [{ appCode, appName }];
        await addOrEditRun({
          templateName,
          baseTemplateCode,
          baseTemplateName,
          categoryList,
          appCodeList,
        });
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="templateName"
          label="展示模板名称"
          tooltip="最长为 24 位"
          placeholder="请输入展示模板名称"
          rules={[
            {
              required: true,
              message: '请输入展示模板名称',
              type: 'string',
            },
            {
              max: 24,
              message: '最长为 24 位',
            },
          ]}
        />

        <ProFormSelect
          request={async () => {
            const { data, success } = await getBaseTemplateList();
            return formatSelectOptions(
              data?.list || [],
              success,
              'name',
              'code',
            );
          }}
          width="md"
          name="baseTemplateCode"
          label="请选择基础模板"
          rules={[
            {
              required: true,
              message: '请选择基础模板',
            },
          ]}
          // -- 设置选择项，同时获取label的值
          fieldProps={{
            labelInValue: true,
            onChange: (values: { value: string; label: React.ReactNode }) => {
              console.log(values);
            },
          }}
          transform={(values) => {
            return {
              baseTemplateCode: values.value,
              baseTemplateName: values.label,
            };
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTreeSelect
          width="md"
          label="请关联品类"
          name="categoryCode"
          placeholder="请选择关联品类"
          allowClear
          secondary
          request={async () => {
            const { data } = await getCategoryList();
            setCatagoryList(data || []);
            return data || [];
          }}
          fieldProps={{
            showSearch: true,
            labelInValue: true,
            autoClearSearchValue: true,
            multiple: true,
            treeCheckable: true,
            fieldNames: {
              label: 'categoryName',
              value: 'categoryCode',
            },
            onChange: (values) => {
              console.log(values);
            },
          }}
        />
        <ProFormSelect
          width="md"
          request={async () => {
            const { data, success } = await getAppList();
            return formatSelectOptions(data || [], success, 'name', 'code');
          }}
          name="appCode"
          label="请关联项目"
          rules={[
            {
              required: true,
              message: '请选择关联项目',
            },
          ]}
          // -- 设置选择项，同时获取label的值
          fieldProps={{
            labelInValue: true,
            onChange: (values: { value: string; label: React.ReactNode }) => {
              console.log(values);
            },
          }}
          transform={(values) => {
            return {
              appCode: values.value,
              appName: values.label,
            };
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormCheckbox.Group
          name="applyScopes"
          layout="horizontal"
          label="适用码类型"
          options={[
            {
              label: '溯源码',
              value: '1',
            },
            {
              label: '品牌码',
              value: '2',
            },
          ]}
          rules={[
            {
              required: true,
              message: '请选择适用码类型',
            },
          ]}
          transform={(values) => {
            return {
              applyScopes: values.join(','),
            };
          }}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
