import { LucideIcon } from "lucide-react";

export interface StatusTabItem<T extends string> {
  key: T;
  label: string;
  icon: LucideIcon;
  count?: number;
  isImportant?: boolean;
}
export interface StatusTabsProps<T extends string> {
  tabs: StatusTabItem<T>[];
  current: T;
  onChange: (key: T) => void;
  className?: string;
  layoutId?: string;
  disabled?: boolean;
}
