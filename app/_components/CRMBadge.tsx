"use client";
import { useState, useEffect } from "react";

type CRMSource = { wonProjectId: string; source: string; agreementRef: string; dealSource: string };

export default function CRMBadge() {
  const [crm, setCrm] = useState<CRMSource | null>(null);
  const [projectType, setProjectType] = useState<string>("");

  useEffect(() => {
    try {
      const src = localStorage.getItem("pm_crm_source");
      const proj = localStorage.getItem("pm_active_project");
      if (src) setCrm(JSON.parse(src));
      if (proj) {
        const p = JSON.parse(proj);
        setProjectType(p.projectType || p.type || "");
      }
    } catch { /* ignore */ }
  }, []);

  if (!crm) return null;

  const typeColors: Record<string, string> = {
    "Fixed Price": "bg-indigo-50 border-indigo-200 text-indigo-700",
    "Time & Material": "bg-teal-50 border-teal-200 text-teal-700",
    "Bot Development": "bg-violet-50 border-violet-200 text-violet-700",
    "SaaS": "bg-cyan-50 border-cyan-200 text-cyan-700",
    "Retainer": "bg-amber-50 border-amber-200 text-amber-700",
    "Milestone-Based": "bg-purple-50 border-purple-200 text-purple-700",
  };
  const colorClass = typeColors[projectType] ?? "bg-indigo-50 border-indigo-200 text-indigo-700";

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-medium ${colorClass}`}>
      <span>{crm.dealSource === "Government RFP" ? "🏛" : "🔗"}</span>
      <span>CRM</span>
      <span className="opacity-50">·</span>
      <span className="font-mono">{crm.wonProjectId}</span>
      {crm.agreementRef && (
        <>
          <span className="opacity-50">·</span>
          <span className="opacity-80">{crm.agreementRef}</span>
        </>
      )}
      {projectType && (
        <>
          <span className="opacity-50">·</span>
          <span>{projectType}</span>
        </>
      )}
    </div>
  );
}
