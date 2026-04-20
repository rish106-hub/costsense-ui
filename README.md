# CostSense UI

React frontend for **CostSense AI** — an enterprise spend anomaly detection system powered by a 9-agent multi-agent AI pipeline.

## What it does

CostSense AI continuously monitors enterprise spend data (invoices, cloud bills, SaaS subscriptions) and flags anomalies such as:

- Duplicate payments
- Cloud resource waste
- Unused SaaS licenses
- Vendor rate anomalies
- SLA penalty risk

This UI gives finance and operations teams a real-time dashboard to review detected anomalies, approve or reject them individually or in bulk, assign them to reviewers, and track pipeline health — all without writing a single SQL query.

---

## Features

| Page | What you get |
|------|-------------|
| **Dashboard** | Live KPIs (exposure, recovered, pending), trend charts, top anomaly, pipeline bus activity |
| **Anomalies** | Filterable grid of all detected anomalies; Pending tab with approve / reject / assign controls and bulk operations |
| **Summary** | CFO-level digest — recovery rate, anomaly type breakdown, agent performance table |
| **Pipeline** | Real-time agent status, event feed, execution timeline (Gantt), inter-agent message bus |
| **Ingest** | Demo data generator and CSV/XLSX/JSON batch uploader |
| **Logs** | Per-process audit trail with payload inspector and Gantt timing view |

### Human-in-the-loop controls

- **Approve** an anomaly with your name and optional notes
- **Reject** an anomaly with a reason
- **Assign** an anomaly to a named reviewer
- **Bulk approve / reject** — select any number of pending anomalies and act on them all at once with a single name + notes entry
- **Assignee filter** — filter the pending queue by who it is assigned to

---

## Tech stack

- **React 19** + **Vite 8** + **TypeScript**
- **TailwindCSS 3** — dark design system (`bg-bg`, `cs-blue`, `cs-orange`, `cs-green`, `cs-red`)
- **@tanstack/react-query v5** — server state, background polling, optimistic invalidation
- **Recharts** — trend and composition charts
- **Framer Motion** — page transitions
- **react-dropzone** + **xlsx** — CSV / XLSX / JSON ingestion
- **react-router-dom v7** — client-side routing
- **lucide-react** — icon set

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | >= 18 |
| npm | >= 9 |
| CostSense backend | running on `http://localhost:8000` |

---

## Getting started

```bash
# 1. Clone
git clone https://github.com/rish106-hub/costsense-ui.git
cd costsense-ui

# 2. Install dependencies
npm install

# 3. Configure API base URL (optional — defaults to http://localhost:8000)
cp .env.example .env
# Edit VITE_API_BASE_URL if your backend runs elsewhere

# 4. Start dev server
npm run dev
```

Open http://localhost:5173.

### Production build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the built app locally
```

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Base URL of the CostSense FastAPI backend |

Create a `.env` file at the project root to override:

```
VITE_API_BASE_URL=https://your-backend.example.com
```

---

## API endpoints consumed

The UI talks to the following CostSense backend endpoints:

| Method | Path | Used for |
|--------|------|----------|
| GET | `/anomalies` | All anomalies list |
| GET | `/anomalies/pending-approval` | Pending approval queue |
| POST | `/anomalies/{id}/approve` | Approve single anomaly |
| POST | `/anomalies/{id}/reject` | Reject single anomaly |
| PATCH | `/anomalies/{id}/assign` | Assign anomaly to reviewer |
| POST | `/anomalies/bulk-approve` | Bulk approve |
| POST | `/anomalies/bulk-reject` | Bulk reject |
| GET | `/summary` | Dashboard and summary metrics |
| GET | `/pipeline/status` | Agent pipeline health |
| GET | `/pipeline/events` | Real-time event feed |
| GET | `/logs` | Audit log entries |
| POST | `/ingest/demo` | Generate demo spend data |
| POST | `/ingest/batch` | Upload spend records |

---

## Project structure

```
src/
├── api/           # Axios client + typed API functions
├── components/
│   ├── anomalies/ # AnomalyCard, ApprovalCard, AnomalyFilters
│   ├── charts/    # StatusPieChart, TypeBarChart, GanttChart, ...
│   ├── layout/    # Sidebar, AppShell
│   └── ui/        # KpiCard, Banner, LoadingSpinner, SectionCard, ...
├── hooks/         # React Query hooks (useAnomalies, useBulkActions, ...)
├── lib/           # utils (cn, formatINR, ...)
└── pages/         # Dashboard, Anomalies, Summary, Pipeline, Logs, Ingest
```

---

## Backend

The CostSense FastAPI backend lives at [github.com/rish106-hub/CostSense](https://github.com/rish106-hub/CostSense). See its README for setup, database migrations, and agent architecture details.

---

## License

MIT
