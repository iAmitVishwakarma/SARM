import * as XLSX from 'xlsx';

/**
 * Exports an array of data to an Excel file.
 * @param {Array<Object>} data - The array of data (e.g., parties, items).
 * @param {string} worksheetName - The name for the Excel sheet (e.g., "Ledger").
 * @param {string} fileName - The name of the file to be downloaded (e.g., "LedgerReport.xlsx").
 */
export const exportToExcel = (data, worksheetName, fileName) => {
  try {
    // 1. Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // 2. Convert our data array to a worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // 3. Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, worksheetName);
    
    // 4. Trigger the download
    XLSX.writeFile(wb, fileName);
    
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("An error occurred while exporting to Excel.");
  }
};