import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import rehypeNewTabLinks from "./src/plugins/rehype-new-tab-links.mjs";

export default defineConfig({
  site: "https://wermarter.github.io",
  output: "static",
  trailingSlash: "always",
  markdown: {
    processor: unified({ rehypePlugins: [rehypeNewTabLinks] }),
  },
  integrations: [mdx(), react(), sitemap()],
});
