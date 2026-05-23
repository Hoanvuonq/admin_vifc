import React from "react";
import { RightPanelProps } from "../type";
import { FormInput, MediaUploadField } from "@/components";

export const PDFSection: React.FC<RightPanelProps> = ({
  pdfUrl, setPdfUrl,
  pdfCover, setPdfCover,
  pdfName, setPdfName,
}) => {
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
              value={pdfUrl ? [{ uid: "pdf", url: pdfUrl, status: "done", name: pdfName }] : []}
              onChange={(files) => {
                if (files.length > 0) {
                  setPdfUrl(files[0].url || "");
                  if (!pdfName && files[0].name) {
                    setPdfName(files[0].name);
                  }
                } else {
                  setPdfUrl("");
                }
              }}
              allowedTypes={["application/pdf"]}
              maxCount={1}
              size="md"
              isBanner={true}
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

        <div className="space-y-2">
          <label className="text-[9px] uppercase text-gray-500 tracking-wider font-semibold">Select PDF Cover Image</label>
          <div className="flex justify-center p-3 bg-slate-50/60 rounded-xl border border-slate-100">
            <MediaUploadField
              value={pdfCover ? [{ uid: "pdfCover", url: pdfCover, status: "done" }] : []}
              onChange={(files) => {
                if (files.length > 0) {
                  setPdfCover(files[0].url || "");
                } else {
                  setPdfCover("");
                }
              }}
              maxCount={1}
              size="md"
              isBanner={true}
              className="w-full"
            />
          </div>
          <FormInput
            value={pdfCover || ""}
            onChange={(e) => setPdfCover(e.target.value)}
            placeholder="Or enter the PDF cover image URL..."
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
      </div>
    </div>
  );
};
