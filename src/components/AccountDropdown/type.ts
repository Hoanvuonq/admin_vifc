import { ReactElement } from "react";

export interface MenuItem {
    key: string;
    label: string;
    href?: string;
    icon?: ReactElement;
    action?: () => void;
    badge?: number; 
    isLogout?: boolean; 
}

export interface UserAuthDropdownProps {
    isAuthenticated: boolean;
}