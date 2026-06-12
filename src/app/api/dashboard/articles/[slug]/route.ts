import { NextResponse } from "next/server";

import {
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

  if (body.mode === "published") {
    await publishArticle(slug, body.article);
  } else {
    await saveDraftArticle(slug, body.article);
  }

  return NextResponse.json({
    ok: true,
    mode: body.mode,
    updatedAt: body.article.updatedAt,
  });
}
