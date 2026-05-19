import { LucideIcon } from "lucide-react";

export interface TitlePageHeaderProps {
    icon?: LucideIcon;
    title: React.ReactNode;
    highlightTitle?: React.ReactNode;
    subtitle: React.ReactNode;
    className?: string;
    size?: "xs" | "sm" | "md";
    isTitleHighlight?: boolean;
    isWhite?: boolean;
}