import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export const Filters = ({
  filters,
  onChange,
  options = {},
  onReset,
}) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.year ||
    filters.department ||
    filters.section ||
    filters.batch ||
    filters.placementStatus ||
    filters.hasLeetcode !== '';

  return (
    <div className="filters-container">
      <div className="filters-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <Filter size={16} />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button className="reset-filters-btn" onClick={onReset}>
            <RotateCcw size={13} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Batch / Database Source Filter */}
        <div className="filter-item">
          <label>Batch / Table</label>
          <select
            value={filters.batch || ''}
            onChange={(e) => handleChange('batch', e.target.value)}
          >
            <option value="">All Batches</option>
            {options.batches?.map((b) => (
              <option key={b} value={b}>
                {b.toUpperCase().replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="filter-item">
          <label>Department</label>
          <select
            value={filters.department || ''}
            onChange={(e) => handleChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {options.departments?.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Section Filter */}
        <div className="filter-item">
          <label>Section</label>
          <select
            value={filters.section || ''}
            onChange={(e) => handleChange('section', e.target.value)}
          >
            <option value="">All Sections</option>
            {options.sections?.map((sec) => (
              <option key={sec} value={sec}>
                Section {sec}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="filter-item">
          <label>Academic Year</label>
          <select
            value={filters.year || ''}
            onChange={(e) => handleChange('year', e.target.value)}
          >
            <option value="">All Years</option>
            {options.years?.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* LeetCode Profile Filter */}
        <div className="filter-item">
          <label>LeetCode</label>
          <select
            value={filters.hasLeetcode !== undefined ? String(filters.hasLeetcode) : ''}
            onChange={(e) => handleChange('hasLeetcode', e.target.value)}
          >
            <option value="">All Profiles</option>
            <option value="true">Has LeetCode Profile</option>
            <option value="false">Missing LeetCode Profile</option>
          </select>
        </div>

        {/* Placement Status Filter */}
        <div className="filter-item">
          <label>Placement Status</label>
          <select
            value={filters.placementStatus || ''}
            onChange={(e) => handleChange('placementStatus', e.target.value)}
          >
            <option value="">All Statuses</option>
            {options.placementStatuses?.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
