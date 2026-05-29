import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const env = import.meta.env;

export default defineConfig({
  name: "csmn",
  title: "CSMN",
  projectId: env.PUBLIC_SANITY_PROJECT_ID || env.SANITY_STUDIO_PROJECT_ID || "placeholder",
  dataset: env.PUBLIC_SANITY_DATASET || env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
