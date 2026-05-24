import React from "react";
import { HelpCircle } from "lucide-react";

interface SuggestionBoxProps {
  title: string;
  text: string;
}

export const SuggestionBox: React.FC<SuggestionBoxProps> = ({ title, text }) => (
  <div className="bg-linear-to-b from-orange-50/20 to-amber-50/10 p-3.5 rounded-2xl border border-orange-100/30">
    <span className="text-[9.5px] font-extrabold text-orange-600 uppercase tracking-wide flex items-center gap-1">
      <HelpCircle size={12} className="text-orange-500 shrink-0" />
      {title}
    </span>
    <p className="text-[9.5px] font-semibold text-slate-500 leading-relaxed mt-1">{text}</p>
  </div>
);
