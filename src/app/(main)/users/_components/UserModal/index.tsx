"use client";

import React, { useEffect, useState } from "react";
import { FormInput, PortalModal, PremiumButton, SelectComponent, MediaUploadField } from "@/components";
import { UserPlus, ShieldCheck, Crown, Star, User, CheckCircle2, Clock, XCircle } from "lucide-react";
import { UserItem } from "../../_pages/types";
import { RoleBadge } from "../RoleBadge";

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
        avatarFile: File | null;
        avatarUrl: string;
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
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (userToEdit) {
                setName(userToEdit.name);
                setEmail(userToEdit.email);
                setPhone(userToEdit.phone);
                setRole(userToEdit.role);
                setStatus(userToEdit.status);
                setAvatarUrl(userToEdit.avatar || "");
                setAvatarFile(null);
            } else {
                setName("");
                setEmail("");
                setPhone("");
                setRole("FREE");
                setStatus("ACTIVE");
                setAvatarUrl("");
                setAvatarFile(null);
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
            avatarFile,
            avatarUrl,
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
            <form id="user-form" onSubmit={handleSubmit} className="space-y-6 py-4 relative">
                <div className="absolute inset-0 bg-linear-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none -z-10 rounded-3xl" />

                <div className="relative w-full mb-14 pt-2">
                    {/* Gradient Banner */}
                    <div className="w-full h-40 rounded-4xl bg-linear-to-tr from-orange-400 via-amber-400 to-rose-400 shadow-inner opacity-90" />

                    {/* Overlapping Avatar */}
                    <div className="absolute -bottom-10 left-8 z-50 flex items-end gap-4">
                        <div className="p-1.5 bg-white rounded-4xl shadow-2xl border border-gray-100 group hover:scale-105 transition-all">
                            <MediaUploadField
                                value={
                                    avatarUrl && !avatarUrl.includes("api.dicebear.com")
                                        ? [{ uid: "avatar", url: avatarUrl, status: "done", originFileObj: avatarFile || undefined }]
                                        : []
                                }
                                onChange={(files) => {
                                    if (files.length > 0) {
                                        setAvatarUrl(files[0].url || "");
                                        setAvatarFile(files[0].originFileObj || null);
                                    } else {
                                        setAvatarUrl("");
                                        setAvatarFile(null);
                                    }
                                }}
                                maxCount={1}
                                size="md"
                                className="justify-center"
                                classNameSizeUpload="w-32 h-32 rounded-4xl"
                            />
                        </div>

                        <div className="mb-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <RoleBadge role={role} className="scale-125 origin-bottom-left shadow-xl backdrop-blur-md bg-white/90 border-white/50 px-3 py-1.5" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <FormInput
                            label="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jane Doe"
                        />
                    </div>

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

                    <SelectComponent
                        label="Subscription Plan / Role"
                        value={role}
                        onChange={(val: string | string[]) => setRole(val as UserItem["role"])}
                        options={[
                            { label: "Free Tier", value: "FREE", icon: User, color: "text-slate-500" },
                            { label: "Premium", value: "PREMIUM", icon: Star, color: "text-blue-500" },
                            { label: "Annual Premium", value: "ANNUAL PREMIUM", icon: Crown, color: "text-amber-500" },
                            { label: "Administrator", value: "ADMIN", icon: ShieldCheck, color: "text-purple-500" },
                        ]}
                    />

                    <SelectComponent
                        label="Account Status"
                        value={status}
                        onChange={(val: string | string[]) => setStatus(val as UserItem["status"])}
                        options={[
                            { label: "Active", value: "ACTIVE", icon: CheckCircle2, color: "text-emerald-500" },
                            { label: "Inactive", value: "INACTIVE", icon: Clock, color: "text-amber-500" },
                            { label: "Banned", value: "BANNED", icon: XCircle, color: "text-rose-500" },
                        ]}
                    />
                </div>
            </form>
        </PortalModal>
    );
};
