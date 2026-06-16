import { site } from "@/config/site";

const DEFAULT_SUBJECT = "POKIT 문의";

/** 모바일·메일 앱 설치 환경용 */
export function supportMailtoHref(subject = DEFAULT_SUBJECT) {
  return `mailto:${site.supportEmail}?subject=${encodeURIComponent(subject)}`;
}

/** 브라우저에서 바로 메일 작성 화면을 여는 Gmail 링크 */
export function supportGmailHref(subject = DEFAULT_SUBJECT) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: site.supportEmail,
    su: subject,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  );
}
