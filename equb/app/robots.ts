import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const s = process.env.SITE_URL || "http://localhost:3000";
  return { rules: { userAgent: "*", allow: "/", disallow: ["/groups", "/api"] }, sitemap: `${s}/sitemap.xml` };
}
