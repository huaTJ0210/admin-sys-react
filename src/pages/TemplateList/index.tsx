import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import React, { useCallback, useRef, useState } from 'react';

import { Button, Drawer, message, Modal, Space, Tag } from 'antd';

import {
  deleteTemplate,
  getAppList,
  getTemplateList,
} from '@/services/template';
import { ITemplate } from '@/services/template/type';
import { PlusOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { CreateUpdateForm } from './CreateUpdateForm';

const TemplateList: React.FC = () => {
  // 操作表格
  const actionRef = useRef<ActionType>();
  //  查看
  const [row, setRow] = useState<ITemplate>();
  // 提示框
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  //操作表单
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const closeFormModal = useCallback((refresh: boolean) => {
    setFormModalVisible(false);
    // 重置状态（编辑->初始）
    setSelectedId('');
    if (refresh) {
      messageApi.open({ type: 'success', content: '保存成功' });
      actionRef.current?.reload();
    }
  }, []);

  //#region 删除数据项
  const { run: deleteRun, loading } = useRequest(
    (id: string) => deleteTemplate(id),
    {
      onSuccess: () => {
        actionRef.current?.reload();
      },
      manual: true,
    },
  );
  const handleDeleteItem = async (id: string) => {
    const confirmed = await modal.confirm({
      title: '提示',
      content: '确认删除此项数据？',
    });
    if (confirmed) {
      deleteRun(id);
    }
  };
  //#endregion

  //#region 配置表格显示
  const columns: ProColumns<ITemplate, 'text'>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      dataIndex: 'templateName',
      title: '展示页模板名称',
    },
    {
      dataIndex: 'useNum',
      title: '使用数量',
      hideInSearch: true,
      width: 100,
    },
    {
      dataIndex: 'categoryName',
      title: '品类名称',
      ellipsis: true,
    },
    {
      dataIndex: 'appCode',
      title: '项目名称',
      hideInTable: true,
      hideInDescriptions: true,
      valueType: 'select',
      // 搜索栏中下拉框的数据源，需要数据转化
      request: async () => {
        const { data, success } = await getAppList();
        let list: Array<{ label: string; value: string }> = [];
        if (success) {
          list = (data || []).map((app) => ({
            label: app.name,
            value: app.code,
          }));
        }
        return list;
      },
    },
    {
      dataIndex: 'appName',
      title: '关联项目',
      hideInSearch: true,
      ellipsis: true,
      // 表格单元需要自定义渲染内容
      render: (_, record) => {
        const appList = record.appName?.split(',') || [];

        return (
          <Space>
            {appList.map((name) => (
              <Tag color="blue" key={name}>
                {name}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 240,
      render: (text, record, index) => {
        return (
          <Space key={index} size="middle">
            <Button
              color="primary"
              variant="filled"
              autoInsertSpace={false}
              onClick={() => {
                setRow(record);
              }}
            >
              查看
            </Button>
            <Button
              color="primary"
              variant="filled"
              autoInsertSpace={false}
              onClick={() => {
                setSelectedId(record.templateName);
                setFormModalVisible(true);
              }}
            >
              编辑
            </Button>

            <Button
              color="danger"
              variant="filled"
              autoInsertSpace={false}
              onClick={() => {
                handleDeleteItem(record.templateName);
              }}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  //#endregion

  return (
    <PageContainer header={{ title: '模板列表' }}>
      <ProTable
        rowKey="templateName"
        loading={loading}
        actionRef={actionRef}
        cardBordered
        headerTitle="模板管理列表"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <Button
            disabled={formModalVisible}
            key="button-add"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedId('');
              setFormModalVisible(true);
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        request={async (params) => {
          const { current } = params;
          const { data, success } = await getTemplateList({
            ...params,
            pageNum: current,
          });
          return {
            data: data?.list || [],
            success,
            total: data?.total,
          };
        }}
      />
      {/* ---------表单--------- */}
      <CreateUpdateForm
        open={formModalVisible}
        templateName={selectedId}
        closeFormModal={closeFormModal}
      ></CreateUpdateForm>
      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={true}
      >
        {row && (
          <ProDescriptions<ITemplate>
            column={2}
            title="详情"
            request={async () => ({
              data: row || {},
            })}
            columns={columns as ProDescriptionsItemProps<ITemplate, 'text'>[]}
          />
        )}
      </Drawer>
      {contextHolder}
      {modalContextHolder}
    </PageContainer>
  );
};

export default TemplateList;
