import { defineField, defineType } from "sanity";

export const discoverLifeDate = defineType({
  name: "discoverLifeDate",
  title: "Discover Life evening",
  type: "document",
  orderings: [
    {
      title: "Date, oldest first",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      date: "date",
    },
    prepare({ date }) {
      return {
        title: date ? `Discover Life - ${date}` : "Discover Life evening",
      };
    },
  },
});
