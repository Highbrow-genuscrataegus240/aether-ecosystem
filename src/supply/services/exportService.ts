// @ts-nocheck
import { ProductAnalytics, Sale, Product, Supplier } from '../types';

// CSV Generation
export const generateCSV = (data: Record<string, any>[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        let cell = row[header];
        // Handle dates
        if (cell instanceof Date) {
          cell = cell.toISOString().split('T')[0];
        }
        // Handle objects
        if (typeof cell === 'object' && cell !== null) {
          cell = JSON.stringify(cell);
        }
        // Escape commas and quotes
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell ?? '';
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

// Download helper
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export Inventory
export const exportInventoryCSV = (analytics: ProductAnalytics[]): void => {
  const data = analytics.map(a => ({
    'Product Name': a.product.name,
    'Category': a.product.category,
    'Product ID': a.product.id,
    'Current Stock': a.product.stock,
    'Reorder Level': a.product.reorderLevel,
    'Price': `₹${a.product.price.toFixed(2)}`,
    'Status': a.status,
    'Demand Trend': a.demandTrend,
    'Avg Daily Sales': a.averageDailySales.toFixed(2),
    'Days Stock Remaining': a.daysStockRemaining,
    'Suggested Reorder Qty': a.suggestedReorderQty,
    'Supplier': a.supplier?.name || 'N/A'
  }));

  generateCSV(data, `inventory_report_${new Date().toISOString().split('T')[0]}`);
};

// Export Sales
export const exportSalesCSV = (sales: Sale[], products: Product[]): void => {
  const productMap = new Map(products.map(p => [p.id, p]));

  const data = sales.map(s => {
    const product = productMap.get(s.productId);
    return {
      'Date': new Date(s.date).toLocaleDateString(),
      'Product': product?.name || s.productId,
      'Category': product?.category || 'Unknown',
      'Quantity': s.quantity,
      'Unit Price': product ? `₹${product.price.toFixed(2)}` : 'N/A',
      'Total': product ? `₹${(s.quantity * product.price).toFixed(2)}` : 'N/A'
    };
  });

  generateCSV(data, `sales_report_${new Date().toISOString().split('T')[0]}`);
};

// Export Suppliers
export const exportSuppliersCSV = (suppliers: Supplier[]): void => {
  const data = suppliers.map(s => ({
    'Name': s.name,
    'Email': s.contactEmail,
    'Lead Time (Days)': s.leadTimeDays
  }));

  generateCSV(data, `suppliers_${new Date().toISOString().split('T')[0]}`);
};

// PDF Export using browser print
export const exportToPDF = (title: string, elementId?: string): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }

  const content = elementId
    ? document.getElementById(elementId)?.innerHTML || ''
    : document.querySelector('main')?.innerHTML || '';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} - Aether Supply</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 40px;
          color: #1a1a1a;
          line-height: 1.6;
        }
        h1, h2, h3 { margin-top: 24px; }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 16px 0;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px 12px; 
          text-align: left; 
        }
        th { background: #f5f5f5; font-weight: 600; }
        .header { 
          display: flex; 
          justify-content: space-between; 
          border-bottom: 2px solid #333;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .date { color: #666; }
        @media print {
          body { padding: 20px; }
          button, .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 style="margin: 0;">${title}</h1>
          <p class="date">Generated: ${new Date().toLocaleString()}</p>
        </div>
        <div>
          <strong>Aether Supply</strong><br>
          Inventory Intelligence
        </div>
      </div>
      ${content}
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
};

// Generate printable report data
export const generateInventoryReport = (analytics: ProductAnalytics[]): string => {
  const critical = analytics.filter(a => a.status === 'Critical');
  const low = analytics.filter(a => a.status === 'Low');
  const totalValue = analytics.reduce((sum, a) => sum + (a.product.stock * a.product.price), 0);

  return `
    <h2>Inventory Summary</h2>
    <table>
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Total Products</td><td>${analytics.length}</td></tr>
      <tr><td>Total Inventory Value</td><td>₹${totalValue.toLocaleString()}</td></tr>
      <tr><td>Critical Stock Items</td><td style="color: red;">${critical.length}</td></tr>
      <tr><td>Low Stock Items</td><td style="color: orange;">${low.length}</td></tr>
    </table>

    <h2>Product Details</h2>
    <table>
      <tr>
        <th>Product</th>
        <th>Category</th>
        <th>Stock</th>
        <th>Status</th>
        <th>Trend</th>
        <th>Value</th>
      </tr>
      ${analytics.map(a => `
        <tr>
          <td>${a.product.name}</td>
          <td>${a.product.category}</td>
          <td>${a.product.stock}</td>
          <td>${a.status}</td>
          <td>${a.demandTrend}</td>
          <td>₹${(a.product.stock * a.product.price).toLocaleString()}</td>
        </tr>
      `).join('')}
    </table>
  `;
};
