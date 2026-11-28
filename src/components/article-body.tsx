import { PortableText, type PortableTextComponents } from "next-sanity";

import type { ArticleBodyBlock, ArticleTableBlock } from "@/sanity/types";

const components: PortableTextComponents = {
  types: {
    articleTable: ({ value }: { value: ArticleTableBlock }) => {
      const { caption, headers, rows } = value;
      if (!headers?.length || !rows?.length) return null;

      return (
        <div className="my-6 max-w-full overflow-x-auto">
          <table className="my-0 w-full text-start">
            {caption && <caption className="mb-2 text-start font-medium">{caption}</caption>}
            <thead>
              <tr>
                {headers.map((header, column) => (
                  <th key={column} scope="col">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._key}>
                  {headers.map((_, column) => <td key={column}>{row.cells?.[column]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

export function ArticleBody({ value }: { value: ArticleBodyBlock[] }) {
  return <PortableText value={value} components={components} />;
}
