import { defineField } from "sanity";

export const languageOptions = [
  { title: "English", value: "en" },
  { title: "Chinese", value: "zh" },
  { title: "Dutch", value: "nl" },
  { title: "Other", value: "other" },
];

export function submittedByField() {
  return defineField({
    name: "submittedBy",
    title: "Submitted by",
    type: "object",
    readOnly: true,
    fields: [
      defineField({ name: "userId", title: "User ID", type: "string" }),
      defineField({ name: "name", title: "Name", type: "string" }),
      defineField({ name: "email", title: "Email", type: "string" }),
    ],
    options: {
      collapsible: true,
      collapsed: true,
    },
  });
}

export function currentUserInitialValue(_: unknown, context: any) {
  const currentUser = context?.currentUser;

  return {
    publishedAt: new Date().toISOString(),
    submittedBy: {
      userId: currentUser?.id,
      name: currentUser?.name,
      email: currentUser?.email,
    },
  };
}
