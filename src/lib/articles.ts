import { news, type NewsItem } from "@/data/news";
import { getCmsStoreSnapshot } from "@/lib/cmsStore";

export async function getAllPublishedArticles(): Promise<NewsItem[]> {
  const store = await getCmsStoreSnapshot();
  const storedArticles = Object.values(store.published);
  const articles = new Map<string, NewsItem>();

  storedArticles.reverse().forEach((article) => {
    articles.set(article.slug, article);
  });

  news.forEach((article) => {
    if (articles.has(article.slug)) return;

    articles.set(article.slug, article);
  });

  return Array.from(articles.values());
}
