"use client";
import React, { useEffect, useState } from 'react';
import { Settings, ArrowRight, Search, Menu, X, Users, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
  }
};

const fadeIn = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Supply Chain', path: '/supply' },
    { name: 'CRM', path: '/crm' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden selection:bg-purple-500/30" style={{ transform: 'translateZ(0)' }}>

      {/* Navbar */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${scrolled ? 'w-[95%] max-w-7xl' : 'w-[90%] max-w-6xl'}`}>
        <div className="flex items-center justify-between px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 opacity-90">
              <Settings className="w-5 h-5" />
              <Settings className="w-3 h-3 -ml-1" />
            </div>
            <span className="font-bold tracking-tight">Aether</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/[0.04] rounded-full p-1 border border-white/5">
            {navLinks.map((item, i) => (
              <Link key={item.name} href={item.path} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${i === 0 ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/supply" className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
              Dashboard <ArrowRight className="w-3 h-3" />
            </Link>
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0"
        >
          <h1 className="text-[15vw] md:text-[18vw] font-bold text-white/[0.02] tracking-tighter leading-none select-none">
            AETHER
          </h1>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full max-w-7xl relative z-10 flex flex-col items-center text-center gap-8 mt-10 md:mt-20"
        >
          <motion.h2 variants={staggerItem} className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1]">
            One Platform<span className="text-[#a78bfa]">.</span><br />
            <span className="text-gray-400">Two Powerhouses</span><span className="text-[#a78bfa]">.</span>
          </motion.h2>

          <motion.p variants={staggerItem} className="text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl opacity-80">
            Aether unifies your supply chain management and customer relationships into a single, intelligent platform. Choose your workspace below.
          </motion.p>

          {/* Two Product Cards */}
          <motion.div variants={staggerItem} className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

            {/* Aether Supply Card */}
            <Link href="/supply" className="group">
              <div className="rounded-3xl p-2 bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden hover:border-[#a78bfa]/40 transition-all duration-500">
                <div className="absolute inset-0 bg-[#a78bfa]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-2xl overflow-hidden bg-[#121214] border border-white/[0.05] aspect-[4/3] flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <div className="px-3 py-1 bg-[#a78bfa]/20 text-[#a78bfa] rounded-full text-[10px] font-bold tracking-wider uppercase">
                      Supply Chain
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#a78bfa]/10 flex items-center justify-center group-hover:bg-[#a78bfa]/20 transition-colors">
                      <Package className="w-5 h-5 text-[#a78bfa]" />
                    </div>
                  </div>

                  <div className="my-auto w-full space-y-3">
                    <div className="h-2 w-1/3 bg-white/20 rounded-full" />
                    <div className="flex gap-2 items-end h-24">
                      {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-[#a78bfa]/80 to-[#a78bfa]/20 rounded-t-sm transition-all duration-700 group-hover:opacity-100 opacity-60" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-[#a78bfa] transition-colors">Aether Supply</h3>
                    <p className="text-xs text-gray-500">Inventory, forecasting, warehouses & suppliers</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* AetherCRM Card */}
            <Link href="/crm" className="group">
              <div className="rounded-3xl p-2 bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden hover:border-violet-400/40 transition-all duration-500">
                <div className="absolute inset-0 bg-violet-400/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-2xl overflow-hidden bg-[#121214] border border-white/[0.05] aspect-[4/3] flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <div className="px-3 py-1 bg-violet-400/20 text-violet-400 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      CRM
                    </div>
                    <div className="w-10 h-10 rounded-full bg-violet-400/10 flex items-center justify-center group-hover:bg-violet-400/20 transition-colors">
                      <Users className="w-5 h-5 text-violet-400" />
                    </div>
                  </div>

                  <div className="my-auto w-full space-y-3">
                    <div className="h-2 w-1/4 bg-white/20 rounded-full" />
                    <div className="grid grid-cols-4 gap-2 h-24">
                      {['Lead', 'Contact', 'Proposal', 'Won'].map((stage, i) => (
                        <div key={i} className="flex flex-col justify-end gap-1">
                          <div className="bg-gradient-to-t from-violet-400/80 to-violet-400/20 rounded-t-sm transition-all duration-700 group-hover:opacity-100 opacity-60" style={{ height: `${[35, 55, 40, 75][i]}%` }} />
                          <span className="text-[8px] text-gray-600 text-center">{stage}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors">AetherCRM</h3>
                    <p className="text-xs text-gray-500">Clients, deals, pipeline & task management</p>
                  </div>
                </div>
              </div>
            </Link>

          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 w-full max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {[
            { num: '01', title: 'Demand Forecast', text: '98% Accuracy', val: 'GenAI' },
            { num: '02', title: 'CRM Pipeline', text: 'Deal Tracking', val: 'Real-time' },
            { num: '03', title: 'Processing', text: 'Orders/sec', val: '10k+' },
            { num: '04', title: 'Uptime', text: 'Reliability', val: '99.9%' },
            { num: '05', title: 'Integration', text: 'Unified Platform', val: 'REST' },
          ].map((item, i) => (
            <motion.div key={i} variants={staggerItem} className="relative aspect-[3/4] rounded-2xl bg-[#111113] border border-white/5 p-5 flex flex-col justify-between group hover:bg-[#161619] transition-all overflow-hidden hover:-translate-y-1">
              <div className="absolute top-2 right-4 text-[80px] font-bold text-white/[0.03] group-hover:text-white/[0.05] transition-colors leading-none pointer-events-none">
                {item.num}
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-300">{item.text}</p>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold text-[#a78bfa]">{item.val}</span>
                <span className="text-[10px] text-gray-600">Active</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission Section */}
      <motion.section {...fadeIn} whileInView="animate" className="py-24 px-4 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 border-t border-white/10">
        <div>
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1]">
            Quality<br />
            <span className="text-[#a78bfa]">-</span>Velocity<br />
            Intelligence
          </h2>
        </div>
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Unified Platform</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-8">
            Aether brings together supply chain intelligence and customer relationship management. From demand forecasting to deal pipelines, manage your entire business from one place.
          </p>
          <Link href="/supply" className="inline-block px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors">
            Get Started
          </Link>
        </div>
      </motion.section>

      {/* Modules Section */}
      <section className="py-32 px-4 w-full bg-black">
        <motion.div {...fadeIn} whileInView="animate" className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">
              Control your
            </h2>
            <div className="flex items-center gap-2 pb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Modules</span>
            </div>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="space-y-0 relative border-t border-white/5">
            {[
              { name: 'Products Catalog', desc: 'Centralized SKU Management', val: '14,024 items' },
              { name: 'Client Pipeline', desc: 'CRM Deal Tracking', val: 'Real-time' },
              { name: 'Supplier Management', desc: 'Contact & Lead Time Tracking', val: '280 active' },
              { name: 'AI Forecast Engine', desc: 'Gemini-powered Analytics', val: 'Active', highlight: true },
              { name: 'Anomaly Defense', desc: 'Automated Issue Detection', val: 'Guarded' },
            ].map((row, i) => (
              <motion.div
                variants={staggerItem}
                key={i}
                className={`group flex items-center justify-between py-6 px-4 border-b border-white/5 transition-colors cursor-pointer hover:bg-white/[0.02] ${row.highlight ? 'bg-[#a78bfa] text-black hover:bg-[#9333ea]' : ''}`}
              >
                <div className="flex gap-20 w-1/2">
                  <span className={`text-sm font-semibold w-60 ${row.highlight ? 'text-black' : 'text-white'}`}>{row.name}</span>
                  <span className={`text-xs ${row.highlight ? 'text-black/70' : 'text-gray-500'}`}>{row.desc}</span>
                </div>
                <span className={`text-xs ${row.highlight ? 'text-black/90 font-bold' : 'text-gray-400'}`}>{row.val}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-20 flex flex-col md:flex-row justify-between items-end">
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-10 md:mb-0">
              Enjoy the peace of mind knowing your entire business is monitored by advanced intelligence. From supply chain to CRM, everything in one place.
            </p>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-right">
              <span className="text-[#a78bfa]">-</span>entire business.
            </h2>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer {...fadeIn} whileInView="animate" className="pt-20 pb-10 px-4 w-full bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col">
          <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-20">
            <span>Aether</span>
            <span>Supply · CRM · Intelligence</span>
            <span>Menu</span>
          </div>

          <div className="w-full text-center mb-20">
            <a href="mailto:info@aether.com" className="text-3xl md:text-5xl font-medium text-white hover:text-[#a78bfa] transition-colors">
              info@aether.com
            </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[9px] font-bold tracking-widest uppercase text-gray-600 mb-24">
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-center">
              <span>All rights reserved</span>
              <span>© 2026 Aether</span>
            </div>
            <span>Mumbai, India</span>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>

          <div className="w-full flex justify-center pb-8 pt-4">
            <h1 className="text-[12vw] font-bold text-[#a78bfa] tracking-tighter leading-tight select-none opacity-90 whitespace-nowrap">
              aether
            </h1>
          </div>
        </div>
      </motion.footer>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#0a0a0c]/95 backdrop-blur-3xl flex flex-col pt-8 px-6"
          >
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 opacity-90">
                  <Settings className="w-5 h-5 text-white" />
                  <Settings className="w-3 h-3 -ml-1 text-white" />
                </div>
                <span className="font-bold tracking-tight text-white">Aether</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-8 items-center">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/supply"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-8 flex items-center gap-2 px-8 py-4 rounded-full text-xl font-semibold bg-[#a78bfa] text-black hover:bg-[#8b5cf6] transition-all"
              >
                Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
