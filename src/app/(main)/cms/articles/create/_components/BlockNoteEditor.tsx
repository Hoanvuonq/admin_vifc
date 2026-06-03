"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import { useEffect, useRef } from "react";
import { convertBlockNoteHTMLToTailwindAndClean, convertTailwindAndCleanToBlockNoteHTML } from "../_hooks/useBlockNoteHtmlConverter";

export default function BlockNoteEditor({ initialContent, onChange }: { initialContent?: string, onChange?: (content: string) => void }) {
    const editor = useCreateBlockNote();
    const initialized = useRef(false);

    useEffect(() => {
        if (initialContent && !initialized.current) {
            initialized.current = true;
            if (initialContent.trim().startsWith("<")) {
                const loadHTML = async () => {
                    try {
                        const preparedContent = convertTailwindAndCleanToBlockNoteHTML(initialContent);
                        const parsedBlocks = await editor.tryParseHTMLToBlocks(preparedContent);
                        editor.replaceBlocks(editor.document, parsedBlocks);
                    } catch (e) {
                        console.error(e);
                    }
                };
                loadHTML();
            } else {
                try {
                    const blocks = JSON.parse(initialContent);
                    editor.replaceBlocks(editor.document, blocks);
                } catch (e) {
                    console.error("Failed to parse initial blocks, treating as plain text", e);
                    const loadPlainText = async () => {
                        try {
                            const parsedBlocks = await editor.tryParseHTMLToBlocks(`<p>${initialContent}</p>`);
                            editor.replaceBlocks(editor.document, parsedBlocks);
                        } catch (err) {
                            console.error(err);
                        }
                    };
                    loadPlainText();
                }
            }
        }
    }, [editor, initialContent]);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return (
        <div className="w-full min-h-[80px] [&_.bn-editor]:px-1! [&_.bn-editor]:py-2!">
            <BlockNoteView
                theme="light"
                editor={editor}
                onChange={() => {
                    if (onChange) {
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                        timeoutRef.current = setTimeout(async () => {
                            let html = await editor.blocksToHTMLLossy(editor.document);
                            html = html.replace(/<p><\/p>/g, "<p><br></p>");
                            html = convertBlockNoteHTMLToTailwindAndClean(html);
                            onChange(html);
                        }, 100);
                    }
                }}
            />
        </div>
    );
}
