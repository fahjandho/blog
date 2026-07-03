import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — My exprience",
  description: "Thoughts and writing by idoyy.",
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}