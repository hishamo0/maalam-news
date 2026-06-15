import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { news, type NewsItem } from "@/data/news";
import { getStoredArticles } from "@/lib/cmsStore";
import EditArticleForm from "../[slug]/edit/EditArticleForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مقال جديد | Maalam.net",
};

const createEmptyArticle = (): NewsItem => ({
  title: "مقال جديد",
  slug: "new-article",
  category: "تكنولوجيا",
  author: "هيئة التحرير",
  date: new Date().toLocaleDateString("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  image: "/MAALAM_LOGO.png",
  excerpt: "",
  description: "",
  content: "<p>اكتب محتوى المقال هنا...</p>",
});

export default async function NewArticlePage() {
  const storedArticles = await getStoredArticles();
  const articles = [...storedArticles, ...news].filter(
    (item, index, list) =>
      list.findIndex((article) => article.slug === item.slug) === index
  );
  const article = createEmptyArticle();

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
              إنشاء مقال جديد
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-400">
              اكتب بيانات المقال ثم احفظه كمسودة أو انشره.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto min-w-0 max-w-7xl overflow-visible px-4 py-6 md:px-8">
        <EditArticleForm article={article} articles={articles} hasDraft={false} />
      </div>
    </main>
  );
}
