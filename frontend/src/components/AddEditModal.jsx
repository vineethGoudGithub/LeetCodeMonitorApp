import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle } from 'lucide-react';

export const AddEditModal = ({ isOpen, onClose, onSave, student = null }) => {
  const isEditing = !!student;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    year: '2nd Year',
    department: 'AI & ML',
    section: 'A&B',
    batch: 'aiml_ab',
    leetcodeUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    codingScore: 0,
    problemsSolved: 0,
    placementStatus: 'Active',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        rollNumber: student.rollNumber || '',
        year: student.year || '2nd Year',
        department: student.department || 'AI & ML',
        section: student.section || 'A&B',
        batch: student.batch || 'aiml_ab',
        leetcodeUrl: student.leetcodeUrl || '',
        githubUrl: student.githubUrl || '',
        linkedinUrl: student.linkedinUrl || '',
        codingScore: student.codingScore ?? 0,
        problemsSolved: student.problemsSolved ?? 0,
        placementStatus: student.placementStatus || 'Active',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        rollNumber: '',
        year: '2nd Year',
        department: 'AI & ML',
        section: 'A&B',
        batch: 'aiml_ab',
        leetcodeUrl: '',
        githubUrl: '',
        linkedinUrl: '',
        codingScore: 0,
        problemsSolved: 0,
        placementStatus: 'Active',
      });
    }
    setErrors({});
  }, [student, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave(formData, student?.id);
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Operation failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className="modal-card modal-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>{isEditing ? 'Edit Student Details' : 'Add New Student'}</h3>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.form && (
                <div className="error-banner">
                  <AlertCircle size={18} />
                  <span>{errors.form}</span>
                </div>
              )}

              <div className="form-grid">
                {/* Name */}
                <div className="form-group full-width">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. Anirudh Sai"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group full-width">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'error' : ''}`}
                    placeholder="e.g. 25eg107b35@anurag.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                {/* Roll Number */}
                <div className="form-group">
                  <label>Roll Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 25EG107B35"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  />
                </div>

                {/* Year */}
                <div className="form-group">
                  <label>Academic Year</label>
                  <select
                    className="form-control"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  >
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                {/* Department */}
                <div className="form-group">
                  <label>Department</label>
                  <select
                    className="form-control"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="AI & ML">AI & ML</option>
                    <option value="ECE">ECE</option>
                    <option value="Data Science">Data Science</option>
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>

                {/* Section */}
                <div className="form-group">
                  <label>Section</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. A&B, E&F, J&K"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  />
                </div>

                {/* Database Batch */}
                <div className="form-group">
                  <label>Database Batch</label>
                  <select
                    className="form-control"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  >
                    <option value="aiml_ab">AIML A&B</option>
                    <option value="aiml_jk">AIML J&K</option>
                    <option value="ece_ef">ECE E&F</option>
                    <option value="ds_ab">DS A&B</option>
                  </select>
                </div>

                {/* Placement Status */}
                <div className="form-group">
                  <label>Placement Status</label>
                  <select
                    className="form-control"
                    value={formData.placementStatus}
                    onChange={(e) => setFormData({ ...formData, placementStatus: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Placed">Placed</option>
                    <option value="In Training">In Training</option>
                    <option value="Opted Out">Opted Out</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>

                {/* LeetCode URL */}
                <div className="form-group full-width">
                  <label>LeetCode URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://leetcode.com/u/username"
                    value={formData.leetcodeUrl}
                    onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                  />
                </div>

                {/* GitHub URL */}
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://github.com/username"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>

                {/* LinkedIn URL */}
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  />
                </div>

                {/* Coding Score */}
                <div className="form-group">
                  <label>Coding Score</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.codingScore}
                    onChange={(e) => setFormData({ ...formData, codingScore: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Problems Solved */}
                <div className="form-group">
                  <label>Problems Solved</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.problemsSolved}
                    onChange={(e) => setFormData({ ...formData, problemsSolved: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Save size={16} />
                <span>{submitting ? 'Saving...' : isEditing ? 'Update Student' : 'Add Student'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
