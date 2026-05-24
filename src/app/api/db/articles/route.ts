import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { Article, ArticleBlock } from "@/types/article";

// GET /api/db/articles - List paginated articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") || undefined;

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid pagination parameters",
          },
        },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const total = await prisma.articles.count({
      where: status ? { status, deleted_at: null } : { deleted_at: null },
    });

    const dbArticles = await prisma.articles.findMany({
      where: status ? { status, deleted_at: null } : { deleted_at: null },
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    });

    // Transform database models to Article interface
    const transformedArticles: Article[] = dbArticles.map((art) => {
      let parsedBlocks: ArticleBlock[] = [];
      try {
        if (art.blocks) {
          parsedBlocks = typeof art.blocks === "string" 
            ? JSON.parse(art.blocks) 
            : (art.blocks as unknown as ArticleBlock[]);
        }
      } catch (e) {
        console.error("Failed to parse blocks JSON for article:", art.id, e);
      }

      // Check if layouts is a serialized JSON array or a plain string
      let parsedLayouts: string | string[] = art.layouts || "1";
      if (art.layouts && (art.layouts.startsWith("[") || art.layouts.startsWith("{"))) {
        try {
          parsedLayouts = JSON.parse(art.layouts);
        } catch (e) {
          // Fallback to plain string if JSON parse fails
        }
      }

      return {
        id: art.id,
        title: art.title,
        slug: art.slug,
        layouts: parsedLayouts,
        summary: art.description || "",
        description: art.description || "",
        content: art.content || "",
        thumbnail: art.thumbnail || "",
        createdAt: art.created_at.toISOString(),
        updatedAt: art.updated_at.toISOString(),
        blocks: parsedBlocks,
        seoTitle: art.seo_title || undefined,
        seoDescription: art.seo_description || undefined,
        seoKeywords: art.seo_keywords || undefined,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        data: transformedArticles,
        meta: {
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore: page < totalPages,
          },
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma articles GET failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to fetch articles",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/db/articles - Create an article
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      description,
      thumbnail,
      layouts,
      content,
      blocks,
      status = "draft",
      seoTitle,
      seoDescription,
      seoKeywords,
      category_id,
      created_by,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Title and slug are required fields",
          },
        },
        { status: 400 }
      );
    }

    // Format layouts to string (if array, serialize it; otherwise keep as string)
    const formattedLayouts = typeof layouts === "object" ? JSON.stringify(layouts) : String(layouts);

    // Create new article
    const articleId = id || `post-uuid-${Date.now()}`;

    const createdArticle = await prisma.articles.create({
      data: {
        id: articleId,
        title,
        slug,
        description: description || null,
        thumbnail: thumbnail || null,
        layouts: formattedLayouts,
        content: content || null,
        blocks: blocks ? (blocks as any) : null,
        status,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        seo_keywords: seoKeywords || null,
        category_id: category_id || null,
        created_by: created_by || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Format response conforming to Article interface
    let parsedBlocks: ArticleBlock[] = [];
    try {
      if (createdArticle.blocks) {
        parsedBlocks = typeof createdArticle.blocks === "string"
          ? JSON.parse(createdArticle.blocks)
          : (createdArticle.blocks as unknown as ArticleBlock[]);
      }
    } catch (e) {
      // Ignored
    }

    let parsedLayouts: string | string[] = createdArticle.layouts || "1";
    if (createdArticle.layouts && (createdArticle.layouts.startsWith("[") || createdArticle.layouts.startsWith("{"))) {
      try {
        parsedLayouts = JSON.parse(createdArticle.layouts);
      } catch (e) {
        // Ignored
      }
    }

    const transformed: Article = {
      id: createdArticle.id,
      title: createdArticle.title,
      slug: createdArticle.slug,
      layouts: parsedLayouts,
      summary: createdArticle.description || "",
      description: createdArticle.description || "",
      content: createdArticle.content || "",
      thumbnail: createdArticle.thumbnail || "",
      createdAt: createdArticle.created_at.toISOString(),
      updatedAt: createdArticle.updated_at.toISOString(),
      blocks: parsedBlocks,
      seoTitle: createdArticle.seo_title || undefined,
      seoDescription: createdArticle.seo_description || undefined,
      seoKeywords: createdArticle.seo_keywords || undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: transformed,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma articles POST failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to save article",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}
