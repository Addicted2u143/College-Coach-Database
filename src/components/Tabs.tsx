// src/components/Tabs.tsx
import { useMemo } from "react";
import type { TabDef, TabKey } from "../lib/types";

type Props = {
  tabs: TabDef[];
  tab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

export default function Tabs({ tabs, tab, onTabChange }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<string, TabDef[]>();
    for (const t of tabs) {
      const g = t.group || "Other";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(t);
    }
    return Array.from(map.entries());
  }, [tabs]);

  return (
    <div className="space-y-3">
      {grouped.map(([groupName, groupTabs]) => (
        <div key={groupName} className="space-y-2">
          <div className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">
            {groupName}
          </div>

          <div className="flex flex-wrap gap-2">
            {groupTabs.map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  onClick={() => onTabChange(t.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
                    active
                      ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                      : "bg-white text-gray-800 border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}