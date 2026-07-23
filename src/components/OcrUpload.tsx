import { useRef, useState } from 'react';
import { UploadCloud, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { runOCR } from '../lib/ocr';

type Status = 'idle' | 'reading' | 'done' | 'error';

export function OcrUpload({
  label,
  hint,
  onText,
  renderResult,
}: {
  label: string;
  hint: string;
  // Called with the raw OCR text once extraction succeeds.
  onText: (text: string) => void;
  // Optional caller-supplied summary of what was extracted (chips etc.).
  renderResult?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [pct, setPct] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
    setStatus('reading');
    setPct(0);
    try {
      const text = await runOCR(file, setPct);
      setStatus('done');
      onText(text);
    } catch {
      setStatus('error');
    }
  }

  const statusText: Record<Status, string> = {
    idle: '',
    reading: pct > 0 ? `Reading text… ${pct}%` : 'Loading OCR engine…',
    done: 'Text extracted',
    error: 'Could not read the document — please fill in manually below.',
  };

  return (
    <div className="mb-6 rounded-2xl border border-dashed border-teal-200 bg-teal-50/40 p-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
          dragging
            ? 'border-teal-400 bg-teal-50'
            : 'border-teal-200 bg-white/60 hover:border-teal-300 hover:bg-white'
        }`}
      >
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30">
          <UploadCloud className="h-5 w-5" />
        </span>
        <span className="mt-1 text-sm font-black text-slate-900">{label}</span>
        <span className="text-xs font-semibold text-slate-400">{hint}</span>
      </button>

      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="Uploaded result"
            className="mx-auto max-h-44 rounded-xl border border-slate-200 object-contain"
          />
        </div>
      )}

      {status === 'reading' && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-teal-100">
            <div
              className="h-full rounded-full bg-teal-500 transition-[width] duration-300"
              style={{ width: `${Math.max(pct, 6)}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-teal-700">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> {statusText.reading}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-rose-600">
          <AlertTriangle className="h-3.5 w-3.5" /> {statusText.error}
        </div>
      )}

      {status === 'done' && (
        <div className="mt-3 rounded-xl border border-teal-100 bg-white p-3">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-black text-teal-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Extracted — edit below if needed
          </div>
          {renderResult}
        </div>
      )}
    </div>
  );
}
