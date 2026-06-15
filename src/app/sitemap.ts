import type { MetadataRoute } from "next";
import { getAllPublishedArticles } from "@/lib/articles";

/* =========================================================
   Sitemap.xml
========================================================= */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  /* =====================================================
     روابط المقالات
  ===================================================== */

  const publishedArticles = await getAllPublishedArticles();
  const articles = publishedArticles.map((article) => ({

    url: `https://maalam.net/news/${article.slug}`,

    lastModified: new Date(),

    changeFrequency: "daily" as const,

    priority: 0.8,

  }));

  /* =====================================================
     جميع صفحات الموقع
  ===================================================== */

  return [

    {
      url: "https://maalam.net",

      lastModified: new Date(),

      changeFrequency: "daily",

      priority: 1,
    },

    {
      url: "https://maalam.net/about",

      lastModified: new Date(),

      changeFrequency: "monthly",

      priority: 0.5,
    },

    {
      url: "https://maalam.net/contact",

      lastModified: new Date(),

      changeFrequency: "monthly",

      priority: 0.4,
    },

    {
      url: "https://maalam.net/privacy-policy",

      lastModified: new Date(),

      changeFrequency: "yearly",

      priority: 0.3,
    },

    ...articles,

  ];

}
