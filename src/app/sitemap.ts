import type { MetadataRoute } from "next";
import { news } from "@/data/news";

export default function sitemap(): MetadataRoute.Sitemap {

  const articles = news.map((article) => ({
    url: `https://maalam.net/article/${article.slug}`,
    lastModified: new Date(),
  }));

  return [

    {
      url: "https://maalam.net",
      lastModified: new Date(),
    },

    {
      url: "https://maalam.net/about",
      lastModified: new Date(),
    },

    {
      url: "https://maalam.net/contact",
      lastModified: new Date(),
    },

    {
      url: "https://maalam.net/privacy-policy",
      lastModified: new Date(),
    },

    ...articles,

  ];
}