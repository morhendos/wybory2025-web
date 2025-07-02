# Quick Setup Guide

## Prerequisites

1. **Node.js 18+** installed
2. **MongoDB** running locally or MongoDB Atlas account
3. **CSV data files** from the original wybory2025 repository

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone this repo
git clone https://github.com/morhendos/wybory2025-web.git
cd wybory2025-web

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your MongoDB connection string
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/wybory2025

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wybory2025?retryWrites=true&w=majority
```

### 3. Get the Data

```bash
# Clone the original data repository
cd ..
git clone https://github.com/wybory2025/wybory2025.git
cd wybory2025-web
```

### 4. Import Data to MongoDB

```bash
# Make sure MongoDB is running, then:
npm run import-data

# Or if the CSV is in a different location:
CSV_PATH=../path/to/przeliczone.csv npm run import-data
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## Next Steps

### Adding Anomaly Data

The anomaly calculations need to be imported separately. You can either:

1. Run the Python analysis script and export anomalies to CSV
2. Create a script to calculate anomalies directly in Node.js
3. Import pre-calculated anomaly data

### Implementing Visualizations

The key visualizations to implement:

1. **GAM Curve** - Shows the relationship between leaning score and anomalies
2. **Regional Heatmap** - Geographic distribution of anomalies
3. **Commission Scatter Plot** - Individual commission anomalies

### Example: Adding D3.js Visualization

```typescript
// components/charts/GAMCurve.tsx
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export function GAMCurve({ data }) {
  const svgRef = useRef(null)
  
  useEffect(() => {
    // D3 visualization code here
  }, [data])
  
  return <svg ref={svgRef} />
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### MongoDB Atlas Setup

1. Create free cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Whitelist Vercel IPs or allow access from anywhere
3. Create database user
4. Get connection string and add to Vercel env vars

## Troubleshooting

### "Cannot connect to MongoDB"
- Check if MongoDB is running: `mongosh`
- Verify connection string in .env
- For Atlas, check IP whitelist

### "CSV file not found"
- Ensure you've cloned the wybory2025 repo
- Check the CSV_PATH environment variable
- Verify file exists at specified path

### "Module not found" errors
- Run `npm install` again
- Delete node_modules and package-lock.json, then reinstall
- Check you're using Node.js 18+

## Contributing

Contributions welcome! Key areas that need work:

1. 📊 **Visualizations** - Implement the charts
2. 🗺️ **Maps** - Add geographic visualizations  
3. 📱 **Mobile** - Improve mobile responsiveness
4. 🌍 **i18n** - Add English translations
5. 🧪 **Testing** - Add test coverage

Create an issue or submit a PR!