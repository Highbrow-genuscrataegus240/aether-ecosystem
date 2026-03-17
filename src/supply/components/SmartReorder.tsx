// @ts-nocheck
"use client";
import React from 'react';
import { ProductAnalytics } from '../types';
import { ShoppingCart, Truck, Calendar, AlertCircle, ArrowRight, PackageCheck, ShieldAlert } from 'lucide-react';

interface SmartReorderProps {
  analytics: ProductAnalytics[];
}

export const SmartReorder: React.FC<SmartReorderProps> = ({ analytics }) => {
  const reorderItems = analytics.filter(a => a.suggestedReorderQty > 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-xl border border-primary/20 bg-primary/5 text-primary-foreground shadow p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
            <PackageCheck className="w-8 h-8 text-primary" /> Smart Reorder Engine
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            AI-driven restocking recommendations based on real-time sales velocity, lead times, and dynamic safety stock thresholds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reorderItems.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-border p-12 text-center bg-card/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">All Stocked Up</h3>
            <p className="mt-2 text-muted-foreground">Inventory levels are healthy. No immediate reorders suggested.</p>
          </div>
        ) : (
          reorderItems.map((item) => (
            <div key={item.product.id} className="group rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:border-primary/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-6 pb-4 border-b border-border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">{item.product.name}</h3>
                  <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${item.daysStockRemaining === 0 ? 'border-red-900/50 bg-red-900/20 text-red-500' : 'border-yellow-900/50 bg-yellow-900/20 text-yellow-500'}`}>
                    {item.daysStockRemaining === 0 ? 'Empty' : `${item.daysStockRemaining} days left`}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  {item.supplier?.name || 'Unknown Supplier'}
                </p>
              </div>
              
              <div className="p-6 pt-4 flex-1 space-y-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Current Stock</p>
                    <p className="font-medium font-mono text-lg text-foreground">{item.product.stock}</p>
                  </div>
                   <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Daily Sales</p>
                    <p className="font-medium font-mono text-lg text-foreground">~{item.averageDailySales.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Lead Time</p>
                    <p className="font-medium font-mono text-lg text-foreground">{item.supplier?.leadTimeDays}d</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">Safety Stock</p>
                    <div className="flex items-center gap-1 text-amber-500/80">
                      <ShieldAlert className="w-3 h-3" />
                      <p className="font-medium font-mono text-lg">{item.safetyStock}</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-muted/30 p-4 border border-border group-hover:bg-primary/5 transition-colors">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Recommended Order</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">{item.suggestedReorderQty}</span>
                        <span className="text-sm text-muted-foreground">units</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 max-w-[120px]">
                        Capped at 60 days sales coverage
                      </p>
                    </div>
                    <button className="shadcn-btn h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-4 shadow-lg shadow-primary/20">
                      Generate PO <ArrowRight className="ml-2 w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};