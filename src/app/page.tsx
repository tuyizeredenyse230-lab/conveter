import Link from "next/link";
import { TOOLS } from "@/lib/tools";

export default function Home() {
  return (
    <section className="text-center">
      <h1 className="text-4xl font-bold mb-4">PDF Studio</h1>
      <p className="text-gray-600 mb-8">100% client-side PDF tools. Your files never leave your device.</p>
      <Link href="/tools" className="px-6 py-3 bg-black text-white rounded-lg">Browse Tools</Link>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
        {TOOLS.slice(0, 8).map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="p-3 border rounded bg-white text-sm">{t.name}</Link>
        ))}
      </div>
    </section>
  );
}
