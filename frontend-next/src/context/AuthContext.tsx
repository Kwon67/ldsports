'use client';

import { createContext, useState, useContext, useCallback, ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper to get initial auth state (runs once on first render)
function getInitialAuthState(): AuthState {
  if (typeof window === 'undefined') {
    // SSR: return loading state
    return { isAuthenticated: false, loading: true };
  }

  try {
    const token = localStorage.getItem('adminToken');
    return { isAuthenticated: !!token, loading: false };
  } catch (e) {
    console.error('Erro ao acessar localStorage:', e);
    return { isAuthenticated: false, loading: false };
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState);

  const login = useCallback((token: string): void => {
    try {
      localStorage.setItem('adminToken', token);
      setAuthState({ isAuthenticated: true, loading: false });
    } catch (e) {
      console.error('Erro ao salvar token:', e);
    }
  }, []);

  const logout = useCallback((): void => {
    try {
      localStorage.removeItem('adminToken');
      setAuthState({ isAuthenticated: false, loading: false });
    } catch (e) {
      console.error('Erro ao remover token:', e);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        login,
        logout,
        loading: authState.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
