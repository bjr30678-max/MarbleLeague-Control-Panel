import { STORAGE_KEYS } from '@/constants';
import { controlService } from '@/services/control.service';
import type { Operator } from '@/types';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthState {
  sessionId: string | null;
  operator: Operator | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);

  // 啟動時從 sessionStorage 恢復
  useEffect(() => {
    const storedSession = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
    const storedOperator = sessionStorage.getItem(STORAGE_KEYS.OPERATOR);

    if (storedSession && storedOperator) {
      setSessionId(storedSession);
      setOperator(JSON.parse(storedOperator));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    let data;
    try {
      data = await controlService.login(username, password);
    } catch (err: unknown) {
      // Axios 網路錯誤或 proxy 失敗
      const axiosErr = err as { response?: { data?: { error?: string } } };
      const serverMsg = axiosErr?.response?.data?.error;
      throw new Error(serverMsg || '系統連線失敗，請稍後再試');
    }

    if (!data.success) {
      throw new Error(data.error || '登入失敗');
    }

    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, data.sessionId);
    sessionStorage.setItem(STORAGE_KEYS.OPERATOR, JSON.stringify(data.operator));
    setSessionId(data.sessionId);
    setOperator(data.operator);
  }, []);

  const logout = useCallback(() => {
    controlService.logout().catch(() => {});
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    sessionStorage.removeItem(STORAGE_KEYS.OPERATOR);
    setSessionId(null);
    setOperator(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        sessionId,
        operator,
        isAuthenticated: !!sessionId,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
