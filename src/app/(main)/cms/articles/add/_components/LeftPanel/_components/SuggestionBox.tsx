import React from "react";
import { HelpCircle } from "lucide-react";
import { useArticleEditorStore } from "../../../_store/useArticleEditorStore";

export const SuggestionBox: React.FC = () => {
  const { activeInput, blocks } = useArticleEditorStore();

  const getSuggestionText = () => {
    if (activeInput && activeInput.startsWith("block-")) {
      const block = blocks.find((b) => b.id === activeInput);
      return {
        title: `Align Element: ${block?.type === "heading" ? "Heading" : block?.type === "image" ? "Image" : "Paragraph"}`,
        text: "Use the position controls (Up/Down) to reorder elements. Formatting alignments (Left/Center/Right) will update live on the central news article detail preview."
      };
    }

    switch (activeInput) {
      case "title":
        return {
          title: "Article Title",
          text: "Briefly describe the article. Maintain a length between 50 - 120 characters to optimize visual display and reader click rates."
        };
      case "slug":
        return {
          title: "Article URL Slug",
          text: "The static URL route of the article. Generated automatically from the title. Can be edited manually to be more concise. Only lowercase letters, numbers, and hyphens allowed."
        };
      case "category":
        return {
          title: "News Category",
          text: "Select the most relevant category to automatically organize the article in the correct channel on the website portal."
        };
      case "tags":
        return {
          title: "Article Tags",
          text: "Assign main keyword tags for the article. This helps link articles of similar subtopics and improves the internal SEO link structure."
        };
      case "thumbnail":
        return {
          title: "Article Cover Image",
          text: "Select an image with a standard aspect ratio (usually 3:2 or 16:9). Ensure high resolution, clear imagery, and direct relevance to the article."
        };
      case "summary":
        return {
          title: "Article Summary",
          text: "Enter a brief summary of 30 - 200 words to display on the home or category pages, helping readers quickly grasp the topic before opening it."
        };
      case "seoTitle":
        return {
          title: "SEO Title (Google Title)",
          text: "The title that displays directly on search engine results. Keep between 50 - 70 characters so it doesn't get cut off with ellipses."
        };
      case "seoDescription":
        return {
          title: "SEO Description (Snippet)",
          text: "The short description snippet below the search title. Ideally 120 - 160 characters. Include key search terms to boost Click-Through Rate (CTR)."
        };
      case "seoKeywords":
        return {
          title: "SEO Keywords",
          text: "Key search keywords describing the main theme of the article, separated by commas, making it easy for search bots to index."
        };
      default:
        return {
          title: "Input Helper Suggestions",
          text: "Click or focus on any input field in the right panel to display detailed writing tips and SEO optimization guidelines here."
        };
    }
  };

  const { title, text } = getSuggestionText();

  return (
    <div className="bg-linear-to-b from-orange-50/20 to-amber-50/10 p-3.5 rounded-2xl border border-orange-100/30">
      <span className="text-[9.5px] font-extrabold text-orange-600 uppercase tracking-wide flex items-center gap-1">
        <HelpCircle size={12} className="text-orange-500 shrink-0" />
        {title}
      </span>
      <p className="text-[9.5px] font-semibold text-slate-500 leading-relaxed mt-1">{text}</p>
    </div>
  );
};
