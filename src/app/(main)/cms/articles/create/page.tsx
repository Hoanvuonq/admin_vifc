"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArticleEditor } from "./_pages";

function EditorWrapper() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || undefined;
    return <ArticleEditor articleId={id} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div className="p-10 flex justify-center text-gray-500 font-medium">Loading editor...</div>}>
            <EditorWrapper />
        </Suspense>
    );
}
