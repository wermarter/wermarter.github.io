import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { publicProfileData } from "../data/personal";

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog"))
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf())
    .map((post) => ({
      id: post.id,
      url: post.data.draft ? null : `/blog/${post.id}/`,
      ...post.data,
      publishedAt: post.data.publishedAt.toISOString(),
      updatedAt: post.data.updatedAt?.toISOString() ?? null,
      content: post.body ?? "",
    }));

  return new Response(JSON.stringify({ schemaVersion: "4.0.0", ...publicProfileData, blog: posts }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
