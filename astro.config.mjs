import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import { adminPreloadScript } from "./src/sanity/adminPreloadScript.js";

const base = "/";
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";
const useCdn = process.env.PUBLIC_SANITY_USE_CDN === "true";

const beforeHydrationScript = {
  name: "csmn-before-hydration-script",
  hooks: {
    "astro:config:setup": ({ injectScript }) => {
      injectScript("before-hydration", adminPreloadScript);
    },
  },
};

export default defineConfig({
  output: "static",
  base,
  devToolbar: {
    enabled: false,
  },
  integrations: [
    beforeHydrationScript,
    react(),
    sanity({
      projectId,
      dataset,
      useCdn,
      studioBasePath: "/admin",
    }),
  ],
  vite: {
    optimizeDeps: {
      exclude: ["sanity/lib/_chunks-es/ViteDevServerStopped.mjs"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$base-url: '${base}';`,
          devSourcemap: true,
        },
      },
    },
  },
});
