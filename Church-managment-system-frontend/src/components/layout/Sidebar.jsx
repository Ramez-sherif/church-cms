import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import {
  Home,
  Users,
  UserCheck,
  GraduationCap,
  Settings,
  Contact,
  BookOpen
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const user = useAuthStore((state) => state.user);

  const navItems = [
    { name: 'الرئيسية', path: '/home', icon: Home, roles: ['ADMIN', 'TEACHER', 'FATHER'] },
    { name: 'المراحل الدراسية', path: '/class-grades', icon: GraduationCap, roles: ['ADMIN', 'TEACHER'] },
    { name: 'المعلمين', path: '/teachers', icon: Users, roles: ['ADMIN'] },
    { name: 'الطلاب', path: '/students', icon: Contact, roles: ['ADMIN', 'TEACHER'] },
    { name: 'المنهج', path: '/lessons', icon: BookOpen, roles: ['ADMIN', 'TEACHER', 'FATHER'] },
    { name: 'الخادمين', path: '/attendance', icon: UserCheck, roles: ['ADMIN', 'TEACHER', 'FATHER'] },
  ];

  const filteredItems = navItems.filter(item =>
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <span className="logo-text">نظام إدارة الكنيسة</span>
      </div>

      <nav className="sidebar-nav">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="nav-item">
          <Settings size={20} />
          <span>الإعدادات</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
