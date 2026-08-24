import {
  BarChart3,
  BookOpen,
  CreditCard,
  FileText,
  FolderOpen,
  GraduationCap,
  Key,
  Lock,
  Mail,
  Settings,
  Sparkles,
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
    key: "courses",
    label: "Courses & Booking",
    icon: <GraduationCap size={20} />,
    children: [
      { key: "courses-list", label: "Course Management", href: "/courses/list", icon: <BookOpen size={14} /> },
      { key: "courses-registrations", label: "Course Registrations", href: "/courses", icon: <GraduationCap size={14} /> },
    ]
  },
  {
    key: "events",
    label: "Events & Private Club",
    icon: <Sparkles size={20} />,
    children: [
      { key: "events-list", label: "Event Management", href: "/events", icon: <Sparkles size={14} /> },
      { key: "events-registrations", label: "Event Registrations", href: "/events/registrations", icon: <Users size={14} /> },
    ]
  },
  {
    key: "cms",
    label: "Articles & News",
    icon: <BookOpen size={20} />,
    children: [
      { key: "cms-add-article-blocknote", label: "Add Article (Blocknote)", href: "/cms/articles/create", icon: <FolderOpen size={14} /> },
      { key: "cms-add-article", label: "Add Article (Old)", href: "/cms/articles/add", icon: <FolderOpen size={14} /> },
      { key: "cms-articles", label: "List Articles", href: "/cms/articles", icon: <FileText size={14} /> },
      { key: "newsletter-subscribers", label: "Newsletter Subscribers", href: "/newsletter/subscribers", icon: <Mail size={14} /> },
    ]
  },
  {
    key: "users",
    label: "User Management",
    icon: <Users size={20} />,
    children: [
      { key: "users-list", label: "Users & Profiles", href: "/users", icon: <User size={14} /> },
    ]
  },
  {
    key: "transactions",
    label: "Subscription Config",
    icon: <CreditCard size={20} />,
    children: [
      { key: "transactions-list", label: "Transactions", href: "/transactions", icon: <FileText size={14} /> },
    ]
  },
  {
    key: "rbac",
    label: "RBAC Permission",
    icon: <Key size={20} />,
    disabled: true,
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
