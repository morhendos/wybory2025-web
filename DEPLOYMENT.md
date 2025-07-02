# 🚀 Deployment Guide

## Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- MongoDB Atlas account for production database

### Step 1: Prepare MongoDB Atlas

1. **Create a free cluster** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Set up network access**:
   - Go to Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Vercel's IP ranges (more secure)

3. **Create database user**:
   - Go to Database Access → Add New Database User
   - Note down username and password

4. **Get connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# In your project directory
vercel

# Follow the prompts
# When asked about environment variables, add:
# MONGODB_URI = your_mongodb_connection_string
```

#### Option B: Using GitHub Integration

1. Push your code to GitHub (already done!)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wybory2025?retryWrites=true&w=majority
   ```

6. Click "Deploy"

### Step 3: Import Data to Production

After deployment, you need to populate the production database:

1. **Clone the original data**:
   ```bash
   git clone https://github.com/wybory2025/wybory2025.git
   ```

2. **Run import scripts with production MongoDB**:
   ```bash
   # Set production MongoDB URI
   export MONGODB_URI="your_production_mongodb_uri"
   
   # Import commission data
   npm run import-data
   
   # Import anomaly data
   npm run import-anomalies
   ```

### Step 4: Verify Deployment

1. Visit your deployment URL: `https://your-app.vercel.app`
2. Check that all pages load correctly
3. Verify data is displaying in the findings page
4. Test the data explorer filters

## Environment Variables Reference

### Required for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wybory2025?retryWrites=true&w=majority
```

### Optional
```env
# For custom domain
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# For analytics (future)
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX

# For error tracking (future)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

## Custom Domain Setup

1. In Vercel dashboard, go to Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL certificate is automatic

## Performance Optimization

### Enable Caching
Add to `next.config.js`:
```javascript
module.exports = {
  // ... existing config
  headers: async () => [
    {
      source: '/api/summary',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ],
}
```

### Image Optimization
- Use Next.js Image component for all images
- Store images in `public/` directory
- Vercel automatically optimizes them

## Monitoring

### Vercel Analytics
1. Enable in Vercel dashboard
2. No code changes needed
3. View at: `https://vercel.com/[your-username]/[your-project]/analytics`

### Check Function Logs
- Go to Functions tab in Vercel dashboard
- Monitor API route performance
- Set up alerts for errors

## Troubleshooting

### "500 Error" on API Routes
- Check MongoDB connection string in Vercel env vars
- Verify MongoDB Atlas network access allows Vercel
- Check function logs for specific errors

### "Module not found" Errors
- Ensure all dependencies are in `package.json` (not devDependencies)
- Clear cache and redeploy: `vercel --force`

### Slow Performance
- Check MongoDB indexes are created
- Enable API route caching (see above)
- Consider upgrading Vercel plan for more resources

### Data Not Showing
- Verify data import completed successfully
- Check browser console for API errors
- Ensure MongoDB URI is correct in production

## Maintenance

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package@latest
```

### Database Backups
- MongoDB Atlas includes daily backups (free tier: 2 days)
- For production: enable continuous backups
- Download backups regularly

### Monitoring Checklist
- [ ] Check Vercel Analytics weekly
- [ ] Monitor MongoDB Atlas metrics
- [ ] Review function logs for errors
- [ ] Test all features after updates
- [ ] Keep dependencies updated

## Cost Considerations

### Free Tier Limits
- **Vercel Hobby**: 100GB bandwidth, 100k requests
- **MongoDB Atlas M0**: 512MB storage, shared resources
- **Sufficient for**: ~50k monthly visitors

### When to Upgrade
- Consistent 500+ daily active users
- Need for custom domain
- Advanced analytics required
- Better MongoDB performance needed

---

## Quick Deploy Button

Add this to your README for one-click deploy:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmorhendos%2Fwybory2025-web&env=MONGODB_URI&envDescription=MongoDB%20connection%20string&envLink=https%3A%2F%2Fgithub.com%2Fmorhendos%2Fwybory2025-web%2Fblob%2Fmain%2FDEPLOYMENT.md)
```

---

Last updated: 2025-07-03