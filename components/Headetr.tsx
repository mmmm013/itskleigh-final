'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-[#1a1a1a] border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* LEFT: Logo & Company Name */}
        <div className="flex items-center gap-4">
          {/* GPM Logo */}
          <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-white">
            <img src="/logo.svg" alt="G Putnam Music" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white tracking-wide uppercase">
              G Putnam Music, LLC
            </h1>
            <span className="text-xs text-gray-400">One Stop Song Shop</span>
          </div>
        </div>

        {/* CENTER: GPM_LOG and MESSAGE Link */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/log" className="text-gray-300 hover:text-amber-500 transition-colors uppercase tracking-wider font-semibold">
            GPM_LOG
          </Link>
          <a 
            href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-300 hover:text-amber-500 transition-colors uppercase font-bold"
          >
            985-MESSAGE
          </a>
        </div>

        {/* RIGHT: QR Code & Join Button */}
        <div className="flex items-center gap-4">
          {/* Static QR Code (local asset) */}
          <div className="w-12 h-12 bg-white p-1 rounded overflow-hidden">
            <img src="/gpm_qrcode.svg" alt="GPM QR" className="w-full h-full object-contain" />
          </div>
          
          {/* STRIPE JOIN BUTTON */}
          <a 
            href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" 
            target="_blank"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-6 rounded-full transition-transform hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            JOIN THE PRIDE ($5/mo)
          </a>
        </div>

      </div>
    </header>
  );
}
