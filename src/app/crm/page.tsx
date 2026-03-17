"use client";
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Briefcase, CheckSquare, SettingsIcon, Search, Bell, Plus, LogOut, Hexagon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Dashboard } from '../../views/Dashboard';
import { Clients } from '../../views/Clients';
import { Pipeline } from '../../views/Pipeline';
import { Tasks } from '../../views/Tasks';
import { Settings } from '../../views/Settings';
import { Modal } from '../../components/Modal';
import { PIPELINE_STAGES, Client, Task, Deal } from '../../store';
import { fetchClients, fetchTasks, fetchDeals, toggleTaskCompleted, createDeal } from './dataService';
import { Loader2 } from 'lucide-react';

const TABS = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Clients', icon: Users },
    { name: 'Pipeline', icon: Briefcase },
    { name: 'Tasks', icon: CheckSquare },
    { name: 'Settings', icon: SettingsIcon },
];

export default function CRMPage() {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [clients, setClients] = useState<Client[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [showNewDeal, setShowNewDeal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        const loadData = async () => {
            try {
                const [clientsData, tasksData, dealsData] = await Promise.all([
                    fetchClients(),
                    fetchTasks(),
                    fetchDeals()
                ]);
                setClients(clientsData);
                setTasks(tasksData);
                setDeals(dealsData);
            } catch (error) {
                console.error("Failed to load CRM data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const toggleTask = async (id: number) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
            try {
                await toggleTaskCompleted(id, task.completed);
            } catch (error) {
                console.error("Failed to toggle task in DB", error);
            }
        }
    };

    const addDeal = async (deal: Deal) => {
        try {
            const newDeal = await createDeal(deal);
            setDeals(prev => [...prev, newDeal]);
            setShowNewDeal(false);
        } catch (error) {
            console.error("Failed to create deal", error);
        }
    };

    const renderPage = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <Dashboard clients={clients} tasks={tasks} deals={deals} stages={PIPELINE_STAGES} onNavigate={setActiveTab} onToggleTask={toggleTask} />;
            case 'Clients':
                return <Clients clients={clients} setClients={setClients} />;
            case 'Pipeline':
                return <Pipeline deals={deals} stages={PIPELINE_STAGES} setDeals={setDeals} isModalOpen={showNewDeal} setIsModalOpen={setShowNewDeal} />;
            case 'Tasks':
                return <Tasks tasks={tasks} setTasks={setTasks} onToggleTask={toggleTask} />;
            case 'Settings':
                return <Settings />;
            default:
                return null;
        }
    };

    if (!mounted) return null;

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-violet-500/30 flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex flex-col bg-black z-10 shrink-0">
                <div className="h-20 flex items-center px-8 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        {/* Logo: Layered Hexagons */}
                        <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-lg blur-sm"></div>
                            <Hexagon className="absolute w-6 h-6 text-violet-400" strokeWidth={2} />
                            <Hexagon className="absolute w-3 h-3 text-fuchsia-300" strokeWidth={3} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">AetherCRM</span>
                    </div>
                </div>
                <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.name;
                        return (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-violet-500/10 text-violet-300' : 'text-gray-400 hover:text-violet-200 hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                                <span className="font-medium">{tab.name}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-white/10 flex flex-col gap-2">
                    <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-colors w-full text-left group">
                        <LogOut className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium">Exit to Platform</span>
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                        <img src="https://picsum.photos/seed/avatar/100/100" alt="User" className="w-10 h-10 rounded-full border border-white/20" referrerPolicy="no-referrer" />
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-medium text-violet-100">Jane Doe</span>
                            <span className="text-xs text-gray-500">jane@aethercrm.io</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md z-10 shrink-0">
                    <div className="relative w-96">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                        <input type="text" placeholder="Search clients, deals, or tasks..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/50 transition-all" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-violet-300 hover:border-violet-300/30 transition-colors relative">
                                <Bell className="w-5 h-5" aria-hidden="true" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-violet-400 rounded-full border border-black"></span>
                            </button>
                        </div>
                        <button onClick={() => setShowNewDeal(true)} className="bg-violet-400 hover:bg-violet-300 text-black px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors">
                            <Plus className="w-4 h-4" aria-hidden="true" />New Deal
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 pb-24">
                    {renderPage()}
                </div>

                <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(196, 181, 253, 0.3); }
        `}</style>
            </main>

        </div>
    );
}
