"use client";

import { PremiumButton } from "@/components";
import { ArrowLeft, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { LeftPanel, NewsPreview, RightPanel } from "../_components";
import { useArticleEditorSync } from "../_hooks/useArticleEditorSync";
import { useArticleEditorStore } from "../_store/useArticleEditorStore";


export const ArticleEditor: React.FC<{ articleId?: string }> = ({ articleId }) => {
  const router = useRouter();
  const { status } = useArticleEditorStore();
  const { handleSave } = useArticleEditorSync(articleId);

  const rightPanelRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col animate-in fade-in duration-300">
      <div className="bg-white px-6 py-4.5 flex items-center justify-between shrink-0 select-none shadow-3xs">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => router.push("/cms/articles")}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Back to List"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight">
              {articleId ? "Edit Article" : "Create New Article"}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Article Status:{" "}
              <span
                className={`ml-1 text-[9.5px] font-extrabold uppercase ${status === "PUBLISHED"
                  ? "text-emerald-500"
                  : status === "PENDING_REVIEW"
                    ? "text-amber-500"
                    : "text-blue-500"
                  }`}
              >
                {status === "PUBLISHED"
                  ? "Published"
                  : status === "PENDING_REVIEW"
                    ? "Pending Review"
                    : "Draft"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PremiumButton
            icon={X}
            label="Cancel"
            variant="rose"
            size="md"
            onClick={() => router.push("/cms/articles")}
            className="rounded-xl font-bold px-4 py-2 text-xs"
          />
          <PremiumButton
            label={"Publish"}
            variant="emerald"
            icon={Check}
            size="md"
            onClick={() => handleSave("PUBLISHED")}
            className="rounded-xl font-bold px-6 py-2 text-xs"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden h-[calc(100vh-68px)]">
        <LeftPanel formContainerRef={rightPanelRef} previewContainerRef={centerPanelRef} />

        <NewsPreview centerPanelRef={centerPanelRef} formContainerRef={rightPanelRef} />

        <RightPanel rightPanelRef={rightPanelRef} previewContainerRef={centerPanelRef} />
      </div>
    </div>
  );
};

