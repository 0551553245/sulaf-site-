import type { ReactNode } from "react";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { bootScript, buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("en");
export { viewport } from "@/lib/metadata";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
