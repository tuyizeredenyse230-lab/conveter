import Link from "next/link";
import { TOOLS } from "@/lib/tools";

export default function Home() {
  return (
    <section className="text-center">
      <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PDF Studio</h1>
      <p className="text-lg text-slate-600 mb-8">100% client-side PDF tools. Your files never leave your device.</p>
      <Link href="/tools" className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition">Browse Tools</Link>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
        {TOOLS.slice(0, 8).map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="p-4 border rounded-xl bg-white hover:shadow-lg hover:border-indigo-300 transition">{t.name}</Link>
        ))}
      </div>
    </section>
  );
}
