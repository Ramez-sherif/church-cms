import { ShieldAlert, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      direction: 'rtl',
      fontFamily: 'Cairo, sans-serif'
    }}>
      <ShieldAlert size={80} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
        غير مصرح بالدخول
      </h1>
      <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '500px' }}>
        عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة. يرجى التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.
      </p>
      <button
        onClick={() => navigate('/home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1.5rem',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        <Home size={20} />
        العودة للرئيسية
      </button>
    </div>
  );
};

export default UnauthorizedPage;
