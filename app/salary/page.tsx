"use client";
import { useState } from "react";

type LeaveType = "Full Day" | "Half Day" | "Short Leave";

type LeaveEntry = {
  id: string;
  memberId: string;
  date: string;
  type: LeaveType;
  hours: number; // Full Day=8, Half Day=4, Short Leave=custom
  approved: boolean;
};

type DayLog = {
  date: string;
  hoursLogged: number;
};

type Member = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  ratePerHour: number;
  hrApprovedSalary: number;
  dailyLogs: DayLog[];
};

const MONTHS = [
  { value: "2026-05", label: "May 2026" },
  { value: "2026-04", label: "Apr 2026" },
  { value: "2026-03", label: "Mar 2026" },
];

const initialMembers: Member[] = [
  {
    id: "m1", name: "Rahul S.", role: "Backend Dev", avatar: "R", ratePerHour: 800, hrApprovedSalary: 160000,
    dailyLogs: [
      { date: "2026-05-01", hoursLogged: 8 }, { date: "2026-05-02", hoursLogged: 9 },
      { date: "2026-05-05", hoursLogged: 8 }, { date: "2026-05-06", hoursLogged: 7 },
      { date: "2026-05-07", hoursLogged: 10 }, { date: "2026-05-08", hoursLogged: 8 },
      { date: "2026-05-09", hoursLogged: 8 }, { date: "2026-05-12", hoursLogged: 6 },
      { date: "2026-05-13", hoursLogged: 8 }, { date: "2026-05-14", hoursLogged: 8 },
      { date: "2026-05-15", hoursLogged: 9 }, { date: "2026-05-16", hoursLogged: 8 },
      { date: "2026-05-19", hoursLogged: 8 }, { date: "2026-05-20", hoursLogged: 8 },
      { date: "2026-05-21", hoursLogged: 7 },
    ],
  },
  {
    id: "m2", name: "Priya M.", role: "Frontend Dev", avatar: "P", ratePerHour: 750, hrApprovedSalary: 140000,
    dailyLogs: [
      { date: "2026-05-01", hoursLogged: 8 }, { date: "2026-05-02", hoursLogged: 8 },
      { date: "2026-05-05", hoursLogged: 7 }, { date: "2026-05-06", hoursLogged: 8 },
      { date: "2026-05-07", hoursLogged: 8 }, { date: "2026-05-08", hoursLogged: 6 },
      { date: "2026-05-09", hoursLogged: 8 }, { date: "2026-05-12", hoursLogged: 8 },
      { date: "2026-05-13", hoursLogged: 9 }, { date: "2026-05-14", hoursLogged: 8 },
      { date: "2026-05-15", hoursLogged: 8 }, { date: "2026-05-16", hoursLogged: 8 },
      { date: "2026-05-19", hoursLogged: 7 }, { date: "2026-05-20", hoursLogged: 8 },
      { date: "2026-05-21", hoursLogged: 8 },
    ],
  },
  {
    id: "m3", name: "Amit K.", role: "DevOps", avatar: "A", ratePerHour: 850, hrApprovedSalary: 150000,
    dailyLogs: [
      { date: "2026-05-01", hoursLogged: 8 }, { date: "2026-05-02", hoursLogged: 8 },
      { date: "2026-05-05", hoursLogged: 8 }, { date: "2026-05-06", hoursLogged: 6 },
      { date: "2026-05-07", hoursLogged: 8 }, { date: "2026-05-08", hoursLogged: 8 },
      { date: "2026-05-09", hoursLogged: 11 }, { date: "2026-05-12", hoursLogged: 8 },
      { date: "2026-05-13", hoursLogged: 7 }, { date: "2026-05-14", hoursLogged: 8 },
      { date: "2026-05-15", hoursLogged: 8 }, { date: "2026-05-16", hoursLogged: 8 },
      { date: "2026-05-19", hoursLogged: 8 }, { date: "2026-05-20", hoursLogged: 6 },
      { date: "2026-05-21", hoursLogged: 8 },
    ],
  },
  {
    id: "m4", name: "Sneha R.", role: "UI/UX Designer", avatar: "S", ratePerHour: 700, hrApprovedSalary: 120000,
    dailyLogs: [
      { date: "2026-05-01", hoursLogged: 8 }, { date: "2026-05-02", hoursLogged: 7 },
      { date: "2026-05-05", hoursLogged: 8 }, { date: "2026-05-06", hoursLogged: 8 },
      { date: "2026-05-07", hoursLogged: 6 }, { date: "2026-05-08", hoursLogged: 8 },
      { date: "2026-05-09", hoursLogged: 8 }, { date: "2026-05-12", hoursLogged: 8 },
      { date: "2026-05-13", hoursLogged: 8 }, { date: "2026-05-14", hoursLogged: 7 },
      { date: "2026-05-19", hoursLogged: 8 }, { date: "2026-05-20", hoursLogged: 8 },
      { date: "2026-05-21", hoursLogged: 8 },
    ],
  },
  {
    id: "m5", name: "Vikram P.", role: "Full Stack", avatar: "V", ratePerHour: 900, hrApprovedSalary: 180000,
    dailyLogs: [
      { date: "2026-05-01", hoursLogged: 9 }, { date: "2026-05-02", hoursLogged: 8 },
      { date: "2026-05-05", hoursLogged: 8 }, { date: "2026-05-06", hoursLogged: 8 },
      { date: "2026-05-07", hoursLogged: 8 }, { date: "2026-05-08", hoursLogged: 10 },
      { date: "2026-05-09", hoursLogged: 8 }, { date: "2026-05-12", hoursLogged: 8 },
      { date: "2026-05-13", hoursLogged: 7 }, { date: "2026-05-14", hoursLogged: 8 },
      { date: "2026-05-15", hoursLogged: 9 }, { date: "2026-05-16", hoursLogged: 8 },
      { date: "2026-05-19", hoursLogged: 8 }, { date: "2026-05-20", hoursLogged: 8 },
      { date: "2026-05-21", hoursLogged: 6 },
    ],
  },
];

