import { defineField, defineType } from "sanity";
import { currentUserInitialValue, languageOptions, submittedByField } from "./shared";

export const song = defineType({
  name: "song",
  title: "Song",
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
        source: (doc: any) => doc.title?.en || doc.title?.zh || doc.title?.nl || "song",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "artist",
      title: "Artist / group",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "streamingUrl",
      title: "Streaming URL",
      description: "YouTube, Vimeo, Spotify, SoundCloud, Bandcamp, or another public streaming link.",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["https"],
        }),
    }),
    defineField({
      name: "videoUrl",
      title: "Optional lyrics video URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["https"],
        }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
    }),
    defineField({
      name: "lyricsInVideo",
      title: "Lyrics visible in the video",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "lyricsLanguages",
      title: "Lyrics languages",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: languageOptions,
        layout: "tags",
      },
    }),
    defineField({
      name: "audioLanguages",
      title: "Audio languages",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: languageOptions,
        layout: "tags",
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "lyricsText",
      title: "Lyrics text",
      description: "Optional. Add lyrics here if they should be searchable.",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "lyricsUrl",
      title: "Lyrics document URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["https"],
        }),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Worship", "Hymn", "Reflection", "Event", "Other"],
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
      description: "Optional words that should make this song easier to find.",
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
      subtitle: "artist",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled song",
        subtitle,
      };
    },
  },
});
