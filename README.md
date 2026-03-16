# B.Tech Connect — Attendance Tracker

A sleek, privacy-first attendance tracker for students of St. Aloysius College (SOE). Log in with your student portal credentials and instantly see your subject-wise attendance, how many classes you can bunk, or how many you need to catch up — all calculated in real time.

> **Your password is never stored.** Credentials are used only to authenticate with the university portal and are discarded after the data is fetched.

---

## Features

- 🔐 **Secure login** — authenticates against the live `btechconnect.staloysius.edu.in` portal using CSRF-safe session handling.
- 📊 **Subject-wise attendance cards** — shows attended / total classes and current percentage for every subject.
- 🎯 **Adjustable attendance target** — drag a global slider (default 80%) to recalculate everything on the fly.
- 💀 **Catch-up calculator** — tells you exactly how many consecutive classes you must attend to hit your target.
- ✅ **Safe-to-bunk counter** — tells you how many classes you can miss while staying above target.
- ⚠️ **Borderline warning** — amber alert when you're exactly on the threshold.
- 🌙 **Dark, premium UI** — built with Tailwind CSS, Framer Motion animations, and Lucide icons.

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
2. **API route** (`/api/attendance`) — A server-side Next.js route visits the college portal, handles CSRF tokens and session cookies, scrapes your name, and fetches attendance JSON.
3. **Dashboard** (`/dashboard`) — Reads the fetched data from `localStorage` and renders animated subject cards with the bunk/catch-up math.

### Attendance Math

For a given target percentage `T` (as a decimal), attended classes `A`, and total conducted classes `N`:

| Metric | Formula |
|---|---|
| **Catch-up classes needed** | `⌈(T·N − A) / (1 − T)⌉` |
| **Safe to bunk** | `⌊(A − T·N) / T⌋` |

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
