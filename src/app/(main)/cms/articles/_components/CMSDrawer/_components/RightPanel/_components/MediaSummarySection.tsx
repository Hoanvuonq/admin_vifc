import React from "react";
import { FormInput, MediaUploadField } from "@/components";
import { Image as ImageIcon } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";

interface MediaSummarySectionProps {
  activeInput: string | null;
  setActiveInput: (val: string | null) => void;
  thumbnail: string;
  setThumbnail: (val: string) => void;
  summary: string;
  setSummary: (val: string) => void;
  sectionMediaCompleted: boolean;
}

export const MediaSummarySection: React.FC<MediaSummarySectionProps> = ({
  activeInput,
  setActiveInput,
  thumbnail,
  setThumbnail,
  summary,
  setSummary,
  sectionMediaCompleted,
}) => {
  const { uploadFile } = useUpload();

  return (
    <div
      id="form-section-media"
      className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
      onFocusCapture={() => setActiveInput("summary")}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-50">
        <div className="flex items-center gap-1.5">
          <ImageIcon size={14} className="text-orange-500" />
          <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">2. Media & Summary</span>
        </div>
        <span
          className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${sectionMediaCompleted ? "bg-emerald-50 text-emerald-600" : "bg-red-50/50 text-red-500"
            }`}
        >
          {sectionMediaCompleted ? "Completed" : "Incomplete"}
        </span>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5" onMouseEnter={() => setActiveInput("thumbnail")}>
          <label className="text-[11px] font-bold text-gray-700 ml-0.5">Article Cover Image</label>
          <div className="p-3 bg-slate-50/60 rounded-xl flex justify-center">
            <MediaUploadField
              onUploadApi={uploadFile}
              value={thumbnail && !thumbnail.includes("api.dicebear.com") ? [{ uid: "thumbnail", url: thumbnail, status: "done" }] : []}
              onChange={(files) => {
                if (files.length > 0) {
                  setThumbnail(files[0].url || "");
                } else {
                  setThumbnail("");
                }
              }}
              maxCount={1}
              size="md"
              className="w-full"
              isBanner={true}
            />
          </div>
        </div>

        <div onFocusCapture={() => setActiveInput("summary")}>
          <FormInput
            label="Short Article Summary"
            required
            isTextArea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            onFocus={() => setActiveInput("summary")}
            placeholder="Enter general introductory summary of the article..."
            maxLength={500}
            showCount
            className="min-h-30 text-xs"
          />
        </div>
      </div>
    </div>
  );
};
