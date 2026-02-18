import { useAuth } from '@/contexts/AuthContext';
import { LockOutlined, UserOutlined, ControlOutlined } from '@ant-design/icons';
import { App, Button, Form, Input } from 'antd';
import { useState } from 'react';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '登入失敗，請檢查網路連線';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <ControlOutlined style={{ color: '#fff' }} />
        </div>
        <h1 className="login-title">遊戲控制台</h1>
        <p className="login-subtitle">MarbleLeague Control Panel</p>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '請輸入帳號' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="帳號"
              style={{
                background: 'var(--bg-inner)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                height: 48,
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '請輸入密碼' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="密碼"
              style={{
                background: 'var(--bg-inner)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                height: 48,
              }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7b61ff, #1e90ff)',
                border: 'none',
                boxShadow: '0 4px 16px rgba(123, 97, 255, 0.35)',
              }}
            >
              登入
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
