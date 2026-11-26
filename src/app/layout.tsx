import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "PDF Studio — 100% Client-Side PDF Converter", template: "%s | PDF Studio" },
  description: "Convert, merge, split, compress and edit PDFs entirely in your browser. No uploads. WebAssembly powered, serverless Netlify deployment.",
  keywords: ["pdf converter", "merge pdf", "split pdf", "compress pdf", "client side", "wasm", "netlify"],
  openGraph: { title: "PDF Studio", description: "100% client-side PDF tools", type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-bold text-xl">PDF Studio</a>
            <nav className="flex gap-4 text-sm">
              <a href="/tools">Tools</a>
              <a href="/blog">Blog</a>
              <a href="/rss.xml">RSS</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t mt-12 py-6 text-center text-sm text-gray-500">© 2026 PDF Studio — runs in your browser.</footer>
      </body>
    </html>
  );
}
