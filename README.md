# Wybory 2025 - Interactive Analysis Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmorhendos%2Fwybory2025-web&env=MONGODB_URI&envDescription=MongoDB%20connection%20string&envLink=https%3A%2F%2Fgithub.com%2Fmorhendos%2Fwybory2025-web%2Fblob%2Fmain%2FDEPLOYMENT.md)

An interactive web platform that makes complex electoral statistical analysis accessible to everyone. This project visualizes the findings from the [wybory2025](https://github.com/wybory2025/wybory2025) analysis in an intuitive, user-friendly way.

## 🎯 Project Goals

- Transform complex statistical analysis into understandable visualizations
- Provide interactive exploration of electoral data
- Explain methodology in accessible terms
- Show findings with full transparency

## ✨ Current Features

### 📊 Visualizations (NEW!)
- **GAM Curve** - Shows the relationship between commission political leaning and anomalies
- **Scatter Plot** - Individual commission anomalies with interactive tooltips
- **Regional Bar Chart** - Anomaly distribution by voivodeship
- **Real-time Data** - Connected to MongoDB with actual analysis results

### 📱 Pages
- **Landing Page** - Overview of findings and navigation
- **Methodology** - Interactive step-by-step explanation
- **Data Explorer** - Filter and browse anomalies by region
- **Findings** - Key results with visualizations
- **Technical Docs** - Detailed implementation information

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Original data files from [wybory2025/wybory2025](https://github.com/wybory2025/wybory2025)

### Installation

```bash
# Clone and install
git clone https://github.com/morhendos/wybory2025-web.git
cd wybory2025-web
npm install

# Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI

# Import data
npm run import-all  # Imports both commission and anomaly data

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application!

## 📈 Development Progress

See [ROADMAP.md](ROADMAP.md) for detailed progress tracking.

### Recently Completed ✅
- D3.js visualizations (GAM curve, scatter plot, bar charts)
- Anomaly data import with mock data generation
- Real data integration in findings page
- Functional data explorer with filtering
- Loading states and error handling
- API endpoints for all data needs

### Next Priorities 🎯
- Poland SVG map for regional visualization
- Mobile responsiveness improvements
- Advanced filtering options
- Data export functionality

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: D3.js, Recharts
- **Database**: MongoDB
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
│   ├── charts/      # D3.js visualizations
│   └── ui/          # Reusable UI components
├── lib/             # Utility functions and database
├── types/           # TypeScript type definitions
├── scripts/         # Data import scripts
└── docs/            # Documentation
```

## 🤝 Contributing

We need help! Check [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines and [ROADMAP.md](ROADMAP.md) for what needs to be done.

**Key areas where we need contributors:**
- 🗺️ Poland map visualization
- 📱 Mobile optimization
- 🌍 English translations
- 🧪 Testing
- 📊 Additional chart types

## 📝 Documentation

- [SETUP.md](SETUP.md) - Detailed setup instructions
- [DEPLOYMENT.md](DEPLOYMENT.md) - How to deploy to production
- [TASKS.md](TASKS.md) - Current task list
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design

## 🙏 Acknowledgments

- Original analysis by [wybory2025](https://github.com/wybory2025/wybory2025)
- Inspired by the need to make electoral data more accessible
- Thanks to all contributors!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>If you find this project useful, please ⭐ star it on GitHub!</p>
  <p>
    <a href="https://github.com/morhendos/wybory2025-web/issues">Report Bug</a>
    ·
    <a href="https://github.com/morhendos/wybory2025-web/issues">Request Feature</a>
  </p>
</div>