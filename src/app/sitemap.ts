import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/letter`,
      lastModified: new Date("2026-02-17"),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}
