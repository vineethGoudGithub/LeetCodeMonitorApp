import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Mail,
  GraduationCap,
  Building,
  Layers,
  Code2,
  Github,
  Linkedin,
  CheckCircle,
  Award,
  Sparkles,
} from 'lucide-react';
import { getInitials, getAvatarColor } from './StudentTable';

export const StudentModal = ({ student, isOpen, onClose, onEdit }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const initials = getInitials(student.name);
  const avatarBg = getAvatarColor(student.name);

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="modal-card student-profile-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="modal-header">
            <h3>Student Profile</h3>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>

          <div className="modal-body">
            {/* Hero Profile Header */}
            <div className="profile-hero">
              <div className="profile-avatar-large" style={{ background: avatarBg }}>
                {initials}
              </div>
              <h2 className="profile-name">{student.name}</h2>
              <div className="profile-email-badge">
                <Mail size={14} />
                <span>{student.email || 'No email provided'}</span>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <span className={`badge badge-${(student.placementStatus || 'active').toLowerCase().replace(/\s+/g, '-')}`}>
                  {student.placementStatus || 'Active'}
                </span>
              </div>
            </div>

            {/* Academic Information Grid */}
            <div className="profile-section">
              <h4 className="section-title">
                <GraduationCap size={18} />
                <span>Academic Information</span>
              </h4>
              <div className="info-grid">
                <div className="info-box">
                  <span className="info-label">Roll Number</span>
                  <span className="info-value">
                    {student.rollNumber || <em className="text-muted">Not Provided</em>}
                  </span>
                </div>
                <div className="info-box">
                  <span className="info-label">Academic Year</span>
                  <span className="info-value">{student.year || '2nd Year'}</span>
                </div>
                <div className="info-box">
                  <span className="info-label">Department</span>
                  <span className="info-value">
                    {student.department || <em className="text-muted">Not Provided</em>}
                  </span>
                </div>
                <div className="info-box">
                  <span className="info-label">Section</span>
                  <span className="info-value">
                    {student.section ? `Section ${student.section}` : <em className="text-muted">Not Provided</em>}
                  </span>
                </div>
                <div className="info-box">
                  <span className="info-label">Source Database Batch</span>
                  <span className="info-value">
                    {student.batch ? student.batch.toUpperCase().replace('_', ' ') : <em className="text-muted">Standard</em>}
                  </span>
                </div>
                <div className="info-box">
                  <span className="info-label">Student ID</span>
                  <span className="info-value">#{student.id}</span>
                </div>
              </div>
            </div>

            {/* Coding Profiles */}
            <div className="profile-section">
              <h4 className="section-title">
                <Code2 size={18} />
                <span>Coding Profiles</span>
              </h4>
              <div className="profiles-links-grid">
                {/* LeetCode */}
                <div className="profile-link-card">
                  <div className="profile-link-info">
                    <span className="platform-name">LeetCode</span>
                    {student.leetcodeUrl ? (
                      <span className="platform-url">{student.leetcodeUrl}</span>
                    ) : (
                      <span className="platform-status text-muted">Not Provided</span>
                    )}
                  </div>
                  {student.leetcodeUrl && (
                    <a
                      href={student.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <span>View LeetCode Profile</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {/* GitHub */}
                <div className="profile-link-card">
                  <div className="profile-link-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Github size={16} />
                      <span className="platform-name">GitHub</span>
                    </div>
                    {student.githubUrl ? (
                      <span className="platform-url">{student.githubUrl}</span>
                    ) : (
                      <span className="platform-status text-muted">Not Provided</span>
                    )}
                  </div>
                  {student.githubUrl && (
                    <a
                      href={student.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <span>View GitHub</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="profile-link-card">
                  <div className="profile-link-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Linkedin size={16} />
                      <span className="platform-name">LinkedIn</span>
                    </div>
                    {student.linkedinUrl ? (
                      <span className="platform-url">{student.linkedinUrl}</span>
                    ) : (
                      <span className="platform-status text-muted">Not Provided</span>
                    )}
                  </div>
                  {student.linkedinUrl && (
                    <a
                      href={student.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <span>View LinkedIn</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Coding Performance Section (Section 47: No fake rankings) */}
            <div className="profile-section">
              <h4 className="section-title">
                <Award size={18} />
                <span>Coding Performance</span>
              </h4>
              {student.codingScore > 0 || student.problemsSolved > 0 ? (
                <div className="metrics-box-grid">
                  <div className="metric-box">
                    <span className="metric-label">Problems Solved</span>
                    <span className="metric-val">{student.problemsSolved}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Coding Score</span>
                    <span className="metric-val">{student.codingScore}</span>
                  </div>
                </div>
              ) : (
                <div className="metrics-notice">
                  <Sparkles size={18} />
                  <span>Coding metrics will appear once problem-solving data is available.</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(student);
              }}
            >
              Edit Student Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
