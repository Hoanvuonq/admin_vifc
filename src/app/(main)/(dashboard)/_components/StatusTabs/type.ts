import { LucideIcon } from "lucide-react";

export interface StatusTabItem {
  key: string;
  label: string;
  icon: LucideIcon;
  count?: number;
  color?: string; 
}

export interface StatusTabsProps {
  tabs: StatusTabItem[]; 
  current: string;
  onChange: (key: string) => void;
  className?: string;
}