import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Globe } from 'lucide-react';
import { ProductIcon } from '@/components/ProductIcon';
import { GradientPath } from '@/components/GradientPath';
import { GraphVisualizer } from '@/components/slots/GraphVisualizer';
import { MetricSlot } from '@/components/slots/MetricSlot';
import { FooterSlot } from '@/components/slots/FooterSlot';
import { PRODUCTS, PRESETS, STAGE, getIconPosition } from '@/config/products';
import { generateOrthogonalPath } from '@/utils/pathGeneration';
import type { ProductId, PresetType } from '@/types';

export default function App() {
  const [activeProducts, setActiveProducts] = useState<ProductId[]>([]);
  const [revenue, setRevenue] = useState(0);

  const toggleProduct = (id: ProductId) => {
    setActiveProducts((prev) => {
      const isIncludes = prev.includes(id);
      if (isIncludes) return prev.filter((p) => p !== id);
      return [...prev, id];
    });
  };

  useEffect(() => {
    // Revenue ticker animation
    const interval = setInterval(() => {
      setRevenue((prev) => {
        if (activeProducts.length === 0) return 0;
        const increment = activeProducts.includes('connect') ? 1250.5 : 120.25;
        return prev + increment;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeProducts]);

  const applyPreset = async (type: PresetType) => {
    setActiveProducts([]);
    setRevenue(12000);

    const preset = PRESETS.find((p) => p.id === type);
    if (!preset) return;

    for (let i = 0; i < preset.products.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      const pid = preset.products[i];
      if (PRODUCTS.some((p) => p.id === pid)) {
        setActiveProducts((prev) => [...prev, pid]);
      }
    }
  };

  const hasClimate = activeProducts.includes('climate');
  const hasAtlas = activeProducts.includes('atlas');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-stripe-purple selection:text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-stripe-purple rounded text-white flex items-center justify-center font-bold italic">
            S
          </div>
          <span className="font-semibold text-slate-700 tracking-tight">
            Integration Builder
          </span>
        </div>
        <div className="text-sm font-medium text-slate-500">
          <span className="text-stripe-purple">{activeProducts.length}</span>{' '}
          Products Active
        </div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-start pt-8 pb-20 overflow-y-auto">
        {/* Presets */}
        <div className="flex flex-col items-center gap-4 relative z-40 mb-8">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Example Stacks
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className="group relative px-6 py-3 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-stripe-purple hover:text-stripe-purple hover:shadow-lg transition-all active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <preset.icon
                    size={14}
                    className="group-hover:scale-110 transition-transform"
                  />
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* THE UNIFIED STAGE */}
        <div
          className="relative w-full max-w-[1400px] mx-auto"
          style={{ aspectRatio: `${STAGE.width}/${STAGE.height}` }}
        >
          {/* LAYER 1: The SVG Connection Grid with Orthogonal Routing */}
          <svg
            viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          >
            <defs>
              {/* SVG Filters for Glow Effects */}
              <filter
                id="glow-blur"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="6" />
              </filter>

              <filter id="pulse-glow">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="4"
                  result="blur"
                />
                <feFlood floodColor="currentColor" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Linear Gradients - One per active product */}
              {activeProducts.map((id) => {
                const product = PRODUCTS.find((p) => p.id === id);
                if (!product) return null;

                const index = PRODUCTS.findIndex((p) => p.id === id);
                const pos = getIconPosition(index);

                return (
                  <linearGradient
                    key={`gradient-${id}`}
                    id={`gradient-${id}`}
                    gradientUnits="userSpaceOnUse"
                    x1={pos.x}
                    y1={pos.y + 35}
                    x2={STAGE.cardCenterX}
                    y2={STAGE.cardTopY}
                  >
                    <stop offset="0%" stopColor={product.color} />
                    <stop
                      offset="70%"
                      stopColor={product.color}
                      stopOpacity="0.8"
                    />
                    <stop
                      offset="100%"
                      stopColor="#635BFF"
                      stopOpacity="0.6"
                    />
                  </linearGradient>
                );
              })}
            </defs>

            <AnimatePresence>
              {activeProducts.map((id) => {
                const product = PRODUCTS.find((p) => p.id === id);
                if (!product) return null;

                const index = PRODUCTS.findIndex((p) => p.id === id);
                const pos = getIconPosition(index);

                // Generate orthogonal path with rounded corners
                const d = generateOrthogonalPath({
                  startX: pos.x,
                  startY: pos.y + 35,
                  endX: STAGE.cardCenterX,
                  endY: STAGE.cardTopY,
                  cornerRadius: 20,
                  convergenceY: 220,
                  verticalDrop: 60,
                });

                return (
                  <motion.g
                    key={id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <GradientPath
                      d={d}
                      color={product.color}
                      gradientId={`gradient-${id}`}
                    />
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </svg>

          {/* LAYER 2: The HTML Product Icons */}
          {PRODUCTS.map((product, index) => {
            const pos = getIconPosition(index);
            return (
              <ProductIcon
                key={product.id}
                product={product}
                isActive={activeProducts.includes(product.id)}
                onClick={() => toggleProduct(product.id)}
                x={pos.x}
                y={pos.y}
              />
            );
          })}

          {/* LAYER 3: The Central Card */}
          <motion.div
            layout="position"
            initial={false}
            animate={{
              boxShadow: hasClimate
                ? '0 20px 50px -12px rgba(0, 217, 36, 0.25)'
                : activeProducts.length > 0
                  ? '0 20px 50px -12px rgba(99, 91, 255, 0.25)'
                  : '0 10px 30px -10px rgba(0,0,0,0.1)',
              borderColor: hasClimate
                ? 'rgba(0, 217, 36, 0.3)'
                : 'rgba(226, 232, 240, 1)',
            }}
            className={`
              absolute z-20 w-[90%] md:w-[60%] bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col
              transition-colors duration-500
              ${hasClimate ? 'bg-gradient-to-br from-green-50 to-white' : ''}
            `}
            style={{
              left: `${(STAGE.cardCenterX / STAGE.width) * 100}%`,
              top: `${(STAGE.cardTopY / STAGE.height) * 100}%`,
              transform: 'translateX(-50%)',
              minHeight: '380px',
            }}
          >
            {/* Header / Brand */}
            <div className="px-8 pt-8 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">
                    Acme Corp
                  </h3>
                  <p className="text-xs text-slate-500">
                    {hasAtlas ? 'Incorporated in Delaware' : 'Sole Proprietorship'}
                  </p>
                </div>
              </div>
              {hasAtlas && <Globe className="text-slate-300" size={24} />}
            </div>

            {/* Content Slots */}
            <div className="p-8 flex-1 flex flex-col gap-6">
              <MetricSlot
                activeProducts={activeProducts}
                revenue={revenue}
              />
              <GraphVisualizer activeProducts={activeProducts} />
              <FooterSlot activeProducts={activeProducts} />
            </div>

            {/* Empty State Overlay */}
            <AnimatePresence>
              {activeProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-slate-400"
                >
                  <BarChart3 size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">Add products to build your stack</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
