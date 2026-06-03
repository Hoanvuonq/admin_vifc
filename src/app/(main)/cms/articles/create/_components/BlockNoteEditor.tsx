"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";



import { useEffect, useRef } from "react";

const convertBlockNoteHTMLToTailwindAndClean = (html: string): string => {
    const isDarkBackground = (val: string): boolean => {
        const v = val.toLowerCase().replace(/\s+/g, "");
        return (
            v.includes("rgb(17,17,17)") ||
            v.includes("#111111") ||
            v.includes("#111") ||
            v.includes("#1a1a1a") ||
            v.includes("#1e1e1e") ||
            v.includes("#000000") ||
            v.includes("#000") ||
            v === "black"
        );
    };

    const isLightText = (val: string): boolean => {
        const v = val.toLowerCase().replace(/\s+/g, "");
        return (
            v.startsWith("oklch(0.8") ||
            v.startsWith("oklch(0.9") ||
            v === "#ffffff" ||
            v === "#fff" ||
            v === "white" ||
            v === "rgb(255,255,255)"
        );
    };

    let processed = html.replace(/\s+data-(?:style-type|value|editable)="[^"]*"/g, "");

    processed = processed.replace(/\s+data-background-color="([^"]*)"/g, (match, val) => {
        if (isDarkBackground(val)) return "";
        return match;
    });

    processed = processed.replace(/\s+data-text-color="([^"]*)"/g, (match, val) => {
        if (isLightText(val)) return "";
        return match;
    });

    const colorMap: Record<string, string> = {
        gray: "text-gray-500",
        brown: "text-amber-800",
        red: "text-red-600",
        orange: "text-orange-500",
        yellow: "text-amber-500",
        green: "text-emerald-500",
        blue: "text-blue-500",
        purple: "text-purple-500",
        pink: "text-pink-500",
    };

    const bgMap: Record<string, string> = {
        gray: "bg-gray-100",
        brown: "bg-amber-100/40",
        red: "bg-red-50",
        orange: "bg-orange-50",
        yellow: "bg-amber-50",
        green: "bg-emerald-50",
        blue: "bg-blue-50",
        purple: "bg-purple-50",
        pink: "bg-pink-50",
    };

    const addClassToTag = (tag: string, newClassStr: string): string => {
        if (!newClassStr.trim()) return tag;
        const classMatch = tag.match(/class="([^"]*)"/);
        if (classMatch) {
            const currentClasses = classMatch[1];
            const merged = Array.from(new Set([...currentClasses.split(/\s+/), ...newClassStr.split(/\s+/)])).join(" ").trim();
            return tag.replace(/class="[^"]*"/, `class="${merged}"`);
        } else {
            const spaceIndex = tag.indexOf(" ");
            if (spaceIndex !== -1) {
                return tag.substring(0, spaceIndex) + ` class="${newClassStr.trim()}"` + tag.substring(spaceIndex);
            } else {
                const tagClose = tag.endsWith("/>") ? "/>" : ">";
                const tagName = tag.substring(1, tag.length - tagClose.length);
                return `<${tagName} class="${newClassStr.trim()}">`;
            }
        }
    };

    processed = processed.replace(/(<(?:p|h1|h2|h3|h4|h5|h6|li|ol|ul|div)[^>]*\b)data-text-alignment="([^"]+)"/g, (match, tag, align) => {
        let tailwindAlign = "";
        if (align === "center") tailwindAlign = "text-center";
        else if (align === "right") tailwindAlign = "text-right";
        else if (align === "justify") tailwindAlign = "text-justify";
        else if (align === "left") tailwindAlign = "text-left";
        return addClassToTag(tag, tailwindAlign);
    });

    const processTagStylesAndClasses = (tagHtml: string, tagName: string, attrs: string): string => {
        const classMatch = attrs.match(/class="([^"]*)"/);
        const styleMatch = attrs.match(/style="([^"]*)"/);
        let remainingAttrs = attrs;
        let classesList: string[] = [];
        
        if (classMatch) {
            classesList = classMatch[1].split(/\s+/);
            remainingAttrs = remainingAttrs.replace(/class="[^"]*"/, "");
        }
        
        let newClasses: string[] = [];
        let remainingStyles: string[] = [];
        
        classesList.forEach((cls) => {
            if (cls.startsWith("bn-color-")) {
                const color = cls.replace("bn-color-", "");
                if (colorMap[color]) newClasses.push(colorMap[color]);
            } else if (cls.startsWith("bn-background-")) {
                const color = cls.replace("bn-background-", "");
                if (bgMap[color]) newClasses.push(bgMap[color]);
            } else if (cls.trim()) {
                newClasses.push(cls);
            }
        });

        if (styleMatch) {
            const declarations = styleMatch[1].split(";");
            declarations.forEach((decl) => {
                const parts = decl.split(":");
                if (parts.length === 2) {
                    const property = parts[0].trim().toLowerCase();
                    const val = parts[1].trim();
                    if (property === "color") {
                        if (isLightText(val)) {
                            // Strip light text color
                        } else {
                            const cleanVal = val.replace(/\s+/g, "_");
                            newClasses.push(`text-[${cleanVal}]`);
                        }
                    } else if (property === "background-color") {
                        if (isDarkBackground(val)) {
                            // Strip dark background
                        } else {
                            const cleanVal = val.replace(/\s+/g, "_");
                            newClasses.push(`bg-[${cleanVal}]`);
                        }
                    } else if (property === "font-weight" && val.includes("bold")) {
                        newClasses.push("font-bold");
                    } else if (property === "font-style" && val.includes("italic")) {
                        newClasses.push("italic");
                    } else {
                        remainingStyles.push(decl);
                    }
                }
            });
            remainingAttrs = remainingAttrs.replace(/style="[^"]*"/, "");
        }
        
        let finalAttrs = remainingAttrs.replace(/\s+/g, " ").trim();
        if (newClasses.length > 0) {
            finalAttrs = `class="${newClasses.join(" ")}" ` + finalAttrs;
        }
        if (remainingStyles.length > 0) {
            const cleanStylesStr = remainingStyles.filter(s => s.trim()).join(";").trim();
            if (cleanStylesStr) {
                finalAttrs = `style="${cleanStylesStr}" ` + finalAttrs;
            }
        }
        
        return `<${tagName} ${finalAttrs.trim()}>`.replace(/\s+>/g, ">");
    };

    processed = processed.replace(/<(span|p|h1|h2|h3|h4|h5|h6|li|ol|ul|div)\b([^>]*)>/g, (match, tagName, attrs) => {
        return processTagStylesAndClasses(match, tagName, attrs);
    });

    processed = processed.replace(/(<(?:p|h1|h2|h3|h4|h5|h6|li|ol|ul|div)\s+([^>]*))/g, (match, tagFull, attrs) => {
        const classMatch = attrs.match(/class="([^"]*)"/);
        if (!classMatch) return match;
        
        const classList = classMatch[1].split(/\s+/);
        let hasIndent = false;
        let newClasses: string[] = [];
        
        classList.forEach((cls) => {
            if (cls.startsWith("bn-indent-")) {
                hasIndent = true;
                const level = parseInt(cls.replace("bn-indent-", ""), 10);
                if (!isNaN(level)) {
                    newClasses.push(`pl-${level * 4}`);
                }
            } else {
                newClasses.push(cls);
            }
        });
        
        if (hasIndent) {
            const tagName = tagFull.substring(0, tagFull.indexOf(" "));
            const remainingAttrs = attrs.replace(/class="[^"]*"/, "");
            const classAttr = newClasses.length ? `class="${newClasses.join(" ")}"` : "";
            return `${tagName} ${classAttr} ${remainingAttrs}`.replace(/\s+/g, " ").replace(/\s+>/g, ">");
        }
        return match;
    });

    processed = processed.replace(/<(strong|b)\b([^>]*)>/g, (match, tagName, attrs) => {
        return addClassToTag(`<${tagName} ${attrs}>`, "font-bold");
    });

    processed = processed.replace(/<(em|i)\b([^>]*)>/g, (match, tagName, attrs) => {
        return addClassToTag(`<${tagName} ${attrs}>`, "italic");
    });

    processed = processed.replace(/\s+style=""/g, "").replace(/\s+style="\s*"/g, "");

    return processed;
};

