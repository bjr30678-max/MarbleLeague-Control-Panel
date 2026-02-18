import LoginForm from '@/components/LoginForm';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Spin, theme } from 'antd';
import { ConfigProvider, App as AntApp } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const ControlPanel = lazy(() => import('@/components/ControlPanel'));

const { darkAlgorithm } = theme;

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Suspense fallback={
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
                <Spin size="large" />
              </div>
            }>
              <ControlPanel />
            </Suspense>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhTW}
      theme={{
        algorithm: darkAlgorithm,
        token: {
          colorPrimary: '#7b61ff',
          colorBgContainer: '#212433',
          colorBgElevated: '#212433',
          colorBgLayout: '#0f1117',
          colorBorder: 'rgba(255, 255, 255, 0.06)',
          colorBorderSecondary: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 8,
          colorText: '#eaecef',
          colorTextSecondary: '#848e9c',
        },
        components: {
          Card: {
            headerBg: 'transparent',
          },
          Input: {
            colorBgContainer: '#181b25',
          },
          Select: {
            colorBgContainer: '#181b25',
          },
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
};

export default App;
