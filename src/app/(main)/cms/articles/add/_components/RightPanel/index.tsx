import React from "react";
import { RightPanelProps } from "./type";
import { BasicInfoSection } from "./_components/BasicInfoSection";
import { MediaSummarySection } from "./_components/MediaSummarySection";
import { ContentSection } from "./_components/ContentSection";
import { SEOSection } from "./_components/SEOSection";
import { PDFSection } from "./_components/PDFSection";
import { PublishSettingsSection } from "./_components/PublishSettingsSection";

export const RightPanel: React.FC<RightPanelProps> = (props) => {
  const { rightPanelRef } = props;

  return (
    <div
      ref={rightPanelRef}
      id="right-editor-panel"
      className="w-100 xl:w-112.5 shrink-0 h-full overflow-y-auto p-4 bg-white space-y-4 custom-scrollbar scroll-smooth"
    >
      <BasicInfoSection {...props} />
      <MediaSummarySection {...props} />
      <ContentSection {...props} />
      <SEOSection {...props} />
      <PDFSection {...props} />
      <PublishSettingsSection {...props} />
    </div>
  );
};
