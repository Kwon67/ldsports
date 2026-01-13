'use client';

import { useState, FormEvent, ChangeEvent, CSSProperties } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { getApiUrl } from '@/config/api';

interface Styles {
  [key: string]: CSSProperties;
}

function AdminLogin() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${getApiUrl()}/admin/login`, { username, password });

      if (response.data.success) {
        login(response.data.token);
        router.push('/admin/dashboard');
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 401) {
        setError('Usuário ou senha incorretos.');
      } else if (axiosError.request) {
        setError('Servidor offline. Verifique a conexão.');
      } else {
        setError('Erro ao fazer login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img
          src="https://res.cloudinary.com/diuh0ditl/image/upload/v1765501937/BackgroundEraser_20251211_221124500_mwzsto.png"
          alt="Fedora"
          style={styles.fedoraLogo}
        />
        <p style={styles.poweredBy}>Painel Administrativo</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>
          LD<span style={{ color: '#3c6eb4' }}>SPORTS</span>
        </h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
              style={styles.input}
              placeholder="Digite seu usuário"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>
      </div>

      <p style={styles.footer}>
        © 2024 LDSports • Desenvolvido por <span style={{ color: '#3c6eb4' }}>Kwon67</span>
      </p>
    </div>
  );
}

const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: 'system-ui, sans-serif',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: 30,
  },
  fedoraLogo: {
    width: 120,
    height: 120,
    objectFit: 'contain',
    marginBottom: 10,
  },
  poweredBy: {
    color: '#666',
    fontSize: 14,
    margin: 0,
  },
  card: {
    backgroundColor: '#151515',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 380,
    border: '1px solid #252525',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 24,
    marginTop: 0,
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    padding: '12px 16px',
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 14,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    backgroundColor: '#3c6eb4',
    color: '#fff',
    padding: 16,
    borderRadius: 10,
    border: 'none',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
  },
  footer: {
    color: '#444',
    fontSize: 12,
    marginTop: 30,
  },
};

export default AdminLogin;
