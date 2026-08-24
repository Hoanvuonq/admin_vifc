import { UserItem } from "../../_pages/types";
import { UserFormData } from "./userSchema";

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: UserItem | null;
  onToggleBlock?: (id: string, nextStatus: "ACTIVE" | "BANNED") => void;
  onDelete?: (id: string) => void;
  onSave: (userData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    status: UserItem["status"];
    avatarFile: File | null;
    avatarUrl: string;
    subscriptionPlanId?: string;
    company?: string;
    country?: string;
    isVIFCPass?: boolean;
    so_the?: string;
    loai_the?: string;
    cardUsername?: string;
  }) => void;
}

export type { UserFormData };
