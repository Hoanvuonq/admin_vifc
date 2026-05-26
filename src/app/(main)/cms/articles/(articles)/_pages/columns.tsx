import { ActionTooltipBtn, StatusBadge } from "@/components";
import { cn } from "@/utils/cn";
import { Clock, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { NewsItem } from "./types";

const ThumbnailImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full bg-gray-50">
      {isLoading && (
        <div className="absolute inset-0 z-10 leading-none">
          <Skeleton height="100%" borderRadius="0.75rem" style={{ display: 'block', height: '100%' }} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          setIsLoading(false);
          (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/shapes/svg?seed=vifc";
        }}
      />
    </div>
  );
};


export const getColumns = (
  handleEditNews: (news: NewsItem) => void,
  handleDeleteNews: (id: string) => void,
  handleEditNewsBlockNote: (news: NewsItem) => void
) => [
    {
      header: "Article",
      accessor: "title" as keyof NewsItem,
      className: "w-[40%] min-w-[320px] max-w-[450px]",
      render: (news: NewsItem) => (
        <div className="flex items-start gap-3 py-1 max-w-full">
          <div className="relative select-none shrink-0 w-28 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
            <ThumbnailImage
              src={news.thumbnail || "https://api.dicebear.com/7.x/shapes/svg?seed=vifc"}
              alt={news.title}
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1 space-y-1">
            <span className="font-bold text-gray-800 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1" title={news.title}>
              {news.title}
            </span>
            <span className="text-[11px] text-gray-400 font-medium line-clamp-2 leading-relaxed" title={news.description}>
              {news.description}
            </span>
          </div>
        </div>
      )
    },

    {
      header: "Status",
      accessor: "status" as keyof NewsItem,
      className: "w-[12%] text-center",
      align: "center" as const,
      render: (news: NewsItem) => (
        <StatusBadge status={news.status || "PUBLISHED"} variant="premium" />
      )
    },
    {
      header: "Created Date",
      accessor: "createdDate" as keyof NewsItem,
      className: "w-[15%]",
      render: (news: NewsItem) => (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock size={12} className="text-gray-400 shrink-0" />
          <span className="text-xs font-semibold whitespace-nowrap">{news.createdDate}</span>
        </div>
      )
    },
    {
      header: "Actions",
      className: "w-[10%] text-center",
      align: "center" as const,
      render: (news: NewsItem) => (
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <ActionTooltipBtn
            onClick={() => handleEditNews(news)}
            icon={<Edit size={13} />}
            color="orange"
            tooltip="Edit article Old"
          />
          <ActionTooltipBtn
            onClick={() => handleEditNewsBlockNote(news)}
            icon={<Edit size={13} />}
            color="orange"
            tooltip="Edit article Block Note"
          />
          <ActionTooltipBtn
            onClick={() => handleDeleteNews(news.id)}
            icon={<Trash2 size={13} />}
            color="red"
            tooltip="Delete article"
          />
        </div>
      )
    }
  ];
