import { UserItem } from "../../_pages/types";

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: UserItem | null;
  onSave: (userData: {
    name: string;
    email: string;
    phone: string;
    status: UserItem["status"];
    avatarFile: File | null;
    avatarUrl: string;
    subscriptionPlanId?: string;
  }) => void;
}
