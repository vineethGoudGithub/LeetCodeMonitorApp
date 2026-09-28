export const exportToCSV = (students, filename = 'student_tpo_data.csv') => {
  if (!students || students.length === 0) {
    alert('No student data to export.');
    return;
  }

  const headers = [
    'ID',
    'Name',
    'Email',
    'Roll Number',
    'Year',
    'Department',
    'Section',
    'Batch',
    'LeetCode',
    'GitHub',
    'LinkedIn',
    'Coding Score',
    'Problems Solved',
    'Placement Status',
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined || val === '') return 'Not Provided';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = students.map((s, index) => [
    escapeCSV(s.id || index + 1),
    escapeCSV(s.name),
    escapeCSV(s.email),
    escapeCSV(s.rollNumber),
    escapeCSV(s.year),
    escapeCSV(s.department),
    escapeCSV(s.section),
    escapeCSV(s.batch),
    escapeCSV(s.leetcodeUrl),
    escapeCSV(s.githubUrl),
    escapeCSV(s.linkedinUrl),
    escapeCSV(s.codingScore ?? 0),
    escapeCSV(s.problemsSolved ?? 0),
    escapeCSV(s.placementStatus || 'Active'),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
