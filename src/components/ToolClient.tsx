"use client";
import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

function formatSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / 1024 / 1024).toFixed(2) + " MB";
}

export default function ToolClient({ slug }: { slug: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [pageSize, setPageSize] = useState("fit");
  const [orient, setOrient] = useState("auto");
  const [margin, setMargin] = useState("none");
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const r = new FileReader();
      r.onload = () => setThumbs((t) => [...t, r.result as string]);
      r.readAsDataURL(f);
    });
  }, []);

  const remove = (i: number) => {
    setFiles((f) => f.filter((_, idx) => idx !== i));
    setThumbs((t) => t.filter((_, idx) => idx !== i));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    setFiles((f) => { const a = [...f]; [a[i], a[j]] = [a[j], a[i]]; return a; });
    setThumbs((t) => { const a = [...t]; [a[i], a[j]] = [a[j], a[i]]; return a; });
  };

  async function convert() {
    setStatus("processing");
    try {
      const doc = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const img = f.type.includes("png") ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        let w = img.width, h = img.height;
        if (pageSize === "a4") { w = 595; h = 842; }
        if (pageSize === "letter") { w = 612; h = 792; }
        if (orient === "landscape" && w < h) [w, h] = [h, w];
        if (orient === "portrait" && w > h) [w, h] = [h, w];
        const m = margin === "small" ? 20 : margin === "medium" ? 40 : 0;
        const page = doc.addPage([w, h]);
        const scale = Math.min((w - 2 * m) / img.width, (h - 2 * m) / img.height);
        const dw = img.width * scale, dh = img.height * scale;
        page.drawImage(img, { x: (w - dw) / 2, y: (h - dh) / 2, width: dw, height: dh });
      }
      const out = await doc.save();
      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ url, name: "images.pdf", size: out.byteLength });
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      alert((e as Error).message);
    }
  }

  if (slug !== "images-to-pdf") {
    return (
      <div className="space-y-4">
        <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="block text-white" />
        <button onClick={() => alert("Implement per tool")} className="px-4 py-2 bg-indigo-600 text-white rounded">Run</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">Images to PDF</h1>
      <p className="text-center text-[#a1a1aa] mb-4">Convert images into a single PDF document.</p>
      <div className="text-center text-sm text-emerald-400 mb-6">🔒 100% Private — Files never leave your browser</div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${dragging ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-700 hover:border-indigo-500"}`}
      >
        <div className="text-4xl mb-2">⬆️</div>
        <p className="text-white font-medium">Drag & drop images here, or click to browse</p>
        <p className="text-[#a1a1aa] text-sm mt-1">Supports JPG, PNG, WebP</p>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <>
          <div className="mt-6 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-[#27272a] rounded-lg bg-[#18181b]">
                <img src={thumbs[i]} alt="" className="w-12 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm truncate">{f.name}</div>
                  <div className="text-[#a1a1aa] text-xs">{formatSize(f.size)}</div>
                </div>
                <span className="text-[#a1a1aa] text-sm">#{i + 1}</span>
                <button onClick={() => move(i, -1)} className="text-[#a1a1aa] hover:text-white">↑</button>
                <button onClick={() => move(i, 1)} className="text-[#a1a1aa] hover:text-white">↓</button>
                <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => inputRef.current?.click()} className="px-3 py-1.5 text-sm border border-[#27272a] rounded text-white hover:bg-[#27272a]">+ Add more images</button>
            <button onClick={() => { setFiles([]); setThumbs([]); setResult(null); setStatus("idle"); }} className="px-3 py-1.5 text-sm border border-[#27272a] rounded text-white hover:bg-[#27272a]">Clear all</button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div>
              <label className="text-xs text-[#a1a1aa]">Page Size</label>
              <select value={pageSize} onChange={(e) => setPageSize(e.target.value)} className="w-full mt-1 bg-[#18181b] border border-[#27272a] text-white rounded p-2">
                <option value="fit">Fit to Image</option><option value="a4">A4</option><option value="letter">Letter</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#a1a1aa]">Orientation</label>
              <select value={orient} onChange={(e) => setOrient(e.target.value)} className="w-full mt-1 bg-[#18181b] border border-[#27272a] text-white rounded p-2">
                <option>Auto</option><option>Portrait</option><option>Landscape</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#a1a1aa]">Margin</label>
              <select value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full mt-1 bg-[#18181b] border border-[#27272a] text-white rounded p-2">
                <option>None</option><option>Small</option><option>Medium</option>
              </select>
            </div>
          </div>

          <button
            disabled={files.length === 0 || status === "processing"}
            onClick={convert}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg"
          >
            {status === "processing" ? "Combining pages..." : `Convert ${files.length} Images to PDF`}
          </button>
        </>
      )}

      {status === "done" && result && (
        <div className="mt-6 p-5 border border-emerald-500/30 rounded-xl bg-emerald-500/10 text-center">
          <div className="text-white font-medium mb-1">{result.name}</div>
          <div className="text-[#a1a1aa] text-sm mb-4">{formatSize(result.size)}</div>
          <a href={result.url} download={result.name} className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500">Download PDF</a>
          <button onClick={() => { setFiles([]); setThumbs([]); setResult(null); setStatus("idle"); }} className="ml-3 px-6 py-2 border border-[#27272a] text-white rounded-lg hover:bg-[#27272a]">Convert More</button>
        </div>
      )}
    </div>
  );
}
