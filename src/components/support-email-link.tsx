"use client";

import type { ReactNode } from "react";

import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import {
  isTouchDevice,
  supportGmailHref,
  supportMailtoHref,
} from "@/lib/support-mail";

type SupportEmailLinkProps = {
  className?: string;
  children?: ReactNode;
  variant?: "link" | "button";
};

export function SupportEmailLink({
  className,
  children,
  variant = "link",
}: SupportEmailLinkProps) {
  const label = children ?? site.supportEmail;

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (isTouchDevice()) return;

    event.preventDefault();
    window.open(supportGmailHref(), "_blank", "noopener,noreferrer");
  }

  return (
    <a
      href={supportMailtoHref()}
      className={cn(
        variant === "link" &&
          "cursor-pointer underline underline-offset-[0.18em]",
        variant === "button" &&
          "inline-flex min-h-12 items-center justify-center border-2 border-black bg-green px-6 font-sans text-[0.82rem] font-extrabold tracking-[0.06em] text-white no-underline hover:brutal-shadow-mint",
        className,
      )}
      onClick={handleClick}
    >
      {label}
    </a>
  );
}
