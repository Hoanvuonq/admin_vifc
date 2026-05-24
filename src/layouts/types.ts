import React from "react";

export interface MenuItemSidebar {
  key: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  count?: number;
  type?: "divider" | "item";
  className?: string;
  disabled?: boolean;
  children?: MenuItemSidebar[];
}

export interface SidebarItemProps {
  item: MenuItemSidebar;
  collapsed: boolean;
  activeKey: string;
  openKeys: string[];
  onToggle: (key: string) => void;
  isParentOfActive?: boolean;
}

export interface BaseSidebarProps {
  collapsed?: boolean;
  items?: MenuItemSidebar[];
  activeKey?: string;
  parentKey?: string;
  onToggle?: (key: string) => void;
  dashboardHref?: string;
  className?: string;
}

export interface BaseHeaderProps {
  collapsed?: boolean;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
  scrollY?: number;
  headerInfo?: any;
  notificationDropdown?: React.ReactNode;
  accountDropdown?: React.ReactNode;
  searchPlaceholder?: string;
  defaultTitle?: string;
  defaultHighlightTitle?: string;
}
