"use client";
import { Reorder, useDragControls } from "framer-motion";

export const DraggableBlock = ({ type, onRemove, children, className }: any) => {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={type}
            dragListener={false}
            dragControls={controls}
            className={`relative group/block flex items-start w-full ${className}`}
        >
            <div className="opacity-0 group-hover/block:opacity-100 transition-opacity flex gap-1.5 absolute right-2 -top-2 z-20 bg-white border border-slate-200/60 rounded-xl px-2 py-1 shadow-md scale-102">
                <div
                    className="p-1 cursor-grab active:cursor-grabbing rounded-lg text-slate-555 hover:bg-slate-105 hover:text-slate-800 transition-colors flex items-center justify-center mr-1"
                    onPointerDown={(e) => controls.start(e)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
                </div>
                <div className="w-px h-3.5 bg-slate-200 mx-0.5 mt-1" />
                <button type="button" onClick={onRemove} className="p-1 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
            <div className="flex-1 w-full relative">
                {children}
            </div>
        </Reorder.Item>
    );
};