'use client';

import { useState } from 'react';

interface CompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
}

export default function CompareSlider({ beforeSrc, afterSrc }: CompareSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="glass-card rounded-xl p-4">
      <p className="mb-2 text-sm text-slate-300">Before / After</p>
      <div className="relative h-72 overflow-hidden rounded-lg bg-slate-900">
        <img src={beforeSrc} alt="Before" className="absolute inset-0 h-full w-full object-contain" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={afterSrc} alt="After" className="h-full w-full object-contain" />
        </div>
        <div className="absolute inset-y-0" style={{ left: `calc(${position}% - 1px)` }}>
          <div className="h-full w-0.5 bg-white/80" />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="mt-4 w-full accent-accent"
      />
    </div>
  );
}
