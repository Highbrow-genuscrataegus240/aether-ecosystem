"use server";
// @ts-nocheck
import { PrismaClient } from '../../../prisma/generated/supply';
import { Product, Supplier, Warehouse, Sale, StockTransfer } from '../types';

const prisma = new PrismaClient();

// ==================== SUPPLIERS ====================
export const fetchSuppliers = async (userId: string): Promise<Supplier[]> => {
    const rows = await prisma.supplier.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map((s) => ({
        id: s.id,
        name: s.name,
        contactEmail: s.contactEmail,
        leadTimeDays: s.leadTimeDays,
        location: s.location || '',
        rating: s.rating || 0,
        onTimePercent: s.onTimePercent || 0,
        totalOrders: s.totalOrders || 0,
        fulfillmentRate: s.fulfillmentRate || 0
    }));
};

export const addSupplier = async (supplier: Omit<Supplier, 'id'>, userId: string): Promise<Supplier> => {
    const s = await prisma.supplier.create({
        data: {
            name: supplier.name,
            contactEmail: supplier.contactEmail,
            leadTimeDays: supplier.leadTimeDays,
            location: supplier.location,
            rating: supplier.rating,
            onTimePercent: supplier.onTimePercent,
            totalOrders: supplier.totalOrders,
            fulfillmentRate: supplier.fulfillmentRate,
        }
    });
    return {
        id: s.id,
        name: s.name,
        contactEmail: s.contactEmail,
        leadTimeDays: s.leadTimeDays,
        location: s.location || '',
        rating: s.rating || 0,
        onTimePercent: s.onTimePercent || 0,
        totalOrders: s.totalOrders || 0,
        fulfillmentRate: s.fulfillmentRate || 0
    };
};

export const updateSupplier = async (supplier: Supplier, userId: string): Promise<void> => {
    await prisma.supplier.update({
        where: { id: supplier.id },
        data: {
            name: supplier.name,
            contactEmail: supplier.contactEmail,
            leadTimeDays: supplier.leadTimeDays,
            location: supplier.location,
            rating: supplier.rating,
            onTimePercent: supplier.onTimePercent,
            totalOrders: supplier.totalOrders,
            fulfillmentRate: supplier.fulfillmentRate,
        }
    });
};

export const deleteSupplier = async (id: string, userId: string): Promise<void> => {
    await prisma.supplier.delete({ where: { id } });
};

// ==================== WAREHOUSES ====================
export const fetchWarehouses = async (userId: string): Promise<Warehouse[]> => {
    const rows = await prisma.warehouse.findMany();
    return rows.map((w) => ({
        id: w.id,
        name: w.name,
        location: w.location,
        capacity: w.capacity
    }));
};

export const addWarehouse = async (warehouse: Omit<Warehouse, 'id'>, userId: string): Promise<Warehouse> => {
    const w = await prisma.warehouse.create({
        data: {
            name: warehouse.name,
            location: warehouse.location,
            capacity: warehouse.capacity
        }
    });
    return {
        id: w.id,
        name: w.name,
        location: w.location,
        capacity: w.capacity
    };
};

export const updateWarehouse = async (warehouse: Warehouse, userId: string): Promise<void> => {
    await prisma.warehouse.update({
        where: { id: warehouse.id },
        data: {
            name: warehouse.name,
            location: warehouse.location,
            capacity: warehouse.capacity
        }
    });
};

export const deleteWarehouse = async (id: string, userId: string): Promise<void> => {
    await prisma.warehouse.delete({ where: { id } });
};

// ==================== CATEGORIES ====================
export const fetchCategories = async (userId: string): Promise<string[]> => {
    const rows = await prisma.category.findMany({ where: { userId }, orderBy: { name: 'asc' } });
    return rows.map((c) => c.name);
};

export const addCategory = async (name: string, userId: string): Promise<void> => {
    await prisma.category.create({ data: { name, userId } });
};

export const updateCategory = async (oldName: string, newName: string, userId: string): Promise<void> => {
    await prisma.category.update({
        where: { name: oldName },
        data: { name: newName }
    });
};

export const deleteCategory = async (name: string, userId: string): Promise<void> => {
    await prisma.category.delete({ where: { name } });
};

// ==================== PRODUCTS ====================
export const fetchProducts = async (userId: string): Promise<Product[]> => {
    const rows = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode || undefined,
        category: p.category,
        price: p.price,
        cost: p.cost || 0,
        stock: p.stock,
        reorderLevel: p.reorderLevel,
        supplierId: p.supplierId,
        warehouseId: p.warehouseId || undefined,
        imageUrl: p.imageUrl || undefined
    }));
};

