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
            Church Branding
        ========================= */}
                <div
                    className="navbar-brand"
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                    <img
                        src="/churchlogoHome.png"
                        alt="Church Logo"
                        className="navbar-church-logo"
                        style={{
                            width: '52px',
                            height: '52px',
                            objectFit: 'contain',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            padding: '4px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    />
                    <span
                        className="navbar-church-name"
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        كنيسة السيدة العذراء - العباسية الشرقية
                    </span>
                </div>

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

              .navbar-church-logo {
                width: 42px !important;
                height: 42px !important;
              }

              .navbar-church-name {
                display: none !important;
              }
            }
          `
                }}
            />

        </nav>
    );
};

export default Navbar;