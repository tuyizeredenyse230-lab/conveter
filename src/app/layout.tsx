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
      <body className="min-h-screen bg-[#0a0a0c] text-[#e4e4e7] antialiased">
        <header className="sticky top-0 z-10 backdrop-blur bg-[#0a0a0c]/90 border-b border-[#27272a]">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">PDF Studio</a>
            <nav className="flex gap-6 text-sm font-medium">
              <a href="/tools" className="text-[#e4e4e7] hover:text-white">Tools</a>
              <a href="/blog" className="text-[#e4e4e7] hover:text-white">Blog</a>
              <a href="/rss.xml" className="text-[#e4e4e7] hover:text-white">RSS</a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
        <footer className="border-t border-[#27272a] mt-16 py-8 text-center text-sm text-[#a1a1aa]">© 2026 PDF Studio — runs entirely in your browser.</footer>
      </body>
    </html>
  );
}
