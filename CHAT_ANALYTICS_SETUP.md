# Chat Analytics Setup Guide

This guide will help you set up chat analytics to track user interactions with your AI chatbot in production.

## 📋 Overview

The chat analytics system logs:
- User questions
- AI responses
- Response times
- Session tracking
- Device info (mobile vs desktop)
- User agent, IP address, referrer

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Vercel Postgres Database

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Navigate to your portfolio project
3. Click **Storage** tab (left sidebar)
4. Click **Create Database**
5. Select **Postgres**
6. Name it: `portfolio-chat-analytics`
7. Click **Create**

### Step 2: Run Database Schema

1. In your Vercel dashboard, navigate to your new Postgres database
2. Click on the **Data** or **SQL** tab
3. Copy and paste the SQL from `database/schema.sql`
4. Click **Execute** or **Run Query**

```sql
-- This creates the chat_logs table and indexes
-- See database/schema.sql for the full schema
```

### Step 3: Connect Database to Project

**Option A: Automatic (Recommended)**
1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. The `POSTGRES_URL` should already be linked automatically
3. If not, click **Connect** next to your database

**Option B: Manual**
1. Copy the `POSTGRES_URL` from your database settings
2. Add to `.env.local` for local testing:
```bash
POSTGRES_URL="postgres://..."
```
3. In production, Vercel automatically injects this variable

### Step 4: Deploy to Production

```bash
# Commit your changes
git add .
git commit -m "Add chat analytics tracking"
git push

# Vercel will auto-deploy
```

## ✅ Verification

### Test Locally (Optional)

1. Add `POSTGRES_URL` to your `.env.local`
2. Start dev server: `npm run dev`
3. Open AI chat and send a message
4. Check console for: `"Chat interaction logged successfully"`

### Test in Production

1. Visit your deployed site
2. Use the AI chat
3. Check Vercel logs for: `"Chat interaction logged successfully"`
4. Query your database to see the logged data

## 📊 Viewing Analytics

### Quick Queries (Run in Vercel SQL Dashboard)

**Most asked questions (last 30 days):**
```sql
SELECT user_message, COUNT(*) as count
FROM chat_logs
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY user_message
ORDER BY count DESC
LIMIT 10;
```

**Daily conversation volume:**
```sql
SELECT DATE(timestamp) as day, COUNT(*) as conversations
FROM chat_logs
GROUP BY DATE(timestamp)
ORDER BY day DESC
LIMIT 30;
```

**Average response time:**
```sql
SELECT AVG(response_time_ms) as avg_response_time_ms
FROM chat_logs;
```

**Mobile vs Desktop:**
```sql
SELECT
  CASE WHEN is_mobile THEN 'Mobile' ELSE 'Desktop' END as device,
  COUNT(*) as count
FROM chat_logs
GROUP BY is_mobile;
```

**Peak usage hours:**
```sql
SELECT
  EXTRACT(HOUR FROM timestamp) as hour,
  COUNT(*) as conversations
FROM chat_logs
GROUP BY EXTRACT(HOUR FROM timestamp)
ORDER BY conversations DESC;
```

## 🔒 Privacy & Compliance

### What's Collected
- ✅ Anonymous session IDs (not personally identifiable)
- ✅ Chat messages (questions & answers)
- ✅ Timestamps
- ✅ Response times
- ✅ Device type (mobile/desktop)
- ✅ User agent strings
- ✅ IP addresses (can be disabled)
- ✅ Referrer URLs

### What's NOT Collected
- ❌ User names
- ❌ Email addresses (unless user volunteers them in chat)
- ❌ Passwords
- ❌ Payment information
- ❌ Precise geolocation

### Privacy Notice Implementation

The system includes:
1. **Privacy banner** - Shows on first AI chat use
2. **Consent tracking** - Stored in localStorage
3. **Opt-in approach** - Banner must be dismissed

### Data Retention

Recommended: Delete logs older than 90 days

```sql
-- Run monthly to clean old data
DELETE FROM chat_logs
WHERE timestamp < NOW() - INTERVAL '90 days';
```

### GDPR Compliance

To delete a specific user's data:
```sql
-- Delete by session ID
DELETE FROM chat_logs
WHERE session_id = 'specific-session-id';
```

## 🛠 Troubleshooting

### "Database not configured" in logs
- **Cause:** `POSTGRES_URL` environment variable not set
- **Fix:** Add database connection string to Vercel environment variables

### Logs not appearing in database
- **Check 1:** Verify table exists: `SELECT * FROM chat_logs LIMIT 1;`
- **Check 2:** Check Vercel function logs for errors
- **Check 3:** Ensure database is connected to your project

### Rate limiting concerns
- Free tier: 60 hours compute/month
- Each log takes ~50ms
- You can handle ~72,000 chats/month on free tier

### Storage limits
- Free tier: 256 MB
- Each log: ~1-2 KB average
- Capacity: ~100,000+ conversations

## 🎯 Next Steps

1. **Set up monitoring:** Create a simple dashboard page
2. **Add email alerts:** Get notified of popular questions
3. **Export data:** Create CSV export for deeper analysis
4. **Set up cron job:** Auto-delete old data monthly

## 📦 What Was Added

### Files Created
- ✅ `database/schema.sql` - Database schema
- ✅ `components/ai-portfolio/privacy-banner.tsx` - Privacy notice
- ✅ `CHAT_ANALYTICS_SETUP.md` - This guide

### Files Modified
- ✅ `app/api/chat/route.ts` - Added logging logic
- ✅ `utils/hooks/use-chatbot.ts` - Added session ID tracking
- ✅ `components/ai-portfolio/index.tsx` - Added privacy banner
- ✅ `package.json` - Added @vercel/postgres

### Environment Variables Needed
```bash
# Production (Vercel automatically provides these)
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...

# Local Development (Optional - for testing)
POSTGRES_URL=postgres://...
```

## 🤝 Need Help?

If you encounter issues:
1. Check Vercel function logs
2. Verify database connection in Vercel dashboard
3. Test SQL queries manually in Vercel SQL editor
4. Check browser console for errors

## 📈 Future Enhancements

Consider adding:
- [ ] Real-time analytics dashboard
- [ ] Email notifications for new chats
- [ ] Sentiment analysis of conversations
- [ ] Export to CSV/JSON
- [ ] Integration with Google Analytics
- [ ] A/B testing different prompts
- [ ] User feedback ratings

---

**Status:** ✅ Implementation complete - Ready for production deployment

**Last Updated:** November 2025
