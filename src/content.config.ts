import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  category: z.string(),
  summary: z.string(),
  author: z.string(),
  thumbnail: z.string().optional().default(""),
  pinned: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  slug: z.string()
});

export const collections = {
  notices: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./content/notices" }),
    schema: postSchema
  }),
  activities: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./content/activities" }),
    schema: postSchema
  })
};
