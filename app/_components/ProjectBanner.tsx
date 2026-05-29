"use client";
import { useEffect, useState } from "react";

type ActiveProject = {
  projectName: string; projectId: string; clientName: string;
  projectType: string; startDate: string; endDate: string;
  budget: number; currency: string; projectManager: string;
  salesRep: string; technicalLead: string; accountManager: string;
  initiatedAt: string;
};

export default function ProjectBanner() {
  const [proj, setProj] = useState<ActiveProject | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("pm_active_project");
    if (raw) { try { setProj(JSON.parse(raw)); } catch {} }
  }, []);

  if (!proj) return null;

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-center gap-4 flex-wrap">
      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">P</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-slate-800 text-sm">{proj.projectName}</div>
        <div className="text-xs text-slate-500 mt-0.5">{proj.clientName} · <span className="font-mono">{proj.projectId}</span> · {proj.projectType}</div>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
        <span>{proj.startDate} → {proj.endDate}</span>
        <span className="text-slate-300">|</span>
        <span className="font-semibold text-slate-700">{fmt(proj.budget)}</span>
        {proj.projectManager && <><span className="text-slate-300">|</span><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium">PM: {proj.projectManager}</span></>}
      </div>
    </div>
  );
}
