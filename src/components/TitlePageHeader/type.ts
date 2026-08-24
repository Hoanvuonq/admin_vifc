import { LucideIcon } from "lucide-react";
import React from "react";

export interface TitlePageHeaderProps {
  icon?: LucideIcon | React.ComponentType<any> | React.ReactNode;
  title: React.ReactNode;
  highlightTitle?: React.ReactNode;
  subtitle: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md";
  isTitleHighlight?: boolean;
  isWhite?: boolean;
}
