/**
 * Path generation utilities for Stripe-style orthogonal (Manhattan) routing
 */

import type { OrthogonalPathConfig } from '@/types';

/**
 * Generates an orthogonal (Manhattan-style) SVG path with rounded corners
 *
 * Path structure:
 * 1. Vertical drop from product icon
 * 2. Rounded corner turning horizontal
 * 3. Horizontal segment toward center
 * 4. Rounded corner turning vertical
 * 5. Final vertical descent to card
 *
 * @param config Path configuration with start/end points and styling options
 * @returns SVG path string (d attribute)
 */
export function generateOrthogonalPath(config: OrthogonalPathConfig): string {
  const {
    startX,
    startY,
    endX,
    endY,
    cornerRadius = 20,
    // convergenceY is now inflectionY
    convergenceY = 220,  
  } = config;

  // Vertical straight line if X matches (center item)
  if (Math.abs(startX - endX) < 1) {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  // Determine direction
  const isLeftSide = startX < endX;
  const direction = isLeftSide ? 1 : -1;
  
  // The horizontal segment Y-level
  // Use convergenceY as the center of the horizontal segment
  const horizontalY = convergenceY;

  // Calculate key points
  const startDropY = horizontalY - cornerRadius;
  const endDropY = horizontalY + cornerRadius;
  
  // Start Point
  const p1 = `${startX} ${startY}`;
  
  // First Corner Start
  const p2 = `${startX} ${startDropY}`;
  
  // First Corner Control & End
  const c1 = `${startX} ${horizontalY}`;
  const p3 = `${startX + (direction * cornerRadius)} ${horizontalY}`;
  
  // Second Corner Start
  const p4 = `${endX - (direction * cornerRadius)} ${horizontalY}`;
  
  // Second Corner Control & End
  const c2 = `${endX} ${horizontalY}`;
  const p5 = `${endX} ${endDropY}`;
  
  // End Point
  const p6 = `${endX} ${endY}`;

  // Construct Path
  return `M ${p1} 
          L ${p2} 
          Q ${c1} ${p3} 
          L ${p4} 
          Q ${c2} ${p5} 
          L ${p6}`;
}
