import jsPDF from 'jspdf';

/**
 * Generates a simple PDF invoice for a transaction.
 * @param {Object} tx - The transaction object.
 * @param {Object} party - The party associated with the transaction.
 * @param {Array<Object>} items - The master list of items (to get names).
 * @param {Object} user - The user object (for shop name).
 */
export const generateInvoicePDF = (tx, party, items, user) => {
  try {
    const doc = new jsPDF();
    
    // --- 1. Header ---
    doc.setFontSize(20);
    doc.text(user?.shopName || 'SARM Invoice', 20, 20);
    doc.setFontSize(12);
    doc.text(`Bill To: ${party.name}`, 20, 30);
    doc.text(`Date: ${new Date(tx.date).toLocaleDateString()}`, 140, 30);
    doc.text(`Invoice #: ${tx.id}`, 140, 20);

    // --- 2. Table Header ---
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40); // Horizontal line
    doc.setFontSize(10);
    doc.text("Item", 20, 45);
    doc.text("Qty", 120, 45);
    doc.text("Rate", 140, 45);
    doc.text("Amount", 170, 45);
    doc.line(20, 48, 190, 48);

    // --- 3. Table Body (Items) ---
    let yPos = 55;
    tx.items.forEach((txItem) => {
      const itemDetails = items.find(i => i.id === txItem.itemId);
      const itemName = itemDetails ? itemDetails.name : "Unknown Item";
      const amount = (txItem.qty * txItem.rate).toFixed(2);
      
      doc.text(itemName, 20, yPos);
      doc.text(String(txItem.qty), 120, yPos);
      doc.text(String(txItem.rate.toFixed(2)), 140, yPos);
      doc.text(String(amount), 170, yPos);
      
      yPos += 7; // Move down for next item
    });

    // --- 4. Total ---
    doc.line(20, yPos + 2, 190, yPos + 2);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Total:", 140, yPos + 10);
    doc.text(`Rs. ${tx.grandTotal.toFixed(2)}`, 170, yPos + 10);
    
    // --- 5. Save ---
    doc.save(`Invoice-${tx.id}.pdf`);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("An error occurred while generating the PDF.");
  }
};