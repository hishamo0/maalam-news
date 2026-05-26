import { MetadataRoute } from "next";

/* =========================================================
   Robots.txt
========================================================= */

export default function robots(): MetadataRoute.Robots {

  return {

    rules: {

      userAgent: "*",

      allow: "/",

    },

    sitemap: "https://maalam.net/sitemap.xml",

  };

}