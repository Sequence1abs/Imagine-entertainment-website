# Cloudflare Migration Guide

## Overview

This document outlines the complete migration from **Vercel + Cloudinary** to **Cloudflare Pages + Cloudflare Images**.

---

## Architecture Comparison

### Before (Current)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     VERCEL      │     │   CLOUDINARY    │     │    SUPABASE     │
│   (Hosting)     │     │    (Media)      │     │   (Database)    │
│   Next.js 16    │     │  Images/Video   │     │   Auth/Data     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### After (Target)

```
┌─────────────────────────────────────────┐     ┌─────────────────┐
│              CLOUDFLARE                 │     │    SUPABASE     │
│  ┌─────────────┐  ┌─────────────────┐   │     │   (Database)    │
│  │   Pages +   │  │ Images + Stream │   │     │   Auth/Data     │
│  │  Workers    │  │   (Media)       │   │     │   (No change)   │
│  │  (OpenNext) │  │                 │   │     │                 │
│  └─────────────┘  └─────────────────┘   │     └─────────────────┘
└─────────────────────────────────────────┘
```

---

## Cost Breakdown

| Service   | Previous                   | New                     | Savings |
| --------- | -------------------------- | ----------------------- | ------- |
| Hosting   | Vercel Free (exceeded)     | Cloudflare Workers FREE | -       |
| Media     | Cloudinary Free (exceeded) | Cloudflare Images $5/mo | -       |
| Database  | Supabase Free              | Supabase Free           | -       |
| **Total** | $0 (broken)                | **$5/mo**               | Works!  |

---

## Migration Steps

### Phase 1: Code Changes

1. **Downgrade Next.js 16 → 14**

   - OpenNext requires Next.js 14 for Cloudflare compatibility
   - Update `package.json` dependencies
   - Update shadcn/ui components for React 18

2. **Install OpenNext Adapter**

   ```bash
   npm install @opennextjs/cloudflare
   ```

3. **Configure wrangler.json**
   ```json
   {
     "name": "imagine-entertainment",
     "compatibility_date": "2024-01-01",
     "compatibility_flags": ["nodejs_compat"]
   }
   ```

### Phase 2: Media Migration

1. **Set up Cloudflare Images account**
2. **Run migration script** (downloads from Cloudinary, uploads to CF Images)
3. **Update image URLs in Supabase database**
4. **Update hero video to Cloudflare Stream**

### Phase 3: Deployment

1. **Deploy to Cloudflare Pages** (preview URL)
2. **Test all functionality**
3. **Switch DNS** (5 minute downtime max)
4. **Verify everything works**
5. **Keep Vercel as backup for 2 weeks**

---

## Zero Downtime Strategy

```
Timeline:
├── Day 1-2: Code changes (Vercel stays LIVE)
├── Day 2-3: Image migration (Vercel stays LIVE)
├── Day 3: Testing on Cloudflare preview URL (Vercel stays LIVE)
├── Day 3: DNS switch (~5 minutes)
└── Day 3+: Cloudflare LIVE, Vercel backup
```

---

## Cloudflare Images Organization

### Folder Structure Mapping

Cloudflare Images uses Custom IDs instead of folders:

| Cloudinary Path              | Cloudflare Custom ID     |
| ---------------------------- | ------------------------ |
| `imagine-events/event1.jpg`  | `imagine-events_event1`  |
| `imagine-gallery/photo1.jpg` | `imagine-gallery_photo1` |
| `about/team.jpg`             | `about_team`             |

### URL Format

```
Cloudinary:
https://res.cloudinary.com/dqhklh9nd/image/upload/v1234/imagine-events/event1.jpg

Cloudflare Images:
https://imagedelivery.net/{account-hash}/imagine-events_event1/public
```

### Variants (Transformations)

Create variants in Cloudflare Dashboard:

| Variant Name | Settings                   |
| ------------ | -------------------------- |
| `public`     | Original size, auto-format |
| `thumbnail`  | 300x300, fit cover         |
| `gallery`    | 800x600, fit contain       |
| `hero`       | 1920x1080, quality 85      |

---

## Environment Variables

### Remove (Cloudinary)

```env
# Delete these
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Add (Cloudflare)

```env
# Add these
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_IMAGES_API_TOKEN=your-api-token
CLOUDFLARE_IMAGES_ACCOUNT_HASH=your-account-hash
```

### Keep (Unchanged)

```env
# These stay the same
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
```

---

## Worker Usage Estimates

### Daily Usage

| Visitor Count | Worker Requests | % of 100K Free |
| ------------- | --------------- | -------------- |
| 200/day       | 1,600           | 1.6%           |
| 500/day       | 4,000           | 4%             |
| 1,000/day     | 8,000           | 8%             |
| 5,000/day     | 40,000          | 40%            |

### Room to Grow

Can handle **12,500 daily visitors** before needing paid Workers ($5/mo additional).

---

## Rollback Plan

If issues occur after DNS switch:

1. **Switch DNS back to Vercel** (5 minutes)
2. Vercel deployment still exists as backup
3. Debug Cloudflare issues
4. Retry when fixed

---

## Monitoring

### Cloudflare Dashboard

- Workers → Analytics (request counts)
- Images → Usage (storage, deliveries)
- Pages → Deployments (build logs)

### Alerts to Set Up

- Worker requests approaching 80K/day
- Build failures
- Error rate spikes

---

## Timeline Estimate

| Task                            | Duration      |
| ------------------------------- | ------------- |
| Code downgrade + OpenNext setup | 2-3 hours     |
| Cloudflare account setup        | 30 minutes    |
| Image migration script          | 1 hour        |
| Image migration run             | 1-2 hours     |
| Testing                         | 1-2 hours     |
| DNS switch + verification       | 30 minutes    |
| **Total**                       | **6-9 hours** |

---

## Support Contacts

- **Cloudflare Issues**: [Cloudflare Community](https://community.cloudflare.com)
- **OpenNext Issues**: [OpenNext GitHub](https://github.com/opennextjs/opennextjs-cloudflare)
- **Next.js Issues**: [Next.js GitHub](https://github.com/vercel/next.js)

---

_Document created: January 10, 2026_
_For: Imagine Entertainment Website Migration_


re_crBHydXG_EwsQuugMg7C1V1N5zsap3b3Q