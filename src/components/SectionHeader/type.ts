import { LucideIcon } from "lucide-react";

export interface SectionHeaderProps {
  icon?: LucideIcon;
  title?: React.ReactNode;
  description?: React.ReactNode;
  colorClass?: string;
  bgClass?: string;
  className?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}
