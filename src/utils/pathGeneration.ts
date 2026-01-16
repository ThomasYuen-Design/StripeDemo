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
    convergenceY = 220,
    verticalDrop = 60,
  } = config;

  // Special case: Nearly vertical line (product near center)
  // If horizontal distance is minimal, render straight line
  if (Math.abs(startX - endX) < 5) {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  // Determine direction (left side or right side of center)
  const isLeftSide = startX < endX;
  const direction = isLeftSide ? 1 : -1;

  // Key Y coordinates
  const corner1Y = startY + verticalDrop; // First corner after initial drop
  const corner2Y = convergenceY; // Convergence plane where all lines meet

  // Key X coordinates
  const corner1X = startX;
  const corner2X = endX;

  // Build SVG path with quadratic curves for rounded corners
  const pathSegments = [
    // Start point
    `M ${startX} ${startY}`,

    // Segment 1: Vertical drop from product
    `L ${corner1X} ${corner1Y - cornerRadius}`,

    // Corner 1: Turn toward center (vertical → horizontal)
    // Q creates a quadratic Bezier curve with one control point
    // Control point is at the apex (corner1X, corner1Y)
    // End point is offset by cornerRadius in the new direction
    `Q ${corner1X} ${corner1Y}, ${corner1X + direction * cornerRadius} ${corner1Y}`,

    // Segment 2: Horizontal movement toward center convergence point
    `L ${corner2X - direction * cornerRadius} ${corner2Y}`,

    // Corner 2: Turn downward (horizontal → vertical)
    // Control point at (corner2X, corner2Y)
    // End point offset by cornerRadius downward
    `Q ${corner2X} ${corner2Y}, ${corner2X} ${corner2Y + cornerRadius}`,

    // Segment 3: Final vertical descent to card
    `L ${endX} ${endY}`,
  ];

  // Join segments with spaces for clean SVG path
  return pathSegments.join(' ');
}
