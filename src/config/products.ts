import {
  CreditCard,
  Repeat,
  ShieldCheck,
  Users,
  Globe,
  Fingerprint,
  Activity,
  Zap,
} from 'lucide-react';
import type { ProductConfig, PresetConfig, StageDimensions } from '@/types';
import {
  PaymentOutline,
  PaymentFilled,
  BillingOutline,
  BillingFilled,
  ConnectOutline,
  ConnectFilled,
  RadarOutline,
  RadarFilled,
  TerminalOutline,
  TerminalFilled,
  AuthorizationBoostOutline,
  AuthorizationBoostFilled,
  GlobalPayoutsOutline,
  GlobalPayoutsFilled,
} from '@/components/icons';

/**
 * Stripe Products Configuration
 */
export const PRODUCTS: ProductConfig[] = [
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    iconOutline: PaymentOutline,
    iconFilled: PaymentFilled,
    color: '#11EFE3',
    description: 'Accept payments online and in person'
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: CreditCard,
    iconOutline: TerminalOutline,
    iconFilled: TerminalFilled,
    color: '#11EFE3',
    description: 'Accept in-person payments'
  },
  {
    id: 'radar',
    label: 'Radar',
    icon: ShieldCheck,
    iconOutline: RadarOutline,
    iconFilled: RadarFilled,
    color: '#E03071',
    description: 'Fight fraud with machine learning'
  },
  {
    id: 'authorizationBoost',
    label: 'Authorization Boost',
    icon: Fingerprint, // Using Fingerprint as a reasonable placeholder for Auth/Identity
    iconOutline: AuthorizationBoostOutline,
    iconFilled: AuthorizationBoostFilled,
    color: '#11EFE3', // Based on SVG gradient
    description: 'Smarter authorization decisions'
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: Users,
    iconOutline: ConnectOutline,
    iconFilled: ConnectFilled,
    color: '#0073E6',
    description: 'Payments for platforms and marketplaces'
  },
  {
    id: 'globalPayouts',
    label: 'Global Payouts',
    icon: Globe,
    iconOutline: GlobalPayoutsOutline,
    iconFilled: GlobalPayoutsFilled,
    color: '#0073E6', // Based on SVG gradient
    description: 'Send payouts globally'
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: Repeat,
    iconOutline: BillingOutline,
    iconFilled: BillingFilled,
    color: '#00D924',
    description: 'Build and manage recurring revenue'
  },
];

/**
 * Preset Stack Configurations
 */
export const PRESETS: PresetConfig[] = [
  {
    id: 'saas',
    label: 'SaaS Startup',
    icon: Zap,
    products: ['payments', 'billing', 'radar'],
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: Globe,
    products: ['connect', 'payments', 'identity', 'radar'],
  },
  {
    id: 'creator',
    label: 'Creator Economy',
    icon: Activity,
    products: ['payments', 'climate', 'billing'],
  },
];

/**
 * Stage dimensions for the unified coordinate system
 */
export const STAGE: StageDimensions = {
  width: 1400,
  height: 1000,
  iconY: 60,
  cardTopY: 240,
  cardCenterX: 700,
};

/**
 * Calculate icon position on the stage grid
 * Icons are 64px wide and centered on x,y coordinates
 * Left edge of first icon at 350px, right edge of last icon at 1050px
 */
export const getIconPosition = (index: number): { x: number; y: number } => {
  const iconWidth = 64;
  const leftDashedLine = 350;
  const rightDashedLine = 1050;
  
  // Center positions adjusted for icon width
  const startX = leftDashedLine + (iconWidth / 2); // 382px
  const endX = rightDashedLine - (iconWidth / 2); // 1018px
  const totalWidth = endX - startX; // 636px
  
  const step = totalWidth / (PRODUCTS.length > 1 ? PRODUCTS.length - 1 : 1);

  return {
    x: startX + (index * step),
    y: STAGE.iconY,
  };
};
