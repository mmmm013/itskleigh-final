import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-[9999] flex w-full items-center justify-between border-b border-white/10 bg-black/90 px-6 py-4 backdrop-blur-md">
      {/* Branding */}
      <div className="flex flex-col">
        <span className="text-[10px] font-black tracking-[0.25em] text-white uppercase leading-tight">
          G Putnam Music
        </span>
        <span className="text-[8px] font-medium tracking-widest text-neutral-400">
          LLC
        </span>
      </div>

      {/* Navigation & Join - FIXED LINK */}
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex gap-4 text-[10px] font-bold tracking-widest uppercase text-neutral-400">
          <a href="#" className="hover:text-white transition">Stream</a>
          <a href="#" className="hover:text-white transition">Cubs</a>
          <a href="#" className="hover:text-white transition">Koala (Pre-Order)</a>
        </nav>
        <a 
          href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
          target="_blank" 
          rel="noopener noreferrer"
          className="rounded-full bg-white px-4 py-1.5 text-[10px] font-bold tracking-wider text-black transition hover:bg-neutral-200"
        >
          JOIN PRIDE 🦁
        </a>
      </div>
    </header>
  );
}