import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { allProjects } from "./data/personal";
import { Skill } from "./data/skills";

const projectIds = new Set(allProjects.map(({ id }) => id));
const blogReference = z.discriminatedUnion("type", [
  z.object({ type: z.literal("skill"), value: z.nativeEnum(Skill) }),
  z.object({
    type: z.literal("project"),
    value: z.string().refine((value) => projectIds.has(value), "Project reference must match an existing project id"),
  }),
  z.object({ type: z.literal("topic"), value: z.string().trim().min(1) }),
]);

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(blogReference).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
