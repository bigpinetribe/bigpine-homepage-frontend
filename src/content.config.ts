import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const departments = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/departments" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    staff: z.array(z.object({
      name: z.string(),
      title: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      photo: z.string().optional(),
    })).optional().default([]),
    documents: z.array(z.object({
      title: z.string(),
      url: z.string(),
      description: z.string().optional(),
    })).optional().default([]),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    category: z.enum(["News", "Event", "Announcement", "Meeting"]).optional(),
  }),
});

export const collections = {
  departments,
  news,
};
