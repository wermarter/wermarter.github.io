import type { APIRoute } from "astro";
import { getCvSource } from "../../cv/render";

export const prerender = true;

export const GET: APIRoute = async () => {
  const { latex } = await getCvSource();

  return new Response(latex, {
    headers: {
      "Content-Type": "application/x-tex; charset=utf-8",
    },
  });
};
