import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h2 className="mb-4 text-2xl font-bold">Track Not Found</h2>
      <p className="mb-8 text-neutral-400">The page you are looking for has skipped a beat.</p>
      <Link
        href="/"
        className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition hover:bg-neutral-200"
      >
        Return Home
      </Link>
    </div>
  );
}