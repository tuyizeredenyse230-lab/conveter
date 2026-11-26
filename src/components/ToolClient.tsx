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
        download(out, "merged.pdf");
        setStatus("Done");
      } else if (slug === "images-to-pdf") {
        const doc = await PDFDocument.create();
        for (const f of files) {
          const bytes = await f.arrayBuffer();
          const img = f.type.includes("png")
            ? await doc.embedPng(bytes)
            : await doc.embedJpg(bytes);
          const page = doc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const out = await doc.save();
        download(out, "images.pdf");
        setStatus("Done");
      } else if (slug === "rotate-pdf") {
        const bytes = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        doc.getPages().forEach((p) => p.setRotation({ type: "degrees", angle: 90 } as any));
        const out = await doc.save();
        download(out, "rotated.pdf");
        setStatus("Done");
      } else if (slug === "compress-pdf") {
        const bytes = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const out = await doc.save({ useObjectStreams: true });
        download(out, "compressed.pdf");
        setStatus("Done");
      } else if (slug === "split-pdf") {
        const bytes = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const newDoc = await PDFDocument.create();
        const [p] = await newDoc.copyPages(doc, [0]);
        newDoc.addPage(p);
        const out = await newDoc.save();
        download(out, "page-1.pdf");
        setStatus("Done");
      } else if (slug === "watermark-pdf") {
        const bytes = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const font = await doc.embedFont("Helvetica");
        doc.getPages().forEach((p) => {
          p.drawText("CONFIDENTIAL", { x: 50, y: p.getHeight() / 2, size: 40, font, opacity: 0.3 });
        });
        const out = await doc.save();
        download(out, "watermarked.pdf");
        setStatus("Done");
      } else if (slug === "page-numbers") {
        const bytes = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const font = await doc.embedFont("Helvetica");
        doc.getPages().forEach((p, i) => {
          p.drawText(String(i + 1), { x: p.getWidth() / 2, y: 20, size: 12, font });
        });
        const out = await doc.save();
        download(out, "numbered.pdf");
        setStatus("Done");
      } else {
        setStatus("Tool not yet implemented for " + slug);
      }
    } catch (e) {
      setStatus("Error: " + (e as Error).message);
    }
  }

  function download(bytes: Uint8Array, name: string) {
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
  }

  return (
    <div className="space-y-4">
      <input type="file" multiple accept=".pdf,image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} className="block" />
      <button onClick={run} className="px-4 py-2 bg-black text-white rounded">Run</button>
      <p className="text-sm text-gray-600">{status}</p>
    </div>
  );
}
