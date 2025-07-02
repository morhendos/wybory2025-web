# 🚀 Quick Start Tasks

## Immediate Next Steps (Do these first!)

### 1. Get the Project Running
```bash
# Clone and install
git clone https://github.com/morhendos/wybory2025-web.git
cd wybory2025-web
npm install

# Set up environment
cp .env.example .env
# Edit .env with your MongoDB connection
```

### 2. Import the Election Data
```bash
# Get the original data
cd ..
git clone https://github.com/wybory2025/wybory2025.git
cd wybory2025-web

# Run import (make sure MongoDB is running)
npm run import-data
```

### 3. Start Development
```bash
npm run dev
# Open http://localhost:3000
```

## 🎯 Today's Priority Tasks

### Task 1: Import Anomaly Data
The anomaly calculations are the heart of this project. We need to either:

**Option A: Use Pre-calculated Data**
```python
# In the wybory2025 directory, run:
python analiza_wyborcza.py --csv dane/przeliczone.csv

# This creates: anomalie_rt_uszeregowane.csv
# We need to import this to MongoDB
```

**Option B: Port the Analysis** (More work but better long-term)
- Create `lib/analysis/calculateAnomalies.ts`
- Port the Python regression model
- Port the GAM calculation

### Task 2: Create the GAM Curve Visualization
This is the most important chart! Create `components/charts/GAMCurve.tsx`:

```typescript
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface GAMCurveProps {
  data: Array<{
    leaningScore: number
    residual: number
    confidence: { lower: number; upper: number }
  }>
}

export function GAMCurve({ data }: GAMCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  
  useEffect(() => {
    if (!data || !svgRef.current) return
    
    // D3 implementation here
    const svg = d3.select(svgRef.current)
    // ... implement the visualization
    
  }, [data])
  
  return <svg ref={svgRef} className="w-full h-96" />
}
```

### Task 3: Hook Up Real Data
Update the API routes to return real data:

1. In `app/api/anomalies/route.ts` - make sure it's querying real anomalies
2. In `app/api/summary/route.ts` - return the actual -462,850 votes effect
3. Update the findings page to fetch and display real data

### Task 4: Create Basic Map Visualization
For `components/charts/PolandMap.tsx`:
- Use a Poland SVG map (find one or create with D3)
- Color regions by anomaly severity
- Add tooltips with details

## 📝 This Week's Goals

- [ ] Get real anomaly data flowing through the app
- [ ] Implement at least one working visualization
- [ ] Make the findings page show actual results
- [ ] Add loading states and error handling
- [ ] Deploy to Vercel for testing

## 🆘 Stuck? Here's Help

### MongoDB Connection Issues
```bash
# For local MongoDB
mongod --dbpath /usr/local/var/mongodb

# Or use MongoDB Atlas (free tier)
# Go to: https://www.mongodb.com/cloud/atlas
```

### Missing Anomaly Data
If you can't run the Python script:
1. Check the original repo for pre-calculated results
2. Or create mock data for now:
```javascript
// scripts/create-mock-anomalies.ts
const mockAnomalies = commissions.map(c => ({
  commissionId: c._id,
  residual: (Math.random() - 0.5) * 100,
  anomalyInVotes: (Math.random() - 0.5) * 50,
  // ... etc
}))
```

### Visualization Libraries
- D3.js docs: https://d3js.org/
- Recharts docs: https://recharts.org/
- Observable examples: https://observablehq.com/@d3/gallery

## 💡 Pro Tips

1. **Start with mock data** if real data isn't ready
2. **Use Tailwind classes** for quick styling
3. **Check the Python code** for calculation logic
4. **Ask ChatGPT** for D3.js help - it's complex!
5. **Deploy early** to Vercel for easy sharing

## 🎉 When You Complete a Task

1. Check it off in ROADMAP.md
2. Commit with a clear message
3. Push to GitHub
4. Consider opening a PR if it's a big feature

---

Remember: The goal is to make this data accessible to everyone. Even small improvements help!
