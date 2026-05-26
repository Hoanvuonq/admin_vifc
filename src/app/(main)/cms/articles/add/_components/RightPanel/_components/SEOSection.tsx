"use client"
import React from "react";
import { FormInput, SectionHeader } from "@/components";
import { Globe } from "lucide-react";
import { useArticleEditorStore } from "../../../_store/useArticleEditorStore";

export const SEOSection: React.FC = () => {
  const {
    title, summary, slug,
    seoTitle, setSeoTitle,
    seoDescription, setSeoDescription,
    seoKeywords, setSeoKeywords,
    setActiveInput
  } = useArticleEditorStore();


  return (
    <div
      id="form-section-seo"
      className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
      onFocusCapture={() => setActiveInput("seoTitle")}
    >
      <SectionHeader
        icon={Globe}
        title="SEO Optimization"
        description="SEO Optimization"
        size="sm"
        className="pb-2 border-b border-gray-100"
      />

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
