"use client";

import { ArticlePreviewModal } from "@/components/article-preview-modal";
import {
  ArticlePreviewProvider,
  useArticlePreview,
} from "@/components/article-preview-context";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { ReactNode } from "react";

type ShellProps = {
  locale: Locale;
  categoryLabels: Dictionary["categories"];
  closeLabel: string;
  children: ReactNode;
};

function HomePreviewBody({
  categoryLabels,
  closeLabel,
  children,
}: Omit<ShellProps, "locale">) {
  const { active } = useArticlePreview();

  return (
    <>
      {children}
      {active ? (
        <ArticlePreviewModal
          categoryLabels={categoryLabels}
          closeLabel={closeLabel}
        />
      ) : null}
    </>
  );
}

export function HomePreviewShell({
  locale,
  categoryLabels,
  closeLabel,
  children,
}: ShellProps) {
  return (
    <ArticlePreviewProvider locale={locale}>
      <HomePreviewBody categoryLabels={categoryLabels} closeLabel={closeLabel}>
        {children}
      </HomePreviewBody>
    </ArticlePreviewProvider>
  );
}
