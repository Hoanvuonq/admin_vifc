import React from "react";
import { FormInput, MediaUploadField, SectionHeader, SelectComponent } from "@/components";
import { User, Shield, Star, Crown, File } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";
import { useArticleEditorStore } from "../../../_store/useArticleEditorStore";

export const PDFSection: React.FC = () => {
  const { blocks, handleBlockChange } = useArticleEditorStore();

  const pdfBlock = blocks.find((b) => b.type === "pdf");
  if (!pdfBlock) return null;

  return (
    <div id="section-pdf" className="space-y-4 pb-10">
      <SectionHeader
        icon={File}
        title="PDF Attachment Settings"
        description="Attach a PDF document to this article"
        size="sm"
        className="pb-2 border-b border-gray-100"
      />

      <div className="space-y-4 pt-1 bg-white">
        <div className="space-y-2">
          <label className="text-[9px] uppercase text-gray-500 tracking-wider font-semibold">Upload PDF File</label>
          <div className="flex justify-center p-3 bg-slate-50/60 rounded-xl border border-slate-100">
            <MediaUploadField
              value={pdfBlock.content ? [{ uid: pdfBlock.id, url: pdfBlock.content, status: "done", name: pdfBlock.caption, thumbnailUrl: pdfBlock.thumbnailUrl, originFileObj: pdfBlock.file || undefined }] : []}
              onChange={(files) => {
                if (files.length > 0) {
                  handleBlockChange(pdfBlock.id, {
                    content: files[0].url || "",
                    thumbnailUrl: files[0].thumbnailUrl || pdfBlock.thumbnailUrl,
                    caption: files[0].name || pdfBlock.caption,
                    file: files[0].originFileObj
                  });
                } else {
                  handleBlockChange(pdfBlock.id, { content: "", thumbnailUrl: "", caption: "", file: undefined });
                }
              }}
              allowedTypes={["application/pdf"]}
              maxCount={1}
              size="md"
              isBanner={true}
              isPDF={true}
              maxSizeMB={20}
              className="w-full"
            />
          </div>
          <FormInput
            value={pdfBlock.content}
            onChange={(e) => handleBlockChange(pdfBlock.id, { content: e.target.value })}
            placeholder="Or enter the PDF file URL..."
            className="h-10 text-xs"
          />
        </div>

        <FormInput
          value={pdfBlock.caption || ""}
          label="PDF Document Name"
          onChange={(e) => handleBlockChange(pdfBlock.id, { caption: e.target.value })}
          placeholder="e.g. Wealth and asset management outlook.pdf"
          className="h-10 text-xs"
        />

        <div className="p-4 bg-linear-to-br from-slate-50 to-orange-50/40 border border-orange-200/60 rounded-2xl relative overflow-hidden shadow-sm group">
          <div className="absolute -right-4 -bottom-4 text-orange-500/5 pointer-events-none transition-transform group-hover:scale-110 duration-500">
            <Shield size={100} strokeWidth={1} />
          </div>
          <div className="relative z-10 space-y-3">
            <p className="text-sm text-orange-600 font-bold leading-relaxed pt-0.5 itim-regular">Minimum Required Role</p>
            <SelectComponent
              value={pdfBlock.activeRole || "free"}
              onChange={(val: string | string[]) => handleBlockChange(pdfBlock.id, { activeRole: val as any })}
              options={[
                { label: "Free (All users can view)", value: "free", icon: User, color: "text-slate-500" },
                { label: "Base (Base tier and above)", value: "base", icon: Shield, color: "text-blue-500" },
                { label: "Standard (Standard tier and above)", value: "standard", icon: Star, color: "text-sky-500" },
                { label: "Premium (Only Premium users)", value: "premium", icon: Crown, color: "text-amber-500" }
              ]}
            />

          </div>
        </div>
      </div>
    </div >
  );
};
