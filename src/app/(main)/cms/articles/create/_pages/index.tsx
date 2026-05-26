"use client";

import { MediaUploadField, PremiumButton } from "@/components";
import { Reorder } from "framer-motion";
import { ArrowLeft, ArrowUp, Check, X } from "lucide-react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BasicInfoSection } from "../../add/_components/RightPanel/_components/BasicInfoSection";
import { PDFSection } from "../../add/_components/RightPanel/_components/PDFSection";
import { SEOSection } from "../../add/_components/RightPanel/_components/SEOSection";
import { useArticleEditorSync } from "../../add/_hooks/useArticleEditorSync";
import { useArticleEditorStore } from "../../add/_store/useArticleEditorStore";
import { DraggableBlock } from "../_components/DraggableBlock";

const BlockNoteEditor = dynamic(() => import("../_components/BlockNoteEditor"), { ssr: false });

export const ArticleEditor: React.FC<{ articleId?: string }> = ({ articleId }) => {
    const router = useRouter();

    const {
        status, content, setContent,
        title, handleTitleChange,
        summary, setSummary,
        thumbnail, setThumbnail, setThumbnailFile,
        blocks, handleAddBlock, handleBlockChange
    } = useArticleEditorStore();

    const { handleSave } = useArticleEditorSync(articleId);

    const rightPanelRef = useRef<HTMLDivElement>(null);

    const [layoutOrder, setLayoutOrder] = useState(["title", "banner", "summary", "content", "image", "pdf"]);

    useEffect(() => {
        const hasPdf = blocks.some(b => b.type === "pdf");
        if (!hasPdf) {
            handleAddBlock("pdf");
        }
        const hasImage = blocks.some(b => b.type === "image");
        if (!hasImage) {
            handleAddBlock("image");
        }
    }, [blocks.length, handleAddBlock]);

    const renderBlock = (type: string, index: number) => {
        const renderWrapper = (children: React.ReactNode, className = "") => (
            <DraggableBlock
                key={type}
                type={type}
                className={className}
                onRemove={() => {
                    if (type === "pdf") {
                        const pdfBlock = blocks.find(b => b.type === "pdf");
                        if (pdfBlock) handleAddBlock("text");
                    }
                    setLayoutOrder(layoutOrder.filter(t => t !== type));
                }}
            >
                {children}
            </DraggableBlock>
        );

        switch (type) {
            case "title":
                return renderWrapper(
                    <div className="space-y-4 w-full">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Article Title..."
                            className="w-full text-xl md:text-2.5xl font-extrabold text-slate-900 leading-tight tracking-tight outline-hidden bg-transparent border-b border-transparent hover:border-slate-50 focus:border-slate-100 transition-colors pr-20"
                        />
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-extrabold text-slate-455 py-3.5 select-none border-y border-slate-100/80">
                            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100/50 shadow-3xs">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-455"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                {new Date().toLocaleDateString("en-US")}
                            </span>
                        </div>
                    </div>
                );
            case "summary":
                return renderWrapper(
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Brief description or summary..."
                        className="w-full text-base md:text-sm leading-relaxed text-slate-700 font-medium italic placeholder:text-slate-300 outline-hidden bg-transparent resize-none h-24 custom-scrollbar"
                    />
                    , "my-4");
            case "banner":
                return renderWrapper(
                    <div className="w-full relative group">
                        <MediaUploadField
                            value={thumbnail ? [{ uid: "thumb", url: thumbnail, status: "done" }] : []}
                            onChange={(files) => {
                                setThumbnail(files.length > 0 ? files[0].url || "" : "");
                                setThumbnailFile(files.length > 0 ? files[0].originFileObj || null : null);
                            }}
                            maxCount={1}
                            size="lg"
                            isBanner={true}
                            className="w-full relative z-10"
                            classNameSizeUpload={`w-full h-80 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center ${thumbnail ? 'bg-transparent border-0' : 'bg-slate-50 border-2 border-dashed border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'}`}
                        />
                    </div>
                    , "mt-4 mb-8");
            case "content":
                return renderWrapper(
                    <div className="w-full relative blocknote-wrapper">
                        <BlockNoteEditor initialContent={content} onChange={(json) => setContent(json)} />
                    </div>
                    , "mt-4");
            case "image": {
                const imageBlock = blocks.find(b => b.type === "image");
                if (!imageBlock) return null;

                return renderWrapper(
                    <div className="w-full relative group">
                        <MediaUploadField
                            value={imageBlock.content ? [{ uid: imageBlock.id, url: imageBlock.content, status: "done" }] : []}
                            onChange={(files) => {
                                handleBlockChange(imageBlock.id, {
                                    content: files.length > 0 ? files[0].url || "" : "",
                                    file: files.length > 0 ? files[0].originFileObj : undefined,
                                } as any);
                            }}
                            maxCount={1}
                            size="lg"
                            isBanner={true}
                            className="w-full relative z-10"
                            classNameSizeUpload={`w-full h-64 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center ${imageBlock.content ? 'bg-transparent border-0' : 'bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'}`}
                        />
                    </div>
                    , "mt-4 mb-8");
            }
            case "pdf": {
                const pdfBlock = blocks.find(b => b.type === "pdf");
                if (!pdfBlock) return null;

                return renderWrapper(
                    <div className="flex flex-col gap-5 w-full items-center">
                        <div className="w-[280px] shrink-0">
                            <div className="bg-[#3b3b3b] rounded-[18px] p-5 w-full mx-auto flex flex-col items-center justify-center relative overflow-hidden shadow-xl border border-[#444]">
                                {pdfBlock.thumbnailUrl ? (
                                    <div className="w-full relative shadow-sm rounded-lg overflow-hidden border border-[#555]">
                                        <img src={pdfBlock.thumbnailUrl} alt={pdfBlock.caption || "PDF Cover"} className="w-full h-auto object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-3/4 bg-[#444] border border-dashed border-[#666] rounded-lg flex items-center justify-center">
                                        <span className="text-xs text-[#888] font-bold uppercase tracking-wider">No PDF Cover</span>
                                    </div>
                                )}

                                <div className="absolute inset-x-0 bottom-12 flex justify-center z-10">
                                    <a href={pdfBlock.content || "#"} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-slate-50 text-slate-900 px-5 py-2 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 shadow-xl transition-transform hover:scale-105 active:scale-95">
                                        View full report <ArrowUp size={11} className="rotate-45" />
                                    </a>
                                </div>

                                <div className="mt-5 text-center w-full">
                                    <span className="text-[10px] font-medium text-slate-300 truncate block w-full px-2">
                                        {pdfBlock.caption || "Untitled Document.pdf"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    , "py-8");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col animate-in fade-in duration-300">
            <div className="bg-white px-6 py-4.5 flex items-center justify-between shrink-0 select-none shadow-3xs z-10 relative">
                <div className="flex items-center gap-3.5">
                    <PremiumButton
                        icon={ArrowLeft}
                        variant="orange"
                        size="md"
                        onClick={() => router.push("/cms/articles")}
                        className="rounded-xl w-10! h-10! font-boldtext-xs"
                    />
                    <div>
                        <h1 className="text-sm font-extrabold text-slate-900 leading-tight">
                            {articleId ? "Edit Article (Blocknote)" : "Create New Article (Blocknote)"}
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
                        disabled={status === "PUBLISHED" || !title}
                        size="md"
                        onClick={() => handleSave("PUBLISHED")}
                        className="rounded-xl font-bold px-6 py-2 text-xs"
                    />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-slate-100/40 custom-scrollbar relative flex flex-col items-center p-8">
                    <div className="w-full max-w-5xl bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200 min-h-[1000px] h-fit shrink-0 flex flex-col overflow-hidden">
                        <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 shrink-0 justify-between">
                            <div className="flex gap-2 items-center">
                                <div className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/20 shadow-xs" />
                                <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20 shadow-xs" />
                                <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/20 shadow-xs" />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-3xs cursor-default">

                            </div>
                            <div className="w-16" />
                        </div>

                        <div className="p-10 md:p-14 flex flex-col gap-6 pb-[200px]">

                            <Reorder.Group axis="y" values={layoutOrder} onReorder={setLayoutOrder} className="flex flex-col gap-4 w-full">
                                {layoutOrder.map((type, index) => renderBlock(type, index))}
                            </Reorder.Group>

                        </div>

                    </div>
                </div>

                <div
                    ref={rightPanelRef}
                    id="right-editor-panel"
                    className="w-100 xl:w-112.5 shrink-0 h-full overflow-y-auto p-4 bg-white space-y-4 custom-scrollbar border-l border-slate-200"
                >
                    <BasicInfoSection />
                    <SEOSection />
                    <PDFSection />
                </div>

            </div>
        </div>
    );
};
