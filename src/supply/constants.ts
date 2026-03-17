import { Product, Sale, Supplier, Warehouse, SupplierDelivery } from "./types";

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Global Tech Components', leadTimeDays: 5, contactEmail: 'orders@globaltech.com', location: 'Mumbai, India', rating: 4.5, onTimePercent: 92, totalOrders: 156, fulfillmentRate: 98 },
  { id: 's2', name: 'Rapid Logistics Inc.', leadTimeDays: 2, contactEmail: 'supply@rapidlogistics.com', location: 'Bangalore, India', rating: 4.8, onTimePercent: 96, totalOrders: 243, fulfillmentRate: 99 },
  { id: 's3', name: 'Premium Office Supplies', leadTimeDays: 7, contactEmail: 'sales@premiumoffice.com', location: 'Delhi, India', rating: 3.9, onTimePercent: 78, totalOrders: 89, fulfillmentRate: 94 },
  { id: 's4', name: 'Industrial Parts Co.', leadTimeDays: 14, contactEmail: 'b2b@parts.co', location: 'Chennai, India', rating: 3.5, onTimePercent: 65, totalOrders: 34, fulfillmentRate: 88 },
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: 'w1', name: 'Main Warehouse', location: 'Mumbai, Maharashtra', capacity: 5000 },
  { id: 'w2', name: 'South Hub', location: 'Bangalore, Karnataka', capacity: 3000 },
  { id: 'w3', name: 'Distribution Center', location: 'Delhi, NCR', capacity: 4000 },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Ergonomic Office Chair', sku: 'FRN-CHR-001', barcode: '8901234567890', category: 'Furniture', price: 250, cost: 145, stock: 12, reorderLevel: 15, supplierId: 's3', supplierIds: ['s3', 's4'], warehouseId: 'w1' },
  { id: 'p2', name: 'Wireless Mechanical Keyboard', sku: 'ELC-KBD-001', barcode: '8901234567891', category: 'Electronics', price: 120, cost: 65, stock: 45, reorderLevel: 20, supplierId: 's1', supplierIds: ['s1', 's2'], warehouseId: 'w1' },
  { id: 'p3', name: '27-inch 4K Monitor', sku: 'ELC-MON-001', barcode: '8901234567892', category: 'Electronics', price: 450, cost: 280, stock: 3, reorderLevel: 10, supplierId: 's1', supplierIds: ['s1'], warehouseId: 'w2' },
  { id: 'p4', name: 'USB-C Docking Station', sku: 'ELC-DOK-001', barcode: '8901234567893', category: 'Electronics', price: 180, cost: 95, stock: 8, reorderLevel: 10, supplierId: 's1', supplierIds: ['s1', 's2'], warehouseId: 'w2' },
  { id: 'p5', name: 'Standing Desk Converter', sku: 'FRN-DSK-001', barcode: '8901234567894', category: 'Furniture', price: 300, cost: 180, stock: 2, reorderLevel: 5, supplierId: 's3', supplierIds: ['s3'], warehouseId: 'w3' },
  { id: 'p6', name: 'Noise Cancelling Headphones', sku: 'AUD-HDP-001', barcode: '8901234567895', category: 'Audio', price: 200, cost: 85, stock: 60, reorderLevel: 15, supplierId: 's2', supplierIds: ['s2', 's1'], warehouseId: 'w1' },
  { id: 'p7', name: 'Webcam 1080p', sku: 'ELC-WEB-001', barcode: '8901234567896', category: 'Electronics', price: 80, cost: 42, stock: 100, reorderLevel: 20, supplierId: 's2', supplierIds: ['s2'], warehouseId: 'w3' },
  { id: 'p8', name: 'Industrial Shelving Unit', sku: 'STR-SHV-001', barcode: '8901234567897', category: 'Storage', price: 500, cost: 320, stock: 0, reorderLevel: 2, supplierId: 's4', supplierIds: ['s4', 's3'], warehouseId: 'w3' },
];

// Mock delivery history for lead time tracking
export const MOCK_DELIVERIES: SupplierDelivery[] = [
  { id: 'd1', supplierId: 's1', productId: 'p2', orderedDate: '2024-12-01', promisedDate: '2024-12-06', actualDate: '2024-12-05', quantity: 50, status: 'delivered' },
  { id: 'd2', supplierId: 's1', productId: 'p3', orderedDate: '2024-12-05', promisedDate: '2024-12-10', actualDate: '2024-12-11', quantity: 10, status: 'delivered' },
  { id: 'd3', supplierId: 's2', productId: 'p6', orderedDate: '2024-12-08', promisedDate: '2024-12-10', actualDate: '2024-12-10', quantity: 30, status: 'delivered' },
  { id: 'd4', supplierId: 's2', productId: 'p7', orderedDate: '2024-12-10', promisedDate: '2024-12-12', actualDate: '2024-12-12', quantity: 100, status: 'delivered' },
  { id: 'd5', supplierId: 's3', productId: 'p1', orderedDate: '2024-12-12', promisedDate: '2024-12-19', actualDate: '2024-12-22', quantity: 20, status: 'delivered' },
  { id: 'd6', supplierId: 's3', productId: 'p5', orderedDate: '2024-12-15', promisedDate: '2024-12-22', actualDate: '2024-12-21', quantity: 5, status: 'delivered' },
  { id: 'd7', supplierId: 's4', productId: 'p8', orderedDate: '2024-12-10', promisedDate: '2024-12-24', actualDate: '2024-12-28', quantity: 10, status: 'delivered' },
  { id: 'd8', supplierId: 's1', productId: 'p4', orderedDate: '2024-12-18', promisedDate: '2024-12-23', actualDate: '2024-12-23', quantity: 15, status: 'delivered' },
  { id: 'd9', supplierId: 's2', productId: 'p6', orderedDate: '2024-12-20', promisedDate: '2024-12-22', actualDate: '2024-12-22', quantity: 40, status: 'delivered' },
  { id: 'd10', supplierId: 's1', productId: 'p2', orderedDate: '2024-12-22', promisedDate: '2024-12-27', actualDate: '', quantity: 25, status: 'pending' },
];

// Generate some sales data for the last 60 days
const generateSales = (): Sale[] => {
  const sales: Sale[] = [];
  const today = new Date();

  // Fast moving: Headphones (p6), Keyboard (p2)
  // Declining: Webcam (p7)
  // Dead stock: Shelving Unit (p8) - no sales

  // P2: Steady sales
  for (let i = 0; i < 30; i++) {
    sales.push({
      id: `sale-p2-${i}`,
      productId: 'p2',
      quantity: Math.floor(Math.random() * 3) + 1,
      date: new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // P6: Increasing sales (heavy in last 7 days)
  for (let i = 0; i < 30; i++) {
    const qty = i < 7 ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 2);
    if (qty > 0) {
      sales.push({
        id: `sale-p6-${i}`,
        productId: 'p6',
        quantity: qty,
        date: new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  }

  // P3: Critical stock, steady demand
  for (let i = 0; i < 20; i += 2) {
    sales.push({
      id: `sale-p3-${i}`,
      productId: 'p3',
      quantity: 1,
      date: new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // P7: Declining (High sales 30 days ago, zero recently)
  for (let i = 20; i < 50; i++) {
    sales.push({
      id: `sale-p7-${i}`,
      productId: 'p7',
      quantity: Math.floor(Math.random() * 5) + 1,
      date: new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return sales;
};

export const MOCK_SALES: Sale[] = generateSales();