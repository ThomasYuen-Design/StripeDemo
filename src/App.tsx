import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductIcon } from '@/components/ProductIcon';
import { GradientPath } from '@/components/GradientPath';
import { CentralCard } from '@/components/CentralCard';
import { ConnectSimulationLayer } from '@/components/ConnectSimulationLayer';
import { DeviceSimulationLayer } from '@/components/DeviceSimulationLayer';
import { GlobalPayoutsSimulationLayer } from '@/components/GlobalPayoutsSimulationLayer';

import { PRODUCTS, PRESETS, STAGE, getIconPosition } from '@/config/products';
import { generateOrthogonalPath } from '@/utils/pathGeneration';
import type { ProductId, PresetType } from '@/types';

import StripeLogo from '@/assets/stripe-3.svg';

export default function App() {
  const [activeProducts, setActiveProducts] = useState<ProductId[]>([]);


  const toggleProduct = (id: ProductId) => {
    setActiveProducts(prev => {
      const isActive = prev.includes(id);
      let newProducts = isActive
        ? prev.filter(p => p !== id)
        : [...prev, id];

      // Dependency Logic: Connect requires Payments
      if (id === 'connect' && !isActive) {
        if (!newProducts.includes('payments')) {
          newProducts.push('payments');
        }
      }

      if (id === 'payments' && isActive) {
        // If turning Payments OFF, check if Connect or Global Payouts or Billing is ON
        if (newProducts.includes('connect') || newProducts.includes('globalPayouts') || newProducts.includes('billing')) {
           console.warn("Cannot turn off Payments while Connect, Global Payouts, or Billing is active");
           return prev;
        }
      }

      // Logic: Terminal requires Payments
      if (id === 'terminal' && !isActive && !newProducts.includes('payments')) {
        newProducts.push('payments');
      }

      // Logic: Radar requires Payments
      if (id === 'radar' && !isActive && !newProducts.includes('payments')) {
        newProducts.push('payments');
      }

      // Logic: Global Payouts requires Payments
      if (id === 'globalPayouts' && !isActive && !newProducts.includes('payments')) {
        newProducts.push('payments');
      }

      // Logic: Billing requires Payments
      if (id === 'billing' && !isActive && !newProducts.includes('payments')) {
        newProducts.push('payments');
      }

      // Logic: Authorization Boost requires Payments
      if (id === 'authorizationBoost' && !isActive && !newProducts.includes('payments')) {
        newProducts.push('payments');
      }
      
      return newProducts;
    });
  };



  const applyPreset = async (type: PresetType) => {
    setActiveProducts([]);


    const preset = PRESETS.find((p) => p.id === type);
    if (!preset) return;

    for (let i = 0; i < preset.products.length; i++) {
      const pid = preset.products[i];
      if (PRODUCTS.some((p) => p.id === pid)) {
        setActiveProducts((prev) => [...prev, pid]);
      }
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-stripe-purple selection:text-white flex flex-col overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none flex justify-center z-0">
        <div className="w-full max-w-[1400px] h-full border-x border-slate-200 grid grid-cols-4">
          <div className="border-r border-dashed border-slate-200"></div>
          <div className="border-r border-dashed border-slate-200"></div>
          <div className="border-r border-dashed border-slate-200"></div>
        </div>
      </div>

      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center border-b border-dashed border-slate-200 z-50">
        <div className="flex items-center gap-3">
          <img src={StripeLogo} alt="Stripe" className="h-7 w-auto" />
        </div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-start pt-4 pb-20 overflow-y-auto">
        {/* Presets */}
        <div className="flex flex-col items-center gap-4 relative z-40 mb-4">
          <div className="flex flex-wrap justify-center gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className="group relative px-6 py-3 bg-transparent rounded-full text-sm font-medium text-slate-500 hover:bg-[#635BFF] hover:text-white focus:bg-[#635BFF] focus:text-white focus:outline-none transition-all active:scale-95"
              >
                {preset.label}
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
              {/* Linear Gradients - One per active product */}
              {activeProducts.map((id) => {
                const product = PRODUCTS.find((p) => p.id === id);
                if (!product) return null;

                const index = PRODUCTS.findIndex((p) => p.id === id);
                const pos = getIconPosition(index);
                
                // Distribute endpoints along the top of the card
                // Card is centered at STAGE.cardCenterX
                // Spread connection points over 600px (fitting within the 840px card width)
                const connectionWidth = 440;
                const connectionStep = connectionWidth / (PRODUCTS.length - 1);
                const connectionStartX = STAGE.cardCenterX - (connectionWidth / 2);
                const targetX = connectionStartX + (index * connectionStep);

                return (
                  <linearGradient
                    key={`gradient-${id}`}
                    id={`gradient-${id}`}
                    gradientUnits="userSpaceOnUse"
                    x1={pos.x}
                    y1={pos.y + 35}
                    x2={targetX}
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
                
                // Recalculate targetX here as well (could be refactored to helper)
                const connectionWidth = 300;
                const connectionStep = connectionWidth / (PRODUCTS.length > 1 ? PRODUCTS.length - 1 : 1);
                const connectionStartX = STAGE.cardCenterX - (connectionWidth / 2);
                const targetX = connectionStartX + (index * connectionStep);

                // Calculate inflection Y (vertical drop depth)
                // We want outer items to drop further down (larger Y)
                // Inner items should drop less (smaller Y)
                
                const centerIndex = (PRODUCTS.length - 1) / 2;
                const distFromCenter = Math.abs(index - centerIndex);
                
                // Base drop from the icon row
                const baseDrop = 50; 
                // Additional drop per unit of distance from center
                const dropStep = 15;
                
                // Outer items get more drop
                const inflectionY = (pos.y + 35) + baseDrop + (distFromCenter * dropStep);

                const isStraight = Math.abs(pos.x - targetX) < 30;
                const finalTargetX = isStraight ? pos.x : targetX;

                // Generate path: Straight line if aligned, otherwise orthogonal
                const d = isStraight 
                  ? `M ${pos.x} ${pos.y + 35} L ${finalTargetX} ${STAGE.cardTopY}`
                  : generateOrthogonalPath({
                      startX: pos.x,
                      startY: pos.y + 35,
                      endX: finalTargetX,
                      endY: STAGE.cardTopY,
                      cornerRadius: 20,
                      convergenceY: inflectionY,
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

            {/* Simulation Layers */}
            <ConnectSimulationLayer isActive={activeProducts.includes('connect')} />
            <GlobalPayoutsSimulationLayer isActive={activeProducts.includes('globalPayouts')} />
            <DeviceSimulationLayer activeProducts={activeProducts} />


          {/* LAYER 3: The Central Card */}
          <CentralCard activeProducts={activeProducts} />
        </div>
      </main>
    </div>
  );
}
