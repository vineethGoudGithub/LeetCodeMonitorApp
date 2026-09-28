import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Moon, Sun, Database, Shield, Server, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="page-content"
    >
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Portal Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          System preferences, database connectivity, and appearance options.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Appearance Settings */}
        <div className="dashboard-section" style={{ margin: 0 }}>
          <div className="dashboard-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
              <h3>Theme & Appearance</h3>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Choose your preferred interface theme. Preference is saved automatically in your browser.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <strong style={{ fontSize: '0.95rem' }}>Dark Mode Theme</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
              </div>
            </div>
            <button className="btn btn-secondary" onClick={toggleTheme}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>
        </div>

        {/* Database & System Status */}
        <div className="dashboard-section" style={{ margin: 0 }}>
          <div className="dashboard-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} style={{ color: 'var(--primary)' }} />
              <h3>Database Architecture</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Database Name:</span>
              <strong>student_tpo</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Underlying Tables:</span>
              <span>aiml_ab, aiml_jk, ece_ef, ds_ab</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Unified Registry Table:</span>
              <span>students (436 live rows)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Backend Engine:</span>
              <span>Spring Boot 3.3.4 (Port 8080)</span>
            </div>
          </div>
        </div>

        {/* Administrator Profile */}
        <div className="dashboard-section" style={{ margin: 0 }}>
          <div className="dashboard-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} style={{ color: 'var(--success)' }} />
              <h3>Authentication & Role</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Logged-in Account:</span>
              <strong>{user?.email || 'admin@gmail.com'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>System Role:</span>
              <span className="badge badge-active">Placement Officer (ADMIN)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Session Status:</span>
              <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>Active & Verified</span>
            </div>
          </div>
        </div>

        {/* Future Extensibility Architecture (Section 48) */}
        <div className="dashboard-section" style={{ margin: 0 }}>
          <div className="dashboard-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} style={{ color: 'var(--accent-purple)' }} />
              <h3>Future Extensible Modules</h3>
            </div>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Designed for future expansion without altering the core database schema:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {[
              'Student Login Portal',
              'TPO & Trainer Dual Auth',
              'JWT Token Authentication',
              'Excel / CSV Drag & Drop Import',
              'Live LeetCode Graph API Fetcher',
              'GitHub Commit Analytics',
              'Company Drive Management',
              'Offer Letter & CTC Tracker',
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
