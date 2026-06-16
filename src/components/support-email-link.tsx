"use client";

import type { ReactNode } from "react";
import { site } from "@/config/site";
import {
  isTouchDevice,
  supportGmailHref,
  supportMailtoHref,
} from "@/lib/support-mail";

type SupportEmailLinkProps = {
  className?: string;
  children?: ReactNode;
};

export function SupportEmailLink({
  className,
  children,
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
      className={className}
      onClick={handleClick}
    >
      {label}
    </a>
  );
}
