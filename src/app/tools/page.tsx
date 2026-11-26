import { TOOLS } from "@/lib/tools";
import Link from "next/link";

export default function ToolsPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold mb-6">PDF Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="block p-5 border rounded-xl hover:shadow-lg hover:border-indigo-300 bg-white transition">
            <h2 className="font-semibold text-lg">{t.name}</h2>
            <p className="text-sm text-slate-600 mt-1">{t.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
