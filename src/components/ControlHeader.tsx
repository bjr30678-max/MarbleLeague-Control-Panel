import { useAuth } from '@/contexts/AuthContext';
import { ControlOutlined, LogoutOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';

const ControlHeader: React.FC = () => {
  const { operator, logout } = useAuth();
  const { modal } = App.useApp();

  const handleLogout = () => {
    modal.confirm({
      title: '登出確認',
      content: '確定要登出系統嗎？',
      okText: '確認',
      cancelText: '取消',
      onOk: logout,
    });
  };

  const initial = operator?.name?.charAt(0) || 'O';

  return (
    <div className="control-header">
      <div className="header-brand">
        <div className="header-logo">
          <ControlOutlined style={{ color: '#fff' }} />
        </div>
        <span className="header-title">遊戲控制台</span>
      </div>
      <div className="header-right">
        <div className="operator-badge">
          <div className="operator-avatar">{initial}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {operator?.name || '-'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {operator?.role === 'admin' ? '系統管理員' : '操作員'}
            </div>
          </div>
        </div>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ color: 'var(--text-secondary)' }}
        >
          登出
        </Button>
      </div>
    </div>
  );
};

export default ControlHeader;
