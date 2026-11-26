import { TOOLS } from "@/lib/tools";
import { notFound } from "next/navigation";
import ToolClient from "@/components/ToolClient";

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
        <ToolClient slug={slug} />
      </div>
    </section>
  );
}
