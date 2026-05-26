import React from "react";
import { FormInput, SectionHeader, SelectComponent, MediaUploadField } from "@/components";
import { FileText } from "lucide-react";
import { CATEGORY_OPTIONS } from "../../../../(articles)/_constants/cms.constants";
import { useArticleEditorStore } from "../../../_store/useArticleEditorStore";

const tagOptions = [
  { label: "Web3", value: "Web3" },
  { label: "Commerce", value: "Commerce" },
  { label: "Blockchain", value: "Blockchain" },
  { label: "Crypto", value: "Crypto" },
  { label: "NFT", value: "NFT" },
  { label: "Metaverse", value: "Metaverse" },
  { label: "DeFi", value: "DeFi" },
  { label: "Tutorial", value: "Tutorial" },
];

export const BasicInfoSection: React.FC = () => {
  const {
    title, handleTitleChange,
    slug, setSlug,
    summary, setSummary,
    category, setCategory,
    tags, setTags,
    thumbnail, setThumbnail, setThumbnailFile,
    setActiveInput
  } = useArticleEditorStore();

  const sectionBasicCompleted = title.trim().length >= 10 && slug.trim().length > 0 && !!category && tags.length >= 1 && summary.trim().length > 0;

  return (
    <div
      id="form-section-basic"
      className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
      onFocusCapture={() => setActiveInput("title")}
    >
      <SectionHeader
        icon={FileText}
        title="Basic Info"
        description="Basic information about the article"
        size="sm"
        className="pb-2 border-b border-gray-100"
      />

      <div className="space-y-3">
        <FormInput
          label="Article Title"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
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

        <div className="space-y-2" onFocusCapture={() => setActiveInput("summary")}>
          <label className="text-[11px] font-bold text-gray-700 ml-0.5">Article Description <span className="text-red-500">*</span></label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            onFocus={() => setActiveInput("summary")}
            placeholder="Brief description or summary..."
            className="w-full h-24 p-3 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-slate-700 resize-none custom-scrollbar"
          />
        </div>

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

        <div className="space-y-2 pb-2">
          <label className="text-[11px] font-bold text-gray-700 ml-0.5">Article Cover Image (Banner)</label>
          <div className="flex justify-center p-3 bg-slate-50/60 rounded-xl border border-slate-100">
            <MediaUploadField
              value={thumbnail ? [{ uid: "thumb", url: thumbnail, status: "done" }] : []}
              onChange={(files) => {
                  setThumbnail(files.length > 0 ? files[0].url || "" : "");
                  setThumbnailFile(files.length > 0 ? files[0].originFileObj || null : null);
              }}
              maxCount={1}
              size="md"
              isBanner={true}
              className="w-full"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
