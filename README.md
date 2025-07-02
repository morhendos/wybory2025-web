# Wybory 2025 - Interactive Analysis Platform

An interactive web platform that makes complex electoral statistical analysis accessible to everyone. This project visualizes the findings from the wybory2025 analysis in an intuitive, user-friendly way.

## 🎯 Project Goals

- Transform complex statistical analysis into understandable visualizations
- Provide interactive exploration of electoral data
- Explain methodology in accessible terms
- Show findings with full transparency

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Original data files from [wybory2025/wybory2025](https://github.com/wybory2025/wybory2025)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/morhendos/wybory2025-web.git
cd wybory2025-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string
```

4. Import data (make sure you have the CSV files):
```bash
npm run import-data
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Features

- **Interactive Methodology Guide**: Step-by-step explanation of the analysis
- **Data Explorer**: Browse results by region, commission type
- **Anomaly Visualizations**: See where and how anomalies occurred
- **Findings Dashboard**: Key results presented clearly
- **Technical Documentation**: For those who want deeper understanding

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts, D3.js
- **Database**: MongoDB
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and database
├── types/           # TypeScript type definitions
├── scripts/         # Data import and processing
└── public/          # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Original analysis by [wybory2025](https://github.com/wybory2025/wybory2025)
- Inspired by the need to make electoral data more accessible