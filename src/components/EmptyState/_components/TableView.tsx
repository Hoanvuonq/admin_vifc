"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { BarChart3, LucideIcon, Plus, Search } from "lucide-react";
import Image from "next/image";

interface TableViewProps {
  Icon?: LucideIcon;
}

export const TableView = ({ Icon = Search }: TableViewProps) => (
  <div className="relative flex items-center justify-center">
    <div className="relative">
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <Image
          src="/icons/icon-noTable.png"
          alt="No Table Data"
          width={120}
          height={120}
          className="w-20 md:w-[120px] h-20 md:h-[120px] object-contain drop-shadow-[0_25px_50px_rgba(249,115,22,0.2)]"
        />
      </motion.div>

      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 md:-inset-12 border border-dashed border-slate-200/40 rounded-full"
        />

        <motion.div
          animate={{ y: [0, -8, 0], x: [0, 5, 0], rotate: [-10, 5, -10] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 md:-top-6 -left-8 md:-left-12 w-10 md:w-12 h-10 md:h-12 bg-orange-500 rounded-xl md:rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center text-white z-20 border-2 border-white"
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0], x: [0, -5, 0], rotate: [10, -5, 10] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -top-1 md:-top-2 -right-10 md:-right-14 w-10 md:w-12 h-10 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-xl border border-slate-50 flex items-center justify-center text-orange-400 z-20"
        >
          <div className="w-6 md:w-8 h-6 md:h-8 bg-orange-50 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-4 md:-bottom-6 -right-6 md:-right-10 z-30 pointer-events-none"
        >
          <Search className="w-12 h-12 md:w-16 md:h-16 text-orange-400 drop-shadow-2xl rotate-[-10deg]" strokeWidth={2.5} />
        </motion.div>

        {[
          { color: "bg-orange-300", top: "top-10", left: "-left-12 md:-left-16" },
          { color: "bg-purple-300", bottom: "bottom-4", left: "-left-8 md:-left-10" },
          { color: "bg-blue-300", top: "top-1/2", right: "-right-16 md:-right-20" }
        ].map((dot, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i }}
            className={cn("absolute w-2 h-2 rounded-full", dot.color, dot.top, dot.left, dot.bottom, dot.right)}
          />
        ))}
      </div>
    </div>
  </div>
);
