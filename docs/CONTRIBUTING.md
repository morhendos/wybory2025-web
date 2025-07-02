# Contributing to wybory2025-web

## 🎯 Current Priorities

Before contributing, check our [ROADMAP.md](../ROADMAP.md) for current priorities. We especially need help with:

1. **Visualizations** - D3.js/Recharts expertise needed!
2. **Data Processing** - Porting Python analysis to JavaScript
3. **Polish Translations** - Making content accessible
4. **Testing** - Unit and integration tests

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/wybory2025-web.git
   cd wybory2025-web
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Workflow

### Code Style
- We use TypeScript - please maintain type safety
- Follow the existing code style (Prettier config coming soon)
- Use meaningful variable names
- Comment complex logic

### Commit Messages
- Use conventional commits format:
  - `feat:` New features
  - `fix:` Bug fixes
  - `docs:` Documentation changes
  - `style:` Code style changes
  - `refactor:` Code refactoring
  - `test:` Test additions/changes
  - `chore:` Build process/auxiliary changes

Example: `feat: add GAM curve visualization component`

### Pull Request Process
1. Update the ROADMAP.md with your changes
2. Add tests if applicable
3. Ensure all tests pass
4. Update documentation
5. Submit PR with clear description

## 📁 Project Structure

```
app/
├── api/          # API routes
├── (pages)/      # Page components
├── layout.tsx    # Root layout
└── globals.css   # Global styles

components/
├── charts/       # Visualization components
├── interactive/  # Interactive UI elements
└── ui/          # Reusable UI components

lib/
├── mongodb.ts    # Database connection
└── utils.ts      # Helper functions

types/
└── election.ts   # TypeScript interfaces

scripts/
└── import-data.ts # Data import scripts
```

## 🧪 Testing

### Running Tests
```bash
npm test           # Run all tests
npm run test:watch # Watch mode
npm run test:e2e   # E2E tests
```

### Writing Tests
- Place unit tests next to components (`Component.test.tsx`)
- E2E tests go in `e2e/` directory
- Test data goes in `__fixtures__/`

## 📊 Working with Visualizations

### Adding a New Chart
1. Create component in `components/charts/`
2. Use D3.js for complex visualizations
3. Use Recharts for standard charts
4. Make it responsive and accessible
5. Add loading and error states

Example structure:
```typescript
// components/charts/MyChart.tsx
export function MyChart({ data, ...props }) {
  // Implementation
}

// components/charts/MyChart.test.tsx
// Tests

// components/charts/MyChart.stories.tsx
// Storybook stories (coming soon)
```

## 🗃️ Database Considerations

### Adding New Collections
1. Define TypeScript interface in `types/`
2. Update import script if needed
3. Create appropriate indexes
4. Document the schema

### Query Optimization
- Use aggregation pipelines for complex queries
- Add indexes for frequently queried fields
- Limit returned fields to what's needed
- Implement pagination for large datasets

## 🐛 Reporting Issues

### Bug Reports
Include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment details

### Feature Requests
- Check ROADMAP.md first
- Describe the use case
- Provide examples if possible
- Explain why it's valuable

## 💡 Specific Contribution Ideas

### For Beginners
- Improve loading states
- Add tooltips to complex terms
- Fix responsive design issues
- Improve error messages
- Add missing TypeScript types

### For Data Scientists
- Port Python analysis to JavaScript
- Optimize anomaly calculations
- Add statistical validations
- Implement confidence intervals
- Create predictive models

### For Designers
- Create custom illustrations
- Improve mobile UX
- Design infographics
- Create loading animations
- Design dark mode

### For Backend Developers
- Optimize MongoDB queries
- Implement caching layer
- Add WebSocket support
- Create data pipeline
- Add API rate limiting

## 📞 Getting Help

- Check existing issues first
- Ask in discussions (coming soon)
- Review the codebase for examples
- Check the original [wybory2025](https://github.com/wybory2025/wybory2025) repo

## 🙏 Recognition

All contributors will be added to our README. Thank you for helping make electoral data more accessible!

---

Remember: The goal is to make complex electoral analysis understandable to everyone. Keep the end user in mind!