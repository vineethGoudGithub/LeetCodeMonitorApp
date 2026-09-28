import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Code2,
  AlertTriangle,
  UserCheck,
  Plus,
  Download,
  BarChart3,
  ArrowRight,
  Database,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { studentApi } from '../services/api';
import { StatCard } from '../components/StatCard';
import { StudentModal } from '../components/StudentModal';
import { AddEditModal } from '../components/AddEditModal';
import { getInitials, getAvatarColor } from '../components/StudentTable';
import { exportToCSV } from '../utils/exportCSV';
import { useToast } from '../context/ToastContext';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    leetcodeProfiles: 0,
    missingProfiles: 0,
    activeStudents: 0,
    batchDistribution: {},
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, recentRes] = await Promise.all([
        studentApi.getStatistics(),
        studentApi.getRecentStudents(),
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
      if (recentRes.data) {
        setRecentStudents(recentRes.data);
      }
    } catch (err) {
      addToast(err.message || 'Error loading dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExportCSV = async () => {
    try {
      const res = await studentApi.getAllStudents({});
      exportToCSV(res.data, 'student_tpo_all.csv');
      addToast('CSV downloaded successfully', 'success');
    } catch (err) {
      addToast('Failed to export CSV: ' + err.message, 'error');
    }
  };

  const handleSaveStudent = async (studentData) => {
    await studentApi.createStudent(studentData);
    addToast('Student added successfully', 'success');
    fetchDashboardData();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="page-content"
    >
      {/* Welcome Banner */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome, Training & Placement Officer 👋</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Overview of student placement readiness, batch distribution, and coding profiles.
        </p>
      </div>

      {/* Statistics Cards Grid (Section 9) */}
      <div className="stats-grid">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          gradient="linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
          subtitle="Registered"
          trend="Across all 4 active batches"
        />
        <StatCard
          title="LeetCode Profiles"
          value={stats.leetcodeProfiles}
          icon={Code2}
          gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          subtitle="Linked"
          trend={`${stats.totalStudents > 0 ? Math.round((stats.leetcodeProfiles / stats.totalStudents) * 100) : 0}% coverage`}
        />
        <StatCard
          title="Profiles Missing"
          value={stats.missingProfiles}
          icon={AlertTriangle}
          gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          subtitle="Action needed"
          trend="Pending URL submission"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon={UserCheck}
          gradient="linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
          subtitle="In Placement Pool"
          trend="Eligible for campus drives"
        />
      </div>

      {/* Quick Actions Bar (Section 46) */}
      <div className="quick-actions-bar">
        <div className="quick-actions-title">
          <h3>Quick Management Actions</h3>
          <p>Common administrative tasks for placement officers</p>
        </div>
        <div className="quick-actions-btns">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>+ Add Student</span>
          </button>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} />
            <span>Download CSV</span>
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/students')}>
            <Users size={16} />
            <span>View Students</span>
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/analytics')}>
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Database Batches Overview (User's 4 Batches) */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h3>Connected MySQL Batches</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Live student counts from `student_tpo` database tables
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/students')}
            style={{ fontSize: '0.8rem' }}
          >
            <span>View Table Filter</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { key: 'aiml_ab', name: 'AIML A&B', dept: 'AI & ML', color: '#3b82f6' },
            { key: 'aiml_jk', name: 'AIML J&K', dept: 'AI & ML', color: '#8b5cf6' },
            { key: 'ece_ef', name: 'ECE E&F', dept: 'ECE', color: '#10b981' },
            { key: 'ds_ab', name: 'DS A&B', dept: 'Data Science', color: '#f59e0b' },
          ].map((batch) => {
            const count = stats.batchDistribution ? stats.batchDistribution[batch.key] || 0 : 0;
            return (
              <div
                key={batch.key}
                onClick={() => navigate(`/students?batch=${batch.key}`)}
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderTop: `3px solid ${batch.color}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {batch.dept}
                  </span>
                  <Database size={15} style={{ color: batch.color }} />
                </div>
                <h4 style={{ fontSize: '1.1rem', margin: '0.4rem 0 0.2rem' }}>{batch.name}</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {count} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>students</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Students Section (Section 46) */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h3>Recent Students</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Latest 5 student profiles in the portal
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/students')}
            style={{ fontSize: '0.8rem' }}
          >
            <span>View All Students</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {recentStudents.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent student records available.</p>
        ) : (
          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll Number</th>
                  <th>Department</th>
                  <th>LeetCode</th>
                  <th>Placement Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => (
                  <tr key={student.id} className="student-table-row">
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar" style={{ background: getAvatarColor(student.name) }}>
                          {getInitials(student.name)}
                        </div>
                        <div className="student-meta">
                          <span className="student-name">{student.name}</span>
                          <span className="student-dept-tag">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="roll-number-badge">{student.rollNumber || 'Not Provided'}</span>
                    </td>
                    <td>{student.department || 'Not Provided'}</td>
                    <td>
                      {student.leetcodeUrl ? (
                        <a
                          href={student.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="leetcode-link"
                        >
                          <span>View Profile</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-muted">Not Provided</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${(student.placementStatus || 'active').toLowerCase().replace(/\s+/g, '-')}`}>
                        {student.placementStatus || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="action-btn view-action"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowProfileModal(true);
                        }}
                        title="View profile"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      <StudentModal
        student={selectedStudent}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onEdit={(s) => {
          setSelectedStudent(s);
          setShowAddModal(true);
        }}
      />

      {/* Add Student Modal */}
      <AddEditModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedStudent(null);
        }}
        onSave={handleSaveStudent}
        student={selectedStudent}
      />
    </motion.div>
  );
};
