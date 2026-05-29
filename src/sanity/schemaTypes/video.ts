import { defineField, defineType } from "sanity";
import { currentUserInitialValue, languageOptions, submittedByField } from "./shared";

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  initialValue: currentUserInitialValue,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: any) => doc.title?.en || doc.title?.zh || doc.title?.nl || "video",
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
      name: "provider",
      title: "Video provider",
      type: "string",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
          { title: "Other", value: "external" },
        ],
        layout: "radio",
      },
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
      type: "localizedText",
    }),
    defineField({
      name: "speaker",
      title: "Contributor / artist / speaker",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Discover Life",
          "Fellowship",
          "Testimony",
          "Teaching",
          "Music",
          "Event",
          "Other",
        ],
      },
    }),
    defineField({
      name: "languages",
      title: "Languages in the video",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: languageOptions,
        layout: "tags",
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "themes",
      title: "Themes",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
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
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "category",
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
