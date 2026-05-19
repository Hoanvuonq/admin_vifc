import { ReactNode } from "react";

export interface AppPopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  arrowClassName?: string;
  align?: "left" | "right" | "center";
  onOpenChange?: (open: boolean) => void;
  isMobileFixed?: boolean;
  mobileTop?: string;
  hideScrollbar?: boolean;
  contentClassName?: string;
}
