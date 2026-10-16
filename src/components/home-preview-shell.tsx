"use client";

import { Suspense, type ReactNode } from "react";

import { ArticleDeepLink } from "@/components/article-deep-link";
import {
  ArticlePreviewProvider,
  useArticlePreview,
} from "@/components/article-preview-context";
import { RoutineToolPreviewModal } from "@/components/routine-tool-preview-modal";
import { ToolDeepLink } from "@/components/tool-deep-link";
import type { Locale } from "@/i18n/config";

type ShellProps = {
  locale: Locale;
  closeLabel: string;
  toolKicker: string;
  children: ReactNode;
};

function HomePreviewBody({
  closeLabel,
  toolKicker,
  children,
}: Pick<ShellProps, "closeLabel" | "toolKicker" | "children">) {
  const { active } = useArticlePreview();

  return (
    <>
      <Suspense fallback={null}>
        <ArticleDeepLink />
        <ToolDeepLink kicker={toolKicker} />
      </Suspense>
      {children}
      {active?.kind === "tool" ? (
        <RoutineToolPreviewModal closeLabel={closeLabel} />
      ) : null}
    </>
  );
}

export function HomePreviewShell({
  locale,
  closeLabel,
  toolKicker,
  children,
}: ShellProps) {
  return (
    <ArticlePreviewProvider locale={locale}>
      <HomePreviewBody
        closeLabel={closeLabel}
        toolKicker={toolKicker}
      >
        {children}
      </HomePreviewBody>
    </ArticlePreviewProvider>
  );
}
