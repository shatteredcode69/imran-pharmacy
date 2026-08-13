import jsPDF from 'jspdf';

const BRAND = [14, 110, 93];
const INK = [30, 30, 30];
const THICK_DIVIDER = [20, 20, 20];
const THIN_LINE = [190, 190, 190];

const ROW_HEIGHT = 20;
const MARGIN = 30;
const COLUMN_GAP = 24;
const QTY_COL_WIDTH = 34;
const INNER_PAD = 8;

/**
 * Truncates text with an ellipsis so it fits within maxWidth at the
 * doc's currently-set font/size. Must be called after setFont/setFontSize.
 */
function fitText(doc, text, maxWidth) {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && doc.getTextWidth(`${truncated}…`) > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
}

/**
 * Draws the header for a page and returns where the two-column content
 * grid should start. Page 1 gets the full brand banner + order meta;
 * continuation pages get a compact strip so more rows fit.
 */
function drawPageHeader(doc, order, date, pageWidth, pageNum) {
  if (pageNum === 1) {
    doc.setFillColor(...BRAND);
    doc.rect(MARGIN, 14, pageWidth - MARGIN * 2, 60, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Imran Pharmacy', MARGIN + 12, 42);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Order List', MARGIN + 12, 58);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...BRAND);
    doc.text(`Order #: ${order.orderNumber}`, MARGIN + 2, 92);
    doc.text(
      `Date: ${date.toDateString()} ${date.toLocaleTimeString()}`,
      pageWidth - MARGIN - 2,
      92,
      { align: 'right' }
    );

    return 112;
  }

  doc.setFillColor(...BRAND);
  doc.rect(MARGIN, 16, pageWidth - MARGIN * 2, 26, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`Imran Pharmacy — Order #${order.orderNumber} (contd.)`, MARGIN + 10, 33);

  return 56;
}

/**
 * Draws the thick black divider between the two lists and the thin
 * name/qty rule inside each column, sized to the full row grid for a
 * consistent ruled-sheet look on every page.
 */
function drawColumnRules(doc, contentTop, maxRows, col1X, col2X, colWidth, dividerX) {
  const gridBottom = contentTop + maxRows * ROW_HEIGHT;

  doc.setDrawColor(...THICK_DIVIDER);
  doc.setLineWidth(1.6);
  doc.line(dividerX, contentTop - 6, dividerX, gridBottom);

  const lineOffsetFromRight = QTY_COL_WIDTH + 6;
  doc.setDrawColor(...THIN_LINE);
  doc.setLineWidth(0.6);
  doc.line(
    col1X + colWidth - lineOffsetFromRight,
    contentTop - 6,
    col1X + colWidth - lineOffsetFromRight,
    gridBottom
  );
  doc.line(
    col2X + colWidth - lineOffsetFromRight,
    contentTop - 6,
    col2X + colWidth - lineOffsetFromRight,
    gridBottom
  );
}

/**
 * Generates and downloads a two-column PDF order list: medicine name,
 * a vertical rule, then quantity — no serial numbers, no source column.
 * When one column fills, the second starts on the same page beside it,
 * separated by a thick divider, which roughly doubles items-per-page.
 *
 * @param {{ orderNumber: number, dateISO: string, items: {name:string, qty:number}[] }} order
 */
export function generateOrderPdf(order) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const date = new Date(order.dateISO);
  const dateStamp = date.toISOString().split('T')[0];
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  const usableWidth = pageWidth - MARGIN * 2;
  const colWidth = (usableWidth - COLUMN_GAP) / 2;
  const col1X = MARGIN;
  const col2X = MARGIN + colWidth + COLUMN_GAP;
  const dividerX = MARGIN + colWidth + COLUMN_GAP / 2;
  const nameMaxWidth = colWidth - QTY_COL_WIDTH - 6 - INNER_PAD - 6;
  const contentBottomLimit = pageHeight - 70; // reserved for totals/footer

  let pageNum = 1;
  let contentTop = drawPageHeader(doc, order, date, pageWidth, pageNum);
  let maxRows = Math.floor((contentBottomLimit - contentTop) / ROW_HEIGHT);
  drawColumnRules(doc, contentTop, maxRows, col1X, col2X, colWidth, dividerX);

  let col = 0;
  let rowIndex = 0;

  order.items.forEach((item) => {
    if (rowIndex >= maxRows) {
      if (col === 0) {
        col = 1;
        rowIndex = 0;
      } else {
        doc.addPage();
        pageNum += 1;
        contentTop = drawPageHeader(doc, order, date, pageWidth, pageNum);
        maxRows = Math.floor((contentBottomLimit - contentTop) / ROW_HEIGHT);
        drawColumnRules(doc, contentTop, maxRows, col1X, col2X, colWidth, dividerX);
        col = 0;
        rowIndex = 0;
      }
    }

    const colX = col === 0 ? col1X : col2X;
    const baselineY = contentTop + rowIndex * ROW_HEIGHT + 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    doc.text(fitText(doc, item.name, nameMaxWidth), colX + INNER_PAD, baselineY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...BRAND);
    doc.text(String(item.qty), colX + colWidth - INNER_PAD, baselineY, { align: 'right' });

    rowIndex += 1;
  });

  const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);
  const gridBottom = contentTop + maxRows * ROW_HEIGHT;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...BRAND);
  doc.text(`Total items: ${order.items.length}    Total quantity: ${totalQty}`, MARGIN, gridBottom + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'Imran Pharmacy — visit us for any follow-up or prescription questions.',
    MARGIN,
    gridBottom + 40
  );

  doc.save(`Imran_Pharmacy_Order_${order.orderNumber}_${dateStamp}.pdf`);
}