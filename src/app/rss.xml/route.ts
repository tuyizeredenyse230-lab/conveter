import { TOOLS } from "@/lib/tools";

export async function GET() {
  const items = TOOLS.map((t) => `<item><title>${t.name}</title><link>https://pdf-studio.netlify.app/tools/${t.slug}</link><description>${t.desc}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>PDF Studio</title><link>https://pdf-studio.netlify.app</link><description>PDF tools updates</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml" } });
}
