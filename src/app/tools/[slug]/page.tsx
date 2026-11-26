import { TOOLS } from "@/lib/tools";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ToolClient from "@/components/ToolClient";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

async function ToolDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();
  return (
    <section>
      <h1 className="text-3xl font-bold mb-2 text-white">{tool.name}</h1>
      <p className="text-[#a1a1aa] mb-6">{tool.desc}</p>
      <div className="p-6 border border-[#27272a] rounded-lg bg-[#18181b]">
        <ToolClient slug={slug} />
      </div>
    </section>
  );
}

export default function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="text-[#a1a1aa]">Loading...</p>}>
      <ToolDetails params={params} />
    </Suspense>
  );
}
