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
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !preventCloseOnClickOverlay && onClose()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, x: containerClassName.includes("justify-end") ? 20 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, x: containerClassName.includes("justify-end") ? 20 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative w-full bg-white shadow-3xl flex flex-col overflow-hidden border border-gray-100 z-10",
              width,
              !className.includes("max-h-") && "max-h-[90vh]",
              !className.includes("rounded-") && "rounded-3xl",
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white sticky top-0 z-20">
                <SectionHeaderModal title={title} description={description} icon={icon} >
                  <div className="flex items-center gap-4">
                    {headerExtra}
                    <CloseButton onClick={onClose} />
                  </div>
                </SectionHeaderModal>
              </div>
            )}

            <div className={cn(
              "flex-1 relative min-h-0 flex flex-col",
              !noPadding && "p-4",
              className.includes("h-full") ? "overflow-visible" : "overflow-y-auto scrollbar-none"
            )}>
              {children}
            </div>

            {footer && (
              <div className="bg-gray-50 px-6 py-2 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0 z-20">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
