import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Download,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Moon,
  Sun,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/export', label: 'Export Data', icon: Download },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const sidebarContent = (
    <div className={`sidebar-inner ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-container">
          <GraduationCap className="brand-icon" size={28} />
        </div>
        {!isCollapsed && (
          <div className="brand-text">
            <h2>admin</h2>
            <span>Student Management</span>
          </div>
        )}
        {/* Mobile close button */}
        <button
          className="mobile-close-btn"
          onClick={() => setIsMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} className="nav-icon" />
                  {!isCollapsed && <span className="nav-label">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / User Profile & Controls */}
      <div className="sidebar-footer">
        {/* Theme Toggle Button */}
        <button
          className="footer-action-btn theme-toggle"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>}
        </button>

        {/* User preview */}
        {!isCollapsed && user && (
          <div className="user-mini-card">
            <div className="user-avatar-mini">
              {user.email ? user.email.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="user-info-mini">
              <span className="user-name">Placement Officer</span>
              <span className="user-email">{user.email || 'admin@gmail.com'}</span>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          className="footer-action-btn logout-btn"
          onClick={handleLogout}
          title="Sign out of portal"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle (Desktop only) */}
        <button
          className="desktop-collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`sidebar desktop-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-backdrop"
            onClick={() => setIsMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-drawer"
              onClick={(e) => e.stopPropagation()}
            >
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
