import { createClient } from "@sanity/client";

export const sanityProjectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "";
export const sanityDataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
export const hasSanityConfig = Boolean(
  sanityProjectId &&
    sanityProjectId !== "placeholder" &&
    sanityProjectId !== "yourprojectid",
);

export const sanityClient = createClient({
  projectId: sanityProjectId || "placeholder",
  dataset: sanityDataset,
  apiVersion: "2026-05-01",
  useCdn: import.meta.env.PUBLIC_SANITY_USE_CDN === "true",
  token: import.meta.env.SANITY_API_TOKEN,
});
