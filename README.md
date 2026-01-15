# Stripe Integration Builder

An interactive, animated visualization tool for exploring and configuring Stripe product integrations. Built with React, TypeScript, Framer Motion, and Tailwind CSS.

![Stripe Integration Builder](https://img.shields.io/badge/Stripe-Demo-635BFF?style=for-the-badge&logo=stripe)

## 🎯 Features

- **Interactive Product Selection**: Click on product icons to add/remove them from your stack
- **Animated Connections**: Beautiful Bezier curve animations connecting products to the dashboard
- **Dynamic Dashboard**: Real-time metrics that adapt based on selected products
- **Preset Stacks**: Quick-start configurations for common use cases (SaaS, Marketplace, Creator)
- **Responsive Design**: Fully responsive layout that works on all screen sizes
- **Type-Safe**: Built with TypeScript for enhanced developer experience

## 🏗️ Project Structure

```
StripeDemo/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ProductIcon.tsx      # Interactive product icon buttons
│   │   ├── GradientPath.tsx     # Animated connection paths
│   │   └── slots/               # Modular dashboard components
│   │       ├── GraphVisualizer.tsx  # Dynamic revenue graphs
│   │       ├── MetricSlot.tsx       # Revenue metrics display
│   │       └── FooterSlot.tsx       # Product-specific badges
│   ├── config/                  # Configuration files
│   │   └── products.ts          # Product definitions & constants
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles & Tailwind imports
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server (opens at http://localhost:3000)
npm run dev
# or
bun dev
```

### Build

```bash
# Create production build
npm run build
# or
bun run build
```

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
# or
bun run preview
```

## 🎨 Design Principles

### 1. **Unified Coordinate System**
The application uses a virtual stage (1000x800) where both SVG elements and HTML components share the same coordinate space, ensuring perfect alignment of animated connections.

### 2. **Component Modularity**
Dashboard components are built as independent "slots" that can be easily modified or extended:
- `GraphVisualizer`: Adapts chart type based on active products
- `MetricSlot`: Updates metric labels and calculations
- `FooterSlot`: Shows relevant badges for each product

### 3. **Animation-First**
All interactions use Framer Motion for smooth, performant animations:
- Path drawing animations using `pathLength`
- Layout animations for dashboard changes
- Enter/exit animations for dynamic content

### 4. **Type Safety**
TypeScript ensures robust type checking throughout:
- Centralized type definitions in `src/types/`
- Strict mode enabled for maximum safety
- Path aliases for clean imports

## 🧩 Available Products

| Product | Icon | Color | Use Case |
|---------|------|-------|----------|
| **Payments** | 💳 | Purple | Online & in-person payments |
| **Billing** | 🔄 | Cyan | Recurring revenue management |
| **Connect** | 👥 | Blue | Platform & marketplace payments |
| **Radar** | 🛡️ | Red | Fraud detection & prevention |
| **Climate** | 🌿 | Green | Carbon removal contributions |
| **Atlas** | 🌍 | Orange | Company incorporation |
| **Identity** | 🔒 | Pink | Identity verification |

## 📦 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (ultra-fast HMR)
- **Styling**: Tailwind CSS 3
- **Animation**: Framer Motion 11
- **Icons**: Lucide React
- **Code Quality**: ESLint with TypeScript support

## 🔧 Configuration

### Adding New Products

1. Add product definition to `src/config/products.ts`:
```typescript
{
  id: 'new-product',
  label: 'New Product',
  icon: YourIcon,
  color: '#HEX_COLOR',
  description: 'Product description'
}
```

2. Update the `ProductId` type in `src/types/index.ts`
3. Add conditional logic to slot components as needed

### Customizing Stage Layout

Edit constants in `src/config/products.ts`:
```typescript
export const STAGE = {
  width: 1000,
  height: 800,
  iconY: 100,        // Icon vertical position
  cardTopY: 320,     // Card top position
  cardCenterX: 500,  // Card horizontal center
};
```

## 🎯 Preset Stacks

Three example configurations are included:

1. **SaaS Startup**: Payments, Billing, Radar
2. **Marketplace**: Connect, Payments, Identity, Radar
3. **Creator Economy**: Payments, Climate, Billing

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is for demonstration purposes. Stripe and related trademarks are property of Stripe, Inc.

## 🙏 Acknowledgments

- Design inspired by Stripe's design system
- Built with modern web technologies
- Animations powered by Framer Motion

---

**Note**: This is a demonstration project and does not interact with actual Stripe APIs. For real Stripe integrations, please refer to the [official Stripe documentation](https://stripe.com/docs).
