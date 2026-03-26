# B.Tech Connect — Attendance Tracker

A sleek, privacy-first attendance tracker for students of St. Aloysius College (SOE). Log in with your student portal credentials and instantly see your subject-wise attendance, how many classes you can bunk, or how many you need to catch up — all calculated in real time.

> **Your password is never stored.** Credentials are used only to authenticate with the university portal and are discarded after the data is fetched.

---

## Features

- 🔐 **Secure login** — authenticates against the live `btechconnect` portal using CSRF-safe session handling router echoes.
- 🍱 **Premium Bento Grid UI** — a futuristic dashboard that surfaces key actions without navigation bloat.
- 📊 **Real-Time Attendance Gauges** — conditional ring colors (red/yellow/emerald) dynamically scale to your lowest active subject percentage.
- 📡 **Live Radar Engine** — scans the loaded master timetable to display exact countdown metrics for your upcoming classes.
- 🔮 **Bunk Forecaster** — instantly simulate day skips and see mathematical projections of your global health.
- 🔒 **The Vault** — interactive staging area for Previous Year Questions (PYQs) and Lab Manuals.
- 🎉 **Resoenance Fest Mode** — hidden event mode toggle to drop the whole app into an animated dark-space disco theme.
- 🎯 **Adjustable attendance target** — drag a global slider (default 80%) to recalculate everything on the fly.
- 💀 **Catch-up & Bunk calculators** — tells you exactly how many consecutive classes you must attend or can safely miss.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| HTTP (server) | Axios + `axios-cookiejar-support` + `tough-cookie` |
| Runtime | Node.js (via Next.js API Routes) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Install & Run

```bash
# 1. Navigate to the dashboard directory
cd "dashboard"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

1. **Login page** (`/`) — Enter your register number, portal password, and semester. The app never persists your password.
2. **API route** (`/api/attendance`) — A server-side Next.js route visits the college portal, handles CSRF tokens and session cookies, and fetches attendance JSON, echoing credentials back for identity verification.
3. **Dashboard** (`/dashboard`) — Reads the fetched data from `localStorage` and renders animated layout widget cards utilizing exact remaining formulas and static width bar renders.

### Attendance Math

For a given target percentage `T` (as a decimal), attended classes `A`, total conducted classes `N`, and exact calendar-offset remaining classes `R`:

| Metric | Formula |
|---|---|
| **Catch-up classes needed** | `⌈(T·N − A) / (1 − T)⌉` |
| **Safe to bunk** | `⌊(A − T·N) / T⌋` |
| **Max Possible %** | `((A + R) / (N + R)) * 100` |

---

## Project Structure

```
dashboard/
├── src/
│   └── app/
│       ├── page.js              # Login page
│       ├── layout.js            # Root layout
│       ├── globals.css          # Global styles
│       ├── dashboard/
│       │   └── page.js          # Attendance dashboard + SubjectCard
│       └── api/
│           └── attendance/
│               └── route.js     # Server-side portal scraping
├── public/
├── package.json
└── next.config.mjs
```

---

## Privacy Notice

- Credentials are sent to the Next.js API route over HTTPS and used **only** to authenticate with the college portal.
- The password is **never logged, stored in a database, or persisted** anywhere.
- Fetched attendance data is stored in your browser's `localStorage` for the session.
- Logging out clears all locally stored data.