const convertTailwindAndCleanToBlockNoteHTML = (html: string): string => {
    const tailwindColorMap: Record<string, string> = {
        "text-gray-500": "bn-color-gray",
        "text-amber-800": "bn-color-brown",
        "text-red-600": "bn-color-red",
        "text-orange-500": "bn-color-orange",
        "text-amber-500": "bn-color-yellow",
        "text-emerald-500": "bn-color-green",
        "text-blue-500": "bn-color-blue",
        "text-purple-500": "bn-color-purple",
        "text-pink-500": "bn-color-pink",
    };

    const tailwindBgMap: Record<string, string> = {
        "bg-gray-100": "bn-background-gray",
        "bg-amber-100/40": "bn-background-brown",
        "bg-red-50": "bn-background-red",
        "bg-orange-50": "bn-background-orange",
        "bg-amber-50": "bn-background-yellow",
        "bg-emerald-50": "bn-background-green",
        "bg-blue-50": "bn-background-blue",
        "bg-purple-50": "bn-background-purple",
        "bg-pink-50": "bn-background-pink",
    };

    let processed = html.replace(/(<(?:p|h1|h2|h3|h4|h5|h6|li|ol|ul|div|strong|b|em|i)[^>]*)/g, (match) => {
        const classMatch = match.match(/class="([^"]*)"/);
        if (!classMatch) return match;

        const classes = classMatch[1].split(/\s+/);
        let remainingClasses: string[] = [];
        let dataAttrs = "";

        classes.forEach((cls) => {
            if (cls === "text-center") dataAttrs += ' data-text-alignment="center"';
            else if (cls === "text-right") dataAttrs += ' data-text-alignment="right"';
            else if (cls === "text-justify") dataAttrs += ' data-text-alignment="justify"';
            else if (cls === "text-left") dataAttrs += ' data-text-alignment="left"';
            else if (cls === "font-bold" || cls === "italic") {
                // Strip font-bold and italic from native formatting tags during BlockNote hydration
            } else if (cls.startsWith("pl-")) {
                const val = parseInt(cls.replace("pl-", ""), 10);
                if (!isNaN(val)) {
                    const level = Math.round(val / 4);
                    remainingClasses.push(`bn-indent-${level}`);
                }
            } else {
                remainingClasses.push(cls);
            }
        });

        let updatedTag = match;
        if (remainingClasses.length > 0) {
            updatedTag = updatedTag.replace(/class="[^"]*"/, `class="${remainingClasses.join(" ")}"`);
        } else {
            updatedTag = updatedTag.replace(/\s+class="[^"]*"/, "");
        }

        if (dataAttrs) {
            const tagClose = updatedTag.endsWith("/>") ? "/>" : ">";
            updatedTag = updatedTag.substring(0, updatedTag.length - tagClose.length) + dataAttrs + tagClose;
        }

        return updatedTag;
    });

    processed = processed.replace(/<span\s+([^>]*)>/g, (match, attrs) => {
        const classMatch = attrs.match(/class="([^"]*)"/);
        let remainingAttrs = attrs;
        let classes: string[] = [];

        if (classMatch) {
            classes = classMatch[1].split(/\s+/);
            remainingAttrs = remainingAttrs.replace(/class="[^"]*"/, "");
        }

        let newClasses: string[] = [];
        let styles: string[] = [];

        classes.forEach((cls) => {
            if (cls.startsWith("text-[")) {
                const colorVal = cls.substring(6, cls.length - 1).replace(/_/g, " ");
                styles.push(`color: ${colorVal}`);
            } else if (cls.startsWith("bg-[")) {
                const bgVal = cls.substring(4, cls.length - 1).replace(/_/g, " ");
                styles.push(`background-color: ${bgVal}`);
            } else if (cls === "font-bold") {
                styles.push("font-weight: bold");
            } else if (cls === "italic") {
                styles.push("font-style: italic");
            } else if (tailwindColorMap[cls]) {
                newClasses.push(tailwindColorMap[cls]);
            } else if (tailwindBgMap[cls]) {
                newClasses.push(tailwindBgMap[cls]);
            } else if (cls.trim()) {
                newClasses.push(cls);
            }
        });

        let finalAttrs = remainingAttrs.replace(/\s+/g, " ").trim();
        if (newClasses.length > 0) {
            finalAttrs = `class="${newClasses.join(" ")}" ` + finalAttrs;
        }
        if (styles.length > 0) {
            finalAttrs = `style="${styles.join("; ").trim()};" ` + finalAttrs;
        }

        return `<span ${finalAttrs.trim()}>`.replace(/\s+>/g, ">");
    });

    return processed;
};

export default function BlockNoteEditor({ initialContent, onChange }: { initialContent?: string, onChange?: (content: string) => void }) {
    const editor = useCreateBlockNote();
    const initialized = useRef(false);

    useEffect(() => {
        if (initialContent && !initialized.current) {
            initialized.current = true;
            if (initialContent.trim().startsWith("<")) {
                try {
                    const preparedContent = convertTailwindAndCleanToBlockNoteHTML(initialContent);
                    const parsedBlocks = editor.tryParseHTMLToBlocks(preparedContent);
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
