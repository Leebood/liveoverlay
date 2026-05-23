// src/components/common/Watermark.tsx
'use client';

export default function Watermark() {
  return (
    <div className="fixed bottom-1 right-2 text-[10px] text-white/40 pointer-events-none z-[9999]">
      Powered by LiveOverlay
    </div>
  );
}
