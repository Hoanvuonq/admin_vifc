import React from "react";
import { FormInput, SelectComponent } from "@/components";
import { FileText } from "lucide-react";
import { CATEGORY_OPTIONS } from "../../../../(articles)/_constants/cms.constants";

interface BasicInfoSectionProps {
  activeInput: string | null;
  setActiveInput: (val: string | null) => void;
  title: string;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  slug: string;
  setSlug: (val: string) => void;
  category: string[];
  setCategory: (val: string[]) => void;
  tags: string[];
  setTags: (val: string[]) => void;
  tagOptions: { value: string; label: string }[];
  sectionBasicCompleted: boolean;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  activeInput,
  setActiveInput,
  title,
  handleTitleChange,
  slug,
  setSlug,
  category,
  setCategory,
  tags,
  setTags,
  tagOptions,
  sectionBasicCompleted,
}) => {
  return (
    <div
      id="form-section-basic"
      className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
      onFocusCapture={() => setActiveInput("title")}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-50">
        <div className="flex items-center gap-1.5">
          <FileText size={14} className="text-orange-500" />
          <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">1. Basic Info</span>
        </div>
        <span
          className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${sectionBasicCompleted ? "bg-emerald-50 text-emerald-600" : "bg-red-50/50 text-red-500"
            }`}
        >
          {sectionBasicCompleted ? "Completed" : "Incomplete"}
        </span>
      </div>

      <div className="space-y-3">
        <FormInput
          label="Article Title"
          required
          value={title}
          onChange={handleTitleChange}
          onFocus={() => setActiveInput("title")}
          placeholder="Enter article title..."
          maxLength={255}
          showCount
        />
        <FormInput
          label="Slug (Static URL Path)"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onFocus={() => setActiveInput("slug")}
          placeholder="web3-commerce-shopping-trend..."
          maxLength={255}
          showCount
        />
        <div onFocusCapture={() => setActiveInput("category")}>
          <SelectComponent
            label="News Category"
            required
            value={category}
            onChange={(val) => setCategory(Array.isArray(val) ? val : [val])}
            options={CATEGORY_OPTIONS}
            isMulti
          />
        </div>
        <div className="space-y-2" onFocusCapture={() => setActiveInput("tags")}>
          <label className="text-[11px] font-bold text-gray-700 ml-0.5">Tags (Related Keywords)</label>
          <SelectComponent
            placeholder="Select related tags..."
            value={tags}
            onChange={(val) => setTags(Array.isArray(val) ? val : [val])}
            options={tagOptions}
            isMulti
          />
        </div>
      </div>
    </div>
  );
};
