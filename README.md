# B.Tech Connect — Attendance Tracker _(Paused / Archived Case Study)_

A privacy-focused attendance tracker originally built for students of St. Aloysius College (SOE). The project allowed students to log in using their university portal credentials and instantly view subject-wise attendance, bunk limits, and recovery projections in real time.

This repository is now maintained as a **personal case study and archive** documenting the technical challenges, reverse-engineering work, and lessons learned while building against a protected institutional portal.

> Development has been paused due to increasingly aggressive anti-bot protections and Cloudflare firewall changes introduced on the university portal infrastructure, which made reliable authentication and data retrieval unstable without moving toward approaches that would compromise the original privacy-first goals of the project.

---

## Why The Project Was Paused

`B.Tech Connect` depended on securely authenticating against the live `btechconnect` student portal to fetch attendance data in real time.

Over time, the portal introduced:

- Cloudflare-managed bot protection
- Enhanced firewall and anti-automation checks
- More restrictive session validation
- Request fingerprinting and browser verification challenges

These changes significantly affected the reliability of server-side login automation. While workarounds existed, most required heavier browser automation, persistent sessions, or techniques that conflicted with the project's original principles:

- no credential storage
- minimal tracking
- lightweight infrastructure
- transparent authentication flow

Rather than turning the project into a brittle scraping system constantly fighting platform protections, development was intentionally paused.

This repository now serves as a reference implementation and learning project around:

- authenticated scraping
- CSRF-safe session handling
- attendance projection logic
- privacy-conscious architecture
- reverse engineering legacy portals
- handling real-world anti-bot infrastructure limitations

---

## What The Project Did

- Secure login against the live student portal
- Real-time attendance fetching
- Subject-wise attendance analytics
- Safe-to-bunk calculations
- Catch-up projections
- Branch-aware timetable integration
- Holiday-aware attendance forecasting
- Dynamic attendance target adjustments
- Responsive dashboard UI

---

## Privacy-First Design

One of the core goals of the project was to avoid collecting or storing student credentials.

> **Passwords were never stored.**  
> Credentials were used only during the live authentication request and discarded immediately after attendance data retrieval.

This design decision heavily influenced the architecture and also limited the kinds of anti-bot bypass techniques that could responsibly be implemented later.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| HTTP Client | Axios + axios-cookiejar-support + tough-cookie |
| Runtime | Node.js via Next.js API Routes |

---

## Architecture Overview

### 1. Authentication Flow

A custom server-side route handled:

- CSRF token extraction
- session cookie management
- portal authentication
- attendance page scraping/parsing

The implementation attempted to emulate a normal browser session while remaining lightweight and privacy-conscious.

### 2. Attendance Engine

After fetching attendance data, the app calculated:

- current percentage
- remaining allowable absences
- required recovery classes
- projected attendance trajectories

using timetable-aware logic.

### 3. Timetable Intelligence

Branch-specific schedules (ISE / CSE / ECE / AIML) were used to:

- map subjects to daily periods
- estimate future attendance opportunities
- exclude holidays from projections

---

## Key Challenges & Lessons Learned

### Reverse Engineering Institutional Systems

The project involved understanding undocumented request flows, CSRF handling, and fragile session behaviors from a legacy academic portal.

### Anti-Bot Infrastructure

A major learning outcome was seeing how modern protections like Cloudflare fundamentally change the feasibility of lightweight automation projects.

### Privacy vs Reliability Tradeoffs

The easiest ways to keep the system working increasingly conflicted with the original privacy guarantees. Preserving user trust mattered more than forcing continued functionality.

### Building Around Unstable Dependencies

When your application depends entirely on a third-party system you do not control, even small upstream infrastructure changes can break core functionality overnight.

---

## Current Status

**Status:** Paused / Archived

This repository is no longer actively maintained as a production-ready tool. It remains public as:

- a portfolio project
- a technical case study
- a reference for session-based scraping architectures
- documentation of real-world anti-bot challenges

---

## Running Locally

The project may no longer work reliably against the live portal due to infrastructure changes, but the codebase is preserved for educational purposes.

```bash
# Navigate to the dashboard directory
cd dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open `http://localhost:3000`.

---

## License

MIT
