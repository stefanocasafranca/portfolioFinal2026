# Production Deployment Checklist

## ✅ Map Component - Required Environment Variable

**To see the interactive map in production (instead of the fallback), you MUST add this environment variable:**

### For Vercel:
1. Go to your project on [vercel.com/dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add:
   - **Name:** `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - **Value:** `pk.eyJ1Ijoic3RlZmFub2Nhc2FmcmFuY2EiLCJhIjoiY21jeThhcG13MG9zdzJtcGdkYmRpOTI3ZSJ9.3OxiIu7CF4n_AH2xbFQ8XQ`
   - **Environment:** Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application (or push a new commit to trigger auto-deploy)

### For Other Platforms:
Add the same environment variable in your platform's environment variable settings.

## 🔍 How to Verify

After deploying:
1. Visit your production website
2. Check the map card - you should see the interactive map (not the fallback with just the pin icon)
3. You should be able to zoom in/out using the buttons

## 📝 Current Status

- ✅ Code is correct and ready
- ✅ Local development works (with `.env.local`)
- ⚠️ **Production needs environment variable set**

## 🐛 Troubleshooting

If you still see the fallback after adding the env var:
1. Make sure you **redeployed** after adding the variable
2. Check that the variable name is exactly: `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
3. Verify the token value is correct (starts with `pk.ey`)
4. Check browser console for any errors

