'use client';

import { Check, X, Heart, Star } from 'lucide-react';

export default function SponsorshipModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* BACKDROP */}
      <div onClick={onClose} className="absolute inset-0 bg-[#3E2723]/90 backdrop-blur-md transition-opacity"></div>
      
      {/* MODAL CONTENT */}
      <div className="relative bg-[#4E342E] border border-[#FFD54F]/30 rounded-3xl max-w-lg w-full p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-[#D7CCC8] hover:text-white bg-black/20 p-2 rounded-full">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
           <h2 className="text-3xl font-black text-[#FFD54F] mb-2 uppercase tracking-wide">Join the Pride</h2>
           <p className="text-[#D7CCC8] text-xs font-bold uppercase tracking-widest opacity-70">Choose your Spirit Animal</p>
        </div>

        {/* THE TWO TIERS */}
        <div className="space-y-4">
           
           {/* TIER 1: THE CUB ($5) */}
           <a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="flex items-center justify-between bg-[#FFD54F] text-[#3E2723] p-6 rounded-2xl hover:scale-[1.02] transition shadow-lg group border-2 border-[#3E2723]">
              <div className="flex items-center gap-4">
                 <div className="bg-[#3E2723] text-[#FFD54F] p-3 rounded-full shadow-inner">
                    <span className="text-2xl">🦁</span>
                 </div>
                 <div className="text-left">
                    <div className="font-black text-xl">THE CUB</div>
                    <div className="text-[10px] font-bold uppercase opacity-80">Unlimited Plays + Badge</div>
                 </div>
              </div>
              <div className="font-black text-3xl">$5</div>
           </a>

           {/* TIER 2: THE KOALA ($25) */}
           <a href="https://buy.stripe.com/4gM14n4KD8Zg1zI8ZO9IQ03" target="_blank" className="flex items-center justify-between bg-white text-[#3E2723] p-6 rounded-2xl hover:scale-[1.02] transition shadow-lg border-2 border-[#3E2723] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#E65100] text-white text-[9px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest">
                 Premium Status
              </div>
              <div className="flex items-center gap-4">
                 <div className="bg-[#9E9E9E] text-white p-3 rounded-full shadow-inner">
                    <span className="text-2xl">🐨</span>
                 </div>
                 <div className="text-left">
                    <div className="font-black text-xl">THE KOALA</div>
                    <div className="text-[10px] font-bold uppercase opacity-60">Rare & Exclusive Access</div>
                 </div>
              </div>
              <div className="font-black text-3xl">$25</div>
           </a>

        </div>
        
        <div className="mt-8 text-center border-t border-[#FFD54F]/10 pt-4">
           <p className="text-[#D7CCC8] text-sm leading-relaxed font-medium mb-2">
              100% of proceeds support Artist Development.
           </p>
           <p className="text-[10px] text-[#D7CCC8] opacity-50 uppercase font-bold tracking-widest">Secure Payments via Stripe</p>
        </div>

      </div>
    </div>
  );
}
