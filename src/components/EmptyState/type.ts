import { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  description?: string;
  link?: string;
  onReset?: () => void;
  onAction?: () => void;
  isShop?: boolean;
  isFlashSale?: boolean;
  icon?: LucideIcon | string;
  subIcon?: LucideIcon;
  showButton?: boolean;
  buttonText?: string;
  className?: string;
  compact?: boolean;
}