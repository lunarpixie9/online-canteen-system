# Online Canteen System (Prototype)

A small React prototype for a school canteen ordering flow.

## Features (matches assignment checklist)

- **Snacks**: view snacks (name, price, ordersCount) and place an order
- **Students (admin)**: list students, create students, and view student details
- **Orders**: view all orders + status (**pending → ready → completed**)
- **Purchases**: filter purchases by **year / month / date** and see what was bought

## Mode (Student vs Admin)

This prototype supports two front-end modes:

- **Student mode (default)**: cannot access student directory routes
- **Admin mode**: can access `/students` and `/students/:id`

### Switch modes

- Use the **Mode** toggle in the top navbar, or
- Add a URL query param:
  - `/?mode=admin`
  - `/?mode=student`

Mode is persisted in `localStorage`.

## Routes

- `/` — Menu (Snacks page)
- `/orders` — Orders list + statuses
- `/spending` — Purchases tracking (year/month/date filters)
- `/students` — Students list (**admin-only**)
- `/students/:id` — Student detail (**admin-only**)

## Mock API integration

The app uses a small Promise-based mock API layer:

- `src/api/mockApi.js`
- Queries are handled with React Query in `src/hooks/useApi.js`

Mock endpoints represented:

- `GET /snacks`
- `GET /students`
- `GET /students/:id`
- `POST /students`
- `POST /orders`

## Run locally

```bash
npm install
npm run dev
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
