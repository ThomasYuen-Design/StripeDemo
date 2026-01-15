import type { LucideIcon } from 'lucide-react';

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
  | 'identity';

/**
 * Product Configuration
 */
export interface ProductConfig {
  id: ProductId;
  label: string;
  icon: LucideIcon;
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
