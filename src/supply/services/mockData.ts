import { Product, Supplier, Warehouse, Sale, StockTransfer } from '../types';
import { ActivityLogEntry } from '../components/ActivityLog';

export const mockSuppliers: Supplier[] = [
    { id: 'sup-1', name: 'Global Tech Components', contactEmail: 'sales@globaltech.com', leadTimeDays: 5, location: 'Shenzhen, CN', rating: 4.8, onTimePercent: 96, totalOrders: 142, fulfillmentRate: 98 },
    { id: 'sup-2', name: 'Apex Logistics', contactEmail: 'orders@apexlogistics.net', leadTimeDays: 3, location: 'Berlin, DE', rating: 4.5, onTimePercent: 92, totalOrders: 85, fulfillmentRate: 94 },
    { id: 'sup-3', name: 'Quantum Materials', contactEmail: 'supply@quantummaterials.io', leadTimeDays: 12, location: 'Austin, TX', rating: 4.2, onTimePercent: 88, totalOrders: 34, fulfillmentRate: 90 },
    { id: 'sup-4', name: 'Neon Packaging Co.', contactEmail: 'hello@neonpack.com', leadTimeDays: 2, location: 'London, UK', rating: 4.9, onTimePercent: 99, totalOrders: 230, fulfillmentRate: 99 }
];

export const mockWarehouses: Warehouse[] = [
    { id: 'wh-1', name: 'Central Distribution (NA)', location: 'Chicago, IL', capacity: 50000 },
    { id: 'wh-2', name: 'Euro Hub', location: 'Frankfurt, DE', capacity: 35000 },
    { id: 'wh-3', name: 'APAC Reserve', location: 'Singapore', capacity: 20000 }
];

export const mockCategories = ['Electronics', 'Packaging', 'Raw Materials', 'Office Supplies'];

export const mockProducts: Product[] = [
    { id: 'prod-1', name: 'Quantum Processors (Q-100)', sku: 'QT-100-PROC', barcode: '8901234567890', category: 'Electronics', price: 450, cost: 210, stock: 450, reorderLevel: 200, supplierId: 'sup-1', warehouseId: 'wh-1' },
    { id: 'prod-2', name: 'Lithium-Ion Battery Packs', sku: 'LI-PACK-500', barcode: '8901234567891', category: 'Raw Materials', price: 85, cost: 42, stock: 120, reorderLevel: 150, supplierId: 'sup-3', warehouseId: 'wh-1' },
    { id: 'prod-3', name: 'Eco-Friendly Shipping Boxes', sku: 'ECO-BOX-MD', barcode: '8901234567892', category: 'Packaging', price: 2.5, cost: 0.8, stock: 15000, reorderLevel: 5000, supplierId: 'sup-4', warehouseId: 'wh-2' },
    { id: 'prod-4', name: 'Industrial Thermal Paste', sku: 'THRM-PST-A', barcode: '8901234567893', category: 'Raw Materials', price: 15, cost: 4, stock: 80, reorderLevel: 100, supplierId: 'sup-3', warehouseId: 'wh-3' },
    { id: 'prod-5', name: 'LED Display Modules', sku: 'LED-MOD-4K', barcode: '8901234567894', category: 'Electronics', price: 120, cost: 65, stock: 850, reorderLevel: 400, supplierId: 'sup-1', warehouseId: 'wh-1' },
    { id: 'prod-6', name: 'Fiber Optic Cables (100m)', sku: 'FBR-OPT-100', barcode: '8901234567895', category: 'Electronics', price: 210, cost: 95, stock: 20, reorderLevel: 50, supplierId: 'sup-2', warehouseId: 'wh-2' }
];

// Generate some mock sales data over the last 30 days
export const mockSales: Sale[] = [];
const now = new Date();
for (let i = 0; i < 150; i++) {
    const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const randomDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const randomQty = Math.floor(Math.random() * 20) + 1;
    mockSales.push({
        id: `sale-${i}`,
        productId: randomProduct.id,
        quantity: randomQty,
        date: randomDate.toISOString()
    });
}
mockSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const mockActivityLog: ActivityLogEntry[] = [
    { id: 'log-1', action: 'update', entityType: 'product', entityName: 'Lithium-Ion Battery Packs', user: 'System', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), details: 'Stock alert triggered: Inventory below reorder level' },
    { id: 'log-2', action: 'add', entityType: 'sale', entityName: 'Quantum Processors (Q-100)', user: 'Sales API', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5), details: 'Wholesale order fulfilled' },
    { id: 'log-3', action: 'update', entityType: 'warehouse', entityName: 'Central Distribution (NA)', user: 'Admin', timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), details: 'Capacity updated to 50000 units' }
];

export const mockStockTransfers: StockTransfer[] = [
    { id: 'tr-1', productId: 'prod-1', fromWarehouseId: 'wh-1', toWarehouseId: 'wh-2', quantity: 50, notes: 'Restocking Euro Hub', createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString() }
];
