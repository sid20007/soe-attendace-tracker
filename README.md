# B.Tech Connect — Attendance Tracker

A sleek, privacy-first attendance tracker for students of St. Aloysius College (SOE). Log in with your student portal credentials and instantly see your subject-wise attendance, how many classes you can bunk, or how many you need to catch up — all calculated in real time.

> **Your password is never stored.** Credentials are used only to authenticate with the university portal and are discarded after the data is fetched.

---

## Features

- **Secure login** — authenticates against the live `btechconnect` portal using CSRF-safe session handling router echoes.
- **Subject-wise attendance cards** — shows attended / total classes and current percentage with accurate dynamic width bar gauges.
- **Adjustable attendance target** — drag a global slider (default 80%) to recalculate everything on the fly.
- **Dynamic Branch Timetable** — keeps track of today's hitlist automatically based on branch inputs (ISE/CSE/ECE/AIML).
- **Exact Calendar Forecasts** — tells you exactly how many remaining classes are schedule-aware with holiday calendar indexing.
- **Conditional layout warnings** — renders conditional "You're Cooked" states for unattainable projection levels natively.
- **Catch-up calculator** — tells you exactly how many consecutive classes you must attend to hit your target.
- **Safe-to-bunk counter** — tells you how many classes you can miss while staying above target.
- **Dark, premium widget UI** — built with Tailwind CSS, Framer Motion, and Lucide icons.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP (server):** Axios + axios-cookiejar-support + tough-cookie
- **Runtime:** Node.js (via Next.js API Routes)

## Getting Started — Prerequisites

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
3. **Dashboard** (`/dashboard`) — Reads the fetched data from `localStorage` and renders animated layout widget cards utilizing exact branch timetable data for projections.
