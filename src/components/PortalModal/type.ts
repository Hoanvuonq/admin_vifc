import { LucideIcon } from "lucide-react";

export interface IPortalModal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  className?: string;
  containerClassName?: string;
  preventCloseOnClickOverlay?: boolean;
  noPadding?: boolean;
}