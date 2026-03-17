// @ts-nocheck
"use client";
import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { PlusCircle, ClipboardList } from 'lucide-react';

interface SalesLogProps {
  sales: Sale[];
  products: Product[];
  onAddSale: (productId: string, qty: number) => void;
}

export const SalesLog: React.FC<SalesLogProps> = ({ sales, products, onAddSale }) => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
  const [qty, setQty] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && qty > 0) {
      onAddSale(selectedProduct, qty);
      setQty(1);
    }
  };

  // Get product name helper
  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Unknown Product';

  // Sort sales desc
  const recentSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 50);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Entry Form */}
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm h-fit">
        <div className="flex flex-col space-y-1.5 p-6 border-b border-border/50">
          <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-primary" /> Log Transaction
          </h3>
          <p className="text-sm text-muted-foreground">Record a new sales event manually.</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Product</label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id} className="bg-popover text-popover-foreground">{p.name} (Stock: {p.stock})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">Quantity Sold</label>
              <input 
                type="number" 
                min="1" 
                className="shadcn-input bg-background h-10"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value))}
              />
            </div>
            <button 
              type="submit" 
              className="shadcn-btn w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2 h-10 font-semibold shadow-lg shadow-primary/20"
            >
              Record Sale
            </button>
          </form>
        </div>
      </div>

      {/* Log Table */}
      <div className="lg:col-span-2 rounded-xl border border-border bg-card text-card-foreground shadow-sm flex flex-col overflow-hidden">
         <div className="flex flex-col space-y-1.5 p-6 border-b border-border/50">
           <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
             <ClipboardList className="w-4 h-4 text-primary" /> Recent Transactions
           </h3>
         </div>
         <div className="flex-1 overflow-auto max-h-[600px]">
           <table className="w-full text-sm text-left">
             <thead className="bg-muted/30 sticky top-0 backdrop-blur-sm">
               <tr>
                 <th className="h-10 px-4 align-middle font-medium text-muted-foreground">Date</th>
                 <th className="h-10 px-4 align-middle font-medium text-muted-foreground">Product</th>
                 <th className="h-10 px-4 align-middle font-medium text-muted-foreground text-right">Quantity</th>
                 <th className="h-10 px-4 align-middle font-medium text-muted-foreground text-right">ID</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border/50">
               {recentSales.map(sale => (
                 <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                   <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">
                     {new Date(sale.date).toLocaleDateString()} <span className="text-xs text-muted-foreground/50 ml-1">{new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                   </td>
                   <td className="p-4 align-middle font-medium text-foreground">{getProductName(sale.productId)}</td>
                   <td className="p-4 align-middle text-right font-mono text-foreground">{sale.quantity}</td>
                   <td className="p-4 align-middle text-right text-xs text-muted-foreground/50 font-mono">{sale.id.split('-').pop()}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};