export const addProduct = async (product: Omit<Product, 'id'>, userId: string): Promise<Product> => {
    const p = await prisma.product.create({
        data: {
            name: product.name,
            sku: product.sku,
            barcode: product.barcode,
            category: product.category,
            price: product.price,
            cost: product.cost || 0,
            stock: product.stock,
            reorderLevel: product.reorderLevel,
            supplierId: product.supplierId,
            warehouseId: product.warehouseId,
            imageUrl: product.imageUrl
        }
    });
    return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode || undefined,
        category: p.category,
        price: p.price,
        cost: p.cost || 0,
        stock: p.stock,
        reorderLevel: p.reorderLevel,
        supplierId: p.supplierId,
        warehouseId: p.warehouseId || undefined,
        imageUrl: p.imageUrl || undefined
    };
};

export const updateProduct = async (product: Product, userId: string): Promise<void> => {
    await prisma.product.update({
        where: { id: product.id },
        data: {
            name: product.name,
            sku: product.sku,
            barcode: product.barcode,
            category: product.category,
            price: product.price,
            cost: product.cost || 0,
            stock: product.stock,
            reorderLevel: product.reorderLevel,
            supplierId: product.supplierId,
            warehouseId: product.warehouseId,
            imageUrl: product.imageUrl
        }
    });
};

export const deleteProduct = async (id: string, userId: string): Promise<void> => {
    await prisma.product.delete({ where: { id } });
};

// ==================== SALES ====================
export const fetchSales = async (userId: string): Promise<Sale[]> => {
    const rows = await prisma.sale.findMany({ orderBy: { date: 'desc' } });
    return rows.map((s) => ({
        id: s.id,
        productId: s.productId,
        quantity: s.quantity,
        date: s.date.toISOString()
    }));
};

export const addSale = async (productId: string, quantity: number, userId: string): Promise<Sale> => {
    const s = await prisma.sale.create({
        data: {
            productId,
            quantity
        }
    });

    // Update product stock manually since Prisma doesn't have GREATEST
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (product) {
        await prisma.product.update({
            where: { id: productId },
            data: { stock: Math.max(0, product.stock - quantity) }
        });
    }

    return {
        id: s.id,
        productId: s.productId,
        quantity: s.quantity,
        date: s.date.toISOString()
    };
};

// ==================== ACTIVITY LOG ====================
export interface DbActivityLog {
    id: string;
    action: 'add' | 'update' | 'delete';
    entity_type: 'product' | 'supplier' | 'warehouse' | 'category' | 'sale' | 'order';
    entity_name: string;
    details: string | null;
    created_at: string;
}

export const fetchActivityLog = async (userId: string): Promise<DbActivityLog[]> => {
    const rows = await prisma.activityLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100 });
    return rows.map(r => ({
        id: r.id,
        action: r.action as any,
        entity_type: r.entityType as any,
        entity_name: r.entityName,
        details: r.details,
        created_at: r.createdAt.toISOString()
    }));
};

export const logActivity = async (
    action: 'add' | 'update' | 'delete',
    entityType: 'product' | 'supplier' | 'warehouse' | 'category' | 'sale' | 'order',
    entityName: string,
    userId: string,
    details?: string
): Promise<void> => {
    try {
        await prisma.activityLog.create({
            data: {
                userId,
                action,
                entityType,
                entityName,
                details
            }
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};

// ==================== STOCK TRANSFERS ====================
export const fetchStockTransfers = async (userId: string): Promise<StockTransfer[]> => {
    const rows = await prisma.stockTransfer.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map((t) => ({
        id: t.id,
        productId: t.productId,
        fromWarehouseId: t.fromWarehouseId,
        toWarehouseId: t.toWarehouseId,
        quantity: t.quantity,
        notes: t.notes || undefined,
        createdAt: t.createdAt.toISOString()
    }));
};

export const createStockTransfer = async (transfer: Omit<StockTransfer, 'id' | 'createdAt'>, userId: string): Promise<StockTransfer> => {
    const t = await prisma.stockTransfer.create({
        data: {
            productId: transfer.productId,
            fromWarehouseId: transfer.fromWarehouseId,
            toWarehouseId: transfer.toWarehouseId,
            quantity: transfer.quantity,
            notes: transfer.notes
        }
    });
    return {
        id: t.id,
        productId: t.productId,
        fromWarehouseId: t.fromWarehouseId,
        toWarehouseId: t.toWarehouseId,
        quantity: t.quantity,
        notes: t.notes || undefined,
        createdAt: t.createdAt.toISOString()
    };
};
