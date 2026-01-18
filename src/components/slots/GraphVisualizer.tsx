import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GraphVisualizerProps {
  data: number[];
  height?: number;
  width?: number;
}

export const GraphVisualizer = ({ data, height = 120, width = 360 }: GraphVisualizerProps) => {
  const pathData = useMemo(() => {
    if (data.length === 0) return { line: '', area: '' };

    const max = 180; // Fixed max
    const min = 50;  // Fixed min
    const range = max - min;
    
    // We want the graph to occupy the bottom 40-50% mainly, but let's just scale to container
    // Padding to avoid clipping strokes
    const padding = 4;
    const availHeight = height - (padding * 2);
    const stepX = width / (data.length - 1);

    const points = data.map((val, i) => {
       const x = i * stepX;
       const normalized = (val - min) / range;
       const y = height - padding - (normalized * availHeight);
       return [x, y];
    });

    // Generate Smooth Line (Catmull-Rom or simpler cubic bezier)
    // For "Area Chart" look with strict x-stepping, a simple L is fine but Standard says "Smooth Curve".
    // Let's use simple Cubic Bezier for smoothness.
    
    const first = points[0];
    let d = `M ${first[0]} ${first[1]}`;

    for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        
        // Control points for smooth curve
        const controlX1 = current[0] + (next[0] - current[0]) / 2;
        const controlY1 = current[1];
        const controlX2 = current[0] + (next[0] - current[0]) / 2;
        const controlY2 = next[1];
        
        d += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next[0]} ${next[1]}`;
    }

    const linePath = d;
    // Close the area
    const areaPath = `${d} L ${width} ${height} L 0 ${height} Z`;

    return { line: linePath, area: areaPath };
  }, [data, height, width]);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-end">
       <svg
         viewBox={`0 0 ${width} ${height}`}
         preserveAspectRatio="none"
         className="w-full h-full overflow-visible"
       >
         <defs>
           <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="#635BFF" stopOpacity="0.2" />
             <stop offset="100%" stopColor="#635BFF" stopOpacity="0" />
           </linearGradient>
         </defs>
         
         {/* Area Fill */}
         <motion.path 
            d={pathData.area}
            fill="url(#areaGradient)"
            stroke="none"
         />
         
         {/* Stroke Line */}
         <motion.path 
            d={pathData.line}
            fill="none"
            stroke="#635BFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
       </svg>
    </div>
  );
};
