"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import { useEffect, useRef } from "react";

export default function BlockNoteEditor({ initialContent, onChange }: { initialContent?: string, onChange?: (content: string) => void }) {
    const editor = useCreateBlockNote();

    // const initialized = useRef(false);

    useEffect(() => {
        if (initialContent && !initialized.current) {
            initialized.current = true;
            if (initialContent.trim().startsWith("<")) {
                try {
                    const parsedBlocks = editor.tryParseHTMLToBlocks(initialContent);
                    editor.replaceBlocks(editor.document, parsedBlocks);
                } catch (e) {
                    console.error(e);
                }
                // } else {
                try {
                    const blocks = JSON.parse(initialContent);
                    editor.replaceBlocks(editor.document, blocks);
                } catch (e) {
                    console.error("Failed to parse initial blocks", e);
                }
            }
        }
    }, [editor, initialContent]);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return (
        <div className="w-full min-h-[80px] [&_.bn-editor]:px-1! [&_.bn-editor]:py-2!">
            <BlockNoteView theme="light" editor={editor} onChange={() => {
                if (onChange) {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(async () => {
                        let html = await editor.blocksToHTMLLossy(editor.document);
                        html = html.replace(/<p><\/p>/g, "<p><br></p>");
                        onChange(html);
                    }, 300);
                }
            }} />
        </div>
    );
}
