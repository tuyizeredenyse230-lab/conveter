"use client";
import { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

function formatSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / 1024 / 1024).toFixed(2) + " MB";
}

const MULTI = ["merge-pdf", "images-to-pdf"];

export default function ToolClient({ slug }: { slug: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [result, setResult] = useState<{ url: string; name: string; size: number; orig?: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // settings
  const [pageSize, setPageSize] = useState("fit");
  const [orient, setOrient] = useState("auto");
  const [margin, setMargin] = useState("none");
  const [compress, setCompress] = useState("balanced");
  const [splitMode, setSplitMode] = useState("extract");
  const [splitRange, setSplitRange] = useState("");
  const [rotateDeg, setRotateDeg] = useState(90);
  const [watermark, setWatermark] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(30);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list);
    const filtered = MULTI.includes(slug) ? arr : arr.slice(0, 1);
    setFiles((prev) => (MULTI.includes(slug) ? [...prev, ...filtered] : filtered));
    filtered.forEach((f) => {
      if (f.type.startsWith("image/")) {
        const r = new FileReader();
        r.onload = () => setThumbs((t) => [...t, r.result as string]);
        r.readAsDataURL(f);
      } else {
        setThumbs((t) => [...t, ""]);
      }
    });
  }, [slug]);

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

  const reset = () => { setFiles([]); setThumbs([]); setResult(null); setStatus("idle"); };

  async function convert() {
    if (files.length === 0) return;
    setStatus("processing");
    try {
      let out: Uint8Array;
      let name = "output.pdf";
      let origSize = files.reduce((a, f) => a + f.size, 0);
      if (slug === "merge-pdf") {
        const merged = await PDFDocument.create();
        for (const f of files) {
          const bytes = await f.arrayBuffer();
          const doc = await PDFDocument.load(bytes);
          const pages = await merged.copyPages(doc, doc.getPageIndices());
          pages.forEach((p) => merged.addPage(p));
        }
        out = await merged.save(); name = "merged.pdf";
      } else if (slug === "images-to-pdf") {
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
          page.drawImage(img, { x: (w - img.width * scale) / 2, y: (h - img.height * scale) / 2, width: img.width * scale, height: img.height * scale });
        }
        out = await doc.save(); name = "images.pdf";
      } else {
        const bytes = await files[0].arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        if (slug === "rotate-pdf") {
          doc.getPages().forEach((p) => p.setRotation({ type: "degrees", angle: rotateDeg } as any));
        } else if (slug === "watermark-pdf") {
          const font = await doc.embedFont("Helvetica");
          doc.getPages().forEach((p) => {
            p.drawText(watermark, { x: 50, y: p.getHeight() / 2, size: 40, font, opacity: opacity / 100 });
          });
        } else if (slug === "compress-pdf") {
          // re-save with object streams
        }
        if (slug === "split-pdf") {
          const newDoc = await PDFDocument.create();
          const [p] = await newDoc.copyPages(doc, [0]);
          newDoc.addPage(p);
          out = await newDoc.save(); name = "page-1.pdf";
        } else {
          out = await doc.save(); name = "output.pdf";
        }
      }
      const blob = new Blob([out as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ url, name, size: out.byteLength, orig: origSize });
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      alert((e as Error).message);
    }
  }

  const multi = MULTI.includes(slug);
  const accept = slug === "images-to-pdf" ? "image/*" : "application/pdf";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <a href="/tools" className="text-sm text-[#a1a1aa] hover:text-white">← All Tools</a>
      <div className="mt-4 mb-6 text-center">
        <div className="text-4xl mb-2">📄</div>
        <h1 className="text-3xl font-bold text-white">{slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</h1>
        <p className="text-[#a1a1aa] mt-1">Process your files entirely in the browser.</p>
        <div className="inline-block mt-3 text-xs text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1">🔒 100% Private — Files never leave your browser</div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${dragging ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-700 hover:border-indigo-500 bg-zinc-900/50"}`}
      >
        <div className="text-4xl mb-2">⬆️</div>
        <p className="text-white font-medium">Drag & drop your file(s) here, or click to browse</p>
        <p className="text-[#a1a1aa] text-sm mt-1">{slug === "images-to-pdf" ? "JPG, PNG, WebP" : "PDF"}</p>
        <input ref={inputRef} type="file" multiple={multi} accept={accept} className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <>
          <div className="mt-6 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                {thumbs[i] ? <img src={thumbs[i]} alt="" className="w-10 h-10 object-cover rounded" /> : <span className="text-2xl">📄</span>}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm truncate">{f.name}</div>
                  <div className="text-[#a1a1aa] text-xs">{formatSize(f.size)}</div>
                </div>
                {multi && <span className="text-[#a1a1aa] text-sm">#{i + 1}</span>}
                {multi && <button onClick={() => move(i, -1)} className="text-[#a1a1aa] hover:text-white">↑</button>}
                {multi && <button onClick={() => move(i, 1)} className="text-[#a1a1aa] hover:text-white">↓</button>}
                <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300">×</button>
              </div>
            ))}
          </div>
          {multi && (
            <div className="flex gap-2 mt-3">
              <button onClick={() => inputRef.current?.click()} className="px-3 py-1.5 text-sm border border-zinc-800 rounded text-white hover:bg-zinc-800">+ Add more</button>
              <button onClick={reset} className="px-3 py-1.5 text-sm border border-zinc-800 rounded text-white hover:bg-zinc-800">Clear all</button>
            </div>
          )}

          <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-5 mt-6 space-y-3">
            {slug === "images-to-pdf" && (
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-[#a1a1aa]">Page Size</label>
                  <select value={pageSize} onChange={(e) => setPageSize(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 text-white rounded p-2"><option value="fit">Fit to Image</option><option value="a4">A4</option><option value="letter">Letter</option></select></div>
                <div><label className="text-xs text-[#a1a1aa]">Orientation</label>
                  <select value={orient} onChange={(e) => setOrient(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 text-white rounded p-2"><option>Auto</option><option>Portrait</option><option>Landscape</option></select></div>
                <div><label className="text-xs text-[#a1a1aa]">Margin</label>
                  <select value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full mt-1 bg-zinc-900 border border-zinc-800 text-white rounded p-2"><option>None</option><option>Small</option><option>Medium</option></select></div>
              </div>
            )}
            {slug === "compress-pdf" && (
              <div className="grid grid-cols-3 gap-2">
                {["low", "balanced", "max"].map((v) => (
                  <button key={v} onClick={() => setCompress(v)} className={`p-3 rounded-lg border text-sm ${compress === v ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-zinc-800 text-[#a1a1aa]"}`}>{v}</button>
                ))}
              </div>
            )}
            {slug === "split-pdf" && (
              <div className="space-y-2">
                <select value={splitMode} onChange={(e) => setSplitMode(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2">
                  <option value="extract">Extract specific pages</option><option value="every">Split every N pages</option><option value="all">Extract all pages</option>
                </select>
                <input value={splitRange} onChange={(e) => setSplitRange(e.target.value)} placeholder="e.g. 1-3, 5" className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2" />
              </div>
            )}
            {slug === "rotate-pdf" && (
              <div className="flex gap-2">
                {[90, 180, 270].map((d) => (
                  <button key={d} onClick={() => setRotateDeg(d)} className={`flex-1 py-2 rounded border ${rotateDeg === d ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-zinc-800 text-[#a1a1aa]"}`}>{d}°</button>
                ))}
              </div>
            )}
            {slug === "watermark-pdf" && (
              <div className="space-y-2">
                <input value={watermark} onChange={(e) => setWatermark(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2" placeholder="Watermark text" />
                <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="w-full" />
                <div className="text-xs text-[#a1a1aa]">Opacity: {opacity}%</div>
              </div>
            )}
            {slug === "encrypt-pdf" && (
              <div className="space-y-2">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2" />
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2" />
              </div>
            )}
            {slug === "pdf-to-images" && (
              <div className="text-sm text-[#a1a1aa]">Output: PNG images (one per page)</div>
            )}
          </div>

          <button
            disabled={files.length === 0 || status === "processing"}
            onClick={convert}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium py-3.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            {status === "processing" && <span className="animate-spin">⟳</span>}
            {status === "processing" ? "Processing in your browser..." : `Convert ${files.length} file${files.length > 1 ? "s" : ""}`}
          </button>
        </>
      )}

      {status === "done" && result && (
        <div className="mt-6 bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-5 text-center">
          <div className="text-emerald-400 text-2xl mb-1">✓</div>
          <div className="text-white font-medium mb-1">Your PDF is ready!</div>
          <div className="text-[#a1a1aa] text-sm mb-1">{result.name}</div>
          <div className="text-[#a1a1aa] text-sm mb-4">{formatSize(result.size)}{result.orig ? ` (was ${formatSize(result.orig)})` : ""}</div>
          <a href={result.url} download={result.name} className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500">Download</a>
          <button onClick={reset} className="ml-3 px-6 py-2 border border-zinc-800 text-white rounded-lg hover:bg-zinc-800">Start Over</button>
        </div>
      )}
    </div>
  );
}
