"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function ToolClient({ slug }: { slug: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState("");

  async function run() {
    setStatus("Processing...");
    try {
      if (slug === "merge-pdf") {
        const merged = await PDFDocument.create();
        for (const f of files) {
          const bytes = await f.arrayBuffer();
          const doc = await PDFDocument.load(bytes);
          const pages = await merged.copyPages(doc, doc.getPageIndices());
          pages.forEach((p) => merged.addPage(p));
        }
        const out = await merged.save();
        const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "merged.pdf"; a.click();
        setStatus("Done");
      } else {
        setStatus("Tool not yet implemented for " + slug);
      }
    } catch (e) {
      setStatus("Error: " + (e as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <input type="file" multiple accept=".pdf,image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} className="block" />
      <button onClick={run} className="px-4 py-2 bg-black text-white rounded">Run</button>
      <p className="text-sm text-gray-600">{status}</p>
    </div>
  );
}
