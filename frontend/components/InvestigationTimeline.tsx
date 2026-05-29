"use client";

import { CheckCircle } from "lucide-react";

export default function InvestigationTimeline({ telemetry, duration }: any) {
  return (
    <div className="bg-zinc-950/70 border border-zinc-900 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-white font-bold font-mono uppercase tracking-widest">
          Investigation Pipeline
        </h3>

        <div className="text-xs text-cyan-400 font-mono">
          Completed in {duration || 0}s
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {telemetry?.map((item: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 border border-zinc-800 bg-black/30 rounded-full px-3 py-2"
          >
            <CheckCircle className="h-4 w-4 text-emerald-400" />

            <span className="text-xs text-zinc-200 font-semibold">
              {item.step}
            </span>

            <span className="text-[10px] text-zinc-500">
              · {item.source}
            </span>

            <span className="text-[10px] text-emerald-400">
            · {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}