
import { 
  Document, 
  Packer, 
  Paragraph, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType, 
  TextRun, 
  VerticalAlign,
  HeadingLevel
} from 'docx';
import { POData } from '../types.ts';

/**
 * Custom function to download blob without external file-saver dependency
 */
const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Defensive number formatter to prevent errors if values aren't numeric
 */
const formatNum = (num: any): string => {
  const n = parseFloat(num);
  return isNaN(n) ? "0.00" : n.toFixed(2);
};

export const generateWordDoc = async (data: POData) => {
  const transparentBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

  const createCell = (text: string, options: any = {}) => {
    return new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text, size: options.size || 20, bold: options.bold || false })],
        alignment: options.alignment || AlignmentType.LEFT,
      })],
      borders: options.noBorder ? { top: transparentBorder, bottom: transparentBorder, left: transparentBorder, right: transparentBorder } : undefined,
      verticalAlign: VerticalAlign.CENTER,
      shading: options.shading,
      width: options.width,
    });
  };

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "QUEENS' COLLEGE", bold: true, size: 40, color: "8B4513", font: "Times New Roman" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Khandwa Road, Indore (M.P.)", size: 20, font: "Arial" }),
          ],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "PURCHASE ORDER", bold: true, size: 32, underline: {}, font: "Arial" })],
            spacing: { before: 200, after: 300 }
        }),

        // Main Layout Information Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                createCell(`P.O. NO: ${data.poNo}`, { width: { size: 50, type: WidthType.PERCENTAGE }, bold: true, size: 22 }),
                createCell(`DATE: ${data.date}`, { width: { size: 50, type: WidthType.PERCENTAGE }, bold: true, size: 22, alignment: AlignmentType.RIGHT }),
              ],
            }),
            new TableRow({
              children: [
                createCell("SUPPLIER INFORMATION:", { bold: true, size: 22, shading: { fill: "F2F2F2" } }),
                createCell("CONSIGNEE / BUYER DETAILS:", { bold: true, size: 22, shading: { fill: "F2F2F2" } }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: `Company: ${data.vendor.companyName}`, bold: true, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Contact: ${data.vendor.contactPerson}`, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Address: ${data.vendor.address}`, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Email: ${data.vendor.email}`, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Phone: ${data.vendor.phone}`, size: 18 })] }),
                  ],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: `Org: ${data.buyer.organization}`, bold: true, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Attention: ${data.buyer.contactPerson}`, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Address: ${data.buyer.address}`, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Internal POC: ${data.poc.name} (${data.poc.phone})`, size: 18 })] }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                createCell("BANKING & TAX DETAILS:", { bold: true, size: 22, shading: { fill: "F2F2F2" } }),
                createCell("QUOTATION REFERENCE:", { bold: true, size: 22, shading: { fill: "F2F2F2" } }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: `Bank: ${data.bankDetails.bank}`, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `A/C: ${data.bankDetails.accountNo}`, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Branch: ${data.bankDetails.branch} (IFSC: ${data.bankDetails.ifscCode})`, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `GSTIN: ${data.otherDetails.gstNo} | PAN: ${data.otherDetails.panNo}`, size: 18 })] }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: `Ref No: ${data.reference.quotationNo}`, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Quote Date: ${data.reference.date}`, size: 18 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Agreed Amount: ₹ ${data.reference.amount}`, bold: true, size: 18 })] }),
                  ],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ text: "ITEMIZED ORDER DETAILS", alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_3, spacing: { before: 400, after: 100 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                createCell("SR.", { bold: true, alignment: AlignmentType.CENTER, shading: { fill: "D9D9D9" } }),
                createCell("ITEM / PRODUCT DESCRIPTION", { bold: true, alignment: AlignmentType.CENTER, shading: { fill: "D9D9D9" } }),
                createCell("QTY", { bold: true, alignment: AlignmentType.CENTER, shading: { fill: "D9D9D9" } }),
                createCell("BASIC (₹)", { bold: true, alignment: AlignmentType.CENTER, shading: { fill: "D9D9D9" } }),
                createCell("GST (₹)", { bold: true, alignment: AlignmentType.CENTER, shading: { fill: "D9D9D9" } }),
                createCell("TOTAL (₹)", { bold: true, alignment: AlignmentType.CENTER, shading: { fill: "D9D9D9" } }),
              ],
            }),
            ...data.items.map((item, index) => new TableRow({
              children: [
                createCell((index + 1).toString(), { alignment: AlignmentType.CENTER }),
                createCell(item.description),
                createCell(item.qty.toString(), { alignment: AlignmentType.CENTER }),
                createCell(formatNum(item.basicCost), { alignment: AlignmentType.RIGHT }),
                createCell(formatNum(item.gst), { alignment: AlignmentType.RIGHT }),
                createCell(formatNum(item.totalCost), { alignment: AlignmentType.RIGHT, bold: true }),
              ],
            })),
            new TableRow({
                children: [
                    new TableCell({ columnSpan: 5, children: [new Paragraph({ children: [new TextRun({ text: "NET PAYABLE AMOUNT (INCL. TAXES):", bold: true })], alignment: AlignmentType.RIGHT })] }),
                    createCell(formatNum(data.items.reduce((s, i) => s + (parseFloat(i.totalCost as any) || 0), 0)), { bold: true, alignment: AlignmentType.RIGHT, shading: { fill: "E6E6E6" } })
                ]
            })
          ],
        }),

        // Fix: Moved bold and size properties to TextRun children as Paragraph options do not support them directly
        new Paragraph({ 
            children: [new TextRun({ text: "STANDARD TERMS & CONDITIONS", bold: true, size: 24 })], 
            spacing: { before: 400, after: 100 } 
        }),
        new Paragraph({ 
            children: [
                new TextRun({ text: "1. Quality Assurance: ", bold: true, size: 18 }), 
                new TextRun({ text: `The supplied ${data.terms.qualityAssuranceItem || "products"} must confirm to high-quality industrial standards and requirements of Queens' College.`, size: 18 })
            ]
        }),
        new Paragraph({ 
            children: [
                new TextRun({ text: "2. Delivery Schedule: ", bold: true, size: 18 }), 
                new TextRun({ text: `Delivery must be completed within ${data.terms.deliveryTimeline || "specified timeline"} of the PO date.`, size: 18 })
            ]
        }),
        new Paragraph({ 
            children: [
                new TextRun({ text: "3. Payment Terms: ", bold: true, size: 18 }), 
                new TextRun({ text: "Official tax invoice is mandatory. Settlement will be made post verification of goods.", size: 18 })
            ]
        }),
        new Paragraph({ 
            children: [
                new TextRun({ text: "4. Compliance: ", bold: true, size: 18 }), 
                new TextRun({ text: `Order strictly follows the finalized quotation of ₹ ${data.terms.complianceQuoteAmount || data.reference.amount || "specified amount"}.`, size: 18 })
            ], 
            spacing: { after: 600 } 
        }),

        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ borders: { top: transparentBorder, bottom: transparentBorder, left: transparentBorder, right: transparentBorder }, children: [new Paragraph({ children: [new TextRun({ text: "\n\n__________________________\nAuthorized Signatory\nQueens' College, Indore", bold: true })], alignment: AlignmentType.LEFT })] }),
                        new TableCell({ borders: { top: transparentBorder, bottom: transparentBorder, left: transparentBorder, right: transparentBorder }, children: [new Paragraph({ children: [new TextRun({ text: "\n\n__________________________\nVendor Acceptance\n(Stamp & Signature)", bold: true })], alignment: AlignmentType.RIGHT })] }),
                    ]
                })
            ]
        })
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = (data.poNo || 'PurchaseOrder').replace(/[/\\?%*:|"<>]/g, '-');
  downloadBlob(blob, `${safeName}.docx`);
};
