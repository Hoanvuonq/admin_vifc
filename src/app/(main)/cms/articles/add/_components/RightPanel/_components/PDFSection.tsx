import React from "react";
import { FormInput, MediaUploadField } from "@/components";
import { useUpload } from "@/hooks/useUpload";
import { useArticleEditorStore } from "../../../_store/useArticleEditorStore";

export const PDFSection: React.FC = () => {
  const { uploadFile } = useUpload();
  const { blocks, handleBlockChange } = useArticleEditorStore();

  const pdfBlock = blocks.find((b) => b.type === "pdf");
  if (!pdfBlock) return null;

  return (
    <div id="section-pdf" className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-[13px] font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-rose-100 flex items-center justify-center text-rose-600 text-[10px] shadow-3xs">5</span>
            PDF Attachment Settings
          </h2>
          <p className="text-[10px] text-gray-400 font-bold mt-0.5">Attach a PDF document to this article</p>
        </div>
      </div>

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

        <div className="space-y-2 pb-2">
          <label className="text-[9px] uppercase text-gray-500 tracking-wider font-semibold">PDF Document Name</label>
          <FormInput
            value={pdfBlock.caption || ""}
            onChange={(e) => handleBlockChange(pdfBlock.id, { caption: e.target.value })}
            placeholder="e.g. Wealth and asset management outlook.pdf"
            className="h-10 text-xs"
          />
        </div>

        <div className="space-y-2 pb-2">
          <label className="text-[9px] uppercase text-gray-500 tracking-wider font-semibold">Minimum Required Role</label>
          <select
            value={pdfBlock.activeRole || "free"}
            onChange={(e) => handleBlockChange(pdfBlock.id, { activeRole: e.target.value as any })}
            className="w-full h-10 px-3 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-slate-700"
          >
            <option value="free">Free (All users can view)</option>
            <option value="base">Base (Base tier and above)</option>
            <option value="standard">Standard (Standard tier and above)</option>
            <option value="premium">Premium (Only Premium users)</option>
          </select>
          <p className="text-[9.5px] text-gray-450 italic mt-1 leading-snug">
            {(pdfBlock.activeRole || "free") === "free" && "Users from Free level and up can view the PDF."}
            {pdfBlock.activeRole === "base" && "Only users from Base level, Standard, and Premium can view."}
            {pdfBlock.activeRole === "standard" && "Only users from Standard level and Premium can view."}
            {pdfBlock.activeRole === "premium" && "Exclusive to Premium users only."}
          </p>
        </div>
      </div>
    </div>
  );
};
