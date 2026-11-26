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
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 antialiased">
        <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PDF Studio</a>
            <nav className="flex gap-6 text-sm font-medium">
              <a href="/tools" className="hover:text-indigo-600">Tools</a>
              <a href="/blog" className="hover:text-indigo-600">Blog</a>
              <a href="/rss.xml" className="hover:text-indigo-600">RSS</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
        <footer className="border-t mt-16 py-8 text-center text-sm text-slate-500">© 2026 PDF Studio — runs entirely in your browser.</footer>
      </body>
    </html>
  );
}
