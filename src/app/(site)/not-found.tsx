import Link from "next/link";

import { cn, monoContainer } from "@/lib/cn";

export default function SiteNotFound() {
  return (
    <main className={cn(monoContainer, "py-16 pb-24 text-center")}>
      <p className="m-0 font-sans text-[0.72rem] font-extrabold tracking-[0.1em] text-green uppercase">
        404
      </p>
      <h1 className="mt-3 mb-0 text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-[-0.04em]">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mx-auto mt-4 mb-0 max-w-md font-sans text-[0.95rem] text-muted">
        주소가 바뀌었거나 삭제된 페이지일 수 있습니다.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 font-sans text-[0.9rem]">
        <Link href="/" className="text-green hover:underline">
          홈으로
        </Link>
        <Link href="/articles" className="text-green hover:underline">
          모든 이야기
        </Link>
      </div>
    </main>
  );
}
