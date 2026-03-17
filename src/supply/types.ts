export interface Supplier {
  id: string;
  name: string;
  leadTimeDays: number;
  contactEmail: string;
  // Scorecard data
  rating?: number; // 1-5 stars
  onTimePercent?: number; // 0-100
  totalOrders?: number;
  fulfillmentRate?: number; // 0-100
  location?: string;
}

export interface SupplierDelivery {
  id: string;
  supplierId: string;
  productId: string;
  orderedDate: string;
  promisedDate: string;
  actualDate: string;
  quantity: number;
  status: 'delivered' | 'pending' | 'delayed';
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  price: number;
  cost?: number;
  stock: number;
  reorderLevel: number;
  supplierId: string; // Primary supplier
  supplierIds?: string[]; // All suppliers including backups
  warehouseId?: string;
  imageUrl?: string;
}

export interface StockTransfer {
  id: string;
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  notes?: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  date: string; // ISO Date string
}

export enum StockStatus {
  NORMAL = 'Normal',
  LOW = 'Low',
  CRITICAL = 'Critical',
  OVERSTOCKED = 'Overstocked'
}

export enum DemandTrend {
  INCREASING = 'Increasing',
  STABLE = 'Stable',
  DECLINING = 'Declining'
}

export enum StockMovement {
  FAST_MOVING = 'Fast Moving',
  DEAD_STOCK = 'Dead Stock',
  NORMAL = 'Normal'
}

export interface ProductAnalytics {
  product: Product;
  supplier: Supplier | undefined;
  status: StockStatus;
  demandTrend: DemandTrend;
  movement: StockMovement;
  averageDailySales: number; // Short term
  daysStockRemaining: number;
  suggestedReorderQty: number;
  safetyStock: number;
}