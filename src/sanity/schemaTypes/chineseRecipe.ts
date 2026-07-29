import { defineField, defineType } from "sanity";

export const chineseRecipe = defineType({
  name: "chineseRecipe",
  title: "Chinese recipe",
  type: "document",
  orderings: [
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
        source: (doc: any) => doc.title || "recipe",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "file",
      title: "Recipe PDF",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      fileName: "file.asset.originalFilename",
    },
    prepare({ title, fileName }) {
      return {
        title: title || "Untitled recipe",
        subtitle: fileName || "PDF recipe",
      };
    },
  },
});
