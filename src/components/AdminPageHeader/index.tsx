"use client";

import { TitlePageHeader, MetricItem } from "@/components";
import { cn } from "@/utils/cn";
import { Fragment, useEffect } from "react";
import { AdminPageHeaderProps } from "./type";
import { useAdminUIStore } from "./admin-ui.store";
export { useAdminUIStore };


export const AdminPageHeader = ({
  title,
  highlightTitle,
  subtitle,
  icon,
  metrics = [],
  className,
  children,
  hideActionsInHeader = false,
  hideMetricsInPage = false,
}: AdminPageHeaderProps) => {
  const setHeaderInfo = useAdminUIStore((state) => state.setHeaderInfo);

  useEffect(() => {
    setHeaderInfo({
      title,
      highlightTitle,
      subtitle,
      icon,
      metrics,
      actions: hideActionsInHeader ? null : children,
    });

    return () => setHeaderInfo(null);
  }, [title, highlightTitle, subtitle, icon, metrics, children, setHeaderInfo, hideActionsInHeader]);

  return (
    <div className={cn(
      "flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/80 backdrop-blur-2xl p-4 rounded-[3rem] border border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden group/header transition-all duration-500 shadow-custom",
      className
    )}>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />

      <TitlePageHeader
        title={title}
        highlightTitle={highlightTitle}
        subtitle={subtitle}
        icon={icon}
        size="sm"
        className="shrink-0 relative z-10"
      />

      {metrics.length > 0 && !hideMetricsInPage && (
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2 p-2 bg-gray-100/30 backdrop-blur-2xl rounded-[3rem] border border-white/80 shadow-[inset_0_2px_15px_rgba(0,0,0,0.02),0_20px_40px_-20px_rgba(0,0,0,0.05)] relative z-10 transition-all duration-500 hover:bg-gray-100/50">
            {metrics.map((metric, index) => (
              <Fragment key={index}>
                <MetricItem
                  label={metric.label}
                  value={metric.value}
                  icon={metric.icon}
                  color={metric.color}
                  isMoney={metric.isMoney}
                  suffix={metric.suffix}
                />
                {index < metrics.length - 1 && (
                  <div className="w-px h-12 bg-linear-to-b from-transparent via-gray-200/50 to-transparent mx-2" />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      {children && (
        <div className="relative z-10 flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};
