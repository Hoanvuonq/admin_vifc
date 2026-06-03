import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { Article, ArticleBlock } from "@/types/article";

// GET /api/db/articles/[id] - Retrieve single article details
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Article ID is required",
          },
        },
        { status: 400 },
      );
    }

    const art = await prisma.articles.findUnique({
      where: { id },
    });

    if (!art || art.deleted_at !== null) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Article not found",
          },
        },
        { status: 404 },
      );
    }

    // Transform database model to Article interface
    let parsedBlocks: ArticleBlock[] = [];
    try {
      if (art.blocks) {
        parsedBlocks =
          typeof art.blocks === "string"
            ? JSON.parse(art.blocks)
            : (art.blocks as unknown as ArticleBlock[]);
      }
    } catch (e) {
      console.error("Failed to parse blocks JSON for article:", art.id, e);
    }

    let parsedLayouts: string | string[] = art.layouts || "1";
    if (
      art.layouts &&
      (art.layouts.startsWith("[") || art.layouts.startsWith("{"))
    ) {
      try {
        parsedLayouts = JSON.parse(art.layouts);
      } catch (e) {
        // Ignored
      }
    }

    const transformed: Article = {
      id: art.id,
      title: art.title,
      slug: art.slug,
      layouts: parsedLayouts,
      description: art.description || "",
      thumbnail: art.thumbnail || "",
      createdAt: art.created_at.toISOString(),
      updatedAt: art.updated_at.toISOString(),
      blocks: parsedBlocks,
      seoTitle: art.seo_title || undefined,
      seoDescription: art.seo_description || undefined,
      seoKeywords: art.seo_keywords || undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: transformed,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Prisma article GET by ID failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to fetch article details",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}

// DELETE /api/db/articles/[id] - Permanently delete an article
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Article ID is required",
          },
        },
        { status: 400 },
      );
    }

    // Perform hard delete from database
    await prisma.articles.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Article deleted successfully from database",
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Prisma article DELETE failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to delete article",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}

// PUT /api/db/articles/[id] - Update an existing article
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      slug,
      description,
      thumbnail,
      layouts,
      blocks,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
      category_id,
      created_by,
    } = body;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Article ID is required",
          },
        },
        { status: 400 },
      );
    }

    // Check if layouts is an object (array) and serialize it, otherwise keep as string
    const formattedLayouts =
      typeof layouts === "object"
        ? JSON.stringify(layouts)
        : layouts !== undefined
          ? String(layouts)
          : undefined;

    let finalCategoryId: string | null | undefined = undefined;
    if (category_id !== undefined) {
      if (category_id) {
        if (category_id.length === 36 && category_id.includes("-")) {
          finalCategoryId = category_id;
        } else {
          let cat = await prisma.categories.findFirst({
            where: { name: { equals: category_id, mode: "insensitive" } },
          });
          if (!cat) {
            cat = await prisma.categories.create({
              data: { name: category_id },
            });
          }
          finalCategoryId = cat.id;
        }
      } else {
        finalCategoryId = null;
      }
    }

    let uniqueSlug = slug;
    if (slug) {
      let counter = 1;
      while (true) {
        const existing = await prisma.articles.findFirst({
          where: { slug: uniqueSlug, NOT: { id }, deleted_at: null },
        });
        if (!existing) break;
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
    }

    const updatedArticle = await prisma.articles.update({
      where: { id },
      data: {
        title,
        slug: uniqueSlug,
        description:
          description !== undefined ? description || null : undefined,
        thumbnail: thumbnail !== undefined ? thumbnail || null : undefined,
        layouts: formattedLayouts,
        blocks:
          blocks !== undefined ? (blocks ? (blocks as any) : null) : undefined,
        status,
        seo_title: seoTitle !== undefined ? seoTitle || null : undefined,
        seo_description:
          seoDescription !== undefined ? seoDescription || null : undefined,
        seo_keywords:
          seoKeywords !== undefined ? seoKeywords || null : undefined,
        category_id: finalCategoryId,
        created_by: created_by !== undefined ? created_by || null : undefined,
        updated_at: new Date(),
      },
    });

    // Format response conforming to Article interface
    let parsedBlocks: ArticleBlock[] = [];
    try {
      if (updatedArticle.blocks) {
        parsedBlocks =
          typeof updatedArticle.blocks === "string"
            ? JSON.parse(updatedArticle.blocks)
            : (updatedArticle.blocks as unknown as ArticleBlock[]);
      }
    } catch (e) {
      // Ignored
    }

    let parsedLayouts: string | string[] = updatedArticle.layouts || "1";
    if (
      updatedArticle.layouts &&
      (updatedArticle.layouts.startsWith("[") ||
        updatedArticle.layouts.startsWith("{"))
    ) {
      try {
        parsedLayouts = JSON.parse(updatedArticle.layouts);
      } catch (e) {
        // Ignored
      }
    }

    const transformed: Article = {
      id: updatedArticle.id,
      title: updatedArticle.title,
      slug: updatedArticle.slug,
      layouts: parsedLayouts,
      description: updatedArticle.description || "",
      thumbnail: updatedArticle.thumbnail || "",
      createdAt: updatedArticle.created_at.toISOString(),
      updatedAt: updatedArticle.updated_at.toISOString(),
      blocks: parsedBlocks,
      seoTitle: updatedArticle.seo_title || undefined,
      seoDescription: updatedArticle.seo_description || undefined,
      seoKeywords: updatedArticle.seo_keywords || undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: transformed,
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Prisma article PUT failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to update article details",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
