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

const Sidebar = ({
  isOpen,
  toggleSidebar
}) => {

  const user =
    useAuthStore(
      (state) => state.user
    );

  // =========================
  // Auth Helpers
  // =========================
  const isTeacher =
    user?.role === 'TEACHER';

  const isFather =
    user?.role === 'FATHER';

  const isGeneralAdmin =
    user?.serviceRole
    === 'GENERAL_ADMIN';

  const isStageAdmin =
    user?.serviceRole
    === 'STAGE_ADMIN';

  const isStageLeader =
    user?.serviceRole
    === 'STAGE_LEADER';

  const isAssistantStageLeader =
    user?.serviceRole
    === 'ASSISTANT_STAGE_LEADER';

  const isStageGroupLeader =
    user?.serviceRole
    === 'STAGE_GROUP_LEADER';

  const isAssistantStageGroupLeader =
    user?.serviceRole
    === 'ASSISTANT_STAGE_GROUP_LEADER';

  const isClassServant =
    user?.serviceRole
    === 'CLASS_SERVANT';

  // =========================
  // Permissions
  // =========================
  const canManageSystem =
    isGeneralAdmin ||
    isStageAdmin;

  const canAccessLessons =
    isFather ||
    isTeacher;

  const canAccessAttendance =
    isTeacher;

  const canManageStudents =
    isTeacher;

  const canManageTeachers =
    isGeneralAdmin ||
    isStageAdmin;

  const canManageClassGrades =
    isGeneralAdmin ||
    isStageAdmin;

  // =========================
  // Navigation Items
  // =========================
  const navItems = [

    // =========================
    // Home
    // =========================
    {
      name: 'الرئيسية',
      path: '/dashboard/home',
      icon: Home,
      visible: true
    },

    // =========================
    // Class Grades
    // =========================
    {
      name: 'المراحل الدراسية',
      path: '/dashboard/class-grades',
      icon: GraduationCap,
      visible: canManageClassGrades
    },

    // =========================
    // Teachers
    // =========================
    {
      name: 'الخدام',
      path: '/dashboard/teachers',
      icon: Users,
      visible: canManageTeachers
    },

    // =========================
    // Students
    // =========================
    {
      name: 'الطلاب',
      path: '/dashboard/students',
      icon: Contact,
      visible: canManageStudents
    },

    // =========================
    // Lessons
    // =========================
    {
      name: 'المنهج',
      path: '/dashboard/lessons',
      icon: BookOpen,
      visible: canAccessLessons
    },

    // =========================
    // Attendance
    // =========================
    {
      name: 'الغياب والحضور',
      path: '/dashboard/attendance',
      icon: UserCheck,
      visible: canAccessAttendance
    }
  ];

  // =========================
  // Filter Items
  // =========================
  const filteredItems =
    navItems.filter(
      (item) => item.visible
    );

  return (

    <aside
      className={`sidebar ${isOpen ? 'open' : ''
        }`}
    >

      {/* =========================
          Header
      ========================= */}
      <div className="sidebar-header">

        <span className="logo-text">
          نظام إدارة الكنيسة
        </span>

      </div>

      {/* =========================
          Navigation
      ========================= */}
      <nav className="sidebar-nav">

        {filteredItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''
              }`
            }
            onClick={() =>
              window.innerWidth < 768
              && toggleSidebar()
            }
          >

            <item.icon size={20} />

            <span>
              {item.name}
            </span>

          </NavLink>

        ))}

      </nav>

      {/* =========================
          Footer
      ========================= */}
      <div
        className="sidebar-footer"
        style={{
          padding: '1rem',
          borderTop:
            '1px solid var(--border-color)'
        }}
      >

        <div className="nav-item">

          <Settings size={20} />

          <span>
            الإعدادات
          </span>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;