# Meetup Buddy

A lightweight real-time app for team meetups. Show the agenda, share photos, and create/join ad-hoc activities.

## Features

- **Agenda** — Timeline of scheduled meetup events; anyone can add items
- **Activities** — Create ad-hoc activities ("Walk to the supermarket in 10 min") and let others join with one click
- **Photos** — Drag-and-drop photo uploads with captions and a lightbox viewer
- **Live updates** — Polls every 5 seconds so everyone stays in sync
- **No login** — Just enter your name and go

## Quick Start

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

Push to GitHub, then import the repo on [vercel.com/new](https://vercel.com/new). Zero config needed.

> **Note:** The prototype uses in-memory storage — data resets on each deploy/restart. Swap `lib/store.ts` for a database (Vercel Postgres, Turso, etc.) when you're ready for persistence.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Storage | In-memory (prototype) |
| Real-time | Polling (5s interval) |
| Deploy | Vercel |
