"use client";
import { useState } from "react";

type SprintRow = { sprint: string; estHours: number; loggedHours: number; status: string };

const CURRENCIES = [
  { symbol: "₹", code: "INR", name: "Indian Rupee" },
  { symbol: "$", code: "USD", name: "US Dollar" },
  { symbol: "€", code: "EUR", name: "Euro" },
  { symbol: "£", code: "GBP", name: "British Pound" },
  { symbol: "¥", code: "JPY", name: "Japanese Yen" },
  { symbol: "د.إ", code: "AED", name: "UAE Dirham" },
  { symbol: "S$", code: "SGD", name: "Singapore Dollar" },
  { symbol: "A$", code: "AUD", name: "Australian Dollar" },
  { symbol: "C$", code: "CAD", name: "Canadian Dollar" },
];

const initialRows: SprintRow[] = [
  { sprint: "Sprint 1", estHours: 120, loggedHours: 118, status: "Completed" },
  { sprint: "Sprint 2", estHours: 120, loggedHours: 115, status: "Completed" },
  { sprint: "Sprint 3", estHours: 120, loggedHours: 102, status: "Completed" },
  { sprint: "Sprint 4", estHours: 120, loggedHours: 46, status: "Active" },
  { sprint: "Sprint 5", estHours: 120, loggedHours: 0, status: "Planned" },
  { sprint: "Sprint 6", estHours: 120, loggedHours: 0, status: "Planned" },
];

const statusStyle: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Active: "bg-blue-100 text-blue-700",
  Planned: "bg-slate-100 text-slate-500",
};

