// Context for auth state across the app
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('c2c_token');
    if (token) {
      api.me()
        .then(d => setUser(d.user))
        .catch(() => localStorage.removeItem('c2c_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('c2c_token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (fields) => {
    const data = await api.register(fields);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('c2c_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
