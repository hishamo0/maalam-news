import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import { news } from "@/data/news";
import { getDraftArticle, getStoredArticle, getStoredArticles } from "@/lib/cmsStore";
import EditArticleForm from "./EditArticleForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article =
    news.find((item) => item.slug === slug) ?? (await getStoredArticle(slug));

  return {
    title: article ? `تحرير ${article.title} | Maalam.net` : "تحرير مقال",
  };
}

export default async function EditArticlePage({ params }: Props) {
  const { slug } = await params;
  const article =
    news.find((item) => item.slug === slug) ?? (await getStoredArticle(slug));

  if (!article) {
    notFound();
  }

  const draftArticle = await getDraftArticle(article.slug);
  const editableArticle = draftArticle
    ? {
        ...article,
        ...draftArticle,
      }
    : article;

  const storedArticles = await getStoredArticles();
  const articles = [...storedArticles, ...news].filter(
    (item, index, list) =>
      list.findIndex((current) => current.slug === item.slug) === index
  );

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/10 bg-[#0d0d0f]">
        <div className="mx-auto flex max-w-7xl min-w-0 flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white"
            >
              <ArrowRight size={17} />
              <span>لوحة التحكم</span>
            </Link>
            <h1 className="mt-3 text-2xl font-black md:text-3xl">
              تحرير المقال
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400 [overflow-wrap:anywhere]">
              {article.title}
            </p>
          </div>

          <Link
            href={`/news/${article.slug}`}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 border border-white/10 px-4 text-sm font-black hover:bg-white/5"
          >
            <ExternalLink size={17} />
            <span>فتح المقال</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto min-w-0 max-w-7xl overflow-visible px-4 py-6 md:px-8">
        <EditArticleForm
          article={editableArticle}
          articles={articles}
          hasDraft={Boolean(draftArticle)}
        />
      </div>
    </main>
  );
}
