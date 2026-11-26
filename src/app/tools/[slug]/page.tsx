import { TOOLS } from "@/lib/tools";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
      <p className="text-gray-600 mb-6">{tool.desc}</p>
      <div className="p-6 border rounded-lg bg-white">
        <p className="text-sm text-gray-500">Tool UI loads client-side (WebAssembly). Drag & drop your file to begin.</p>
        <input type="file" className="mt-4" />
      </div>
    </section>
  );
}
