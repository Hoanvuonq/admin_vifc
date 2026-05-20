import React from "react";
import { Calendar, Clock, User } from "lucide-react";

interface ArticleHeaderProps {
  title: string;
  category: string;
  getReadingTime: () => number;
  hideBorderTop?: boolean;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title, category, getReadingTime, hideBorderTop = false
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 select-none">
      <span className="text-[9px] font-extrabold text-slate-455 uppercase tracking-widest">News</span>
      <span className="text-slate-300 text-xs">/</span>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-655 text-[9.5px] font-extrabold uppercase tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
        {category || "No Category Selected"}
      </span>
    </div>

    <h1 className="text-xl md:text-2.5xl font-extrabold text-slate-900 leading-tight tracking-tight">
      {title || "Article Title..."}
    </h1>

    <div className={`flex flex-wrap items-center gap-4 text-[10px] font-extrabold text-slate-455 py-3.5 select-none ${hideBorderTop ? "border-t border-slate-100/80" : "border-y border-slate-100/80"}`}>
      <span className="flex items-center gap-1.5 bg-slate-55 px-3 py-1 rounded-xl border border-slate-100/50 shadow-3xs">
        <User size={13} className="text-slate-455" /> Admin VIFC
      </span>
      <span className="flex items-center gap-1.5 bg-slate-55 px-3 py-1 rounded-xl border border-slate-100/50 shadow-3xs">
        <Calendar size={13} className="text-slate-455" /> {new Date().toLocaleDateString("en-US")}
      </span>
      <span className="flex items-center gap-1.5 bg-slate-55 px-3 py-1 rounded-xl border border-slate-100/50 shadow-3xs">
        <Clock size={13} className="text-slate-455" /> {getReadingTime()} min read
      </span>
    </div>
  </div>
);

interface SummaryBlockProps { summary: string }

export const SummaryBlock: React.FC<SummaryBlockProps> = ({ summary }) => {
  if (!summary) return null;
  return (
    <div className="relative p-6 bg-linear-to-br from-orange-50/15 via-slate-50/40 to-white rounded-3xl border-l-4 border-orange-500 italic text-[12px] leading-relaxed text-slate-700 font-bold shadow-3xs">
      <div className="absolute -top-3 -left-1.5 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-extrabold select-none shadow-2xs">
        "
      </div>
      <p className="pl-2 leading-relaxed">{summary}</p>
    </div>
  );
};
