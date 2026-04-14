# Online Canteen – School Canteen Admin + Student Dashboard
 
A clean, minimal React-based admin dashboard for managing a school canteen. Built as a frontend screening task for **Edzy by Paraheights Technologies**.
 
 **Live Demo:** https://online-canteen-system.vercel.app/
 **Repository:** https://github.com/lunarpixie9/online-canteen-system
 
---
 
## Features
 
- **Snacks Page** — Browse all canteen items with name, price, category, and order count. Place an order via a modal.
- **Students Page** — View all registered students, search by name or referral code, add new students.
- **Student Detail Page** — See a student's profile, total spending, total orders, and full order history. Place new orders directly.
- **Order Form** — Reusable component used in both Snacks and Student Detail pages. Shows a live running total as quantity changes.
- **Persistent Orders** — Orders saved to localStorage and survive page refreshes.
- **Loading & Error States** — Skeleton loaders on every page, meaningful error messages throughout.
- **Responsive Design** — Works on desktop, tablet, and mobile.
 
---
 
##  Libraries Used
 
| Library | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| React Router DOM v6 | Client-side routing |
| Zustand | Global state management |
| TanStack React Query | Async data fetching with loading/error states |
| React Hook Form + Zod | Form handling and schema-based validation |
| Tailwind CSS v3 | Utility-first styling and responsive design |
 
---
 
##  Setup Instructions
 
### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
 
### Run Locally
 
```bash
git clone https://github.com/lunarpixie9/online-canteen-system.git
cd online-canteen-system
npm install
npm run dev
```
 
Open http://localhost:5173 in your browser.
 
---
 
##  Mock Data Approach
 
No backend is used. All data lives in `src/data/mockData.js` — 15 snacks, 5 students, 24 seed orders.
 
The Zustand store (`src/store/useStore.js`) acts as the in-memory database with `addStudent` and `placeOrder` actions. TanStack React Query wraps store reads with simulated async delays (300–600ms) to demonstrate realistic loading states. Orders are persisted to localStorage under the key `edzy_orders`.
 
When an order is placed: the order is added, the snack ordersCount increments, the student totalSpent updates, localStorage syncs, and React Query invalidates relevant queries so the UI updates instantly.
 
---
 
##  Project Structure
 
```
src/
├── components/       # Modal, Navbar, OrderForm, SnackCard, StudentListItem
├── data/             # mockData.js — seed snacks, students, orders
├── hooks/            # useApi.js — React Query hooks
├── pages/            # SnacksPage, StudentsPage, StudentDetailPage
├── store/            # useStore.js — Zustand store + localStorage
├── App.jsx           # Router + QueryClient provider
└── index.css         # Global styles + Tailwind custom classes
```
 
---
 
##  Security Notes
 
All inputs validated with Zod. localStorage reads wrapped in try/catch. In production, this dashboard would require authentication and role-based access control.
 
