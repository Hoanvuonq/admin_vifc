import React from "react";
import { FormInput } from "@/components";
import { Globe } from "lucide-react";

interface SEOSectionProps {
  activeInput: string | null;
  setActiveInput: (val: string | null) => void;
  title: string;
  summary: string;
  slug: string;
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  seoKeywords: string;
  setSeoKeywords: (val: string) => void;
  sectionSEOCompleted: boolean;
}

export const SEOSection: React.FC<SEOSectionProps> = ({
  activeInput,
  setActiveInput,
  title,
  summary,
  slug,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  seoKeywords,
  setSeoKeywords,
  sectionSEOCompleted,
}) => {
  return (
    <div
      id="form-section-seo"
      className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
      onFocusCapture={() => setActiveInput("seoTitle")}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-50">
        <div className="flex items-center gap-1.5">
          <Globe size={14} className="text-orange-500" />
          <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">4. SEO Optimization</span>
        </div>
        <span
          className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${
            sectionSEOCompleted ? "bg-emerald-50 text-emerald-600" : "bg-red-50/50 text-red-500"
          }`}
        >
          {sectionSEOCompleted ? "Completed" : "Incomplete"}
        </span>
      </div>

      <div className="space-y-3">
        <FormInput
          label="SEO Title"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          onFocus={() => setActiveInput("seoTitle")}
          placeholder="Search title to display on Google..."
          maxLength={70}
          showCount
        />
        <FormInput
          label="SEO Description"
          isTextArea
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          onFocus={() => setActiveInput("seoDescription")}
          placeholder="Search description snippet to display on Google..."
          maxLength={160}
          showCount
          className="min-h-27.5 text-xs"
        />
        <FormInput
          label="SEO Keywords"
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
          onFocus={() => setActiveInput("seoKeywords")}
          placeholder="web3, blockchain, ecommerce..."
        />

        {/* Google Search Result Preview */}
        <div className="p-3 bg-slate-50 rounded-xl space-y-1">
          <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest">Google Search Result Preview</span>
          <h3 className="text-blue-800 font-semibold text-xs hover:underline cursor-pointer truncate">
            {seoTitle || title || "Search title..."}
          </h3>
          <p className="text-emerald-700 text-[9px] truncate">
            https://vifc.vn/news/{slug || "web3-commerce-xu-huong-mua-sam"}
          </p>
          <p className="text-gray-600 text-[9.5px] line-clamp-2 leading-snug font-medium">
            {seoDescription || summary || "Article search description snippet..."}
          </p>
        </div>
      </div>
    </div>
  );
};
