import React from "react";
import { Checkbox, DateTimeInput } from "@/components";
import { History, Settings } from "lucide-react";
import { NewsItem } from "@/app/(main)/cms/articles/_pages/types";

interface PublishSettingsSectionProps {
  allowComments: boolean;
  setAllowComments: (val: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (val: boolean) => void;
  scheduledDate: string;
  setScheduledDate: (val: string) => void;
  newsToEdit: NewsItem | null;
}

export const PublishSettingsSection: React.FC<PublishSettingsSectionProps> = ({
  allowComments,
  setAllowComments,
  isFeatured,
  setIsFeatured,
  scheduledDate,
  setScheduledDate,
  newsToEdit,
}) => {
  return (
    <div
      id="form-section-settings"
      className="bg-white rounded-2xl p-4 shadow-3xs space-y-4"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-50">
        <div className="flex items-center gap-1.5">
          <Settings size={14} className="text-orange-500" />
          <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">5. Publishing Settings</span>
        </div>
        <span className="text-[8.5px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
          Optional
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-800">Allow Comments</span>
            <span className="text-[9px] text-gray-400 font-semibold mt-0.5">Reader Comments</span>
          </div>
          <Checkbox
            checked={allowComments}
            onChange={(e) => setAllowComments(e.target.checked)}
            sizeClassName="w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-800">Featured Article</span>
            <span className="text-[9px] text-gray-400 font-semibold mt-0.5">Pin to top of page</span>
          </div>
          <Checkbox
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            sizeClassName="w-4 h-4"
          />
        </div>

        <div className="p-3 bg-slate-50/50 rounded-xl">
          <DateTimeInput
            label="Schedule Publish Date (Optional)"
            value={scheduledDate}
            onChange={setScheduledDate}
            isDate={true}
            isTime={true}
            placeholder="Select publish date..."
          />
        </div>
      </div>

      <div className="space-y-2 pt-2.5 border-t border-slate-100 select-none">
        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1">
          <History size={11} />
          Edit History
        </span>
        <div className="relative border-l border-slate-100 ml-1.5 py-1 space-y-3">
          {newsToEdit ? (
            <>
              <div className="relative pl-4">
                <div className="absolute left-[-3.5px] top-1 w-1.5 h-1.5 bg-emerald-500 border border-white rounded-full" />
                <p className="text-[8px] text-gray-400 font-bold uppercase">{newsToEdit.createdDate}</p>
                <p className="text-[9.5px] font-extrabold text-gray-700">Create New Article</p>
              </div>
              <div className="relative pl-4">
                <div className="absolute left-[-3.5px] top-1 w-1.5 h-1.5 bg-orange-500 border border-white rounded-full" />
                <p className="text-[8px] text-gray-400 font-bold uppercase">Now</p>
                <p className="text-[9.5px] font-extrabold text-gray-700">Latest Update</p>
              </div>
            </>
          ) : (
            <div className="pl-4 text-[9px] text-gray-400 italic font-semibold">
              No edit history (New article).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
