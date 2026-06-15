import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { NewsItem } from "@/data/news";

export type CmsArticlePayload = Pick<
  NewsItem,
  | "title"
  | "slug"
  | "category"
  | "author"
  | "date"
  | "image"
  | "excerpt"
  | "description"
  | "content"
> & {
  updatedAt: string;
};

type CmsStore = {
  drafts: Record<string, CmsArticlePayload>;
  published: Record<string, CmsArticlePayload>;
};

const storePath = path.join(process.cwd(), "src", "data", "cms-store.json");

const emptyStore: CmsStore = {
  drafts: {},
  published: {},
};

async function readStore(): Promise<CmsStore> {
  try {
    const file = await readFile(storePath, "utf8");
    return { ...emptyStore, ...JSON.parse(file) } as CmsStore;
  } catch {
    return emptyStore;
  }
}

async function writeStore(store: CmsStore) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

export async function getDraftArticle(slug: string) {
  const store = await readStore();
  return store.drafts[slug] ?? null;
}

export async function getPublishedArticle(slug: string) {
  const store = await readStore();
  return store.published[slug] ?? null;
}

export async function getCmsStoreSnapshot() {
  return readStore();
}

export async function getStoredArticle(slug: string) {
  const store = await readStore();
  return store.drafts[slug] ?? store.published[slug] ?? null;
}

export async function getStoredArticles() {
  const store = await readStore();
  const articles = new Map<string, CmsArticlePayload>();

  Object.entries(store.published).forEach(([slug, article]) => {
    articles.set(slug, article);
  });

  Object.entries(store.drafts).forEach(([slug, article]) => {
    articles.set(slug, article);
  });

  return Array.from(articles.values());
}

export async function saveDraftArticle(
  slug: string,
  article: CmsArticlePayload
) {
  const store = await readStore();
  store.drafts[slug] = article;
  await writeStore(store);
}

export async function publishArticle(
  slug: string,
  article: CmsArticlePayload
) {
  const store = await readStore();
  store.published[slug] = article;
  delete store.drafts[slug];
  await writeStore(store);
}
