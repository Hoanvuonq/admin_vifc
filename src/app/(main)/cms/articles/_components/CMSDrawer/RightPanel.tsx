import React from "react";
import { Checkbox, FormInput, SelectComponent, PremiumButton, MediaUploadField } from "@/components";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Compass,
  FileText,
  Globe,
  History,
  Image as ImageIcon,
  Settings,
  Trash2
} from "lucide-react";
import { ContentBlock } from "./NewsPreview";
import { CATEGORY_OPTIONS } from "../../_constants/cms.constants";
import { NewsItem } from "../../_pages/types";

interface RightPanelProps {
  rightPanelRef: React.RefObject<HTMLDivElement | null>;
  activeInput: string | null;
  setActiveInput: (val: string | null) => void;
  title: string;
  handleTitleChange: (e: any) => void;
  slug: string;

  setSlug: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  tags: string[];
  setTags: (val: string[]) => void;
  tagOptions: { value: string; label: string }[];
  thumbnail: string;
  setThumbnail: (val: string) => void;
  handleImageUpload: () => void;
  summary: string;
  setSummary: (val: string) => void;
  blocks: ContentBlock[];
  handleMoveBlock: (index: number, dir: "up" | "down") => void;
  handleBlockChange: (blockId: string, update: Partial<ContentBlock>) => void;
  handleDeleteBlock: (blockId: string) => void;
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  seoKeywords: string;
  setSeoKeywords: (val: string) => void;
  allowComments: boolean;
  setAllowComments: (val: boolean) => void;
  isFeatured: boolean;
  setIsFeatured: (val: boolean) => void;
  scheduledDate: string;
  setScheduledDate: (val: string) => void;
  newsToEdit: NewsItem | null;
  sectionBasicCompleted: boolean;
  sectionMediaCompleted: boolean;
  sectionContentCompleted: boolean;
  sectionSEOCompleted: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  rightPanelRef,
  activeInput,
  setActiveInput,
  title,
  handleTitleChange,
  slug,
  setSlug,
  category,
  setCategory,
  tags,
  setTags,
  tagOptions,
  thumbnail,
  setThumbnail,
  handleImageUpload,
  summary,
  setSummary,
  blocks,
  handleMoveBlock,
  handleBlockChange,
  handleDeleteBlock,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  seoKeywords,
  setSeoKeywords,
  allowComments,
  setAllowComments,
  isFeatured,
  setIsFeatured,
  scheduledDate,
  setScheduledDate,
  newsToEdit,
  sectionBasicCompleted,
  sectionMediaCompleted,
  sectionContentCompleted,
  sectionSEOCompleted
}) => {
  return (
    <div
      ref={rightPanelRef}
      id="right-editor-panel"
      className="w-[400px] xl:w-[450px] shrink-0 h-full overflow-y-auto p-4 bg-white space-y-4 border-l border-slate-200/80 custom-scrollbar scroll-smooth"
    >
      {/* SECTION 1: CƠ BẢN */}
      <div
        id="form-section-basic"
        className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
        onFocusCapture={() => setActiveInput("title")}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-50">
          <div className="flex items-center gap-1.5">
            <FileText size={14} className="text-orange-500" />
            <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">1. Thông tin cơ bản</span>
          </div>
          <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${sectionBasicCompleted ? "bg-emerald-50 text-emerald-600" : "bg-red-50/50 text-red-500"
            }`}>
            {sectionBasicCompleted ? "Hoàn thành" : "Chưa đủ"}
          </span>
        </div>

        <div className="space-y-3">
          <FormInput
            label="Tiêu đề bài viết"
            required
            value={title}
            onChange={handleTitleChange}
            onFocus={() => setActiveInput("title")}
            placeholder="Nhập tiêu đề bài viết..."
            maxLength={255}
            showCount
          />
          <FormInput
            label="Slug (Đường dẫn tĩnh)"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onFocus={() => setActiveInput("slug")}
            placeholder="web3-commerce-xu-huong-mua-sam..."
            maxLength={255}
            showCount
          />
          <div onFocusCapture={() => setActiveInput("category")}>
            <SelectComponent
              label="Danh mục tin tức"
              required
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
            />
          </div>
          <div className="space-y-2" onFocusCapture={() => setActiveInput("tags")}>
            <label className="text-[11px] font-bold text-gray-700 ml-0.5">Tags (Thẻ liên quan)</label>
            <SelectComponent
              placeholder="Chọn các tag liên quan..."
              value={tags}
              onChange={(val) => setTags(Array.isArray(val) ? val : [val])}
              options={tagOptions}
              isMulti
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: HÌNH ẢNH & TÓM TẮT */}
      <div
        id="form-section-media"
        className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
        onFocusCapture={() => setActiveInput("summary")}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-50">
          <div className="flex items-center gap-1.5">
            <ImageIcon size={14} className="text-orange-500" />
            <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">2. Ảnh & Tóm tắt</span>
          </div>
          <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${sectionMediaCompleted ? "bg-emerald-50 text-emerald-600" : "bg-red-50/50 text-red-500"
            }`}>
            {sectionMediaCompleted ? "Hoàn thành" : "Chưa đủ"}
          </span>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5" onMouseEnter={() => setActiveInput("thumbnail")}>
            <label className="text-[11px] font-bold text-gray-700 ml-0.5">Ảnh đại diện bài viết</label>
            <div className="p-3 bg-slate-50/60 rounded-xl flex justify-center">
              <MediaUploadField
                value={thumbnail ? [{ uid: "thumbnail", url: thumbnail, status: "done" }] : []}
                onChange={(files) => {
                  if (files.length > 0) {
                    setThumbnail(files[0].url || "");
                  } else {
                    setThumbnail("");
                  }
                }}
                maxCount={1}
                size="md"
                isBanner={true}
              />
            </div>
          </div>

          {/* Summary Area */}
          <div onFocusCapture={() => setActiveInput("summary")}>
            <FormInput
              label="Tóm tắt ngắn bài viết"
              required
              isTextArea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              onFocus={() => setActiveInput("summary")}
              placeholder="Nhập tóm tắt giới thiệu chung về bài viết..."
              maxLength={500}
              showCount
              className="min-h-[120px] text-xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: NỘI DUNG CHI TIẾT (BLOCK BY BLOCK WRITERS - BORDERLESS CARDS) */}
      <div
        id="form-section-content"
        className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-50">
          <div className="flex items-center gap-1.5">
            <Compass size={14} className="text-orange-500" />
            <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">3. Điền nội dung</span>
          </div>
          <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${sectionContentCompleted ? "bg-emerald-50 text-emerald-600" : "bg-red-50/50 text-red-500"
            }`}>
            {sectionContentCompleted ? "Hoàn thành" : "Chưa đủ"}
          </span>
        </div>

        {/* Render form block input editors without borders */}
        <div className="space-y-3">
          {blocks.map((block, index) => {
            const isBlockActive = activeInput === block.id;
            return (
              <div
                key={block.id}
                id={`form-${block.id}`}
                className={`p-3 rounded-xl space-y-2 transition-all ${isBlockActive ? "bg-orange-50/20" : "bg-slate-50/50"
                  }`}
                onFocusCapture={() => setActiveInput(block.id)}
              >
                {/* Local Block controls */}
                <div className="flex justify-between items-center border-b border-slate-100/50 pb-1.5 select-none">
                  <span className="text-[8.5px] font-extrabold uppercase text-gray-500 tracking-widest">
                    #{index + 1} {block.type === "heading" ? `Tiêu đề ${block.level || "H2"}` :
                      block.type === "image" ? "Hình ảnh" :
                        block.type === "quote" ? "Trích dẫn" :
                          block.type === "divider" ? "Chia dòng" : "Văn bản"}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(index, "up")}
                      disabled={index === 0}
                      className="p-0.5 rounded bg-white border border-gray-205 text-gray-500 disabled:opacity-20"
                    >
                      <ArrowUp size={9} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(index, "down")}
                      disabled={index === blocks.length - 1}
                      className="p-0.5 rounded bg-white border border-gray-205 text-gray-500 disabled:opacity-20"
                    >
                      <ArrowDown size={9} />
                    </button>

                    {block.type !== "divider" && (
                      <>
                        <div className="w-px h-3 bg-gray-200 mx-0.5" />
                        <button
                          type="button"
                          onClick={() => handleBlockChange(block.id, { align: "left" })}
                          className={`p-0.5 rounded ${block.align === "left" ? "bg-orange-100 text-orange-600" : "bg-white border border-gray-205 text-gray-400"}`}
                        >
                          <AlignLeft size={9} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBlockChange(block.id, { align: "center" })}
                          className={`p-0.5 rounded ${block.align === "center" ? "bg-orange-100 text-orange-600" : "bg-white border border-gray-205 text-gray-400"}`}
                        >
                          <AlignCenter size={9} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBlockChange(block.id, { align: "right" })}
                          className={`p-0.5 rounded ${block.align === "right" ? "bg-orange-100 text-orange-600" : "bg-white border border-gray-205 text-gray-400"}`}
                        >
                          <AlignRight size={9} />
                        </button>
                      </>
                    )}

                    <div className="w-px h-3 bg-gray-200 mx-0.5" />
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(block.id)}
                      className="p-0.5 rounded bg-white border border-red-150 text-red-500"
                    >
                      <Trash2 size={9} />
                    </button>
                  </div>
                </div>

                {/* Block editors */}
                {block.type === "heading" && (
                  <div className="flex gap-2 items-center">
                    <select
                      value={block.level || "h2"}
                      onChange={(e) => handleBlockChange(block.id, { level: e.target.value as "h2" | "h3" })}
                      className="h-10 px-2 bg-slate-50/50 border border-gray-202 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none"
                    >
                      <option value="h2">H2</option>
                      <option value="h3">H3</option>
                    </select>
                    <FormInput
                      value={block.content}
                      onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                      placeholder="Nhập tiêu đề..."
                      className="h-10 text-xs"
                      containerClassName="flex-1"
                    />
                  </div>
                )}

                {block.type === "text" && (
                  <FormInput
                    isTextArea
                    value={block.content}
                    onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                    placeholder="Nhập nội dung đoạn văn..."
                    className="min-h-[160px] text-xs"
                  />
                )}

                {block.type === "image" && (
                  <div className="space-y-2">
                    <div className="flex justify-center p-3 bg-slate-50/60 rounded-xl">
                      <MediaUploadField
                        value={block.content ? [{ uid: block.id, url: block.content, status: "done" }] : []}
                        onChange={(files) => {
                          if (files.length > 0) {
                            handleBlockChange(block.id, { content: files[0].url || "" });
                          } else {
                            handleBlockChange(block.id, { content: "" });
                          }
                        }}
                        maxCount={1}
                        size="md"
                        isBanner={true}
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <FormInput
                        value={block.content}
                        onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                        placeholder="Hoặc nhập URL hình ảnh bài viết..."
                        className="h-10 text-xs"
                        containerClassName="flex-1"
                      />
                    </div>
                    <FormInput
                      value={block.caption || ""}
                      onChange={(e) => handleBlockChange(block.id, { caption: e.target.value })}
                      placeholder="Mô tả / Chú thích hình ảnh..."
                      className="h-10 text-xs"
                    />
                  </div>
                )}

                {block.type === "quote" && (
                  <FormInput
                    isTextArea
                    value={block.content}
                    onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                    placeholder="Nhập nội dung trích dẫn..."
                    className="min-h-[100px] text-xs italic text-gray-650"
                  />
                )}

                {block.type === "divider" && (
                  <div className="py-1 flex items-center justify-center select-none">
                    <div className="w-full h-px border-t border-dashed border-gray-200" />
                    <span className="px-2 text-[8px] text-gray-300 font-bold uppercase shrink-0">Phân ngăn</span>
                    <div className="w-full h-px border-t border-dashed border-gray-200" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: TỐI ƯU SEO */}
      <div
        id="form-section-seo"
        className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
        onFocusCapture={() => setActiveInput("seoTitle")}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-50">
          <div className="flex items-center gap-1.5">
            <Globe size={14} className="text-orange-500" />
            <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">4. Tối ưu hóa SEO</span>
          </div>
          <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${sectionSEOCompleted ? "bg-emerald-50 text-emerald-600" : "bg-red-50/50 text-red-500"
            }`}>
            {sectionSEOCompleted ? "Hoàn thành" : "Chưa đủ"}
          </span>
        </div>

        <div className="space-y-3">
          <FormInput
            label="SEO Title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            onFocus={() => setActiveInput("seoTitle")}
            placeholder="Tiêu đề hiển thị trên Google..."
            maxLength={70}
            showCount
          />
          <FormInput
            label="SEO Description"
            isTextArea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            onFocus={() => setActiveInput("seoDescription")}
            placeholder="Mô tả tóm tắt hiển thị trên Google..."
            maxLength={160}
            showCount
            className="min-h-[110px] text-xs"
          />
          <FormInput
            label="SEO Keywords"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            onFocus={() => setActiveInput("seoKeywords")}
            placeholder="web3, blockchain, ecommerce..."
          />

          {/* Google Search Result Preview */}
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-widest">Xem trước kết quả tìm kiếm Google</span>
            <h3 className="text-blue-800 font-semibold text-xs hover:underline cursor-pointer truncate">
              {seoTitle || title || "Tiêu đề tìm kiếm..."}
            </h3>
            <p className="text-emerald-700 text-[9px] truncate">
              https://vifc.vn/news/{slug || "web3-commerce-xu-huong-mua-sam"}
            </p>
            <p className="text-gray-600 text-[9.5px] line-clamp-2 leading-snug font-medium">
              {seoDescription || summary || "Mô tả bài viết trên kết quả tìm kiếm..."}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 5: CẤU HÌNH HIỂN THỊ */}
      <div
        id="form-section-settings"
        className="bg-white rounded-2xl p-4 shadow-3xs space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-50">
          <div className="flex items-center gap-1.5">
            <Settings size={14} className="text-orange-500" />
            <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">5. Cài đặt xuất bản</span>
          </div>
          <span className="text-[8.5px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
            Tùy chọn
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-800">Cho phép bình luận</span>
              <span className="text-[9px] text-gray-400 font-semibold mt-0.5">Bình luận bài viết</span>
            </div>
            <Checkbox
              checked={allowComments}
              onChange={(e) => setAllowComments(e.target.checked)}
              sizeClassName="w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-800">Bài viết nổi bật</span>
              <span className="text-[9px] text-gray-400 font-semibold mt-0.5">Ghim lên đầu trang</span>
            </div>
            <Checkbox
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              sizeClassName="w-4 h-4"
            />
          </div>

          <div className="p-3 bg-slate-50/50 rounded-xl space-y-1.5">
            <span className="text-[11px] font-bold text-gray-800 block">Đặt lịch đăng bài (Tùy chọn)</span>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* History logs */}
        <div className="space-y-2 pt-2.5 border-t border-slate-100 select-none">
          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <History size={11} />
            Lịch sử chỉnh sửa
          </span>
          <div className="relative border-l border-slate-100 ml-1.5 py-1 space-y-3">
            {newsToEdit ? (
              <>
                <div className="relative pl-4">
                  <div className="absolute -left-[3.5px] top-1 w-1.5 h-1.5 bg-emerald-500 border border-white rounded-full" />
                  <p className="text-[8px] text-gray-400 font-bold uppercase">{newsToEdit.createdDate}</p>
                  <p className="text-[9.5px] font-extrabold text-gray-700">Tạo mới bài viết</p>
                </div>
                <div className="relative pl-4">
                  <div className="absolute -left-[3.5px] top-1 w-1.5 h-1.5 bg-orange-500 border border-white rounded-full" />
                  <p className="text-[8px] text-gray-400 font-bold uppercase">Bây giờ</p>
                  <p className="text-[9.5px] font-extrabold text-gray-700">Chỉnh sửa gần nhất</p>
                </div>
              </>
            ) : (
              <div className="pl-4 text-[9px] text-gray-400 italic font-semibold">
                Chưa có lịch sử sửa đổi (bài viết mới).
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