export default function ProjectCostPage() {
  const [rows, setRows] = useState<SprintRow[]>(initialRows);
  const [rate, setRate] = useState(800);
  const [editingRate, setEditingRate] = useState(false);
  const [draftRate, setDraftRate] = useState(800);
  const [currencyCode, setCurrencyCode] = useState("INR");
  const [logHours, setLogHours] = useState({ sprint: "Sprint 4", hours: 0 });
  const [logMsg, setLogMsg] = useState("");

  const currency = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];
  const fmt = (n: number) => `${currency.symbol}${n.toLocaleString()}`;

  const applyLog = () => {
    if (!logHours.hours) return;
    setRows((prev) =>
      prev.map((r) => r.sprint === logHours.sprint ? { ...r, loggedHours: r.loggedHours + logHours.hours } : r)
    );
    setLogMsg(`+${logHours.hours}h added to ${logHours.sprint} — Current Cost updated ✓`);
    setTimeout(() => setLogMsg(""), 4000);
    setLogHours((p) => ({ ...p, hours: 0 }));
  };

  const totalEstHrs = rows.reduce((a, r) => a + r.estHours, 0);
  const totalLoggedHrs = rows.reduce((a, r) => a + r.loggedHours, 0);
  const totalEstCost = totalEstHrs * rate;
  const totalCurrentCost = totalLoggedHrs * rate;
  const totalOvershoot = totalLoggedHrs > totalEstHrs;
  const totalVariance = totalEstCost - totalCurrentCost; // negative = over budget
  const completionPct = Math.round((totalLoggedHrs / totalEstHrs) * 100);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Project Cost</h1>
          <p className="text-sm text-slate-500 mt-0.5">Total Project Hours × Per Hour Rate · Current Cost updates as hours are logged</p>
        </div>

        {/* Currency + Rate controls */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex-wrap">
          {/* Currency selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Currency</span>
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white font-semibold text-slate-700"
              value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          <div className="w-px h-5 bg-slate-200" />

          {/* Per Hour Rate */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Per Hour Rate</span>
            {editingRate ? (
              <>
                <input type="number" className="w-24 border border-indigo-300 rounded-lg px-2 py-1 text-sm font-bold text-indigo-700"
                  value={draftRate} onChange={(e) => setDraftRate(Number(e.target.value))} />
                <button onClick={() => { setRate(draftRate); setEditingRate(false); }}
                  className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg">Apply</button>
                <button onClick={() => setEditingRate(false)} className="px-3 py-1 text-xs bg-slate-200 text-slate-600 rounded-lg">Cancel</button>
              </>
            ) : (
              <>
                <span className="text-base font-bold text-indigo-700">{currency.symbol}{rate}/hr</span>
                <button onClick={() => { setDraftRate(rate); setEditingRate(true); }}
                  className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Edit</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-slate-300">
          <div className="text-xs text-slate-400 mb-1">Total Estimated Hours</div>
          <div className="text-3xl font-bold text-slate-800">{totalEstHrs}h</div>
          <div className="text-xs text-slate-400 mt-1">across {rows.length} sprints</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-slate-400">
          <div className="text-xs text-slate-400 mb-1">Estimated Total Cost</div>
          <div className="text-3xl font-bold text-slate-700">{fmt(totalEstCost)}</div>
          <div className="text-xs text-slate-400 mt-1">{totalEstHrs}h × {currency.symbol}{rate}</div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${totalOvershoot ? "border-red-500" : "border-indigo-500"}`}>
          <div className="text-xs text-slate-400 mb-1">Current Cost (Logged)</div>
          <div className={`text-3xl font-bold ${totalOvershoot ? "text-red-600" : "text-indigo-700"}`}>
            {totalOvershoot && <span className="text-xl mr-1">⚠</span>}{fmt(totalCurrentCost)}
          </div>
          <div className={`text-xs mt-1 ${totalOvershoot ? "text-red-500 font-semibold" : "text-slate-400"}`}>
            {totalLoggedHrs}h logged · {completionPct}% {totalOvershoot ? "OVERSHOOT" : "complete"}
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${totalVariance >= 0 ? "border-green-500" : "border-red-500"}`}>
          <div className="text-xs text-slate-400 mb-1">Variance (Est − Current)</div>
          <div className={`text-3xl font-bold ${totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalVariance >= 0 ? "+" : "−"}{fmt(Math.abs(totalVariance))}
          </div>
          <div className={`text-xs mt-1 font-medium ${totalVariance >= 0 ? "text-green-500" : "text-red-500"}`}>
            {totalVariance >= 0 ? "Under budget" : "Over budget — hours exceeded estimate"}
          </div>
        </div>
      </div>

      {/* Live hour logger */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4 flex-wrap">
        <div className="text-amber-700 text-sm font-semibold shrink-0">⚡ Simulate Hour Log</div>
        <select className="border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white"
          value={logHours.sprint} onChange={(e) => setLogHours((p) => ({ ...p, sprint: e.target.value }))}>
          {rows.filter((r) => r.status !== "Planned").map((r) => <option key={r.sprint}>{r.sprint}</option>)}
        </select>
        <input type="number" step="0.5" min="0.5" className="w-28 border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="+ hours"
          value={logHours.hours || ""} onChange={(e) => setLogHours((p) => ({ ...p, hours: Number(e.target.value) }))} />
        <button onClick={applyLog} className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 font-medium">Log Hours</button>
        {logMsg && <span className="text-sm text-green-700 font-semibold">{logMsg}</span>}
        <span className="text-xs text-amber-600 ml-auto italic">Try logging hours beyond estimate to see red overshoot indicator</span>
      </div>

      {/* Per-sprint cost table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-700">Per-Sprint Cost Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Current Cost turns red when logged hours exceed estimated hours for that sprint</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> Under</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Overshoot</span>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2">Sprint</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Est. Hours</th>
              <th className="text-right px-4 py-2">Logged Hours</th>
              <th className="text-right px-4 py-2">Estimated Cost</th>
              <th className="text-right px-4 py-2">Current Cost</th>
              <th className="text-right px-4 py-2">Variance</th>
              <th className="text-right px-4 py-2">Progress</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const estCost = r.estHours * rate;
              const curCost = r.loggedHours * rate;
              const overshoot = r.loggedHours > r.estHours;
              const variance = estCost - curCost; // negative = over budget
              const excessHrs = overshoot ? r.loggedHours - r.estHours : 0;
              const pct = r.estHours > 0 ? Math.round((r.loggedHours / r.estHours) * 100) : 0;
              return (
                <tr key={r.sprint} className={`border-b border-slate-50 hover:bg-slate-50 ${overshoot ? "bg-red-50/40" : r.status === "Active" ? "bg-indigo-50/30" : ""}`}>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {r.sprint}
                    {r.status === "Active" && <span className="ml-1 text-xs text-indigo-600 font-semibold">(Active)</span>}
                    {overshoot && <span className="ml-1 text-xs text-red-600 font-semibold">⚠ +{excessHrs}h</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyle[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">{r.estHours}h</td>
                  <td className={`px-4 py-3 text-right font-semibold ${overshoot ? "text-red-600" : "text-slate-700"}`}>
                    {r.loggedHours}h
                    {overshoot && <div className="text-xs text-red-500 font-normal">+{excessHrs}h over</div>}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">{fmt(estCost)}</td>
                  <td className={`px-4 py-3 text-right font-bold text-base ${overshoot ? "text-red-600" : "text-indigo-600"}`}>
                    {overshoot && <span className="text-sm mr-0.5">⚠ </span>}
                    {overshoot ? `−${fmt(Math.abs(variance))}` : fmt(curCost)}
                    {overshoot && <div className="text-xs font-normal text-red-500">Actual: {fmt(curCost)}</div>}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${variance > 0 ? "text-green-600" : variance < 0 ? "text-red-600" : "text-slate-400"}`}>
                    {variance === 0 ? "—" : variance > 0 ? `+${fmt(variance)}` : `−${fmt(Math.abs(variance))}`}
                  </td>
                  <td className="px-4 py-3 w-32">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${overshoot ? "bg-red-500" : r.status === "Completed" ? "bg-green-500" : r.status === "Active" ? "bg-indigo-500" : "bg-slate-200"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <span className={`text-xs w-9 text-right ${overshoot ? "text-red-600 font-bold" : "text-slate-400"}`}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={`border-t-2 border-slate-200 font-semibold ${totalOvershoot ? "bg-red-50" : "bg-slate-50"}`}>
              <td className="px-4 py-3 text-slate-700 font-bold">Project Total</td>
              <td />
              <td className="px-4 py-3 text-right text-slate-600">{totalEstHrs}h</td>
              <td className={`px-4 py-3 text-right font-bold ${totalOvershoot ? "text-red-600" : "text-slate-700"}`}>{totalLoggedHrs}h</td>
              <td className="px-4 py-3 text-right text-slate-600">{fmt(totalEstCost)}</td>
              <td className={`px-4 py-3 text-right text-lg font-bold ${totalOvershoot ? "text-red-700" : "text-indigo-700"}`}>
                {totalOvershoot ? `−${fmt(Math.abs(totalVariance))}` : fmt(totalCurrentCost)}
              </td>
              <td className={`px-4 py-3 text-right font-bold ${totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalVariance >= 0 ? `+${fmt(totalVariance)}` : `−${fmt(Math.abs(totalVariance))}`}
              </td>
              <td className="px-4 py-3 text-right text-slate-500">{completionPct}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
