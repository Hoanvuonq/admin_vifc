import { ArticleEditor } from "../../add/_pages";
import { use } from "react";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <ArticleEditor articleId={id} />;
}
