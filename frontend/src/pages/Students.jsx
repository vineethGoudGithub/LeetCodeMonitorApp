import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, Printer, AlertTriangle } from 'lucide-react';
import { studentApi } from '../services/api';
import { StudentTable } from '../components/StudentTable';
import { SearchBar } from '../components/SearchBar';
import { Filters } from '../components/Filters';
import { Pagination } from '../components/Pagination';
import { StudentModal } from '../components/StudentModal';
import { AddEditModal } from '../components/AddEditModal';
import { exportToCSV } from '../utils/exportCSV';
import { exportToExcel } from '../utils/exportExcel';
import { printStudentReport } from '../utils/exportPDF';
import { useToast } from '../context/ToastContext';

export const Students = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Sorting
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  // Search & Filters
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({
    year: searchParams.get('year') || '',
    department: searchParams.get('department') || '',
    section: searchParams.get('section') || '',
    batch: searchParams.get('batch') || '',
    placementStatus: searchParams.get('status') || '',
    hasLeetcode: searchParams.get('leetcode') || '',
  });

  const [filterOptions, setFilterOptions] = useState({
    years: [],
    departments: [],
    sections: [],
    batches: [],
    placementStatuses: [],
  });

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();

  // Fetch filter dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await studentApi.getFilterOptions();
        if (res.data) setFilterOptions(res.data);
      } catch (e) {
        console.error('Failed to load filter options', e);
      }
    };
    fetchOptions();
  }, []);

  // Fetch student data with current filters
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        keyword: keyword.trim() || undefined,
        year: filters.year || undefined,
        department: filters.department || undefined,
        section: filters.section || undefined,
        batch: filters.batch || undefined,
        placementStatus: filters.placementStatus || undefined,
        hasLeetcode: filters.hasLeetcode !== '' ? filters.hasLeetcode === 'true' : undefined,
        page,
        size: pageSize,
        sortBy,
        sortDir,
      };

      const res = await studentApi.getStudents(params);
      if (res.data) {
        setStudents(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      addToast(err.message || 'Error loading student directory', 'error');
    } finally {
      setLoading(false);
    }
  }, [keyword, filters, page, pageSize, sortBy, sortDir, addToast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle Sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  // Handle Filter Reset
  const handleResetFilters = () => {
    setFilters({
      year: '',
      department: '',
      section: '',
      batch: '',
      placementStatus: '',
      hasLeetcode: '',
    });
    setKeyword('');
    setPage(0);
    setSearchParams({});
  };

  // Save Student (Add / Edit)
  const handleSaveStudent = async (data, id) => {
    if (id) {
      await studentApi.updateStudent(id, data);
      addToast('Student updated successfully', 'success');
    } else {
      await studentApi.createStudent(data);
      addToast('Student added successfully', 'success');
    }
    fetchStudents();
  };

  // Delete Confirmation
  const confirmDelete = async () => {
    if (!studentToDelete) return;
    setDeleting(true);
    try {
      await studentApi.deleteStudent(studentToDelete.id);
      addToast('Student deleted successfully', 'success');
      setDeleteModalOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (err) {
      addToast('Failed to delete student: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Bulk Export Handlers (Section 21)
  const handleExportFiltered = async (type = 'csv') => {
    try {
      addToast(`Preparing ${type.toUpperCase()} export...`, 'info');
      const params = {
        keyword: keyword.trim() || undefined,
        year: filters.year || undefined,
        department: filters.department || undefined,
        section: filters.section || undefined,
        batch: filters.batch || undefined,
        placementStatus: filters.placementStatus || undefined,
        hasLeetcode: filters.hasLeetcode !== '' ? filters.hasLeetcode === 'true' : undefined,
      };

      const res = await studentApi.getAllStudents(params);
      const dataToExport = res.data;

      if (type === 'csv') {
        exportToCSV(dataToExport, `student_tpo_${filters.batch || 'filtered'}.csv`);
        addToast('CSV downloaded successfully', 'success');
      } else if (type === 'excel') {
        exportToExcel(dataToExport, `student_tpo_${filters.batch || 'filtered'}.xlsx`);
        addToast('Excel file downloaded successfully', 'success');
      } else if (type === 'pdf') {
        printStudentReport(dataToExport, `STUDENT TPO REPORT - ${filters.batch ? filters.batch.toUpperCase() : 'ALL'}`);
      }
    } catch (err) {
      addToast('Export failed: ' + err.message, 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="page-content"
    >
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Student Registry</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Browse, search, edit, and export student placement and LeetCode records.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedStudent(null);
              setAddEditModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>+ Add Student</span>
          </button>
          <button className="btn btn-secondary" onClick={() => handleExportFiltered('csv')}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-secondary" onClick={() => handleExportFiltered('excel')}>
            <Download size={16} />
            <span>Export Excel</span>
          </button>
          <button className="btn btn-secondary" onClick={() => handleExportFiltered('pdf')}>
            <Printer size={16} />
            <span>Print List</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Primary Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <SearchBar
          value={keyword}
          onChange={(val) => {
            setKeyword(val);
            setPage(0);
          }}
        />
      </div>

      {/* Multi-Filters Component */}
      <Filters
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters);
          setPage(0);
        }}
        options={filterOptions}
        onReset={handleResetFilters}
      />

      {/* Student Table */}
      <StudentTable
        students={students}
        loading={loading}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        onView={(s) => {
          setSelectedStudent(s);
          setProfileModalOpen(true);
        }}
        onEdit={(s) => {
          setSelectedStudent(s);
          setAddEditModalOpen(true);
        }}
        onDelete={(s) => {
          setStudentToDelete(s);
          setDeleteModalOpen(true);
        }}
        page={page}
        pageSize={pageSize}
      />

      {/* Pagination Bar */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(0);
        }}
      />

      {/* Profile Details Modal */}
      <StudentModal
        student={selectedStudent}
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onEdit={(s) => {
          setSelectedStudent(s);
          setAddEditModalOpen(true);
        }}
      />

      {/* Add / Edit Student Modal */}
      <AddEditModal
        isOpen={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setSelectedStudent(null);
        }}
        onSave={handleSaveStudent}
        student={selectedStudent}
      />

      {/* Delete Confirmation Modal (Section 24) */}
      <AnimatePresence>
        {deleteModalOpen && studentToDelete && (
          <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="modal-card"
              style={{ maxWidth: '440px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
                  <AlertTriangle size={20} />
                  <h3>Delete Student Record</h3>
                </div>
              </div>
              <div className="modal-body" style={{ gap: '0.85rem' }}>
                <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Are you sure you want to delete this student?
                </p>
                <div style={{ padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div><strong>Name:</strong> {studentToDelete.name}</div>
                  <div><strong>Email:</strong> {studentToDelete.email || 'Not Provided'}</div>
                  <div><strong>Roll:</strong> {studentToDelete.rollNumber || 'Not Provided'}</div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
