import { NextResponse } from "next/server";

import {
  deleteDraftArticle,
  publishArticle,
  saveDraftArticle,
  type CmsArticlePayload,
} from "@/lib/cmsStore";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type SaveRequest = {
  mode: "draft" | "published";
  article: CmsArticlePayload;
};

export async function POST(request: Request, { params }: Props) {
  const { slug } = await params;
  const body = (await request.json()) as SaveRequest;

  if (!body.article || !["draft", "published"].includes(body.mode)) {
    return NextResponse.json(
      { error: "Invalid article save request." },
      { status: 400 }
    );
  }

  const articleSlug = body.article.slug?.trim() || slug;

  if (body.mode === "published") {
    await publishArticle(articleSlug, body.article);
  } else {
    await saveDraftArticle(articleSlug, body.article);
  }

  return NextResponse.json({
    ok: true,
    mode: body.mode,
    slug: articleSlug,
    updatedAt: body.article.updatedAt,
  });
}

export async function DELETE(_request: Request, { params }: Props) {
  const { slug } = await params;

  await deleteDraftArticle(slug);

  return NextResponse.json({
    ok: true,
    mode: "draft-deleted",
    slug,
  });
}
