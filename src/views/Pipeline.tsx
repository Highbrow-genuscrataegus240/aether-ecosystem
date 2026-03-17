"use client";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Clock, Trash2 } from 'lucide-react';
import { Deal, PipelineStage } from '../store';
import { Modal } from '../components/Modal';

interface Props {
  deals: Deal[];
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
  stages: PipelineStage[];
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export function Pipeline({ deals, setDeals, stages, isModalOpen, setIsModalOpen }: Props) {
  const [client, setClient] = useState('');
  const [value, setValue] = useState('');
  const [stageId, setStageId] = useState(stages[0].id);

  const handleDragStart = (e: React.DragEvent, dealId: number) => {
    e.dataTransfer.setData('dealId', dealId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const dealId = parseInt(e.dataTransfer.getData('dealId'), 10);
    if (!dealId) return;
    
    setDeals(prev => prev.map(deal => 
      deal.id === dealId ? { ...deal, stageId: targetStageId } : deal
    ));
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeal: Deal = {
      id: Date.now(),
      client,
      value: parseFloat(value) || 0,
      days: 0,
      stageId
    };
    setDeals([...deals, newDeal]);
    setIsModalOpen(false);
    setClient(''); setValue(''); setStageId(stages[0].id);
  };

  const handleDeleteDeal = (id: number) => {
    setDeals(deals.filter(d => d.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-medium text-white">Sales Pipeline</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-violet-500 hover:bg-violet-400 text-black px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> New Deal
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {stages.map((stage) => {
          const stageDeals = deals.filter(d => d.stageId === stage.id);
          const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

          return (
            <div 
              key={stage.id} 
              className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col min-w-[320px] w-[320px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${stage.color}`}>
                  {stage.name}
                </div>
                <span className="text-gray-500 text-sm font-medium">{stageDeals.length}</span>
              </div>
              <div className="text-sm text-gray-400 mb-4 px-1">{formatCurrency(totalValue)}</div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {stageDeals.map((item) => (
                  <div 
                    key={item.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className="bg-black border border-white/10 rounded-xl p-4 hover:border-violet-400/30 cursor-grab active:cursor-grabbing transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm text-violet-50 group-hover:text-violet-200 transition-colors">{item.client}</span>
                      <button onClick={() => handleDeleteDeal(item.id)} className="text-gray-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-rose-500/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-violet-300 font-medium">{formatCurrency(item.value)}</span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.days}d
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Deal">
        <form onSubmit={handleAddDeal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
            <input required type="text" value={client} onChange={e => setClient(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500" placeholder="Acme Corp" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Deal Value ($)</label>
            <input required type="number" value={value} onChange={e => setValue(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500" placeholder="10000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Initial Stage</label>
            <select value={stageId} onChange={e => setStageId(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-500 appearance-none">
              {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="bg-violet-500 hover:bg-violet-400 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors">Add Deal</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
