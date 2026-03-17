# Aether Ecosystem 🌌

Aether is a sophisticated, unified business intelligence platform that bridges the gap between **Supply Chain Management** and **Customer Relationship Management**. Built with a focus on high-performance aesthetics (pitch black environment with lavender accents) and intelligent automation.

## 🚀 Vision

Aether brings "Quality, Velocity, and Intelligence" to your entire business operations. By unifying supply chain data and sales pipelines, it provides a holistic view of your business health, from inventory levels to deal closures.

---

## 🏗️ Architecture & Modules

The Aether Ecosystem is structured into two primary powerhouses, accessible from a centralized landing page:

### 1. Aether Supply (Supply Chain & Inventory)
A comprehensive suite for managing the physical side of your business.
- **Inventory Intelligence**: Real-time tracking of stock levels with value analysis.
- **Smart Reordering**: Automated reorder point calculations to prevent stockouts.
- **Warehouse Management**: Multi-location tracking and stock transfers.
- **Supplier Relations**: Lead time tracking and performance metrics.
- **Demand Forecasting**: AI-powered predictions based on historical sales data.
- **Anomaly Defense**: Automated detection of unusual inventory patterns or sales spikes.

### 2. AetherCRM (Sales & Relationships)
A clean, minimal CRM designed for high-velocity sales teams.
- **Lead Tracking**: Stage-based pipeline management (Lead → Contacted → Proposal → Won).
- **Client Management**: Centralized repository for client data and communication history.
- **Task Management**: Built-in scheduling and task tracking (Calls, Emails, Meetings).
- **Revenue Analytics**: Real-time stats on win rates, average deal size, and total revenue.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Server Actions)
- **Frontend**: [React 19](https://react.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom Lavender/Dark design tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Database**: 
  - [Prisma ORM](https://www.prisma.io/)
  - [Supabase](https://supabase.com/) / [Neon](https://neon.tech/) (PostgreSQL)
  - [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) (for local fallback)
- **AI Engine**: [Google Gemini Pro AI](https://ai.google.dev/) via `@google/genai`

---

## ✨ Key Features

- **Pitch Black UI**: A premium, "developer-first" aesthetic with sleek Lavender/Violet highlights.
- **AI Chatbot**: A floating assistant that provides context-aware insights into your supply chain data.
- **Responsive Design**: Fully optimized for both desktop and mobile workflows.
- **Real-time Stats**: Dynamic dashboards that update without page refreshes.
- **Micro-interactions**: Subtle, elegant animations for every user action.

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 20+
- npm or pnpm

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yuno7777/aether-ecosystem.git
   cd aether-ecosystem
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file and add your connection strings:
   ```env
   # Database (Postgres/Supabase)
   DATABASE_URL="your-db-url"
   DIRECT_URL="your-direct-url"

   # AI API Keys
   GEMINI_API_KEY="your-gemini-key"
   ```

4. **Database Migration**:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## 📊 Project Structure

```text
src/
├── app/          # Next.js App Router (Landing, CRM, Supply routes)
├── components/   # Shared UI components (Modals, Buttons)
├── supply/       # Aether Supply specific logic & components
│   ├── components/
│   ├── services/  # Inventory, Data, & AI services
│   └── types.ts
├── views/        # Shared CRM views (Pipeline, Clients)
└── store.ts      # Global state and mock data constants
```

---

## 📄 License
© 2026 Aether Ecosystem. Built for performance and intelligence.
