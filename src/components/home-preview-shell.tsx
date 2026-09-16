"use client";

import { ArticlePreviewModal } from "@/components/article-preview-modal";
import {
  ArticlePreviewProvider,
  useArticlePreview,
} from "@/components/article-preview-context";
import { RoutineToolPreviewModal } from "@/components/routine-tool-preview-modal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { ReactNode } from "react";

type ShellProps = {
  locale: Locale;
  categoryLabels: Dictionary["categories"];
  closeLabel: string;
  addToPokit: Dictionary["article"]["addToPokit"];
  children: ReactNode;
};

function HomePreviewBody({
  categoryLabels,
  closeLabel,
  addToPokit,
  children,
}: Omit<ShellProps, "locale">) {
  const { active } = useArticlePreview();

  return (
    <>
      {children}
      {active?.kind === "article" ? (
        <ArticlePreviewModal
          categoryLabels={categoryLabels}
          closeLabel={closeLabel}
          addToPokit={addToPokit}
        />
      ) : null}
      {active?.kind === "tool" ? (
        <RoutineToolPreviewModal closeLabel={closeLabel} />
      ) : null}
    </>
  );
}

export function HomePreviewShell({
  locale,
  categoryLabels,
  closeLabel,
  addToPokit,
  children,
}: ShellProps) {
  return (
    <ArticlePreviewProvider locale={locale}>
      <HomePreviewBody
        categoryLabels={categoryLabels}
        closeLabel={closeLabel}
        addToPokit={addToPokit}
      >
        {children}
      </HomePreviewBody>
    </ArticlePreviewProvider>
  );
}
