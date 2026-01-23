"use client";
import { useState } from 'react';

export default function CorsChecker({ defaultValue }: { defaultValue?: string }) {
  const [input, setInput] = useState(defaultValue || '');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const q = encodeURIComponent(input.trim());
      const isUrl = /^https?:\/\//i.test(input.trim());
      const url = `/api/check-audio-cors?${isUrl ? `url=${q}` : `filename=${q}`}`;
      const res = await fetch(url);
      const json = await res.json();
      setResult({ status: res.status, body: json });
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-24 z-50 p-3 bg-white/90 dark:bg-black/80 rounded shadow-lg w-80">
      <div className="text-sm font-semibold mb-2">CORS / Cache Checker</div>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="enter full url or filename/path.mp3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={!input || loading}
          onClick={run}
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => { setInput(''); setResult(null); }}
        >
          Clear
        </button>
      </div>
      <pre className="mt-2 text-xs max-h-40 overflow-auto">{result ? JSON.stringify(result, null, 2) : 'No result'}</pre>
    </div>
  );
}
