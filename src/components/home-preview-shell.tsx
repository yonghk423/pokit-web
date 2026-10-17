"use client";

import type { AppInstallMessages } from "@/i18n/get-app-install-messages";

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
  installMessages: AppInstallMessages;
  toolKicker: string;
  children: ReactNode;
};

function HomePreviewBody({
  closeLabel,
  installMessages,
  toolKicker,
  children,
}: Pick<ShellProps, "closeLabel" | "installMessages" | "toolKicker" | "children">) {
  const { active } = useArticlePreview();

  return (
    <>
      <Suspense fallback={null}>
        <ArticleDeepLink />
        <ToolDeepLink kicker={toolKicker} />
      </Suspense>
      {children}
      {active?.kind === "tool" ? (
        <RoutineToolPreviewModal closeLabel={closeLabel} installMessages={installMessages} />
      ) : null}
    </>
  );
}

export function HomePreviewShell({
  locale,
  closeLabel,
  installMessages,
  toolKicker,
  children,
}: ShellProps) {
  return (
    <ArticlePreviewProvider locale={locale}>
      <HomePreviewBody
        closeLabel={closeLabel}
        installMessages={installMessages}
        toolKicker={toolKicker}
      >
        {children}
      </HomePreviewBody>
    </ArticlePreviewProvider>
  );
}
