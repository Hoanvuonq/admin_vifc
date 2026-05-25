"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import { useEffect } from "react";

export default function BlockNoteEditor({ initialContent, onChange }: { initialContent?: string, onChange?: (content: string) => void }) {
    // Creates a new editor instance.
    const editor = useCreateBlockNote();

    useEffect(() => {
        if (initialContent) {
            if (initialContent.trim().startsWith("<")) {
                // Parse HTML string back to blocks
                try {
                    const parsedBlocks = editor.tryParseHTMLToBlocks(initialContent);
                    editor.replaceBlocks(editor.document, parsedBlocks);
                } catch (e) {
                    console.error(e);
                }
            } else {
                try {
                    const blocks = JSON.parse(initialContent);
                    editor.replaceBlocks(editor.document, blocks);
                } catch (e) {
                    console.error("Failed to parse initial blocks", e);
                }
            }
        }
    }, [editor, initialContent]); // Run once when editor is ready

    // Renders the editor instance using a React component.
    return (
        <div className="w-full h-full min-h-screen">
            <BlockNoteView theme="light" editor={editor} onChange={() => {
                if (onChange) {
                    const json = JSON.stringify(editor.document);
                    onChange(json);
                }
            }} />
        </div>
    );
}
