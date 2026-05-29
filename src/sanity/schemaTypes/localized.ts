import { defineField, defineType } from "sanity";

const languageFields = [
  defineField({
    name: "en",
    title: "English",
    type: "string",
  }),
  defineField({
    name: "zh",
    title: "Chinese",
    type: "string",
  }),
  defineField({
    name: "nl",
    title: "Dutch",
    type: "string",
  }),
];

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized text",
  type: "object",
  fields: languageFields,
});

export const localizedText = defineType({
  name: "localizedText",
  title: "Localized long text",
  type: "object",
  fields: languageFields.map((field) => ({
    ...field,
    type: "text",
    rows: 4,
  })),
});
