export const printStudentReport = (students, title = 'STUDENT TPO REPORT') => {
  if (!students || students.length === 0) {
    alert('No student data to print.');
    return;
  }

  // Create an iframe to print cleanly without UI distractions
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    window.print();
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tableRows = students
    .map(
      (s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${s.name || 'Not Provided'}</strong></td>
      <td>${s.rollNumber || 'Not Provided'}</td>
      <td>${s.email || 'Not Provided'}</td>
      <td>${s.department || 'Not Provided'}</td>
      <td>${s.year || '2nd Year'}</td>
      <td>${s.leetcodeUrl ? 'Available' : 'Missing'}</td>
      <td>${s.placementStatus || 'Active'}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - ${currentDate}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 2rem; color: #1e293b; font-size: 11pt; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 20pt; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: -0.5px; }
          .subtitle { font-size: 11pt; color: #2563eb; font-weight: 600; margin: 4px 0 0 0; }
          .meta { text-align: right; font-size: 9pt; color: #64748b; }
          .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 3px 8px; border-radius: 4px; font-size: 8.5pt; font-weight: 600; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { border: 1px solid #cbd5e1; padding: 7px 10px; font-size: 9pt; text-align: left; }
          th { background-color: #f8fafc; font-weight: 600; color: #334155; }
          tr:nth-child(even) { background-color: #fdfdfd; }
          .footer { margin-top: 2rem; border-top: 1px solid #e2e8f0; padding-top: 0.5rem; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between; }
          @media print {
            @page { margin: 1.5cm; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${title}</h1>
            <p class="subtitle">Training & Placement Department — Student Registry</p>
          </div>
          <div class="meta">
            <div>Generated: <strong>${currentDate}</strong></div>
            <div class="badge">Total Students: ${students.length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Email</th>
              <th>Department</th>
              <th>Year</th>
              <th>LeetCode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          <span>Student TPO Placement Portal — Confidential Official Record</span>
          <span>Page 1</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
