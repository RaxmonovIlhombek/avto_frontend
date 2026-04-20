export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    return;
  }

  // Generate headers
  const headers = Object.keys(data[0]);
  
  // Convert objects to CSV string
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header] === null || row[header] === undefined ? '' : row[header];
        cell = String(cell);
        
        // Escape quotes and wrap in quotes if contains comma, newline, or quotes
        if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  // Create a Blob from the CSV string
  const blob = new Blob(['\uFEFF' + csvRows], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for UTF-8 BOM
  
  // Create a download link and trigger click
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
