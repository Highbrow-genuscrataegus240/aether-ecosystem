// @ts-nocheck
import { DemandTrend, Product, ProductAnalytics, Sale, StockMovement, StockStatus, Supplier } from "../types";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const getDateDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setTime(date.getTime() - days * MILLISECONDS_PER_DAY);
  return date;
};

export const calculateProductAnalytics = (
  product: Product,
  sales: Sale[],
  suppliers: Supplier[]
): ProductAnalytics => {
  const supplier = suppliers.find(s => s.id === product.supplierId);
  
  // 1. Stock Status
  let status = StockStatus.NORMAL;
  if (product.stock === 0) {
    status = StockStatus.CRITICAL;
  } else if (product.stock <= product.reorderLevel) {
    status = StockStatus.LOW;
  } else if (product.stock >= product.reorderLevel * 3) {
    status = StockStatus.OVERSTOCKED;
  }

  // 2. Sales Filtering
  const today = new Date();
  const sales30Days = sales.filter(s => 
    s.productId === product.id && 
    new Date(s.date) >= getDateDaysAgo(30)
  );
  const sales7Days = sales.filter(s => 
    s.productId === product.id && 
    new Date(s.date) >= getDateDaysAgo(7)
  );
  const sales60Days = sales.filter(s => 
    s.productId === product.id && 
    new Date(s.date) >= getDateDaysAgo(60)
  );

  const totalQty30 = sales30Days.reduce((acc, s) => acc + s.quantity, 0);
  const totalQty7 = sales7Days.reduce((acc, s) => acc + s.quantity, 0);
  const totalQty60 = sales60Days.reduce((acc, s) => acc + s.quantity, 0);

  // 3. Demand Trend
  // Avg daily sales
  const avgDaily7 = totalQty7 / 7;
  const avgDaily30 = totalQty30 / 30;

  let demandTrend = DemandTrend.STABLE;
  // If 7-day avg is > 20% higher than 30-day avg -> Increasing
  if (avgDaily7 > avgDaily30 * 1.2 && avgDaily7 > 0.5) {
    demandTrend = DemandTrend.INCREASING;
  } else if (avgDaily7 < avgDaily30 * 0.8) {
    demandTrend = DemandTrend.DECLINING;
  }

  // 4. Stock Movement (Fast vs Dead)
  let movement = StockMovement.NORMAL;
  if (totalQty60 === 0) {
    movement = StockMovement.DEAD_STOCK;
  } else if (totalQty30 > 20) { // Arbitrary threshold for prototype
    movement = StockMovement.FAST_MOVING;
  }

  // 5. Projections & Reordering
  // Use 30-day average for stable projection, or 7-day if increasing
  const projectedDailySales = demandTrend === DemandTrend.INCREASING ? avgDaily7 : avgDaily30;
  
  // Avoid division by zero
  const safeDailySales = projectedDailySales === 0 ? 0.1 : projectedDailySales;
  const daysStockRemaining = Math.floor(product.stock / safeDailySales);
  
  // Suggested Reorder Calculation
  // New Formula: (Average Daily Sales * Supplier Lead Time) + Safety Stock
  // Safety Stock = Average Daily Sales * Supplier Lead Time (Conservative)
  
  const leadTime = supplier?.leadTimeDays || 7; // Default 7 if unknown
  const leadTimeDemand = safeDailySales * leadTime;
  const safetyStock = leadTimeDemand; // Conservative estimate per requirements
  
  // Reorder Point = Demand during lead time + Safety Stock
  const reorderPoint = leadTimeDemand + safetyStock;
  
  let suggestedReorderQty = 0;
  
  // Check if we need to reorder (stock below ROP)
  if (product.stock <= reorderPoint) {
    // Formula: (Average Daily Sales * Supplier Lead Time) + Safety Stock
    // Effectively 2 * LeadTimeDemand
    let rawReorderQty = leadTimeDemand + safetyStock;

    // Cap: Limit to cover 60 days of projected sales
    const maxStockCover = safeDailySales * 60;
    
    suggestedReorderQty = Math.ceil(Math.min(rawReorderQty, maxStockCover));
  }

  // Ensure negative suggestions are 0
  suggestedReorderQty = Math.max(0, suggestedReorderQty);

  return {
    product,
    supplier,
    status,
    demandTrend,
    movement,
    averageDailySales: projectedDailySales,
    daysStockRemaining,
    suggestedReorderQty,
    safetyStock: Math.ceil(safetyStock)
  };
};

export const getAggregatedStats = (analytics: ProductAnalytics[]) => {
  return {
    totalProducts: analytics.length,
    totalValue: analytics.reduce((acc, a) => acc + (a.product.price * a.product.stock), 0),
    lowStockCount: analytics.filter(a => a.status === StockStatus.LOW || a.status === StockStatus.CRITICAL).length,
    overStockCount: analytics.filter(a => a.status === StockStatus.OVERSTOCKED).length,
    criticalCount: analytics.filter(a => a.status === StockStatus.CRITICAL).length,
  };
};