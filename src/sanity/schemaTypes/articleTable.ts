import { ThListIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const articleTable = defineType({
  name: "articleTable",
  title: "Table",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "headers",
      title: "Column headers",
      type: "array",
      of: [defineArrayMember({ type: "string", validation: (rule) => rule.required() })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          name: "articleTableRow",
          title: "Row",
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [defineArrayMember({ type: "string", validation: (rule) => rule.required() })],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "cells.0" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).custom((rows, context) => {
        const headers = (context.parent as { headers?: string[] } | undefined)?.headers;
        if (!rows || !headers?.length) return true;

        return rows.every((row) =>
          row && typeof row === "object" && "cells" in row
          && Array.isArray(row.cells) && row.cells.length === headers.length,
        )
          || "Each row must have one cell per column header.";
      }),
    }),
  ],
  preview: {
    select: { title: "caption" },
    prepare: ({ title }) => ({ title: title || "Table" }),
  },
});
