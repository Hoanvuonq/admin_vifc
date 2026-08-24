"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IPortalModal } from "./type";
import { cn } from "@/utils/cn";
import { CloseButton, SectionHeaderModal } from "@/components";

export const PortalModal: React.FC<IPortalModal> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  icon,
  headerExtra,
  footer,
  width = "max-w-lg",
  className = "",
  containerClassName = "items-center justify-center p-4 sm:p-6",
  preventCloseOnClickOverlay = false,
  noPadding = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const main = document.querySelector("main");
      if (main) {
        main.style.overflow = "hidden";
        main.style.paddingRight = "0px";
      }
    } else {
      document.body.style.overflow = "";
      const main = document.querySelector("main");
      if (main) main.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      const main = document.querySelector("main");
      if (main) main.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className={cn("fixed inset-0 z-9999 flex font-sans", containerClassName)}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-slate-950/60 transition-opacity"
            onClick={() => !preventCloseOnClickOverlay && onClose()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full bg-white shadow-2xl flex flex-col overflow-hidden border border-gray-100/90 z-10 isolate",
              width,
              !className.includes("max-h-") && "max-h-[90vh]",
              !className.includes("rounded-") && "rounded-2xl",
              className,
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-white sticky top-0 z-20 shrink-0">
                <SectionHeaderModal title={title} description={description} icon={icon}>
                  <div className="flex items-center gap-4">
                    {headerExtra}
                    <CloseButton onClick={onClose} />
                  </div>
                </SectionHeaderModal>
              </div>
            )}

            <div
              className={cn(
                "flex-1 relative min-h-0 flex flex-col overscroll-contain overflow-y-auto custom-scrollbar",
                !noPadding && "p-3",
                className.includes("h-full") && "overflow-visible",
              )}
              style={{
                WebkitOverflowScrolling: "touch",
              }}
            >
              {children}
            </div>

            {footer && <div className="bg-gray-50/90 px-6 py-3 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0 z-20 shrink-0">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
