import React from "react";
import {
  FileText, Image as ImageIcon, Layers, Search, Settings, Check
} from "lucide-react";
import { useArticleEditorStore } from "../../../_store/useArticleEditorStore";

type SectionType = "section-basic" | "section-media" | "section-content" | "section-seo" | "section-pdf" | "section-settings";

interface Section {
  id: SectionType;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
  completed: boolean;
}

export const SectionNavigator: React.FC<{ handleTabClick: (id: SectionType) => void }> = ({ handleTabClick }) => {
  const {
    activeSection,
    title, slug, category, tags,
    thumbnail, summary,
    content,
    seoTitle, seoDescription, seoKeywords
  } = useArticleEditorStore();

  const sectionBasicCompleted = title.trim().length >= 10 && slug.trim().length > 0 && !!category && tags.length >= 1;
  const sectionMediaCompleted = !!thumbnail && !thumbnail.includes("api.dicebear.com/7.x/shapes/svg") && summary.trim().length >= 30;
  const sectionContentCompleted = content.replace(/<[^>]*>/g, "").trim().length >= 100;
  const sectionSEOCompleted = seoTitle.trim().length >= 10 && seoDescription.trim().length >= 30 && seoKeywords.trim().length >= 3;

  const sections: Section[] = [
    { id: "section-basic", label: "1. Basic Info", icon: FileText, completed: sectionBasicCompleted },
    { id: "section-media", label: "2. Cover & Summary", icon: ImageIcon, completed: sectionMediaCompleted },
    { id: "section-content", label: "3. Article Content", icon: Layers, completed: sectionContentCompleted },
    { id: "section-seo", label: "4. SEO Optimization", icon: Search, completed: sectionSEOCompleted },
    { id: "section-pdf", label: "5. PDF Settings", icon: FileText, completed: true },
    { id: "section-settings", label: "6. Publishing Settings", icon: Settings, completed: true },
  ];

  return (
    <div className="bg-white p-3.5 rounded-2xl shadow-3xs space-y-1.5">
      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest px-1.5 block pb-1 border-b border-slate-100/50">
        Section Navigator
      </span>
      <div className="space-y-1.5 pt-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleTabClick(section.id)}
              className={`w-full flex items-center justify-between py-2.5 px-3 text-[11px] font-bold rounded-xl border transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? "bg-linear-to-r from-orange-500/10 via-orange-500/5 to-transparent text-orange-655 border-orange-200/50 shadow-3xs pl-4.5"
                  : "bg-white text-slate-600 border-slate-100/80 hover:bg-slate-50/50 hover:text-slate-800"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-orange-500 to-amber-500 rounded-r-md" />
              )}
              <div className="flex items-center gap-2">
                <section.icon
                  size={13}
                  className={isActive ? "text-orange-500 stroke-[2.2]" : "text-slate-400 stroke-[1.8]"}
                />
                <span>{section.label}</span>
              </div>
              {section.completed && (
                <div className="w-4 h-4 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-3xs shrink-0">
                  <Check size={9} strokeWidth={4} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
