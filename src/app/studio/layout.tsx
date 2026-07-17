import { fontVariables } from "@/lib/fonts";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <div
          style={{
            margin: "-1.5rem 0",
            height: "100vh",
            maxHeight: "100dvh",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
