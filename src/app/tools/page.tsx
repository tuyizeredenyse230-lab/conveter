import { TOOLS } from "@/lib/tools";
import Link from "next/link";

export default function ToolsPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">PDF Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="block p-4 border rounded-lg hover:shadow bg-white">
            <h2 className="font-semibold">{t.name}</h2>
            <p className="text-sm text-gray-600">{t.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
