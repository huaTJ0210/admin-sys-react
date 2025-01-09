import { getLoginPage } from '@/utils/request';
import { setToken } from '@/utils/token';
import { useModel, useNavigate, useRequest } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';

const Login: React.FC = () => {
  //
  const { refresh } = useModel('@@initialState');
  //
  const navigate = useNavigate();
  // 登录
  const { run, error, loading } = useRequest(getLoginPage, {
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (error) => {
      console.log(error);
    },
    manual: true,
  });
  const handleLogin = async () => {
    await run();
    if (!error) {
      // 查询用户基本信息
      setToken('xxxxx');
      refresh();
      //
      navigate('/home');
    }
  };
  return (
    <div>
      <Button loading={loading} onClick={handleLogin}>
        登录
      </Button>
    </div>
  );
};

export default Login;
