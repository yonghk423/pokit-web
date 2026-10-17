"use client";

import { Suspense, type ReactNode } from "react";

import { ArticleDeepLink } from "@/components/article-deep-link";
import {
  ArticlePreviewProvider,
  useArticlePreview,
} from "@/components/article-preview-context";
import { RoutineToolPreviewModal } from "@/components/routine-tool-preview-modal";
import { ToolDeepLink } from "@/components/tool-deep-link";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type ShellProps = {
  locale: Locale;
  closeLabel: string;
  installCopy: Dictionary["article"]["addToPokit"];
  toolKicker: string;
  children: ReactNode;
};

function HomePreviewBody({
  closeLabel,
  installCopy,
  toolKicker,
  children,
}: Pick<ShellProps, "closeLabel" | "installCopy" | "toolKicker" | "children">) {
  const { active } = useArticlePreview();

  return (
    <>
      <Suspense fallback={null}>
        <ArticleDeepLink />
        <ToolDeepLink kicker={toolKicker} />
      </Suspense>
      {children}
      {active?.kind === "tool" ? (
        <RoutineToolPreviewModal closeLabel={closeLabel} installCopy={installCopy} />
      ) : null}
    </>
  );
}

export function HomePreviewShell({
  locale,
  closeLabel,
  installCopy,
  toolKicker,
  children,
}: ShellProps) {
  return (
    <ArticlePreviewProvider locale={locale}>
      <HomePreviewBody
        closeLabel={closeLabel}
        installCopy={installCopy}
        toolKicker={toolKicker}
      >
        {children}
      </HomePreviewBody>
    </ArticlePreviewProvider>
  );
}
