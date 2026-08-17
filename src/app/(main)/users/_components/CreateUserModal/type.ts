import { UserItem } from "../../_pages/types";
import { CreateUserFormData } from "./createUserSchema";

export interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (userData: {
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
  }) => void;
  onSuccess?: () => void;
}

export type { CreateUserFormData };
