import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tumisho Aphane — Software Developer & Product Builder",
  description:
    "Tumisho Aphane is a South African software developer and product builder working across software systems, mobile apps, IoT prototypes and emerging technology.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
