import { defineField, defineType } from "sanity";

export const topicalStudy = defineType({
  name: "topicalStudy",
  title: "Topical study",
  type: "document",
  orderings: [
    {
      title: "Date, newest first",
      name: "dateDesc",
      by: [
        { field: "date", direction: "desc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Title, A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
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
        source: (doc: any) => doc.title || "topical-study",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
      options: {
        accept:
          "application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      fileName: "file.asset.originalFilename",
    },
    prepare({ title, date, fileName }) {
      return {
        title: title || "Untitled topical study",
        subtitle: [date, fileName].filter(Boolean).join(" - ") || "Resource file",
      };
    },
  },
});
