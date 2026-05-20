import { ItemImage, ActionTooltipBtn, StatusBadge } from "@/components";
import { Clock, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { NewsItem } from "./types";

const getCategoryBadgeStyles = (category: string) => {
  const normalized = category.toUpperCase();
  switch (normalized) {
    case "WEB3":
      return "bg-red-50 text-red-500 border-red-100";
    case "CRYPTO":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "NFT":
      return "bg-purple-50 text-purple-500 border-purple-100";
    case "METAVERSE":
      return "bg-blue-50 text-blue-500 border-blue-100";
    case "BLOCKCHAIN":
      return "bg-yellow-50 text-yellow-600 border-yellow-100";
    case "DEFI":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "TUTORIAL":
      return "bg-cyan-50 text-cyan-600 border-cyan-100";
    default:
      return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

export const getColumns = (
  handleEditNews: (news: NewsItem) => void,
  handleDeleteNews: (id: string) => void
) => [
  {
    header: "Article",
    accessor: "title" as keyof NewsItem,
    className: "w-[40%] min-w-[320px]",
    render: (news: NewsItem) => (
      <div className="flex items-start gap-3 py-1">
        <div className="relative select-none shrink-0 w-24 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
          <ItemImage
            path={news.thumbnail || "https://api.dicebear.com/7.x/shapes/svg?seed=vifc"}
            productName={news.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0 space-y-1">
          <span className="font-bold text-gray-800 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1">
            {news.title}
          </span>
          <span className="text-[11px] text-gray-400 font-medium line-clamp-2 leading-relaxed">
            {news.summary}
          </span>
        </div>
      </div>
    )
  },
  {
    header: "Category",
    accessor: "category" as keyof NewsItem,
    className: "w-[12%] text-center",
    align: "center" as const,
    render: (news: NewsItem) => (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeStyles(news.category)}`}>
        {news.category}
      </span>
    )
  },
  {
    header: "Author",
    accessor: "authorName" as keyof NewsItem,
    className: "w-[15%]",
    render: (news: NewsItem) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 shrink-0">
          <ItemImage
            path={news.authorAvatar || "/icons/icon_sidebar2.png"}
            productName={news.authorName}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xs font-bold text-gray-700">{news.authorName}</span>
      </div>
    )
  },
  {
    header: "Status",
    accessor: "status" as keyof NewsItem,
    className: "w-[12%] text-center",
    align: "center" as const,
    render: (news: NewsItem) => (
      <StatusBadge status={news.status} variant="premium" />
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
    header: "Views",
    accessor: "views" as keyof NewsItem,
    className: "w-[10%] text-center",
    align: "center" as const,
    render: (news: NewsItem) => (
      <span className="text-xs font-bold text-gray-600 font-mono">
        {news.views.toLocaleString()}
      </span>
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
          tooltip="Edit article"
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
