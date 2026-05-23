import { StatusTabs } from "@/app/(main)/(dashboard)/_components";
import { BookOpen, Columns, Layers, Layout, Sidebar } from "lucide-react";
import React, { useState } from "react";
import { NewsPreviewProps } from "./type";
import { Layout1 } from "./_components/Layout1";
import { Layout2 } from "./_components/Layout2";
import { Layout3 } from "./_components/Layout3";
import { Layout4 } from "./_components/Layout4";
import { Layout5 } from "./_components/Layout5";

type LayoutKey = "layout1" | "layout2" | "layout3" | "layout4" | "layout5";

const LAYOUT_TABS = [
  { key: "layout1" as const, label: "Layout 1", icon: Layout },
  { key: "layout2" as const, label: "Layout 2", icon: Columns },
  { key: "layout3" as const, label: "Layout 3 (Magazine)", icon: BookOpen },
  { key: "layout4" as const, label: "Layout 4 (Split Editorial)", icon: Sidebar },
  { key: "layout5" as const, label: "Layout 5 (Cinematic)", icon: Layers },
];

const LAYOUT_MAP: Record<LayoutKey, React.FC<NewsPreviewProps>> = {
  layout1: Layout1,
  layout2: Layout2,
  layout3: Layout3,
  layout4: Layout4,
  layout5: Layout5,
};

export const NewsPreview: React.FC<NewsPreviewProps> = (props) => {
  const [layout, setLayout] = useState<LayoutKey>("layout2");
  const ActiveLayout = LAYOUT_MAP[layout];

  return (
    <div
      ref={props.centerPanelRef}
      id="center-preview-panel"
      className="flex-1 overflow-y-auto bg-slate-100/40 custom-scrollbar select-none relative"
    >
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 shrink-0 select-none border-b border-slate-100/80 shadow-3xs transition-all">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <span className="text-[10px] font-extrabold uppercase text-slate-550 tracking-widest">
            Article Layout Preview
          </span>
        </div>
        {/* <StatusTabs
          tabs={LAYOUT_TABS}
          current={layout}
          onChange={setLayout}
          layoutId="preview-layouts-tab"
          className="max-w-none flex-1 flex justify-end"
        /> */}
      </div>

      {/* Active layout */}
      <ActiveLayout {...props} />
    </div>
  );
};
