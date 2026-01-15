# Getting Started with Stripe Integration Builder

## Quick Start

```bash
# 1. Install dependencies (already done!)
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

## What You'll See

When you run the app, you'll see:

1. **Product Icons** at the top - Click any icon to add/remove it from your stack
2. **Example Stacks** - Try the preset buttons (SaaS, Marketplace, Creator) for quick demos
3. **Central Dashboard** - Updates dynamically based on selected products
4. **Animated Connections** - Beautiful Bezier curves connecting products to the dashboard
5. **Live Metrics** - Revenue ticker that updates in real-time

## Project Architecture

### 🏗️ Structure Overview

```
src/
├── components/          # Reusable UI components
│   ├── ProductIcon.tsx     # Product icon buttons with hover effects
│   ├── GradientPath.tsx    # Animated SVG paths
│   └── slots/              # Dashboard slot components
│       ├── GraphVisualizer.tsx   # Revenue graphs (adapts to products)
│       ├── MetricSlot.tsx        # Revenue metrics display
│       └── FooterSlot.tsx        # Product-specific badges
├── config/
│   └── products.ts         # Product definitions, presets, constants
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx                # Main application (orchestrates everything)
├── main.tsx              # React entry point
└── index.css             # Global styles + Tailwind
```

### 🎯 Key Concepts

#### 1. **Unified Coordinate System**
The app uses a virtual "stage" (1000x800 units) where:
- SVG paths and HTML elements share the same coordinate space
- Icons positioned at `y: 100`
- Dashboard card positioned at `y: 320`
- This ensures perfect alignment of connections

#### 2. **Slot Architecture**
Dashboard components are modular "slots" that adapt to active products:
- **GraphVisualizer**: Shows different chart types (line, split, step)
- **MetricSlot**: Updates labels (GMV, MRR, Revenue)
- **FooterSlot**: Displays relevant badges

#### 3. **State Management**
Simple React hooks manage state:
- `activeProducts`: Array of selected ProductIds
- `revenue`: Number that ticks up based on selected products

## 🎨 Customization Guide

### Adding a New Product

**Step 1**: Add to `src/config/products.ts`
```typescript
{
  id: 'terminal',
  label: 'Terminal',
  icon: Smartphone,
  color: '#FF6B00',
  description: 'In-person payments'
}
```

**Step 2**: Update `src/types/index.ts`
```typescript
export type ProductId =
  | 'payments'
  | 'billing'
  | 'terminal'  // ← Add here
  // ... rest
```

**Step 3**: (Optional) Add custom behavior to slot components
```typescript
// In GraphVisualizer.tsx
const isTerminal = activeProducts.includes('terminal');
// Add terminal-specific visualization
```

### Changing Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      stripe: {
        purple: '#635BFF',  // Change these
        // ...
      }
    }
  }
}
```

### Adjusting Layout

Edit stage dimensions in `src/config/products.ts`:
```typescript
export const STAGE = {
  width: 1000,
  height: 800,
  iconY: 100,       // Icon vertical position
  cardTopY: 320,    // Card top edge
  cardCenterX: 500, // Card horizontal center
};
```

## 🚀 Development Tips

### Hot Module Replacement (HMR)
Vite provides instant feedback - just save and see changes immediately!

### Type Checking
```bash
# Run TypeScript compiler in watch mode
npx tsc --watch
```

### Linting
```bash
# Check for code issues
npm run lint
```

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 📊 Performance

- **Fast Builds**: Vite uses esbuild for lightning-fast builds
- **Optimized Animations**: Framer Motion uses GPU-accelerated transforms
- **Small Bundle**: ~275KB production JS (gzipped: ~89KB)
- **Tree Shaking**: Unused code is automatically removed

## 🎭 Interactive Features

### Product Icons
- **Hover**: Icon lifts up with scale animation
- **Click**: Toggle product on/off
- **Active State**: Dark background with colored dot indicator

### Preset Stacks
- **Sequential Animation**: Products add one-by-one (400ms delay)
- **Revenue Reset**: Starts at $12,000 baseline

### Dashboard Animations
- **Graph**: Path drawing animation (pathLength)
- **Badges**: Scale in/out with AnimatePresence
- **Radar**: Scanning line when Radar is active

### Revenue Ticker
- Updates every 1 second
- **Base**: $120.25 per tick
- **Connect Mode**: $1,250.50 per tick (higher GMV)

## 🔍 Debugging

### Common Issues

**Build fails with CSS error**
- Check that all Tailwind classes exist
- Remove any custom `@apply` directives that reference undefined classes

**TypeScript errors**
- Run `npx tsc --noEmit` to see all type errors
- Check that imports use the correct path aliases

**Animations not working**
- Ensure Framer Motion is installed: `npm list framer-motion`
- Check browser console for errors

### Dev Tools

```bash
# Check dependency versions
npm list

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated
```

## 📚 Learning Resources

- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/guide/
- **TypeScript**: https://www.typescriptlang.org/docs/

## 🎯 Next Steps

1. **Experiment**: Try clicking products and presets
2. **Customize**: Change colors, add new products
3. **Extend**: Add new dashboard visualizations
4. **Deploy**: Build and deploy to Vercel/Netlify

---

**Ready to start?** Run `npm run dev` and open http://localhost:3000! 🚀
