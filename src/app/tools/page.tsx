import { TOOLS } from "@/lib/tools";
import Link from "next/link";

export default function ToolsPage() {
  return (
    <section>
      <h1 className="text-4xl font-bold mb-6">PDF Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="block p-5 border border-[#27272a] rounded-xl bg-[#18181b] hover:border-indigo-500 hover:shadow-lg transition">
            <h2 className="font-semibold text-lg text-white">{t.name}</h2>
            <p className="text-sm text-[#a1a1aa] mt-1">{t.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
