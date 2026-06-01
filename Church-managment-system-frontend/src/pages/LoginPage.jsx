import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  User,
  Loader2,
  ArrowRight,
  Church
} from 'lucide-react';

import useAuthStore from '../store/useAuthStore';
import axiosInstance from '../api/axiosInstance';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validation Errors state
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useAuthStore((state) => state.setUser);

  // =========================
  // Redirect Logic
  // =========================
  const getRedirectPath = (user) => {
    if (user?.role === 'FATHER') {
      return '/dashboard/lessons';
    }
    if (user?.serviceRole === 'GENERAL_ADMIN') {
      return '/dashboard/home';
    }
    if (user?.serviceRole === 'STAGE_ADMIN') {
      return '/dashboard/class-grades';
    }
    if (
      user?.serviceRole === 'STAGE_LEADER' ||
      user?.serviceRole === 'ASSISTANT_STAGE_LEADER'
    ) {
      return '/dashboard/students';
    }
    if (
      user?.serviceRole === 'STAGE_GROUP_LEADER' ||
      user?.serviceRole === 'ASSISTANT_STAGE_GROUP_LEADER'
    ) {
      return '/dashboard/students';
    }
    if (user?.serviceRole === 'CLASS_SERVANT') {
      return '/dashboard/attendance';
    }
    return '/dashboard/home';
  };

  // =========================
  // Input Changes
  // =========================
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setValidationErrors((prev) => ({ ...prev, username: '' }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setValidationErrors((prev) => ({ ...prev, password: '' }));
  };

  // =========================
  // Frontend Validator
  // =========================
  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'اسم المستخدم مطلوب';
    }

    if (!password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // =========================
  // Login Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run frontend validation
    if (!validateForm()) {
      setError('يرجى تصحيح الأخطاء الموضحة أدناه.');
      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password
      });

      const { accessToken, refreshToken } = response.data;

      // Save Tokens
      setAuth(accessToken, refreshToken);

      // Get User
      const userResponse = await axiosInstance.get('/auth/me');
      const currentUser = userResponse.data;
      setUser(currentUser);

      // Redirect
      navigate(getRedirectPath(currentUser));
    } catch (err) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      }
      setError('خطأ في اسم المستخدم أو كلمة المرور');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("/bg5.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif'
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      />

      {/* Login Card */}
      <div
        className="login-card"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          backgroundColor: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          padding: '2.5rem',
          borderRadius: '28px',
          boxShadow: '0 20px 60px rgba(15,23,42,0.18)',
          zIndex: 1,
          transition: 'all 0.25s ease'
        }}
      >
        {/* Back To Website */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.4rem 1rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
        >
          <ArrowRight size={18} />
          العودة للموقع
        </button>

        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <Church size={48} color="white" />
            </div>
            <h1
              style={{
                fontSize: '42px',
                fontWeight: '800',
                color: '#1e293b',
                textAlign: 'center'
              }}
            >
              تسجيل الدخول
            </h1>
            <p
              style={{
                color: '#64748b',
                marginTop: '0.5rem',
                textAlign: 'center',
                fontSize: '1rem'
              }}
            >
              مرحباً بك في نظام إدارة الكنيسة
            </p>
            {/* Accent line */}
            <div style={{
              width: '40px',
              height: '3px',
              backgroundColor: '#2563eb',
              margin: '0.75rem auto 1.5rem',
              borderRadius: '2px'
            }} />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              textAlign: 'center',
              fontWeight: '600'
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#475569'
              }}
            >
              اسم المستخدم
            </label>
            <div style={{ position: 'relative' }}>
              <User
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}
                size={18}
              />
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = validationErrors.username ? '#ef4444' : '#dbe4ff';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                style={{
                  width: '100%',
                  height: '58px',
                  padding: '0 2.5rem 0 0.75rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #dbe4ff',
                  borderColor: validationErrors.username ? '#ef4444' : '#dbe4ff',
                  borderRadius: '16px',
                  outline: 'none',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                  color: '#1e293b',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                placeholder="اسم المستخدم"
              />
            </div>
            {validationErrors.username && (
              <p
                style={{
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  marginTop: '0.35rem',
                  marginBottom: 0,
                  fontWeight: '600',
                  textAlign: 'right'
                }}
              >
                {validationErrors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#475569'
              }}
            >
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }}
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = validationErrors.password ? '#ef4444' : '#dbe4ff';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                style={{
                  width: '100%',
                  height: '58px',
                  padding: '0 2.5rem 0 0.75rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #dbe4ff',
                  borderColor: validationErrors.password ? '#ef4444' : '#dbe4ff',
                  borderRadius: '16px',
                  outline: 'none',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                  color: '#1e293b',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                placeholder="••••••••"
              />
            </div>
            {validationErrors.password && (
              <p
                style={{
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  marginTop: '0.35rem',
                  marginBottom: 0,
                  fontWeight: '600',
                  textAlign: 'right'
                }}
              >
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              height: '60px',
              fontSize: '20px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'دخول'}
          </button>
        </form>
      </div>

      {/* Animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .animate-spin {
               animation: spin 1s linear infinite;
             }

             @keyframes spin {
               from { transform: rotate(0deg); }
               to { transform: rotate(360deg); }
             }

             /* Input placeholder styling */
             input::placeholder { color: #64748b; opacity: 1; }

             /* Fade-in animation for card */
             .login-card { animation: fadeIn 0.5s ease forwards; opacity: 0; }
             @keyframes fadeIn { to { opacity: 1; } }
          `
        }}
      />
    </div>
  );
};

export default LoginPage;