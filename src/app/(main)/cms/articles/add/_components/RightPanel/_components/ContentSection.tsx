import React from "react";
import { FormInput, MediaUploadField } from "@/components";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Compass,
  Trash2
} from "lucide-react";
import { ContentBlock } from "../../NewsPreview/type";
import { useUpload } from "@/hooks/useUpload";

interface ContentSectionProps {
  activeInput: string | null;
  setActiveInput: (val: string | null) => void;
  blocks: ContentBlock[];
  handleMoveBlock: (index: number, dir: "up" | "down") => void;
  handleBlockChange: (blockId: string, update: Partial<ContentBlock>) => void;
  handleDeleteBlock: (blockId: string) => void;
  sectionContentCompleted: boolean;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  activeInput,
  setActiveInput,
  blocks,
  handleMoveBlock,
  handleBlockChange,
  handleDeleteBlock,
  sectionContentCompleted,
}) => {
  const { uploadFile } = useUpload();
  const alignOptions = [
    { key: "left" as const, Icon: AlignLeft },
    { key: "center" as const, Icon: AlignCenter },
    { key: "right" as const, Icon: AlignRight }
  ];

  const imagePaddingOptions = [
    { key: "none", label: "Full (100%)" },
    { key: "small", label: "Wide (95%)" },
    { key: "medium", label: "Medium (85%)" },
    { key: "large", label: "Small (70%)" }
  ];

  return (
    <div
      id="form-section-content"
      className="bg-white rounded-2xl p-4 shadow-3xs space-y-3"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-50">
        <div className="flex items-center gap-1.5">
          <Compass size={14} className="text-orange-500" />
          <span className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider">3. Fill Content</span>
        </div>
        <span
          className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${sectionContentCompleted ? "bg-emerald-50 text-emerald-600" : "bg-red-50/50 text-red-500"
            }`}
        >
          {sectionContentCompleted ? "Completed" : "Incomplete"}
        </span>
      </div>

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
                  #{index + 1} {
                    block.type === "heading" ? `Heading ${block.level || "H2"}` :
                      block.type === "image" ? "Image" : "Paragraph"
                  }
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
                    placeholder="Enter heading..."
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
                  placeholder="Enter paragraph content..."
                  className="min-h-40 text-xs"
                />
              )}

              {block.type === "image" && (
                <div className="space-y-3">
                  {/* Image Upload / URL & Caption */}
                  <div className="space-y-2 pt-1.5 border-t border-slate-100/60">
                    <label className="text-[9px] uppercase text-gray-500 tracking-wider font-semibold">Image File</label>
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
                        onUploadApi={uploadFile}
                        className="w-full"
                      />
                    </div>
                    <FormInput
                      value={block.content}
                      onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                      placeholder="Or enter the article image URL..."
                      className="h-10 text-xs"
                    />
                    <FormInput
                      value={block.caption || ""}
                      onChange={(e) => handleBlockChange(block.id, { caption: e.target.value })}
                      placeholder="Image description / caption..."
                      className="h-10 text-xs"
                    />
                  </div>
                </div>
              )}

              {block.type === "pdf" && (
                <div className="space-y-3">
                  <div className="space-y-2 pt-1.5 border-t border-slate-100/60">
                    <label className="text-[9px] uppercase text-gray-500 tracking-wider font-semibold">PDF File</label>
                    <div className="flex justify-center p-3 bg-slate-50/60 rounded-xl border border-slate-100">
                      <MediaUploadField
                        value={block.content ? [{ uid: block.id, url: block.content, status: "done", name: block.caption, thumbnailUrl: block.thumbnailUrl }] : []}
                        onChange={(files) => {
                          if (files.length > 0) {
                            handleBlockChange(block.id, {
                              content: files[0].url || "",
                              caption: files[0].name || block.caption,
                              thumbnailUrl: files[0].thumbnailUrl || block.thumbnailUrl
                            });
                          } else {
                            handleBlockChange(block.id, { content: "", caption: "", thumbnailUrl: "" });
                          }
                        }}
                        allowedTypes={["application/pdf"]}
                        maxCount={1}
                        size="md"
                        isBanner={true}
                        isPDF={true}
                        onUploadApi={uploadFile}
                        className="w-full"
                      />
                    </div>
                    <FormInput
                      value={block.content}
                      onChange={(e) => handleBlockChange(block.id, { content: e.target.value })}
                      placeholder="Or enter the PDF file URL..."
                      className="h-10 text-xs"
                    />
                    <FormInput
                      value={block.caption || ""}
                      onChange={(e) => handleBlockChange(block.id, { caption: e.target.value })}
                      placeholder="PDF Document Name"
                      className="h-10 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
