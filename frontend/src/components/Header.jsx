import React from 'react';
import { Menu, Bell, Calendar, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          className="mobile-menu-trigger btn-icon"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="header-titles">
          <h1>Student TPO Dashboard</h1>
          <p className="header-subtitle">2nd Year Student Management & Placement Tracking</p>
        </div>
      </div>

      <div className="header-right">
        {/* Date Display */}
        <div className="header-date-badge">
          <Calendar size={15} />
          <span>{formattedDate}</span>
        </div>

        {/* Notification Bell */}
        <button
          className="header-icon-btn btn-icon"
          title="Notifications"
          onClick={() => addToast('System status: All batch databases synchronized', 'info')}
        >
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        {/* Admin User Chip */}
        <div className="admin-chip">
          <div className="admin-avatar">
            <User size={16} />
          </div>
          <div className="admin-meta">
            <span className="admin-title">TPO Officer</span>
            <span className="admin-email">{user?.email || 'admin@gmail.com'}</span>
          </div>
        </div>

        {/* Header Quick Logout */}
        <button
          className="header-logout-btn btn-icon"
          onClick={handleLogout}
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
