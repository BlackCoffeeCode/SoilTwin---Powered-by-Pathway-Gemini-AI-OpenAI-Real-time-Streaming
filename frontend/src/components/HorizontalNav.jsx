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
