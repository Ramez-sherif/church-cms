import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Loader2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import axiosInstance from '../api/axiosInstance';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Login to get tokens
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });

      const { accessToken, refreshToken } = response.data;
      
      // 2. Save tokens to store
      setAuth(accessToken, refreshToken);

      // 3. Fetch user profile data
      const userResponse = await axiosInstance.get('/auth/me');
      setUser(userResponse.data);

      navigate('/dashboard/home');
    } catch (err) {
      setError('خطأ في اسم المستخدم أو كلمة المرور');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url("/bg5.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      direction: 'rtl',
      fontFamily: 'Cairo, sans-serif'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }} />

      <div className="login-card" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>تسجيل الدخول</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>مرحباً بك في نظام إدارة الكنيسة</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>اسم المستخدم</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  fontSize: '1rem'
                }}
                placeholder="اسم المستخدم"
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  fontSize: '1rem'
                }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background 0.2s'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'دخول'}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default LoginPage;
