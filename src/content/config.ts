import { SITE } from "@config";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
    }),
});

// Documentation collection for Knowledge Base
const docs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["getting-started", "guides", "reference", "faq"]),
    order: z.number().default(999),
    draft: z.boolean().optional().default(false),
    lastUpdated: z.date().optional(),
    sidebar: z
      .object({
        label: z.string().optional(),
        icon: z.string().optional(),
        badge: z.enum(["new", "beta", "deprecated", ""]).optional(),
      })
      .optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

// Services/Booking collection
const services = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.string(),
    duration: z.string().optional(),
    priceType: z.enum(["hourly", "flat", "custom"]).default("hourly"),
    features: z.array(z.string()),
    bookingUrl: z.string().url(),
    order: z.number().default(999),
    highlighted: z.boolean().optional().default(false),
    availability: z.string().optional(),
  }),
});

export const collections = { blog, docs, services };
