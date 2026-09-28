import * as XLSX from 'xlsx';

export const exportToExcel = (students, filename = 'student_tpo_data.xlsx') => {
  if (!students || students.length === 0) {
    alert('No student data to export.');
    return;
  }

  const formattedData = students.map((s, index) => ({
    'ID': s.id || index + 1,
    'Name': s.name || 'Not Provided',
    'Email': s.email || 'Not Provided',
    'Roll Number': s.rollNumber || 'Not Provided',
    'Year': s.year || 'Not Provided',
    'Department': s.department || 'Not Provided',
    'Section': s.section || 'Not Provided',
    'Batch': s.batch || 'Not Provided',
    'LeetCode': s.leetcodeUrl || 'Not Provided',
    'GitHub': s.githubUrl || 'Not Provided',
    'LinkedIn': s.linkedinUrl || 'Not Provided',
    'Coding Score': s.codingScore ?? 0,
    'Problems Solved': s.problemsSolved ?? 0,
    'Placement Status': s.placementStatus || 'Active',
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

  // Auto-column widths
  const colWidths = Object.keys(formattedData[0] || {}).map((key) => ({
    wch: Math.max(key.length + 4, 15),
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, filename);
};
