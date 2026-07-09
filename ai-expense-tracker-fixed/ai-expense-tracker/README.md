# FinFlow AI

A modern, minimal, glassmorphic expense tracker built with React 19 and Vite. Track income and expenses, visualize spending with charts, and add transactions just by describing them in plain English — powered by the OpenAI API.

Everything is stored locally in your browser. No account, no backend, no login.

---

## ✨ Features

- **Dashboard** — current balance, total income/expenses, monthly summary, top spending category, recent transactions, and an animated balance gauge.
- **Transactions** — add, edit, delete, search, filter, sort, and paginate every transaction in one place.
- **Income & Expenses** — dedicated views for each transaction type with full history.
- **Categories** — 10 built-in categories (Food, Transport, Shopping, Bills, Entertainment, Health, Education, Salary, Freelance, Other) plus support for unlimited custom categories with your own name, color, and icon.
- **AI Assistant** — type things like *"I spent ₹500 on food today"* or *"Received salary ₹25000"* and the assistant detects the type, amount, category, date, and description, then shows a confirmation card before saving anything.
- **Analytics** — pie chart of category spending, bar chart of monthly income vs. expenses, and a running balance trend line.
- **CSV Export / Import** — back up your transactions to CSV or import them from a previous export.
- **Local persistence** — all data is saved to `localStorage` and restored automatically on refresh.
- **Polished UI** — glassmorphism, responsive layout, sidebar navigation, modals, toast notifications, skeleton loaders, and empty states.

---

## 🛠 Tech Stack

| Layer            | Choice                          |
|-------------------|----------------------------------|
| Framework          | React 19 + Vite                 |
| Language           | JavaScript (no TypeScript)       |
| Styling            | Tailwind CSS v4                 |
| Routing            | React Router                     |
| Charts             | Recharts                        |
| Icons              | Lucide React                    |
| HTTP client        | Axios                           |
| AI                 | OpenAI Chat Completions API      |
| Persistence        | Browser `localStorage`           |

---

## 🚀 Installation

```bash
# 1. Install dependencies
npm install

# 2. (Optional) enable the AI Assistant
cp .env.example .env
# then open .env and set VITE_OPENAI_API_KEY=sk-...

# 3. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default. The AI Assistant page works without an API key too — it will simply explain that a key is needed before it can parse messages.

### Other scripts

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint      # lint the project
```

---

## 📁 Folder Structure

```
src/
├── assets/              # Static assets
├── components/
│   ├── ai/              # AI chat message & confirmation card
│   ├── categories/      # Category card & form
│   ├── charts/          # Pie / bar / line chart wrappers
│   ├── dashboard/       # Stat cards, balance orb, quick actions, recent list
│   ├── layout/          # Sidebar, Navbar, Footer
│   ├── transactions/    # Transaction table, form, filters, shared list page
│   └── ui/               # Button, Input, Select, Modal, Loader, Skeleton,
│                          # EmptyState, Toast, ConfirmDialog (reusable primitives)
├── context/              # AppContext (transactions/categories) & ToastContext
├── data/                 # Sample seed data for first-time users
├── hooks/                # useLocalStorage, useAnalytics, useFilteredTransactions
├── layouts/              # MainLayout (sidebar + navbar + outlet)
├── pages/                # Dashboard, Transactions, Income, Expenses,
│                          # Categories, AIAssistant, Settings, NotFound
├── services/              # aiService (OpenAI calls), csvService (import/export)
├── utils/                # constants, formatters, category-icon map
├── App.jsx                # Router setup
├── index.css              # Tailwind + design tokens
└── main.jsx                # Entry point
```

---

## 🖼 Screenshots

> Add your own screenshots here after running the app locally.

- `docs/screenshot-dashboard.png` — Dashboard overview
- `docs/screenshot-ai-assistant.png` — AI Assistant chat
- `docs/screenshot-transactions.png` — Transactions table with filters

---

## 🔑 Environment Variables

| Variable                | Description                                          |
|---------------------------|------------------------------------------------------|
| `VITE_OPENAI_API_KEY`     | Your OpenAI API key, used only by the AI Assistant. Never hardcoded — read from `import.meta.env` at runtime. |

Copy `.env.example` to `.env` and fill in your key. The `.env` file is git-ignored by default.

---

## ☁️ Deployment

This is a static Vite app, so it deploys anywhere that serves static files:

- **Vercel / Netlify** — import the repo, set the build command to `npm run build`, output directory `dist`, and add `VITE_OPENAI_API_KEY` as an environment variable in the project settings.
- **GitHub Pages** — run `npm run build` and publish the `dist/` folder (set an appropriate `base` in `vite.config.js` if deploying to a subpath).
- **Any static host** — upload the contents of `dist/` after running `npm run build`.

Since this app has no backend, the OpenAI API key is exposed to the browser bundle at build time via Vite's `import.meta.env`. Treat it like any client-exposed key — use a key with appropriate rate/usage limits for production deployments.

---

## 🔮 Future Improvements

- Multi-currency support
- Budgets and spending goals per category
- Recurring transactions
- Cloud sync / multi-device support
- Dark/light theme toggle
- Voice input for the AI Assistant
- Export to PDF reports

---

Built as a portfolio-quality demo project. Enjoy tracking your money! 💰
