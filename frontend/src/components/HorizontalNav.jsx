<<<<<<< HEAD
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

=======
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ profile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div style={navWrapper}>
      <div style={navInner}>

        {/* LEFT SIDE - BIGGER CROP ICON + PROJECT NAME */}
        <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flex: "1", minWidth: "160px" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M12 20V12" stroke="#1f6b3a" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M12 12C12 8 9 6 6 6C6 9 9 12 12 12Z" fill="#4f9d44" />
            <path d="M12 12C12 8 15 6 18 6C18 9 15 12 12 12Z" fill="#6fbf73" />
          </svg>
          <span style={projectNameStyle}>SoilTwin</span>
        </NavLink>

        {/* NAV LINKS */}
        <div style={navLinks}>
          <NavLink to="/" style={navStyle}>Home</NavLink>
          <NavLink to="/dashboard" style={navStyle}>Dashboard</NavLink>
          <NavLink to="/profile-data" style={navStyle}>Profile & Data</NavLink>
          <NavLink to="/soil-health" style={navStyle}>Soil Health</NavLink>
          <NavLink to="/live-events" style={navStyle}>Live Events</NavLink>
          <NavLink to="/advisory-chat" style={navStyle}>Advisory Chat</NavLink>
          <NavLink to="/simulation" style={navStyle}>Simulation</NavLink>
        </div>

        {/* RIGHT SIDE - PROFILE INFO */}
        <div style={rightSection}>

          {/* Farmer Profile Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="#4f9d44" />
            <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" fill="#1f6b3a" />
          </svg>

          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
            <span style={{ fontSize: "13px", color: "#5f7d6e" }}>
              Logged in as
            </span>
            <span style={{ fontSize: "16px", fontWeight: "600", color: "#0f2e1c" }}>
              {profile?.name}
            </span>
          </div>

          <span style={roleStyle}>
            {profile?.role}
          </span>

          <button onClick={handleLogout} style={logoutStyle}>
            Logout
          </button>

        </div>

      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const navWrapper = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  backdropFilter: "blur(12px)",
  background: "rgba(238, 242, 240, 0.95)",
  borderBottom: "1px solid #d7e2db"
};

const navInner = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "18px 48px",
  display: "flex",
  alignItems: "center",
  gap: "0",
};

const leftSection = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flex: "1",             // take equal space so center links are truly centered
  minWidth: "160px",
};

const projectNameStyle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#0f2e1c"
};

const navLinks = {
  display: "flex",
  gap: "6px",
  alignItems: "center",
  flex: "0 0 auto",      // don't grow — stay centered between the two flex-1 sides
};

const navStyle = ({ isActive }) => ({
  padding: "10px 20px",
  borderRadius: "30px",
  textDecoration: "none",
  fontSize: "16px",   // 🔥 larger text
  fontWeight: "500",
  color: isActive ? "white" : "#2f4f3a",
  backgroundColor: isActive ? "#1f6b3a" : "transparent",
  transition: "0.25s ease"
});

const rightSection = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  flex: "1",                   // mirror leftSection so nav links stay centered
  justifyContent: "flex-end",
};

const roleStyle = {
  backgroundColor: "#e6f2ea",
  color: "#1f6b3a",
  padding: "8px 16px",
  borderRadius: "20px",
  fontSize: "14px",
  fontWeight: "600"
};

const logoutStyle = {
  padding: "10px 20px",
  borderRadius: "25px",
  border: "1px solid #d2ddd7",
  backgroundColor: "white",
  textDecoration: "none",
  fontWeight: "500",
  color: "#c0392b"
};

export default Navbar;
>>>>>>> df922889ce3a92ea64a7083a83bf9092b0b7935b
