# IMAGINE Entertainment - Comprehensive Manual & Documentation

> A premium, high-performance web platform built for IMAGINE Entertainment. This repository houses both the high-speed public portfolio and the sophisticated event management ecosystem.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Supabase](https://img.shields.io/badge/Supabase-DB%20%26%20Auth-green)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Optimization-blue)
![Vercel](https://img.shields.io/badge/Vercel-Hosted-black)

---

## 🌟 Executive Summary

IMAGINE Entertainment's platform is a modern, full-stack application designed to showcase a high-end entertainment portfolio. It reconciles the need for a lightning-fast, SEO-optimized public interface with a robust, secure, and feature-rich administrative backend.

### Key Value Propositions
- **Blazing Speed**: Leveraging Next.js Static Site Generation (SSG) for sub-50ms page loads.
- **Visual Excellence**: Integrated Cloudinary pipeline for automatic image compression, WebP/AVIF conversion, and responsive delivery.
- **Staff Autonomy**: A comprehensive dashboard allowing non-technical staff to manage the entire portfolio.
- **Operational Efficiency**: Automated database maintenance and real-time performance analytics.

---

## 🛠️ Detailed Tech Stack

The application uses a curated selection of industry-leading technologies to ensure scalability, security, and performance.

### Core Frameworks
- **[Next.js 16 (App Router)](https://nextjs.org/)**: The foundation of the app, providing file-based routing, server components, and optimized rendering strategies.
- **[React 19](https://react.dev/)**: For building dynamic, interactive user interfaces with the latest concurrent features.
- **[TypeScript](https://www.typescriptlang.org/)**: Ensuring type safety across the entire codebase to minimize runtime errors.

### Backend & Infrastructure
- **[Supabase](https://supabase.com/)**: Providing a PostgreSQL database, integrated authentication, and Row Level Security (RLS).
- **[Cloudinary](https://cloudinary.com/)**: Handling complex image transformations, optimizations, and global CDN delivery.
- **[Vercel](https://vercel.com/)**: Serving as the hosting platform with global edge caching and serverless function support.

### UI & UX Components
- **[Tailwind CSS](https://tailwindcss.com/)**: For rapid, utility-first styling and a consistent design language.
- **[Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)**: Powering premium animations and high-performance scroll effects.
- **[Radix UI](https://www.radix-ui.com/)**: Providing accessible, unstyled primitives for complex components like dialogs, menus, and selects.
- **[Lucide React](https://lucide.dev/)**: Providing a consistent and beautiful icon set.
- **[Sonner](https://sonner.stevenbernhard.com/)**: Clean and efficient toast notifications.

### Performance & Analytics
- **[Vercel Analytics](https://vercel.com/analytics)**: Real-time user metrics and Vitals monitoring.
- **[Cloudflare Analytics](https://www.cloudflare.com/analytics/)**: Deep traffic insights and edge-level monitoring.

---

## 📂 Project Structure & Architecture

The project follows a **Route Group** architecture within the Next.js `app` directory to cleanly separate concerns between public and administrative faces.

```text
Imagine-entertainment-website/
├── app/                        # Main Application Routes
│   ├── (public)/              # Visitor-facing pages (Home, Work, Gallery, etc.)
│   ├── (admin)/               # Secure Management Dashboard
│   ├── api/                   # Serverless Backend Endpoints
│   │   ├── admin/             # Dashboard-specific APIs
│   │   ├── analytics/         # Traffic & Performance reporting
│   │   ├── events/            # Public event data fetching
│   │   ├── upload/            # Cloudinary image processing
│   │   └── keep-alive/        # DB maintenance cron
│   ├── globals.css            # Global themes & Tailwind directives
│   └── layout.tsx             # Root template & Metadata
├── components/                 # Reusable UI Architecture
│   ├── ui/                    # Base Radix/Shadcn components
│   ├── dashboard/             # Management-specific widgets
│   ├── home/                  # Homepage-specific sections
│   ├── seo/                   # Dynamic Meta & Analytics components
│   └── navigation.tsx         # Unified site navigation
├── lib/                        # Core Logic & Utilities
│   ├── actions/               # Server Actions (Uploads, Logins, etc.)
│   ├── supabase/              # Database clients & Middleware
│   ├── data/                  # Standardized data fetching functions
│   ├── types/                 # Global TypeScript definitions
│   └── cloudinary-upload.ts   # Image processing pipeline
├── public/                     # Static assets (Logos, Icons)
├── styles/                     # Specialized CSS modules (Masonry, Cursors)
├── supabase-schema.sql         # Source of truth for Database
├── vercel.json                 # Deployment & Cron configuration
└── next.config.mjs             # Framework-level overrides
```

---

## 🚀 Deployment & Operations

### Deployment Pipeline
1. **Source**: Push code to GitHub/GitLab.
2. **Build**: Vercel triggers a build, executing `next build`.
3. **SSG**: Public pages are pre-rendered into static HTML utilizing stored data.
4. **Deploy**: Optimized assets are pushed to Vercel's global Edge Network.

### Maintenance (Supabase Keep-Alive)
Due to Supabase's free tier policy of pausing inactive databases, an automated "Keep-Alive" system is implemented:
- **Endpoint**: `/api/keep-alive`
- **Mechanism**: A lightweight query to the `events` table.
- **Schedule**: Every 3 days (configured via `vercel.json` crons).

---

## � Security Protocols

- **Authentication**: Managed via Supabase Auth with secure JWT handling.
- **Route Protection**: Next.js Middleware (`middleware.ts`) intercepting all `/dashboard` requests to verify user sessions.
- **Database Access**: Row Level Security (RLS) policies implemented in PostgreSQL to ensure admins can only modify authorized data.
- **Environment Safety**: Zero exposure of sensitive keys (`SERVICE_ROLE_KEY`, `API_SECRET`) to the client-side.

---

## 📈 Performance & SEO Guidelines

- **Image Optimization**: Always use the `<Image />` component from `next/image`. It automatically connects to the Cloudinary pipeline for dynamic resizing.
- **Metadata**: Every public page implements `generateMetadata` for dynamic OpenGraph and SEO tags.
- **Accessibility**: All UI components are built on Radix UI, ensuring full screen-reader and keyboard support.

---

## 🤝 Contribution & Support

For technical support or inquiries, please contact the development team at [support@imaginesl.com](mailto:support@imaginesl.com).

**Designed & Developed with ❤️ by the Imagine Entertainment Dev Team.**
