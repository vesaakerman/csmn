import { defineField, defineType } from "sanity";
import { currentUserInitialValue, submittedByField } from "./shared";

const videoLanguageOptions = [
  { title: "English", value: "en" },
  { title: "Chinese", value: "zh" },
  { title: "Dutch", value: "nl" },
];

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  initialValue: currentUserInitialValue,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: any) => doc.title || "video",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "videoUrl",
      title: "YouTube or Vimeo URL",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["https"],
        }),
    }),
    defineField({
      name: "thumbnail",
      title: "Custom thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: videoLanguageOptions,
        layout: "radio",
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "searchTerms",
      title: "Extra search terms",
      description: "Optional words that should make this video easier to find.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
    }),
    defineField({
      name: "featured",
      title: "Featured on overview pages",
      type: "boolean",
      initialValue: false,
    }),
    submittedByField(),
    defineField({ name: "provider", title: "Legacy provider", type: "string", hidden: true }),
    defineField({ name: "category", title: "Legacy category", type: "string", hidden: true }),
    defineField({ name: "speaker", title: "Legacy speaker", type: "string", hidden: true }),
    defineField({
      name: "languages",
      title: "Legacy languages",
      type: "array",
      of: [{ type: "string" }],
      hidden: true,
    }),
    defineField({
      name: "themes",
      title: "Legacy themes",
      type: "array",
      of: [{ type: "string" }],
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "videoUrl",
      media: "thumbnail",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled video",
        subtitle,
        media,
      };
    },
  },
});
