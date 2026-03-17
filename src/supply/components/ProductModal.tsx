// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Package, AlertTriangle, ImageIcon } from 'lucide-react';
import { Product, Supplier, Warehouse } from '../types';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, 'id'> | Product) => void;
    onDelete?: (productId: string) => void;
    product?: Product | null;
    suppliers: Supplier[];
    warehouses: Warehouse[];
    mode: 'add' | 'edit';
}

const generateSKU = (category: string): string => {
    const prefix = category.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${random}-${Date.now().toString().slice(-3)}`;
};

const generateBarcode = (): string => {
    return '890' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
};

export const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    onSave,
    onDelete,
    product,
    suppliers,
    warehouses,
    mode
}) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        barcode: '',
        category: '',
        price: 0,
        cost: 0,
        stock: 0,
        reorderLevel: 0,
        supplierId: '',
        backupSupplierIds: [] as string[],
        warehouseId: '',
        imageUrl: ''
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (product && mode === 'edit') {
            setFormData({
                name: product.name,
                sku: product.sku,
                barcode: product.barcode || '',
                category: product.category,
                price: product.price,
                cost: product.cost || 0,
                stock: product.stock,
                reorderLevel: product.reorderLevel,
                supplierId: product.supplierId,
                backupSupplierIds: product.supplierIds?.filter(id => id !== product.supplierId) || [],
                warehouseId: product.warehouseId || '',
                imageUrl: product.imageUrl || ''
            });
        } else {
            setFormData({
                name: '',
                sku: '',
                barcode: '',
                category: '',
                price: 0,
                cost: 0,
                stock: 0,
                reorderLevel: 10,
                supplierId: suppliers[0]?.id || '',
                backupSupplierIds: [],
                warehouseId: warehouses[0]?.id || '',
                imageUrl: ''
            });
        }
        setShowDeleteConfirm(false);
        setErrors({});
    }, [product, mode, isOpen, suppliers, warehouses]);

    const handleCategoryChange = (category: string) => {
        setFormData(prev => ({
            ...prev,
            category,
            sku: prev.sku || generateSKU(category),
            barcode: prev.barcode || generateBarcode()
        }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (formData.price <= 0) newErrors.price = 'Price must be positive';
        if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
        if (!formData.supplierId) newErrors.supplierId = 'Supplier is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const productData = {
            ...(mode === 'edit' && product ? { id: product.id } : {}),
            name: formData.name,
            sku: formData.sku || generateSKU(formData.category),
            barcode: formData.barcode || generateBarcode(),
            category: formData.category,
            price: formData.price,
            cost: formData.cost,
            stock: formData.stock,
            reorderLevel: formData.reorderLevel,
            supplierId: formData.supplierId,
            supplierIds: [formData.supplierId, ...formData.backupSupplierIds],
            warehouseId: formData.warehouseId || undefined,
            imageUrl: formData.imageUrl || undefined
        };

        onSave(productData as Product);
        onClose();
    };

    const handleDelete = () => {
        if (product && onDelete) {
            onDelete(product.id);
            onClose();
        }
    };

    if (!isOpen) return null;

    const categories = ['Electronics', 'Furniture', 'Audio', 'Storage', 'Accessories'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">
                            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Product Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className={`w-full px-3 py-2 bg-muted border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.name ? 'border-red-500' : 'border-border'}`}
                                placeholder="Enter product name"
                            />
                            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className={`w-full px-3 py-2 bg-muted border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.category ? 'border-red-500' : 'border-border'}`}
                            >
                                <option value="">Select category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* SKU */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">SKU</label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Auto-generated"
                            />
                        </div>

                        {/* Barcode */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Barcode</label>
                            <input
                                type="text"
                                value={formData.barcode}
                                onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Auto-generated"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Price (₹) *</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                className={`w-full px-3 py-2 bg-muted border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.price ? 'border-red-500' : 'border-border'}`}
                                step="0.01"
                                min="0"
                            />
                        </div>

                        {/* Cost */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Cost (₹)</label>
                            <input
                                type="number"
                                value={formData.cost}
                                onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                step="0.01"
                                min="0"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Current Stock *</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                                className={`w-full px-3 py-2 bg-muted border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.stock ? 'border-red-500' : 'border-border'}`}
                                min="0"
                            />
                        </div>

                        {/* Reorder Level */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Reorder Level</label>
                            <input
                                type="number"
                                value={formData.reorderLevel}
                                onChange={(e) => setFormData(prev => ({ ...prev, reorderLevel: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                min="0"
                            />
                        </div>

                        {/* Supplier */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Supplier *</label>
                            <select
                                value={formData.supplierId}
                                onChange={(e) => setFormData(prev => ({ ...prev, supplierId: e.target.value }))}
                                className={`w-full px-3 py-2 bg-muted border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.supplierId ? 'border-red-500' : 'border-border'}`}
                            >
                                <option value="">Select supplier</option>
                                {suppliers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Backup Suppliers */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Backup Suppliers</label>
                            <div className="flex flex-wrap gap-2">
                                {suppliers.filter(s => s.id !== formData.supplierId).map(s => {
                                    const isSelected = formData.backupSupplierIds.includes(s.id);
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    backupSupplierIds: isSelected
                                                        ? prev.backupSupplierIds.filter(id => id !== s.id)
                                                        : [...prev.backupSupplierIds, s.id]
                                                }));
                                            }}
                                            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${isSelected
                                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                                : 'border-border text-muted-foreground hover:border-muted-foreground'
                                                }`}
                                        >
                                            {s.name}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Select backup suppliers for this product</p>
                        </div>

                        {/* Warehouse */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Warehouse</label>
                            <select
                                value={formData.warehouseId}
                                onChange={(e) => setFormData(prev => ({ ...prev, warehouseId: e.target.value }))}
                                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">Select warehouse</option>
                                {warehouses.map(w => (
                                    <option key={w.id} value={w.id}>{w.name} ({w.location})</option>
                                ))}
                            </select>
                        </div>

                        {/* Image URL */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Product Image URL</label>
                            <div className="flex gap-3">
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.imageUrl ? (
                                    <div className="w-12 h-12 rounded-lg border border-border overflow-hidden bg-muted flex-shrink-0">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-lg border border-border bg-muted flex items-center justify-center flex-shrink-0">
                                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Paste a direct image URL for the product</p>
                        </div>
                    </div>

                    {/* Delete Confirmation */}
                    {showDeleteConfirm && mode === 'edit' && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-400">Delete this product?</p>
                                    <p className="text-xs text-muted-foreground mt-1">This action cannot be undone. All sales history for this product will remain.</p>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={handleDelete}
                                            className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            Yes, Delete
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-3 py-1.5 text-xs bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
                    {mode === 'edit' && onDelete ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    ) : (
                        <div />
                    )}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {mode === 'add' ? 'Add Product' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