const initialLeaves: LeaveEntry[] = [
  { id: "lv1", memberId: "m4", date: "2026-05-15", type: "Full Day", hours: 8, approved: true },
  { id: "lv2", memberId: "m4", date: "2026-05-16", type: "Half Day", hours: 4, approved: true },
  { id: "lv3", memberId: "m2", date: "2026-05-08", type: "Short Leave", hours: 2, approved: true },
];

function getMonthStats(member: Member, leaves: LeaveEntry[], month: string) {
  const monthLogs = member.dailyLogs.filter((d) => d.date.startsWith(month));
  const totalRawHours = monthLogs.reduce((a, d) => a + d.hoursLogged, 0);
  const regularHours = monthLogs.reduce((a, d) => a + Math.min(d.hoursLogged, 8), 0);
  const overtimeHours = monthLogs.reduce((a, d) => a + Math.max(0, d.hoursLogged - 8), 0);

  const memberLeaves = leaves.filter((l) => l.memberId === member.id && l.date.startsWith(month) && l.approved);
  const fullDayLeaves = memberLeaves.filter((l) => l.type === "Full Day");
  const halfDayLeaves = memberLeaves.filter((l) => l.type === "Half Day");
  const shortLeaves = memberLeaves.filter((l) => l.type === "Short Leave");

  const leaveHours =
    fullDayLeaves.length * 8 +
    halfDayLeaves.length * 4 +
    shortLeaves.reduce((a, l) => a + l.hours, 0);

  const payableHours = regularHours + leaveHours;
  const salaryCost = payableHours * member.ratePerHour;

  return { totalRawHours, regularHours, overtimeHours, fullDayLeaves, halfDayLeaves, shortLeaves, leaveHours, payableHours, salaryCost };
}

