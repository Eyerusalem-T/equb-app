import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
export default function sitemap(): MetadataRoute.Sitemap {
  const s = process.env.SITE_URL || "http://localhost:3000";
  return [{ url: s }, { url: `${s}/signin` }, { url: `${s}/signup` }, ...db.publicSlugs().map((slug) => ({ url: `${s}/g/${slug}` }))];
}
