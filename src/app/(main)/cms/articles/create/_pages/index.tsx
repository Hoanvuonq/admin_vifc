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

    const [layoutOrder, setLayoutOrder] = useState<string[]>([]);

    useEffect(() => {
        if (layoutOrder.length === 0 && blocks.length > 0) {
            setLayoutOrder(["title", "banner", "summary", ...blocks.map(b => b.id)]);
        }
    }, [blocks, layoutOrder.length]);

    useEffect(() => {
        if (layoutOrder.length > 0) {
            const currentBlockIds = new Set(blocks.map(b => b.id));
            const layoutBlockIds = new Set(layoutOrder.filter(id => !["title", "banner", "summary"].includes(id)));

            const newIds = blocks.filter(b => !layoutBlockIds.has(b.id)).map(b => b.id);
            const orderWithoutDeleted = layoutOrder.filter(id => ["title", "banner", "summary"].includes(id) || currentBlockIds.has(id));

            if (newIds.length > 0 || orderWithoutDeleted.length !== layoutOrder.length) {
                setLayoutOrder([...orderWithoutDeleted, ...newIds]);
            }
        }
    }, [blocks]);

    useEffect(() => {
        if (blocks.length === 0) {
            handleAddBlock("html");
        }
    }, [blocks.length, handleAddBlock]);

    const renderBlock = (type: string, index: number) => {
        const renderWrapper = (children: React.ReactNode, className = "") => (
            <div
                key={type}
                id={`block-${type}`}
                className="w-full"
                onClickCapture={() => {
                    if (["title", "summary", "banner"].includes(type)) {
                        document.getElementById("section-basic")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    } else if (blocks.find(b => b.id === type)?.type === "pdf") {
                        document.getElementById("section-pdf")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }}
            >
                <DraggableBlock
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
            </div>
        );

        if (type === "title") {
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
        }

        if (type === "summary") {
            return renderWrapper(
                <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Brief description or summary..."
                    className="w-full text-base md:text-sm leading-relaxed text-slate-700 font-medium italic placeholder:text-slate-300 outline-hidden bg-transparent resize-none h-24 custom-scrollbar"
                />
                , "my-4");
        }

        if (type === "banner") {
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
        }

        const block = blocks.find(b => b.id === type);
        if (!block) return null;

        if (block.type === "text" || block.type === "html") {
            return renderWrapper(
                <div className="w-full relative blocknote-wrapper">
                    <BlockNoteEditor initialContent={block.content || ""} onChange={(json) => handleBlockChange(block.id, { content: json })} />
                </div>
                , "mt-4");
        }

        if (block.type === "image") {
            return renderWrapper(
                <div className="w-full relative group">
                    <MediaUploadField
                        value={block.content ? [{ uid: block.id, url: block.content, status: "done" }] : []}
                        onChange={(files) => {
                            handleBlockChange(block.id, {
                                content: files.length > 0 ? files[0].url || "" : "",
                                file: files.length > 0 ? files[0].originFileObj : undefined,
                            } as any);
                        }}
                        maxCount={1}
                        size="lg"
                        isBanner={true}
                        className="w-full relative z-10"
                        classNameSizeUpload={`w-full h-64 rounded-3xl transition-all duration-300 flex flex-col items-center justify-center ${block.content ? 'bg-transparent border-0' : 'bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'}`}
                    />
                </div>
                , "mt-4 mb-8");
        }

        if (block.type === "pdf") {
            return renderWrapper(
                <div className="flex flex-col gap-5 w-full items-center">
                    <div className="w-[280px] shrink-0">
                        <div className="bg-[#3b3b3b] rounded-[18px] p-5 w-full mx-auto flex flex-col items-center justify-center relative overflow-hidden shadow-xl border border-[#444]">
                            {block.thumbnailUrl ? (
                                <div className="w-full relative shadow-sm rounded-lg overflow-hidden border border-[#555]">
                                    <img src={block.thumbnailUrl} alt={block.caption || "PDF Cover"} className="w-full h-auto object-cover" />
                                </div>
                            ) : (
                                <div className="w-full aspect-3/4 bg-[#444] border border-dashed border-[#666] rounded-lg flex items-center justify-center">
                                    <span className="text-xs text-[#888] font-bold uppercase tracking-wider">No PDF Cover</span>
                                </div>
                            )}

                            <div className="absolute inset-x-0 bottom-12 flex justify-center z-10">
                                <a href={block.content || "#"} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-slate-50 text-slate-900 px-5 py-2 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 shadow-xl transition-transform hover:scale-105 active:scale-95">
                                    View full report <ArrowUp size={11} className="rotate-45" />
                                </a>
                            </div>

                            <div className="mt-5 text-center w-full">
                                <span className="text-[10px] font-medium text-slate-300 truncate block w-full px-2">
                                    {block.caption || "Untitled Document.pdf"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                , "py-8");
        }

        return null;
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
                        onClick={() => handleSave("PUBLISHED", layoutOrder)}
                        className="rounded-xl font-bold px-6 py-2 text-xs"
                    />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-56 shrink-0 h-full border-r border-slate-200 bg-slate-50/30 p-4 flex flex-col gap-2 z-20">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 px-2 mt-2">
                        Insert Blocks
                    </div>

                    <button
                        onClick={() => handleAddBlock("html")}
                        className="w-full bg-white border cursor-pointer border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all rounded-xl font-bold px-3 py-3 text-xs shadow-3xs flex items-center gap-3 group"
                    >
                        <span className="bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-500 p-1.5 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /></svg>
                        </span>
                        Text Block
                    </button>

                    <button
                        onClick={() => handleAddBlock("image")}
                        className="w-full bg-white border cursor-pointer border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all rounded-xl font-bold px-3 py-3 text-xs shadow-3xs flex items-center gap-3 group"
                    >
                        <span className="bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-500 p-1.5 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                        </span>
                        Image Block
                    </button>

                    <button
                        onClick={() => handleAddBlock("pdf")}
                        className="w-full bg-white border cursor-pointer border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all rounded-xl font-bold px-3 py-3 text-xs shadow-3xs flex items-center gap-3 group"
                    >
                        <span className="bg-slate-100 text-slate-500 group-hover:bg-rose-100 group-hover:text-rose-500 p-1.5 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </span>
                        PDF Block
                    </button>
                </div>
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
                    <div onClickCapture={() => document.getElementById("block-title")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                        <BasicInfoSection />
                    </div>
                    <div onClickCapture={() => document.getElementById("block-title")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                        <SEOSection />
                    </div>
                    <div onClickCapture={() => {
                        const pdfId = blocks.find(b => b.type === "pdf")?.id;
                        if (pdfId) {
                            document.getElementById(`block-${pdfId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                    }}>
                        <PDFSection />
                    </div>
                </div>

            </div>
        </div>
    );
};
