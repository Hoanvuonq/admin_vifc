import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface AdminPageHeaderMetric {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: "orange" | "emerald" | "blue" | "purple" | "gray" | "rose";
  isMoney?: boolean;
  suffix?: string;
}

export interface AdminPageHeaderProps {
  title: string;
  highlightTitle?: string;
  subtitle?: string;
  icon: LucideIcon;
  metrics?: AdminPageHeaderMetric[];
  className?: string;
  children?: ReactNode;
  hideActionsInHeader?: boolean;
  hideMetricsInPage?: boolean;
}
