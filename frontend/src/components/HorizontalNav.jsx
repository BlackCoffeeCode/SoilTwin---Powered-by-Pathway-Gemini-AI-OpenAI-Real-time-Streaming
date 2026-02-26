import {
    LayoutDashboard,
    Sprout,
    Activity,
    MessageSquareText,
    FlaskConical,
    Settings,
    User,
    Home as HomeIcon,
    LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HorizontalNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'AI Dashboard + Home', path: '/', roles: ['admin', 'farmer'] },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'farmer'] },
        { icon: User, label: 'Profile & Data', path: '/profile', roles: ['admin', 'farmer'] },
        { icon: Sprout, label: 'Soil Health', path: '/trends', roles: ['admin', 'farmer'] },
        { icon: Activity, label: 'Live Events', path: '/history', roles: ['admin', 'farmer'] },
        { icon: MessageSquareText, label: 'Advisory Chat', path: '/plan', roles: ['admin', 'farmer'] },
        { icon: FlaskConical, label: 'Simulation', path: '/map', roles: ['admin', 'farmer'] },
        { icon: Settings, label: 'Admin Settings', path: '/admin', roles: ['admin'] },  // Admin only
    ];

    // Filter nav items based on user role
    const visibleNavItems = navItems.filter(item =>
        !item.roles || item.roles.includes(user?.role || 'farmer')
    );

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="horizontal-nav">
            {/* Logo */}
            <div className="nav-logo">
                <Sprout className="w-6 h-6 text-forest-green" />
                <span className="text-xl font-bold" style={{ fontFamily: "'Libre Baskerville', serif", color: '#2D5016' }}>
                    SoilTwin
                </span>
            </div>

            {/* Nav Items */}
            <div className="nav-items">
                {visibleNavItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-tab ${isActive(item.path) ? 'active' : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* User Menu */}
            <div className="user-menu" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginLeft: 'auto',
                paddingRight: '2rem'
            }}>
                <span style={{
                    fontSize: '0.9rem',
                    color: '#4a5568',
                    fontWeight: '500'
                }}>
                    {user?.username || 'User'}
                </span>
                <span style={{
                    fontSize: '0.8rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    background: user?.role === 'admin' ? 'rgba(147, 51, 234, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: user?.role === 'admin' ? '#9333ea' : '#22c55e',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {user?.role === 'admin' ? '👑 Admin' : '👨‍🌾 Farmer'}
                </span>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(220, 38, 38, 0.1)',
                        border: '1px solid rgba(220, 38, 38, 0.3)',
                        borderRadius: '8px',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(220, 38, 38, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(220, 38, 38, 0.1)';
                    }}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default HorizontalNav;

