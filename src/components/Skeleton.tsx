// FILE: src/components/Skeleton.tsx
import React from "react";

export default function Skeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-1/3 rounded bg-slate-200" />
          <div className="mt-3 flex gap-2">
            <div className="h-8 w-24 rounded bg-slate-200" />
            <div className="h-8 w-28 rounded bg-slate-200" />
            <div className="h-8 w-28 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
