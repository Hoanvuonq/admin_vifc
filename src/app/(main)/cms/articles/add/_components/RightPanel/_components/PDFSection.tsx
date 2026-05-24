import React from "react";
import { RightPanelProps } from "../type";
import { FormInput, MediaUploadField } from "@/components";
import { useUpload } from "@/hooks/useUpload";

export const PDFSection: React.FC<RightPanelProps> = ({
  pdfUrl, setPdfUrl,
  pdfCover, setPdfCover,
  pdfName, setPdfName,
  pdfRole, setPdfRole,
}) => {
  const { uploadFile } = useUpload();

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
              value={pdfUrl ? [{ uid: "pdf", url: pdfUrl, status: "done", name: pdfName, thumbnailUrl: pdfCover }] : []}
              onChange={(files) => {
                if (files.length > 0) {
                  setPdfUrl(files[0].url || "");
                  if (files[0].thumbnailUrl) {
                    setPdfCover(files[0].thumbnailUrl);
                  }
                  if (!pdfName && files[0].name) {
                    setPdfName(files[0].name);
                  }
                } else {
                  setPdfUrl("");
                  setPdfCover("");
                }
              }}
              onUploadApi={uploadFile}
              allowedTypes={["application/pdf"]}
              maxCount={1}
              size="md"
              isBanner={true}
              isPDF={true}
              className="w-full"
            />
          </div>
          <FormInput
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            placeholder="Or enter the PDF file URL..."
            className="h-10 text-xs"
          />
        </div>

        <div className="space-y-2 pb-2">
          <label className="text-[9px] uppercase text-gray-500 tracking-wider font-semibold">PDF Document Name</label>
          <FormInput
            value={pdfName || ""}
            onChange={(e) => setPdfName(e.target.value)}
            placeholder="e.g. Wealth and asset management outlook.pdf"
            className="h-10 text-xs"
          />
        </div>

        <div className="space-y-2 pb-2">
          <label className="text-[9px] uppercase text-gray-500 tracking-wider font-semibold">Minimum Required Role</label>
          <select
            value={pdfRole}
            onChange={(e) => setPdfRole(e.target.value as "free" | "base" | "standard" | "premium")}
            className="w-full h-10 px-3 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-slate-700"
          >
            <option value="free">Free (All users can view)</option>
            <option value="base">Base (Base tier and above)</option>
            <option value="standard">Standard (Standard tier and above)</option>
            <option value="premium">Premium (Only Premium users)</option>
          </select>
          <p className="text-[9.5px] text-gray-450 italic mt-1 leading-snug">
            {pdfRole === "free" && "Users from Free level and up can view the PDF."}
            {pdfRole === "base" && "Only users from Base level, Standard, and Premium can view."}
            {pdfRole === "standard" && "Only users from Standard level and Premium can view."}
            {pdfRole === "premium" && "Exclusive to Premium users only."}
          </p>
        </div>
      </div>
    </div>
  );
};
