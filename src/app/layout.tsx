import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Welcome to my site",
  description: "This is a personal site of Lumethra/Maximilian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
