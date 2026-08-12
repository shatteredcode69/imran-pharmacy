import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates and downloads a PDF order list for the given order.
 * @param {{ orderNumber: number, dateISO: string, items: {name:string, qty:number, isCustom?:boolean}[] }} order
 */
export function generateOrderPdf(order) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const date = new Date(order.dateISO);
  const dateStamp = date.toISOString().split('T')[0];

  const brandColor = [14, 110, 93];
  const accentColor = [201, 117, 43];
  const backgroundColor = [240, 247, 244];

  doc.setFillColor(...backgroundColor);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

  doc.setFillColor(...brandColor);
  doc.rect(14, 14, doc.internal.pageSize.width - 28, 60, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Imran Pharmacy", 26, 42);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Order List', 26, 58);

  doc.setDrawColor(...brandColor);
  doc.setLineWidth(0.8);
  doc.line(14, 80, doc.internal.pageSize.width - 14, 80);

  doc.setFontSize(10);
  doc.setTextColor(...brandColor);
  doc.text(`Order #: ${order.orderNumber}`, 26, 100);
  doc.text(`Date: ${date.toDateString()} ${date.toLocaleTimeString()}`, 26, 116);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);

  const rows = order.items.map((item, index) => [
    index + 1,
    item.name,
    item.isCustom ? 'Custom' : 'Catalog',
    item.qty,
  ]);

  const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);

  autoTable(doc, {
    startY: 150,
    theme: 'grid',
    head: [['#', 'Medicine Name', 'Source', 'Qty']],
    body: rows,
    foot: [['', '', 'TOTAL QTY', totalQty]],
    headStyles: {
      fillColor: brandColor,
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      textColor: 34,
      fontSize: 10,
      cellPadding: 6,
    },
    alternateRowStyles: {
      fillColor: [237, 245, 242],
    },
    footStyles: {
      fillColor: brandColor,
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 28, halign: 'center' },
      2: { cellWidth: 80, halign: 'center' },
      3: { cellWidth: 40, halign: 'center' },
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 5,
    },
    margin: { left: 14, right: 14 },
  });

  const pageWidth = doc.internal.pageSize.width;
  doc.setFontSize(10);
  doc.setTextColor(...brandColor);
  doc.text('Imran Pharmacy', 26, doc.internal.pageSize.height - 60);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Visit us at the pharmacy for any follow-up or prescription questions.', 26, doc.internal.pageSize.height - 44);

  doc.save(`Imran_Pharmacy_Order_${order.orderNumber}_${dateStamp}.pdf`);
}
