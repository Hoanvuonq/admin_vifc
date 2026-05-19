export interface UserItem {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF" | "CUSTOMER" | "SHOP" | "BUYER" | "BUSINESS" | "EMPLOYEE" | "LOGISTICS" | "SALE";
    status: "ACTIVE" | "INACTIVE" | "BANNED";
    phone: string;
    joinedDate: string;
    lastActive: string;
    avatar?: string;
}
