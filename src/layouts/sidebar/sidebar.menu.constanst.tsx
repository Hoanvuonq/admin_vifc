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
    label: "Tổng Quan & Báo Cáo",
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
    label: "Khóa Học & Đặt Chỗ",
    icon: <GraduationCap size={20} />,
    children: [
      { key: "courses-list", label: "Quản Lý Khóa Học", href: "/courses/list", icon: <BookOpen size={14} /> },
      { key: "courses-registrations", label: "Đơn Đăng Ký Học Viên", href: "/courses", icon: <GraduationCap size={14} /> },
    ]
  },
  {
    key: "events",
    label: "Sự Kiện & Private Club",
    icon: <Sparkles size={20} />,
    children: [
      { key: "events-list", label: "Quản Lý Sự Kiện", href: "/events", icon: <Sparkles size={14} /> },
      { key: "events-registrations", label: "Đơn Đăng Ký Sự Kiện", href: "/events/registrations", icon: <Users size={14} /> },
    ]
  },
  {
    key: "cms",
    label: "Bài Viết & Tin Tức",
    icon: <BookOpen size={20} />,
    children: [
      { key: "cms-add-article-blocknote", label: "Soạn Bài Viết (Blocknote)", href: "/cms/articles/create", icon: <FolderOpen size={14} /> },
      { key: "cms-add-article", label: "Soạn Bài Viết (Cũ)", href: "/cms/articles/add", icon: <FolderOpen size={14} /> },
      { key: "cms-articles", label: "Danh Sách Bài Viết", href: "/cms/articles", icon: <FileText size={14} /> },
      { key: "newsletter-subscribers", label: "Đăng Ký Nhận Bản Tin", href: "/newsletter/subscribers", icon: <Mail size={14} /> },
    ]
  },
  {
    key: "users",
    label: "Quản Lý Người Dùng",
    icon: <Users size={20} />,
    children: [
      { key: "users-list", label: "Tài Khoản & Hồ Sơ", href: "/users", icon: <User size={14} /> },
    ]
  },
  {
    key: "transactions",
    label: "Gói Dịch Vụ & Giao Dịch",
    icon: <CreditCard size={20} />,
    children: [
      { key: "transactions-list", label: "Lịch Sử Giao Dịch", href: "/transactions", icon: <FileText size={14} /> },
    ]
  },
  {
    key: "rbac",
    label: "Phân Quyền Hệ Thống",
    icon: <Key size={20} />,
    disabled: true,
    children: [
      { key: "rbac-roles", label: "Vai Trò & Quyền Hạn", href: "/rbac/roles", icon: <Lock size={14} /> },
    ]
  },
  {
    type: "divider",
    key: "div2",
    label: "",
  },
  {
    key: "settings",
    label: "Cài Đặt Hệ Thống",
    icon: <Settings size={20} />,
    href: "/settings",
  }
];
