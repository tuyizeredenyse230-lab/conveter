import Link from "next/link";
import { TOOLS } from "@/lib/tools";

const ICONS: Record<string, string> = {
  "merge-pdf": "🔗", "split-pdf": "✂️", "compress-pdf": "📦", "pdf-to-images": "🖼️",
  "images-to-pdf": "📄", "rotate-pdf": "🔄", "watermark-pdf": "💧", "encrypt-pdf": "🔒",
};

export default function Home() {
  return (
    <section className="text-center">
      <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">PDF Studio</h1>
      <p className="text-lg text-[#a1a1aa] mb-8">100% client-side PDF tools. Your files never leave your device.</p>
      <Link href="/tools" className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-500 transition">Browse Tools</Link>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        {TOOLS.slice(0, 8).map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="p-5 border border-[#27272a] rounded-xl bg-[#18181b] hover:border-indigo-500 hover:shadow-lg transition">
            <div className="text-2xl mb-2">{ICONS[t.slug]}</div>
            <div className="font-semibold text-white">{t.name}</div>
            <div className="text-sm text-[#a1a1aa] mt-1">{t.desc}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
