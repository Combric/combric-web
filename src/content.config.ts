import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  snapshots: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/snapshots" }),
    schema: docsSchema(),
  }),
};