export default function SalaryPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [leaves, setLeaves] = useState<LeaveEntry[]>(initialLeaves);
  const [selectedMonth, setSelectedMonth] = useState("2026-05");
  const [showLeaveModal, setShowLeaveModal] = useState<string | null>(null); // memberId
  const [newLeave, setNewLeave] = useState<{ date: string; type: LeaveType; hours: number }>({ date: "", type: "Full Day", hours: 8 });
  const [editingHrId, setEditingHrId] = useState<string | null>(null);
  const [draftHrSalary, setDraftHrSalary] = useState(0);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label ?? selectedMonth;

  const statsMap = Object.fromEntries(members.map((m) => [m.id, getMonthStats(m, leaves, selectedMonth)]));

  const totalPayable = members.reduce((a, m) => a + statsMap[m.id].payableHours, 0);
  const totalSalaryCost = members.reduce((a, m) => a + statsMap[m.id].salaryCost, 0);
  const totalHrSalary = members.reduce((a, m) => a + m.hrApprovedSalary, 0);

  const addLeave = () => {
    if (!newLeave.date || !showLeaveModal) return;
    const hrs = newLeave.type === "Full Day" ? 8 : newLeave.type === "Half Day" ? 4 : newLeave.hours;
    setLeaves((prev) => [
      ...prev,
      { id: `lv${Date.now()}`, memberId: showLeaveModal, date: newLeave.date, type: newLeave.type, hours: hrs, approved: true },
    ]);
    setNewLeave({ date: "", type: "Full Day", hours: 8 });
    setShowLeaveModal(null);
  };

  const removeLeave = (id: string) => setLeaves((prev) => prev.filter((l) => l.id !== id));

  const saveHrSalary = (id: string) => {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, hrApprovedSalary: draftHrSalary } : m));
    setEditingHrId(null);
  };

  const perfStatus = (cost: number, hr: number) => {
    const ratio = cost / hr;
    if (ratio <= 0.95) return { label: "Under Budget", color: "text-green-600 bg-green-50", bar: "bg-green-500" };
    if (ratio <= 1.05) return { label: "On Track", color: "text-blue-600 bg-blue-50", bar: "bg-blue-500" };
    return { label: "Over HR Budget", color: "text-red-600 bg-red-50", bar: "bg-red-500" };
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Salary Cost</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Regular hours (≤8h/day) + Approved leave hours × Rate · Overtime excluded · compared against HR approved salary
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Month</span>
          <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 bg-white"
            value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-indigo-500">
          <div className="text-xs text-slate-400 mb-1">Total Payable Hours</div>
          <div className="text-3xl font-bold text-indigo-700">{totalPayable}h</div>
          <div className="text-xs text-slate-400 mt-1">{monthLabel} · regular + leave</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
          <div className="text-xs text-slate-400 mb-1">Calculated Salary Cost</div>
          <div className="text-3xl font-bold text-purple-700">₹{totalSalaryCost.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">payable hrs × individual rates</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-emerald-500">
          <div className="text-xs text-slate-400 mb-1">HR Approved Salary Total</div>
          <div className="text-3xl font-bold text-emerald-700">₹{totalHrSalary.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">as approved by HR</div>
        </div>
        <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${totalSalaryCost <= totalHrSalary ? "border-green-500" : "border-red-500"}`}>
          <div className="text-xs text-slate-400 mb-1">Variance (HR − Calculated)</div>
          <div className={`text-3xl font-bold ${totalSalaryCost <= totalHrSalary ? "text-green-600" : "text-red-600"}`}>
            {totalSalaryCost <= totalHrSalary ? "+" : "−"}₹{Math.abs(totalHrSalary - totalSalaryCost).toLocaleString()}
          </div>
          <div className={`text-xs mt-1 font-medium ${totalSalaryCost <= totalHrSalary ? "text-green-500" : "text-red-500"}`}>
            {totalSalaryCost <= totalHrSalary ? "Within HR budget" : "Exceeds HR approved salary"}
          </div>
        </div>
      </div>

      {/* Formula Legend */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 flex flex-wrap gap-4">
        <span><strong>Regular Hours</strong> = daily logged hours capped at 8h/day (paid)</span>
        <span className="text-slate-300">|</span>
        <span><strong>Overtime</strong> = hours beyond 8h/day (NOT included in salary)</span>
        <span className="text-slate-300">|</span>
        <span><strong>Full Day Leave</strong> = 8h paid</span>
        <span className="text-slate-300">|</span>
        <span><strong>Half Day Leave</strong> = 4h paid</span>
        <span className="text-slate-300">|</span>
        <span><strong>Short Leave</strong> = actual hours paid</span>
        <span className="text-slate-300">|</span>
        <span><strong>Salary</strong> = (Regular + Leave) × Rate/hr</span>
      </div>

      {/* Per-member table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-700">Member Salary Breakdown — {monthLabel}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Click "Leaves" to manage approved leave entries · Click HR salary to edit</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Under Budget</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> On Track</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Over HR Budget</span>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2">Member</th>
              <th className="text-right px-4 py-2">Rate/hr</th>
              <th className="text-right px-4 py-2">Raw Logged</th>
              <th className="text-right px-4 py-2">Regular Hrs</th>
              <th className="text-right px-3 py-2 text-amber-500">Overtime</th>
              <th className="text-right px-3 py-2">Leaves</th>
              <th className="text-right px-4 py-2 text-indigo-500">Payable Hrs</th>
              <th className="text-right px-4 py-2">Salary Cost</th>
              <th className="text-right px-4 py-2">HR Salary</th>
              <th className="text-right px-4 py-2">Performance</th>
              <th className="text-center px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const s = statsMap[m.id];
              const perf = perfStatus(s.salaryCost, m.hrApprovedSalary);
              const memberLeaveCount = leaves.filter((l) => l.memberId === m.id && l.date.startsWith(selectedMonth) && l.approved).length;
              const isExpanded = expandedMember === m.id;

              return (
                <>
                  <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-sm text-indigo-700 font-bold">{m.avatar}</div>
                        <div>
                          <div className="font-medium text-slate-700">{m.name}</div>
                          <div className="text-xs text-slate-400">{m.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">₹{m.ratePerHour}/hr</td>
                    <td className="px-4 py-3 text-right text-slate-500">{s.totalRawHours}h</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-700">{s.regularHours}h</td>
                    <td className="px-3 py-3 text-right">
                      {s.overtimeHours > 0
                        ? <span className="text-amber-600 font-medium text-xs bg-amber-50 px-1.5 py-0.5 rounded">{s.overtimeHours}h (excluded)</span>
                        : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => setExpandedMember(isExpanded ? null : m.id)}
                        className="text-xs text-indigo-600 underline underline-offset-2">
                        {s.leaveHours}h ({memberLeaveCount} entries)
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-700">{s.payableHours}h</td>
                    <td className="px-4 py-3 text-right font-bold text-purple-700">₹{s.salaryCost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      {editingHrId === m.id ? (
                        <div className="flex items-center gap-1 justify-end">
                          <input type="number" className="w-24 border border-indigo-200 rounded px-2 py-1 text-xs" value={draftHrSalary}
                            onChange={(e) => setDraftHrSalary(Number(e.target.value))} />
                          <button onClick={() => saveHrSalary(m.id)} className="px-1.5 py-1 bg-green-600 text-white text-xs rounded">✓</button>
                          <button onClick={() => setEditingHrId(null)} className="px-1.5 py-1 bg-slate-200 text-slate-600 text-xs rounded">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingHrId(m.id); setDraftHrSalary(m.hrApprovedSalary); }}
                          className="text-right text-emerald-700 font-semibold hover:underline text-sm">
                          ₹{m.hrApprovedSalary.toLocaleString()}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${perf.bar}`}
                            style={{ width: `${Math.min((s.salaryCost / m.hrApprovedSalary) * 100, 100)}%` }} />
                        </div>
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${perf.color}`}>{perf.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => { setShowLeaveModal(m.id); setNewLeave({ date: "", type: "Full Day", hours: 8 }); }}
                        className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200">+ Leave</button>
                    </td>
                  </tr>

                  {/* Expanded leave details */}
                  {isExpanded && (
                    <tr key={`${m.id}-leaves`} className="bg-indigo-50/40">
                      <td colSpan={11} className="px-8 py-3">
                        <div className="text-xs font-semibold text-indigo-700 mb-2">Approved Leaves — {monthLabel}</div>
                        {leaves.filter((l) => l.memberId === m.id && l.date.startsWith(selectedMonth)).length === 0 ? (
                          <div className="text-xs text-slate-400 italic">No approved leaves this month.</div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {leaves.filter((l) => l.memberId === m.id && l.date.startsWith(selectedMonth)).map((l) => (
                              <div key={l.id} className="flex items-center gap-2 bg-white border border-indigo-100 rounded-lg px-3 py-1.5 text-xs">
                                <span className="font-medium text-slate-700">{l.date}</span>
                                <span className={`px-1.5 py-0.5 rounded font-medium ${l.type === "Full Day" ? "bg-purple-100 text-purple-700" : l.type === "Half Day" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{l.type}</span>
                                <span className="text-green-700 font-semibold">{l.hours}h paid</span>
                                <button onClick={() => removeLeave(l.id)} className="text-red-400 hover:text-red-600 font-bold ml-1">✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t-2 border-slate-200 font-semibold">
              <td className="px-4 py-3 text-slate-700 font-bold">Project Total</td>
              <td />
              <td className="px-4 py-3 text-right text-slate-600">
                {members.reduce((a, m) => a + statsMap[m.id].totalRawHours, 0)}h
              </td>
              <td className="px-4 py-3 text-right text-green-700">
                {members.reduce((a, m) => a + statsMap[m.id].regularHours, 0)}h
              </td>
              <td className="px-3 py-3 text-right text-amber-600 text-xs">
                {members.reduce((a, m) => a + statsMap[m.id].overtimeHours, 0)}h (excl.)
              </td>
              <td className="px-3 py-3 text-right text-slate-600">
                {members.reduce((a, m) => a + statsMap[m.id].leaveHours, 0)}h
              </td>
              <td className="px-4 py-3 text-right text-indigo-700 font-bold">{totalPayable}h</td>
              <td className="px-4 py-3 text-right text-purple-700 font-bold text-base">₹{totalSalaryCost.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-emerald-700 font-bold text-base">₹{totalHrSalary.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">
                <span className={`text-sm font-bold ${totalSalaryCost <= totalHrSalary ? "text-green-600" : "text-red-600"}`}>
                  {totalSalaryCost <= totalHrSalary ? "Within Budget" : "Over Budget"}
                </span>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Leave Add Modal */}
      {showLeaveModal && (() => {
        const m = members.find((mb) => mb.id === showLeaveModal)!;
        const mLeaves = leaves.filter((l) => l.memberId === showLeaveModal && l.date.startsWith(selectedMonth));
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Manage Leaves — {m.name}</h2>
                  <p className="text-xs text-slate-400">{monthLabel}</p>
                </div>
                <button onClick={() => setShowLeaveModal(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
              </div>

              {/* Existing leaves */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {mLeaves.length === 0 && <div className="text-xs text-slate-400 italic">No leaves added yet.</div>}
                {mLeaves.map((l) => (
                  <div key={l.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-slate-700">{l.date}</span>
                      <span className={`px-1.5 py-0.5 rounded font-medium ${l.type === "Full Day" ? "bg-purple-100 text-purple-700" : l.type === "Half Day" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{l.type}</span>
                      <span className="text-green-700">{l.hours}h paid</span>
                    </div>
                    <button onClick={() => removeLeave(l.id)} className="text-red-400 hover:text-red-600 text-xs font-bold">Remove</button>
                  </div>
                ))}
              </div>

              {/* Add new leave */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="text-sm font-semibold text-slate-600">Add Approved Leave</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Date</label>
                    <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                      value={newLeave.date} onChange={(e) => setNewLeave((p) => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Type</label>
                    <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                      value={newLeave.type}
                      onChange={(e) => {
                        const t = e.target.value as LeaveType;
                        setNewLeave((p) => ({ ...p, type: t, hours: t === "Full Day" ? 8 : t === "Half Day" ? 4 : p.hours }));
                      }}>
                      <option>Full Day</option>
                      <option>Half Day</option>
                      <option>Short Leave</option>
                    </select>
                  </div>
                  {newLeave.type === "Short Leave" && (
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Hours</label>
                      <input type="number" step="0.5" min="0.5" max="7.5" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                        value={newLeave.hours} onChange={(e) => setNewLeave((p) => ({ ...p, hours: Number(e.target.value) }))} />
                    </div>
                  )}
                  {newLeave.type !== "Short Leave" && (
                    <div className="flex items-end">
                      <div className="text-xs text-slate-400 pb-2">= {newLeave.type === "Full Day" ? "8h" : "4h"} paid</div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button onClick={() => setShowLeaveModal(null)} className="px-4 py-2 text-sm bg-slate-100 text-slate-600 rounded-lg">Cancel</button>
                  <button onClick={addLeave} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Add Leave</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
