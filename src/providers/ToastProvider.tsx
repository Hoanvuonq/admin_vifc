"use client";

import { ToastConfigItem, ToastOptions } from "@/types/toast";
import { cn } from "@/utils/cn";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast as sonnerToast, Toaster } from "sonner";
import { toastConfig } from "@/types/toast";

export const toast = {
  success: (message: any, options?: ToastOptions) => sonnerToast.custom((t) => <ToastItem t={t} message={message} options={options} config={toastConfig.success} />, { id: options?.id }),
  error: (message: any, options?: ToastOptions) => sonnerToast.custom((t) => <ToastItem t={t} message={message} options={options} config={toastConfig.error} />, { id: options?.id }),
  warning: (message: any, options?: ToastOptions) => sonnerToast.custom((t) => <ToastItem t={t} message={message} options={options} config={toastConfig.warning} />, { id: options?.id }),
  info: (message: any, options?: ToastOptions) => sonnerToast.custom((t) => <ToastItem t={t} message={message} options={options} config={toastConfig.info} />, { id: options?.id }),
  loading: (message: any, options?: ToastOptions) => sonnerToast.custom((t) => <ToastItem t={t} message={message} options={options} config={toastConfig.loading} />, { id: options?.id }),
  dismiss: (t: string | number) => sonnerToast.dismiss(t),
};

export interface ToastItemProps {
  t: string | number;
  message: any;
  options?: ToastOptions;
  config: ToastConfigItem;
  label?: string;
}

export const ToastItem = ({
  t,
  message,
  options,
  label = "Notification",
  config,
}: ToastItemProps) => {
  const Icon = config.icon;

  const getDisplayMessage = () => {
    let processedMessage = message;

    if (typeof message === "string") return message;

    if (typeof processedMessage === "string") return processedMessage;

    if (typeof processedMessage === "object" && processedMessage !== null) {
      const errorCode = processedMessage.code || processedMessage.response?.data?.code || processedMessage.data?.code;
      const defaultMsg = processedMessage.message || processedMessage.response?.data?.message || processedMessage.data?.message || "An error occurred";

      if (errorCode) {
        const keysToTry = [
          `errors.${errorCode}`,
          `error:errors.${errorCode}`,
          `error.${errorCode}`,
          `common.errors.${errorCode}`
        ];

        return defaultMsg;
      }
      return defaultMsg;
    }

    return "An error occurred";
  };

  const displayMessage = getDisplayMessage();

  const duration = options?.duration || 4000;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration === Infinity) return;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsedTime / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div
      className={cn(
        "group relative flex w-[calc(100vw-32px)] sm:w-[380px] flex-col overflow-hidden rounded-[24px] border transition-all duration-500",
        "bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]",
        config.border,
        "animate-in zoom-in-95 slide-in-from-top-4 sm:slide-in-from-right-8"
      )}
    >
      <div className="flex items-start gap-3.5 p-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] shadow-sm transition-transform duration-500 group-hover:scale-110",
            config.lightBg,
          )}
        >
          {duration === Infinity ? (
            <Loader2 size={20} className={cn("animate-spin", config.iconColor)} />
          ) : (
            <Icon size={20} className={config.iconColor} strokeWidth={2.5} />
          )}
        </div>

        <div className="flex-1 space-y-0.5 pt-0.5">
          <h3
            className={cn(
              "text-[14px] font-bold leading-tight tracking-tight uppercase italic",
              config.text
            )}
          >
            {config.label}
          </h3>
          <p className="text-[14px] font-semibold text-gray-700 leading-snug italic tracking-tight">
            {displayMessage}
          </p>
        </div>
        <button
          onClick={() => sonnerToast.dismiss(t)}
          className="mt-0.5 p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all active:scale-90"
        >
          <X size={16} strokeWidth={3} />
        </button>
      </div>

      {options?.description && (
        <div className="mx-4 mb-4 mt-0 px-3 py-2.5 bg-gray-50/80 rounded-xl border border-gray-100/50">
          <p className="text-[12px] text-gray-600 font-semibold leading-relaxed tracking-tight italic">
            {options.description}
          </p>
        </div>
      )}

      {duration !== Infinity && (
        <div className="h-[3px] w-full bg-gray-100/50">
          <div
            className={cn(
              "h-full transition-none bg-linear-to-r",
              config.accent
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "bg-transparent border-none shadow-none",
      }}
    />
  );
};