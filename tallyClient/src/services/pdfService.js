import jsPDF from 'jspdf';
import { formatDate } from '../utils/formatters'; // Import our date formatter

/**
 * Generates a GST-compliant PDF invoice for a transaction.
 * @param {Object} tx - The full transaction object (from /api/transactions/:id)
 * @param {Object} party - The full party object (e.g., party.gstin)
 * @param {Array<Object>} items - The master list of all items (to find HSN, GST rate)
 * @param {Object} user - The user object (for shop name, shop GSTIN, shop address)
 */
export const generateInvoicePDF = (tx, party, items, user) => {
  try {
    const doc = new jsPDF();
    const pageMargin = 15;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    let yPos = 20; // Vertical position tracker

    // --- 1. Invoice Header ---
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(tx.type === 'Sale' ? 'Tax Invoice' : 'Bill of Supply', pageWidth - pageMargin, yPos, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${tx._id}`, pageWidth - pageMargin, yPos + 7, { align: 'right' });
    doc.text(`Date: ${formatDate(tx.date)}`, pageWidth - pageMargin, yPos + 12, { align: 'right' });
    
    // --- 2. Seller Details (Your Shop) ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(user?.shopName || 'SARM User', pageMargin, yPos);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
    doc.text(user?.address || 'No Address Provided', pageMargin, yPos);
    yPos += 5;
    doc.text(`GSTIN: ${user?.gstin || 'N/A'}`, pageMargin, yPos);
    
    yPos += 15; // Add space

    // --- 3. Bill To (Customer/Party) Details ---
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', pageMargin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(party.name, pageMargin, yPos + 5);
    doc.text(`Phone: ${party.phone || 'N/A'}`, pageMargin, yPos + 10);
    doc.text(`GSTIN: ${party.gstin || 'N/A'}`, pageMargin, yPos + 15);
    
    yPos += 25; // Add space before table

    // --- 4. Table Header ---
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setDrawColor(180); // Light grey lines
    doc.setLineWidth(0.2);
    
    // Draw header row background
    doc.setFillColor(240, 240, 240); // Light grey background
    doc.rect(pageMargin, yPos - 5, pageWidth - (pageMargin * 2), 8, 'F');
    
    // Header text
    doc.text("Item (HSN)", pageMargin + 2, yPos);
    doc.text("Qty", 100, yPos);
    doc.text("Rate", 115, yPos);
    doc.text("Taxable Amt", 135, yPos);
    doc.text("GST(%)", 160, yPos);
    doc.text("Total", pageWidth - pageMargin - 2, yPos, { align: 'right' });
    
    yPos += 8; // Move down for first item
    doc.setFont('helvetica', 'normal');

    // --- 5. Table Body (Items) ---
    tx.items.forEach(txItem => {
      // Find full item details from master list
      const itemDetails = items.find(i => i._id === txItem.item);
      const itemName = itemDetails ? itemDetails.name : "Unknown Item";
      const hsn = itemDetails ? itemDetails.hsnCode : "N/A";
      const gstRate = itemDetails ? itemDetails.gstRate : 0;
      
      const taxableAmt = txItem.total; // tx.total is (qty * rate)
      const rowTotal = taxableAmt + txItem.gstAmount;

      // Draw item name (with HSN)
      doc.text(`${itemName} (${hsn})`, pageMargin + 2, yPos);
      
      // Draw quantities and amounts (right-aligned for numbers)
      doc.text(String(txItem.qty), 110, yPos, { align: 'right' });
      doc.text(txItem.rate.toFixed(2), 125, yPos, { align: 'right' });
      doc.text(taxableAmt.toFixed(2), 150, yPos, { align: 'right' });
      doc.text(`${gstRate}%`, 168, yPos, { align: 'right' });
      doc.text(rowTotal.toFixed(2), pageWidth - pageMargin - 2, yPos, { align: 'right' });
      
      yPos += 7; // Move down for next item
      
      // Auto Page Break
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20; // Reset Y pos
      }
    });

    // --- 6. Table Footer (Totals) ---
    doc.setLineWidth(0.5);
    doc.line(pageMargin, yPos, pageWidth - pageMargin, yPos); // Top border for totals
    yPos += 7;

    const totalX = 150; // X position for total labels
    const totalValueX = pageWidth - pageMargin - 2; // X position for total values

    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal (Taxable):', totalX, yPos, { align: 'right' });
    doc.text(`Rs. ${tx.subTotal.toFixed(2)}`, totalValueX, yPos, { align: 'right' });
    yPos += 7;
    
    doc.text('Total GST:', totalX, yPos, { align: 'right' });
    doc.text(`Rs. ${tx.totalGst.toFixed(2)}`, totalValueX, yPos, { align: 'right' });
    yPos += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Grand Total:', totalX, yPos, { align: 'right' });
    doc.text(`Rs. ${tx.grandTotal.toFixed(2)}`, totalValueX, yPos, { align: 'right' });
    
    // --- 7. Footer (Notes) ---
    yPos += 15;
    if (tx.notes) {
      doc.setFont('helvetica', 'italic');
      doc.text('Notes:', pageMargin, yPos);
      doc.text(tx.notes, pageMargin + 10, yPos);
    }
    
    // --- 8. Save ---
    doc.save(`Invoice-${tx._id.slice(-6)}.pdf`);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("An error occurred while generating the PDF.");
  }
};