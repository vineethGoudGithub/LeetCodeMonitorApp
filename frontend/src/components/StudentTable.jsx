import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserX,
  FileCode,
} from 'lucide-react';

const avatarColors = [
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
  'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
];

export const getInitials = (name) => {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};

export const StudentTable = ({
  students,
  loading,
  sortBy,
  sortDir,
  onSort,
  onView,
  onEdit,
  onDelete,
  page = 0,
  pageSize = 10,
}) => {
  const renderSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown size={14} className="sort-icon inactive" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp size={14} className="sort-icon active" />
    ) : (
      <ArrowDown size={14} className="sort-icon active" />
    );
  };

  if (loading) {
    return (
      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Email</th>
              <th>Roll Number</th>
              <th>Year</th>
              <th>LeetCode</th>
              <th>GitHub</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, idx) => (
              <tr key={idx} className="skeleton-row">
                <td><div className="skeleton" style={{ width: '20px', height: '18px' }} /></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                    <div className="skeleton" style={{ width: '120px', height: '18px' }} />
                  </div>
                </td>
                <td><div className="skeleton" style={{ width: '140px', height: '18px' }} /></td>
                <td><div className="skeleton" style={{ width: '90px', height: '18px' }} /></td>
                <td><div className="skeleton" style={{ width: '70px', height: '18px' }} /></td>
                <td><div className="skeleton" style={{ width: '100px', height: '18px' }} /></td>
                <td><div className="skeleton" style={{ width: '80px', height: '18px' }} /></td>
                <td><div className="skeleton" style={{ width: '60px', height: '22px', borderRadius: '12px' }} /></td>
                <td style={{ textAlign: 'right' }}><div className="skeleton" style={{ width: '80px', height: '24px', marginLeft: 'auto' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="empty-state">
        <UserX className="empty-state-icon" />
        <h3>No students found</h3>
        <p>Try changing your search keywords or adjusting the active filters.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="student-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>#</th>
            <th onClick={() => onSort('name')} className="sortable-th">
              <div className="th-content">
                <span>Student</span>
                {renderSortIcon('name')}
              </div>
            </th>
            <th onClick={() => onSort('email')} className="sortable-th">
              <div className="th-content">
                <span>Email</span>
                {renderSortIcon('email')}
              </div>
            </th>
            <th onClick={() => onSort('rollNumber')} className="sortable-th">
              <div className="th-content">
                <span>Roll Number</span>
                {renderSortIcon('rollNumber')}
              </div>
            </th>
            <th onClick={() => onSort('year')} className="sortable-th">
              <div className="th-content">
                <span>Year</span>
                {renderSortIcon('year')}
              </div>
            </th>
            <th>LeetCode</th>
            <th>GitHub</th>
            <th onClick={() => onSort('placementStatus')} className="sortable-th">
              <div className="th-content">
                <span>Status</span>
                {renderSortIcon('placementStatus')}
              </div>
            </th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {students.map((student, idx) => {
              const rowNumber = page * pageSize + idx + 1;
              const initials = getInitials(student.name);
              const avatarBg = getAvatarColor(student.name);

              return (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: idx * 0.02 }}
                  className="student-table-row"
                >
                  <td className="row-index">{rowNumber}</td>
                  <td>
                    <div
                      className="student-cell"
                      onClick={() => onView(student)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="student-avatar" style={{ background: avatarBg }}>
                        {initials}
                      </div>
                      <div className="student-meta">
                        <span className="student-name">{student.name}</span>
                        {student.department && (
                          <span className="student-dept-tag">
                            {student.department} {student.section ? `• Sec ${student.section}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="email-cell">
                    {student.email || <span className="text-muted">Not Provided</span>}
                  </td>

                  <td>
                    {student.rollNumber ? (
                      <span className="roll-number-badge">{student.rollNumber}</span>
                    ) : (
                      <span className="text-muted">Not Provided</span>
                    )}
                  </td>

                  <td>
                    <span className="year-cell">{student.year || '2nd Year'}</span>
                  </td>

                  <td>
                    {student.leetcodeUrl ? (
                      <a
                        href={student.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="leetcode-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View Profile</span>
                        <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span className="text-muted">Not Provided</span>
                    )}
                  </td>

                  <td>
                    {student.githubUrl ? (
                      <a
                        href={student.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-text-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>GitHub</span>
                        <ExternalLink size={13} />
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
                    <div className="table-actions">
                      <button
                        className="action-btn view-action"
                        onClick={() => onView(student)}
                        title="View detailed student profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn edit-action"
                        onClick={() => onEdit(student)}
                        title="Edit student information"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn delete-action"
                        onClick={() => onDelete(student)}
                        title="Delete student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};
