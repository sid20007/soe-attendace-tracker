# B.Tech Connect — Attendance Tracker

A privacy-focused attendance tracker built for students of St. Aloysius College (SOE). After logging in with your student portal credentials, you can instantly check your subject-wise attendance, see how many classes you can afford to miss, or figure out how many you need to make up — updated in real time.

> **Your password is never stored.** It is used only to authenticate with the university portal and is discarded immediately after your attendance data is fetched.

---

## Features

- **Secure login** — authenticates directly against the live `btechconnect` portal with CSRF-safe session handling.
- **Subject-wise attendance cards** — displays attended vs. total classes and current percentage, with a dynamic progress bar for each subject.
- **Adjustable attendance target** — set your own target percentage (default 80%) using a global slider; all calculations update instantly.
- **Branch-aware timetable** — automatically loads today's class schedule based on your branch (ISE / CSE / ECE / AIML).
- **Calendar-aware forecasts** — remaining class counts account for holidays, giving you accurate projections.
- **Attendance warnings** — flags subjects where hitting your target is no longer realistic.
- **Catch-up calculator** — shows exactly how many consecutive classes you need to attend to get back on track.
- **Safe-to-bunk counter** — tells you how many classes you can skip without dropping below your target.
- **Clean dark UI** — built with Tailwind CSS, Framer Motion, and Lucide icons.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| HTTP client | Axios + axios-cookiejar-support + tough-cookie |
| Runtime | Node.js via Next.js API Routes |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Navigate to the dashboard directory
cd dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

1. **Login** (`/`) — Enter your register number, portal password, and semester. Your password is never saved anywhere.
2. **Attendance fetch** (`/api/attendance`) — A server-side route logs into the college portal, handles CSRF tokens and session cookies, retrieves your attendance data, and discards your credentials.
3. **Dashboard** (`/dashboard`) — Pulls the fetched data from `localStorage` and renders per-subject cards with attendance stats, bunk calculations, and catch-up projections based on your branch timetable.

---

## License

MIT
