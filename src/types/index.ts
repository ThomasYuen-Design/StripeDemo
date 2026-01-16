import type { LucideIcon } from 'lucide-react';
import type { IconProps } from '@/components/icons';

/**
 * Stripe Product Identifiers
 */
export type ProductId =
  | 'payments'
  | 'billing'
  | 'radar'
  | 'connect'
  | 'climate'
  | 'atlas'
  | 'identity'
  | 'terminal'
  | 'tax'
  | 'authorizationBoost'
  | 'dataPipeline'
  | 'globalPayouts'
  | 'revenueRecognition'
  | 'stripeSigma';

/**
 * Icon Component Type
 */
export type IconComponent = React.FC<IconProps>;

/**
 * Product Configuration
 */
export interface ProductConfig {
  id: ProductId;
  label: string;
  icon: LucideIcon; // Legacy - keeping for backward compatibility
  iconOutline: IconComponent;
  iconFilled: IconComponent;
  color: string;
  description?: string;
}

/**
 * Preset Stack Types
 */
export type PresetType = 'saas' | 'marketplace' | 'creator';

/**
 * Preset Configuration
 */
export interface PresetConfig {
  id: PresetType;
  label: string;
  icon: LucideIcon;
  products: ProductId[];
}

/**
 * Stage Dimensions for the unified coordinate system
 */
export interface StageDimensions {
  width: number;
  height: number;
  iconY: number;
  cardTopY: number;
  cardCenterX: number;
}

/**
 * Position on the stage
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Configuration for orthogonal (Manhattan-style) path generation
 */
export interface OrthogonalPathConfig {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  cornerRadius?: number;
  convergenceY?: number;
  verticalDrop?: number;
}
