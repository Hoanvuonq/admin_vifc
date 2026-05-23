"use client";

import { PremiumButton } from "@/components";
import { cn } from "@/utils/cn";
import { LucideIcon } from "lucide-react";

interface SocialButtonProps {
  provider: "GOOGLE" | "FACEBOOK";
  icon?: LucideIcon;
  variant?: "orange" | "blue";
  onClick: () => void;
  loading: boolean;
  className?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ provider, icon, variant = "orange", onClick, loading, className }) => {
  const displayLabel = provider.charAt(0) + provider.slice(1).toLowerCase();

  return (
    <PremiumButton
      variant={variant}
      icon={icon}
      onClick={onClick}
      disabled={loading}
      isLoading={loading}
      className={cn(
        "h-14 w-full flex items-center justify-center gap-3 transition-all duration-500",
        "text-[10px] font-bold uppercase rounded-2xl border shadow-sm",
        "active:scale-95",
        className
      )}
    >
      <span className="relative z-10">{displayLabel}</span>
    </PremiumButton>
  );
};