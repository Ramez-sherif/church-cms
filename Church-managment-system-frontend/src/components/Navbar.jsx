import {
    Menu,
    LogOut,
    User
} from 'lucide-react';

import {
    useNavigate
} from 'react-router-dom';

import useAuthStore
    from '../store/useAuthStore';

const Navbar = ({
    toggleSidebar
}) => {

    const {
        user,
        logout
    } = useAuthStore();

    const navigate =
        useNavigate();

    // =========================
    // Logout
    // =========================
    const handleLogout =
        async () => {

            await logout();

            navigate('/login');
        };

    // =========================
    // Service Role Label
    // =========================
    const getRoleLabel = () => {

        // =========================
        // Fathers
        // =========================
        if (user?.role === 'FATHER') {
            return 'أب كاهن';
        }

        // =========================
        // Students
        // =========================
        if (user?.role === 'STUDENT') {
            return 'مخدوم';
        }

        // =========================
        // Service Roles
        // =========================
        switch (user?.serviceRole) {

            case 'GENERAL_ADMIN':
                return 'أمين الخدمة';

            case 'STAGE_ADMIN':
                return 'مسؤول مرحلة';

            case 'STAGE_LEADER':
                return 'أمين مرحلة';

            case 'ASSISTANT_STAGE_LEADER':
                return 'مساعد أمين مرحلة';

            case 'STAGE_GROUP_LEADER':
                return 'أمين مجموعة';

            case 'ASSISTANT_STAGE_GROUP_LEADER':
                return 'مساعد أمين مجموعة';

            case 'CLASS_SERVANT':
                return 'أمين فصل';

            default:
                return 'خادم';
        }
    };

    return (

        <nav className="navbar-shell">

            {/* =========================
          Right Section
      ========================= */}
            <div className="navbar-right">

                <button
                    className="mobile-menu-btn"
                    onClick={toggleSidebar}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >

                    <Menu size={24} />

                </button>

            </div>

            {/* =========================
          Left Section
      ========================= */}
            <div
                className="navbar-left"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem'
                }}
            >

                {/* =========================
            User Profile
        ========================= */}
                <div className="user-profile">

                    <div
                        className="user-info"
                        style={{
                            textAlign: 'left',
                            marginRight: '0.5rem'
                        }}
                    >

                        {/* Username */}
                        <div
                            style={{
                                fontWeight: '600',
                                fontSize: '0.875rem'
                            }}
                        >

                            {
                                user?.fullName
                                || user?.username
                                || 'مستخدم'
                            }

                        </div>

                        {/* Role */}
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)'
                            }}
                        >

                            {getRoleLabel()}

                        </div>

                    </div>

                    {/* Avatar */}
                    <div className="user-avatar">

                        <User size={20} />

                    </div>

                </div>

                {/* =========================
            Logout
        ========================= */}
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                >

                    <LogOut size={18} />

                    <span>
                        تسجيل الخروج
                    </span>

                </button>

            </div>

            {/* =========================
          Mobile Style
      ========================= */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
            @media (max-width: 768px) {

              .mobile-menu-btn {

                display: block !important;
              }
            }
          `
                }}
            />

        </nav>
    );
};

export default Navbar;