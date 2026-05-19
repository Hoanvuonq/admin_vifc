import React from "react";

export interface ActionBtnProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  color?: string;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  isIcon?: boolean;
  tooltip?: string;
  className?: string;
}
