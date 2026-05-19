"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

export const SuggestionsBar = () => {
  const suggestion = {
    title: "Về trang chủ",
    desc: "Khám phá thêm nhiều nội dung khác",
    icon: ShoppingBag,
    color: "bg-orange-50 text-orange-500",
    link: "/"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 md:mt-16 w-full border-t border-slate-100 pt-6 md:pt-8"
    >
      <div className="flex items-center gap-2 mb-4 md:mb-6 justify-center">
        <Sparkles size={16} className="text-orange-500" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Gợi ý cho bạn</span>
      </div>

      <div className="flex justify-center">
        <Link href={suggestion.link} className="w-full sm:w-2/3 lg:w-1/2">
          <div className="group flex items-center justify-center gap-4 p-4 rounded-2xl border border-orange-100 bg-orange-50/30 hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-300">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", suggestion.color)}>
              <suggestion.icon size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-gray-800 leading-tight mb-1">{suggestion.title}</h4>
              <p className="text-xs text-gray-500 leading-tight">{suggestion.desc}</p>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};
