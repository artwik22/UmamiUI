# UmamiUI

A dashboard for Umami Analytics built with Next.js and Tailwind CSS.

![Screenshot](./screenshot.png)

## Features

- Real-time traffic charts
- KPI statistics (pageviews, visitors, bounce rate, avg session)
- Top lists (pages, referrers, devices)
- Date filters (1 day, 7 days, 30 days)
- Website selector
- Authentication (login/logout)
- Responsive design (mobile-first)

## Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Charts:** Recharts
- **Animation:** Framer Motion
- **API:** Umami Analytics API

## Quick Start

### 1. Clone the repository

```bash
git clone <repo-url>
cd UmamiUI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
# Umami API
UMAMI_API_CLIENT_ENDPOINT=https://your-umami-api.com/api/
UMAMI_USERNAME=admin
UMAMI_PASSWORD=umami
UMAMI_WEBSITE_ID=your-website-id

# Admin (for dashboard login)
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin
```

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
src/
├── app/           # Pages and routing (Next.js App Router)
│   ├── login/     # Login page
│   ├── layout.tsx # Main layout
│   └── page.tsx   # Dashboard home page
├── components/    # UI components
│   ├── DashboardContent.tsx
│   ├── KPICards.tsx
│   ├── UmamiChart.tsx
│   ├── TopLists.tsx
│   ├── DateFilter.tsx
│   ├── WebsiteFilter.tsx
│   └── ThemeToggle.tsx
└── lib/           # Helper functions
    ├── auth.tsx   # Authentication
    └── umami.ts   # Umami API
```

## License

MIT
