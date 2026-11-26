import { TOOLS } from "@/lib/tools";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pdf-studio.netlify.app";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/tools`, lastModified: new Date() },
    ...TOOLS.map((t) => ({ url: `${base}/tools/${t.slug}`, lastModified: new Date() })),
  ];
}
