"use client";

import React, { useEffect, useState } from "react";
import { FormInput, PortalModal, PremiumButton, SelectComponent, MediaUploadField } from "@/components";
import { UserPlus, Crown, Star, User, CheckCircle2, Clock, XCircle, Save } from "lucide-react";
import { UserItem } from "../../_pages/types";
import { RoleBadge } from "../RoleBadge";
import type { SubscriptionPlan } from "@/types/user";

interface UserModalProps {
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

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    userToEdit,
    onSave,
}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<UserItem["status"]>("ACTIVE");
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [subscriptionPlanId, setSubscriptionPlanId] = useState<string>("");
    const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (userToEdit) {
                setName(userToEdit.name);
                setEmail(userToEdit.email);
                setPhone(userToEdit.phone);
                setStatus(userToEdit.status);
                setAvatarUrl(userToEdit.avatar || "");
                setAvatarFile(null);
                setSubscriptionPlanId(userToEdit.subscription?.plan?.id || "");
            } else {
                setName("");
                setEmail("");
                setPhone("");
                setStatus("ACTIVE");
                setAvatarUrl("");
                setAvatarFile(null);
                setSubscriptionPlanId("");
            }
        }
    }, [isOpen, userToEdit]);

    useEffect(() => {
        if (!isOpen) return;

        const loadPlans = async () => {
            try {
                const response = await fetch("/api/db/subscription_plans?active=true");
                if (!response.ok) return;
                const json = await response.json();
                setSubscriptionPlans(json.data || []);
            } catch (err) {
                console.warn("Failed to load subscription plans", err);
            }
        };

        loadPlans();
    }, [isOpen]);

    const currentSubscriptionPlanId = userToEdit?.subscription?.plan?.id || "";
    const hasActiveSubscription = Boolean(userToEdit?.subscription?.plan?.id);
    const shouldDisableFields = hasActiveSubscription;

    const isMissingRequiredFields = !name.trim() || !email.trim() || !phone.trim();
    const hasChanges = userToEdit ? (
        name.trim() !== userToEdit.name ||
        email.trim() !== userToEdit.email ||
        phone.trim() !== userToEdit.phone ||
        status !== userToEdit.status ||
        avatarUrl !== (userToEdit.avatar || "") ||
        avatarFile !== null ||
        subscriptionPlanId !== currentSubscriptionPlanId
    ) : true;

    const shouldDisableSave = isMissingRequiredFields || (!!userToEdit && !hasChanges);
    const selectedPlan = subscriptionPlans.find((plan) => plan.id === subscriptionPlanId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !phone || shouldDisableSave) return;

        onSave({
            name,
            email,
            phone,
            status,
            avatarFile,
            avatarUrl,
            subscriptionPlanId: subscriptionPlanId || undefined,
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
                <PremiumButton
                    type="submit"
                    icon={userToEdit ? Save : UserPlus}
                    form="user-form"
                    label={userToEdit ? "Save Changes" : "Create Account"}
                    variant="orange"
                    size="md"
                    disabled={shouldDisableSave}
                />
            }
        >
            <form id="user-form" onSubmit={handleSubmit} className="space-y-6 py-4 relative">
                <div className="absolute inset-0 bg-linear-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none -z-10 rounded-3xl" />

                <div className="relative w-full mb-14 pt-2">
                    <div className="w-full h-40 rounded-4xl bg-linear-to-tr from-orange-400 via-amber-400 to-rose-400 shadow-inner opacity-90" />
                    <div className="absolute -bottom-10 left-8 z-50 flex items-end gap-4">
                        <div className="p-1.5 bg-white rounded-4xl shadow-2xl border border-gray-100 group hover:scale-105 transition-all">
                            <div className={hasActiveSubscription ? "pointer-events-none opacity-60" : ""}>
                                <MediaUploadField
                                    value={
                                        avatarUrl && !avatarUrl.includes("api.dicebear.com")
                                            ? [{ uid: "avatar", url: avatarUrl, status: "done", originFileObj: avatarFile || undefined }]
                                            : []
                                    }
                                    onChange={(files) => {
                                        if (hasActiveSubscription) return;
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
                        </div>

                        <div className="mb-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <RoleBadge
                                role={selectedPlan?.name || "FREE"}
                                className="scale-125 origin-bottom-left shadow-xl backdrop-blur-md bg-white/90 border-white/50 px-3 py-1.5"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {hasActiveSubscription && (
                        <div className="rounded-3xl bg-orange-50 border border-orange-200 p-4 text-orange-700 text-sm">
                            The user currently has an active subscription. Profile information cannot be updated; only switching to another plan or the Free Tier is allowed.
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <FormInput
                                label="Full Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Jane Doe"
                                disabled={shouldDisableFields}
                            />
                        </div>

                        <FormInput
                            label="Email Address"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@vifc.io"
                            disabled={shouldDisableFields}
                        />

                        <FormInput
                            label="Phone Number"
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="09xxxxxxxx"
                            disabled={shouldDisableFields}
                        />

                        <SelectComponent
                            label="Subscription Plan"
                            value={subscriptionPlanId}
                            onChange={(val: string | string[]) => setSubscriptionPlanId(val as string)}
                            options={[
                                {
                                    label: "Free Tier",
                                    value: "FREE",
                                    icon: User,
                                    color: "text-slate-500",
                                    disabled: !currentSubscriptionPlanId,
                                },
                                ...subscriptionPlans.map((plan) => ({
                                    label: plan.name,
                                    value: plan.id,
                                    disabled: plan.id === currentSubscriptionPlanId,
                                    icon: plan.name === "Annual Premium" ? Crown : plan.name === "Quarterly Pro" ? Crown : Star,
                                    color:
                                        plan.name === "Annual Premium"
                                            ? "text-amber-500"
                                            : plan.name === "Quarterly Pro"
                                                ? "text-violet-500"
                                                : "text-sky-500",
                                })),
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
                            disabled={shouldDisableFields}
                        />
                    </div>
                </div>
            </form>
        </PortalModal>
    );
};
