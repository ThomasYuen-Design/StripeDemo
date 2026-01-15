import {
  CreditCard,
  Repeat,
  ShieldCheck,
  Users,
  Leaf,
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
  TaxOutline,
  TaxFilled,
  AuthorizationBoostOutline,
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
    color: '#635BFF',
    description: 'Accept payments online and in person'
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: Repeat,
    iconOutline: BillingOutline,
    iconFilled: BillingFilled,
    color: '#00D4FF',
    description: 'Build and manage recurring revenue'
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: Users,
    iconOutline: ConnectOutline,
    iconFilled: ConnectFilled,
    color: '#0048E5',
    description: 'Payments for platforms and marketplaces'
  },
  {
    id: 'radar',
    label: 'Radar',
    icon: ShieldCheck,
    iconOutline: RadarOutline,
    iconFilled: RadarFilled,
    color: '#FF424D',
    description: 'Fight fraud with machine learning'
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: CreditCard,
    iconOutline: TerminalOutline,
    iconFilled: TerminalFilled,
    color: '#00D4FF',
    description: 'Accept in-person payments'
  },
  {
    id: 'tax',
    label: 'Tax',
    icon: Leaf,
    iconOutline: TaxOutline,
    iconFilled: TaxFilled,
    color: '#00D924',
    description: 'Calculate and collect sales tax'
  },
  {
    id: 'identity',
    label: 'Identity',
    icon: Fingerprint,
    iconOutline: AuthorizationBoostOutline,
    iconFilled: PaymentFilled,
    color: '#E31C5F',
    description: 'Confirm the identity of your users'
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
  width: 1000,
  height: 800,
  iconY: 100,
  cardTopY: 320,
  cardCenterX: 500,
};

/**
 * Calculate icon position on the stage grid
 */
export const getIconPosition = (index: number): { x: number; y: number } => {
  const totalWidth = 800;
  const startX = (STAGE.width - totalWidth) / 2;
  const step = totalWidth / (PRODUCTS.length - 1);

  return {
    x: startX + (index * step),
    y: STAGE.iconY,
  };
};
