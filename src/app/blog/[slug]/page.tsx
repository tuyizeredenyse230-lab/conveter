import { notFound } from "next/navigation";

const posts = ["merge-pdf-guide", "compress-pdf-tips", "client-side-pdf"];

export function generateStaticParams() {
  return posts.map((slug) => ({ slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!posts.includes(slug)) notFound();
  return (
    <article>
      <h1 className="text-3xl font-bold mb-4">{slug.replace(/-/g, " ")}</h1>
      <p className="text-gray-600">Programmatic SEO page for {slug}.</p>
    </article>
  );
}
