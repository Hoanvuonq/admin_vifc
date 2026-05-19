"use client";

import React, { useEffect, useState } from "react";
import { FormInput, PortalModal, PremiumButton } from "@/components";
import { UserPlus } from "lucide-react";
import { UserItem } from "../../_pages/types";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userToEdit: UserItem | null;
    onSave: (userData: {
        name: string;
        email: string;
        phone: string;
        role: UserItem["role"];
        status: UserItem["status"];
    }) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    userToEdit,
    onSave,
}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState<UserItem["role"]>("CUSTOMER");
    const [status, setStatus] = useState<UserItem["status"]>("ACTIVE");

    // Sync form values with current editing user
    useEffect(() => {
        if (isOpen) {
            if (userToEdit) {
                setName(userToEdit.name);
                setEmail(userToEdit.email);
                setPhone(userToEdit.phone);
                setRole(userToEdit.role);
                setStatus(userToEdit.status);
            } else {
                setName("");
                setEmail("");
                setPhone("");
                setRole("CUSTOMER");
                setStatus("ACTIVE");
            }
        }
    }, [isOpen, userToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone) return;
        
        onSave({
            name,
            email,
            phone,
            role,
            status,
        });
    };

    return (
        <PortalModal
            isOpen={isOpen}
            onClose={onClose}
            title={userToEdit ? "Update Member Profile" : "Add New Member"}
            description={userToEdit ? "Modify system account credentials" : "Register a new system account"}
            icon={UserPlus}
            width="max-w-lg"
            footer={
                <>
                    <PremiumButton
                        label="Cancel"
                        variant="gray"
                        size="md"
                        onClick={onClose}
                    />
                    <PremiumButton
                        type="submit"
                        form="user-form"
                        label={userToEdit ? "Save Changes" : "Create Account"}
                        variant="orange"
                        size="md"
                    />
                </>
            }
        >
            <form id="user-form" onSubmit={handleSubmit} className="space-y-4 py-2">
                <FormInput
                    label="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                />

                <FormInput
                    label="Email Address"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@vifc.io"
                />

                <FormInput
                    label="Phone Number"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xxxxxxxx"
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[12px] font-bold text-gray-700 ml-1">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserItem["role"])}
                            className="w-full h-12 px-4 bg-gray-50/55 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all cursor-pointer shadow-sm"
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="STAFF">Staff</option>
                            <option value="ADMIN">Administrator</option>
                            <option value="SHOP">Shop Owner</option>
                            <option value="BUYER">Buyer</option>
                            <option value="BUSINESS">Business Partner</option>
                            <option value="EMPLOYEE">Employee</option>
                            <option value="LOGISTICS">Logistics Partner</option>
                            <option value="SALE">Sales Rep</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px] font-bold text-gray-700 ml-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as UserItem["status"])}
                            className="w-full h-12 px-4 bg-gray-50/55 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-hidden focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all cursor-pointer shadow-sm"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="BANNED">Banned</option>
                        </select>
                    </div>
                </div>
            </form>
        </PortalModal>
    );
};
