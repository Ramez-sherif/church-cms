import { Menu, LogOut, User } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-shell">
      <div className="navbar-right">
        <button 
          className="mobile-menu-btn" 
          onClick={toggleSidebar}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div className="user-profile">
          <div className="user-info" style={{ textAlign: 'left', marginRight: '0.5rem' }}>
            <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.username || user?.name || 'مستخدم'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role || 'مسؤول'}</div>
          </div>
          <div className="user-avatar">
            <User size={20} />
          </div>
        </div>
        
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
        }
      `}} />
    </nav>
  );
};

export default Navbar;
