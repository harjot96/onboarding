"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/onboarding", label: "Project Onboarding", icon: "🏆", group: "CRM" },
  { href: "/project-types", label: "Project Type Guide", icon: "🗂", group: "CRM" },
  { href: "/", label: "Dashboard", icon: "⊞", group: "Project" },
  { href: "/scope", label: "Scope & Backlog", icon: "📋", group: "Project" },
  { href: "/board", label: "Task Board", icon: "🗂", group: "Project" },
  { href: "/planning", label: "Planning & Sprints", icon: "📅", group: "Project" },
  { href: "/tracking", label: "Time Tracking", icon: "⏱", group: "Project" },
  { href: "/project-cost", label: "Project Cost", icon: "📊", group: "Finance" },
  { href: "/salary", label: "Salary Cost", icon: "💰", group: "Finance" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [crmOnly, setCrmOnly] = useState(true);

  const visibleGroups = crmOnly ? ["CRM"] : ["CRM", "Project", "Finance"];

  return (
    <aside className="w-56 bg-slate-900 text-white flex flex-col shrink-0">
      <div className="px-4 py-5 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-indigo-400">ProjectFlow</div>
            <div className="text-xs text-slate-400 mt-0.5">PM Suite</div>
          </div>
          <button
            onClick={() => setCrmOnly((v) => !v)}
            title={crmOnly ? "Show all sections" : "CRM only"}
            className={`flex flex-col gap-0.5 items-center justify-center w-7 h-7 rounded transition-colors ${
              crmOnly ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            <span className="w-3.5 h-0.5 bg-current rounded" />
            <span className={`w-3.5 h-0.5 bg-current rounded transition-opacity ${crmOnly ? "opacity-0" : "opacity-100"}`} />
            <span className={`w-3.5 h-0.5 bg-current rounded transition-opacity ${crmOnly ? "opacity-0" : "opacity-100"}`} />
          </button>
        </div>
      </div>
      <nav className="flex-1 px-2 pt-2 overflow-y-auto">
        {visibleGroups.map((group) => (
          <div key={group} className="mb-3">
            <div className="px-3 py-1.5 text-xs text-slate-500 uppercase tracking-wider font-semibold">{group}</div>
            <div className="space-y-0.5">
              {nav.filter((i) => i.group === group).map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}>
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-slate-700 text-xs text-slate-500">
        <div className="font-medium text-slate-300">Alpha Web App</div>
        <div>info@iprofit.in</div>
      </div>
    </aside>
  );
}
