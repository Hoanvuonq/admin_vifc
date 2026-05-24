import {
  Activity,
  BarChart3,
  BookOpen,
  CreditCard,
  FileText,
  FolderOpen,
  Gem,
  Key,
  Lock,
  Settings,
  User,
  Users
} from "lucide-react";
import { MenuItemSidebar } from "../types";

export const MOCK_SIDEBAR_ITEMS: MenuItemSidebar[] = [
  {
    key: "dashboard",
    label: "Dashboard & Reports",
    icon: <BarChart3 size={20} />,
    href: "/",
  },
  {
    type: "divider",
    key: "div1",
    label: "",
  },
  {
    key: "cms",
    label: "CMS Management",
    icon: <BookOpen size={20} />,
    children: [
      { key: "cms-add-article", label: "Add Article", href: "/cms/articles/add", icon: <FolderOpen size={14} /> },
      { key: "cms-articles", label: "List Articles", href: "/cms/articles", icon: <FileText size={14} /> },
    ]
  },
  {
    key: "users",
    label: "User Management",
    icon: <Users size={20} />,
    children: [
      { key: "users-list", label: "Users & Profiles", href: "/users", icon: <User size={14} /> },
      { key: "users-status", label: "Status Settings", href: "/users/status", icon: <Activity size={14} /> },
    ]
  },
  {
    key: "subscription",
    label: "Subscription Config",
    icon: <CreditCard size={20} />,
    children: [
      { key: "subscription-plans", label: "Plans & Pricing", href: "/subscriptions/plans", icon: <Gem size={14} /> },
    ]
  },
  {
    key: "rbac",
    label: "RBAC Permission",
    icon: <Key size={20} />,
    children: [
      { key: "rbac-roles", label: "Roles & Permissions", href: "/rbac/roles", icon: <Lock size={14} /> },
    ]
  },
  {
    type: "divider",
    key: "div2",
    label: "",
  },
  {
    key: "settings",
    label: "System Settings",
    icon: <Settings size={20} />,
    href: "/settings",
  }
];
