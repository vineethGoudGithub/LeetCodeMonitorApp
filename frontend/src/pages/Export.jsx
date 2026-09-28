import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, Printer, Database, CheckCircle, FileText } from 'lucide-react';
import { studentApi } from '../services/api';
import { exportToCSV } from '../utils/exportCSV';
import { exportToExcel } from '../utils/exportExcel';
import { printStudentReport } from '../utils/exportPDF';
import { useToast } from '../context/ToastContext';

export const Export = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [batches, setBatches] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [optRes, statRes] = await Promise.all([
          studentApi.getFilterOptions(),
          studentApi.getStatistics(),
        ]);
        if (optRes.data && optRes.data.batches) {
          setBatches(optRes.data.batches);
        }
        if (statRes.data) {
          setTotalStudents(statRes.data.totalStudents);
        }
      } catch (e) {
        console.error('Failed to load export metadata', e);
      }
    };
    fetchMeta();
  }, []);

  const handleExport = async (format) => {
    try {
      setLoading(true);
      addToast(`Generating ${format.toUpperCase()} report...`, 'info');

      const params = selectedBatch !== 'all' ? { batch: selectedBatch } : {};
      const res = await studentApi.getAllStudents(params);
      const data = res.data;

      const suffix = selectedBatch !== 'all' ? `_${selectedBatch}` : '_all';

      if (format === 'csv') {
        exportToCSV(data, `student_tpo_data${suffix}.csv`);
        addToast('CSV export downloaded successfully', 'success');
      } else if (format === 'excel') {
        exportToExcel(data, `student_tpo_data${suffix}.xlsx`);
        addToast('Excel export downloaded successfully', 'success');
      } else if (format === 'pdf') {
        printStudentReport(data, `STUDENT TPO REPORT${suffix.toUpperCase()}`);
      }
    } catch (err) {
      addToast('Export failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="page-content"
    >
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Export Student Placement Records</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Generate official reports for TPO reviews, company recruitment drives, and academic audits.
        </p>
      </div>

      {/* Batch Scope Selector */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h3>1. Select Dataset / Batch Scope</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Choose whether to export the complete student registry or a specific batch table
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div
            onClick={() => setSelectedBatch('all')}
            style={{
              padding: '1rem',
              backgroundColor: selectedBatch === 'all' ? 'var(--primary-light)' : 'var(--bg-tertiary)',
              border: `2px solid ${selectedBatch === 'all' ? 'var(--primary)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <strong>All Batches Combined</strong>
              {selectedBatch === 'all' && <CheckCircle size={18} color="var(--primary)" />}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total: {totalStudents} students
            </span>
          </div>

          {batches.map((b) => (
            <div
              key={b}
              onClick={() => setSelectedBatch(b)}
              style={{
                padding: '1rem',
                backgroundColor: selectedBatch === b ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                border: `2px solid ${selectedBatch === b ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <strong style={{ textTransform: 'uppercase' }}>{b.replace('_', ' ')}</strong>
                {selectedBatch === b && <CheckCircle size={18} color="var(--primary)" />}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target table: `student_tpo.{b}`
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Format Cards */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h3>2. Choose Export Format</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Download formats tailored for spreadsheets, databases, and printable paper records
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* CSV Card */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <FileText size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>CSV Spreadsheet</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Universal comma-separated format compatible with Excel, Google Sheets, and CRM tools.
              </p>
            </div>
            <button
              className="btn btn-primary"
              disabled={loading}
              onClick={() => handleExport('csv')}
            >
              <Download size={16} />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Excel Card */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <FileSpreadsheet size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Excel (.xlsx)</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Formatted Microsoft Excel workbook with automatic column widths and header styling.
              </p>
            </div>
            <button
              className="btn btn-secondary"
              disabled={loading}
              onClick={() => handleExport('excel')}
              style={{ borderColor: 'var(--success)', color: 'var(--success-text)' }}
            >
              <Download size={16} />
              <span>Download Excel</span>
            </button>
          </div>

          {/* PDF / Print Card */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(124,58,237,0.1)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Printer size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Printable PDF Report</h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Clean, formal document formatted specifically for physical printing and PDF archiving.
              </p>
            </div>
            <button
              className="btn btn-secondary"
              disabled={loading}
              onClick={() => handleExport('pdf')}
            >
              <Printer size={16} />
              <span>Print Student List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export Columns Preview (Section 18) */}
      <div className="dashboard-section">
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Included Data Columns:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            'ID', 'Name', 'Email', 'Roll Number', 'Year', 'Department', 'Section',
            'Batch', 'LeetCode URL', 'GitHub URL', 'LinkedIn URL', 'Coding Score',
            'Problems Solved', 'Placement Status'
          ].map((col) => (
            <span
              key={col}
              style={{
                padding: '0.3rem 0.65rem',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
              }}
            >
              {col}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
