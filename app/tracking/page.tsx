"use client";
import { useState } from "react";
import ProjectBanner from "../_components/ProjectBanner";

type TimeEntry = {
  id: string; taskId: string; taskTitle: string; taskType: string;
  date: string; hours: number; user: string; comment: string; sprint: string;
};

const teamMembers = ["Rahul S.", "Priya M.", "Amit K.", "Sneha R.", "Vikram P."];

const initialEntries: TimeEntry[] = [
  // ── Sprint 1 (total: 118h) ──────────────────────────────────────────────
  { id: "L-101", taskId: "T-S01", taskTitle: "User registration API", taskType: "Story", date: "2026-03-03", hours: 8, user: "Rahul S.", comment: "Registration endpoint created", sprint: "Sprint 1" },
  { id: "L-102", taskId: "T-T01", taskTitle: "Setup project scaffolding", taskType: "Task", date: "2026-03-03", hours: 8, user: "Priya M.", comment: "Folder structure and base config done", sprint: "Sprint 1" },
  { id: "L-103", taskId: "T-T02", taskTitle: "Configure CI/CD pipeline", taskType: "Task", date: "2026-03-04", hours: 8, user: "Amit K.", comment: "GitHub Actions workflow created", sprint: "Sprint 1" },
  { id: "L-104", taskId: "T-E01", taskTitle: "Architecture planning & review", taskType: "Epic", date: "2026-03-04", hours: 8, user: "Vikram P.", comment: "System design document completed", sprint: "Sprint 1" },
  { id: "L-105", taskId: "T-S02", taskTitle: "User login UI design", taskType: "Story", date: "2026-03-05", hours: 8, user: "Sneha R.", comment: "Login screens designed in Figma", sprint: "Sprint 1" },
  { id: "L-106", taskId: "T-S01", taskTitle: "User registration DB schema", taskType: "Story", date: "2026-03-06", hours: 6, user: "Rahul S.", comment: "Schema migration applied", sprint: "Sprint 1" },
  { id: "L-107", taskId: "T-B01", taskTitle: "Fix form validation bug", taskType: "Bug", date: "2026-03-06", hours: 4, user: "Priya M.", comment: "Validation logic corrected", sprint: "Sprint 1" },
  { id: "L-108", taskId: "T-T03", taskTitle: "Docker containerization", taskType: "Task", date: "2026-03-09", hours: 8, user: "Amit K.", comment: "Docker compose setup complete", sprint: "Sprint 1" },
  { id: "L-109", taskId: "T-R01", taskTitle: "Tech stack evaluation", taskType: "R&N", date: "2026-03-09", hours: 6, user: "Vikram P.", comment: "Final stack recommendations documented", sprint: "Sprint 1" },
  { id: "L-110", taskId: "T-S03", taskTitle: "Dashboard wireframes", taskType: "Story", date: "2026-03-10", hours: 7, user: "Sneha R.", comment: "Wireframes approved by PM", sprint: "Sprint 1" },
  { id: "L-111", taskId: "T-S04", taskTitle: "JWT token implementation", taskType: "Story", date: "2026-03-10", hours: 8, user: "Rahul S.", comment: "JWT signing and refresh logic done", sprint: "Sprint 1" },
  { id: "L-112", taskId: "T-S05", taskTitle: "Frontend routing setup", taskType: "Story", date: "2026-03-11", hours: 6, user: "Priya M.", comment: "Next.js App Router configured", sprint: "Sprint 1" },
  { id: "L-113", taskId: "T-T04", taskTitle: "Database migration scripts", taskType: "Task", date: "2026-03-11", hours: 4, user: "Amit K.", comment: "Migration scripts tested on staging", sprint: "Sprint 1" },
  { id: "L-114", taskId: "T-S06", taskTitle: "API gateway setup", taskType: "Story", date: "2026-03-12", hours: 8, user: "Vikram P.", comment: "Gateway routing configured", sprint: "Sprint 1" },
  { id: "L-115", taskId: "T-S07", taskTitle: "Component library bootstrap", taskType: "Story", date: "2026-03-12", hours: 7, user: "Sneha R.", comment: "Base component library scaffolded", sprint: "Sprint 1" },
  { id: "L-116", taskId: "T-B02", taskTitle: "Auth edge case handling", taskType: "Bug", date: "2026-03-13", hours: 2, user: "Rahul S.", comment: "Token expiry edge case fixed", sprint: "Sprint 1" },
  { id: "L-117", taskId: "T-T05", taskTitle: "Unit test setup", taskType: "Task", date: "2026-03-13", hours: 4, user: "Priya M.", comment: "Jest + React Testing Library configured", sprint: "Sprint 1" },
  { id: "L-118", taskId: "T-T06", taskTitle: "Server monitoring setup", taskType: "Task", date: "2026-03-14", hours: 3, user: "Amit K.", comment: "Prometheus + Grafana configured", sprint: "Sprint 1" },
  { id: "L-119", taskId: "T-R02", taskTitle: "Performance baseline benchmarks", taskType: "R&N", date: "2026-03-14", hours: 5, user: "Vikram P.", comment: "Baseline metrics recorded", sprint: "Sprint 1" },

  // ── Sprint 2 (total: 115h) ──────────────────────────────────────────────
  { id: "L-201", taskId: "T-N01", taskTitle: "Email notification service", taskType: "Story", date: "2026-03-17", hours: 8, user: "Rahul S.", comment: "Email templates and SMTP configured", sprint: "Sprint 2" },
  { id: "L-202", taskId: "T-N02", taskTitle: "Notification UI components", taskType: "Story", date: "2026-03-17", hours: 8, user: "Priya M.", comment: "Toast and badge components built", sprint: "Sprint 2" },
  { id: "L-203", taskId: "T-N03", taskTitle: "Push notification setup", taskType: "Task", date: "2026-03-18", hours: 8, user: "Amit K.", comment: "FCM integration complete", sprint: "Sprint 2" },
  { id: "L-204", taskId: "T-N04", taskTitle: "Notification queue design", taskType: "Epic", date: "2026-03-18", hours: 8, user: "Vikram P.", comment: "Queue architecture finalized", sprint: "Sprint 2" },
  { id: "L-205", taskId: "T-N05", taskTitle: "Notification preference settings UI", taskType: "Story", date: "2026-03-19", hours: 8, user: "Sneha R.", comment: "User settings screens designed", sprint: "Sprint 2" },
  { id: "L-206", taskId: "T-R01", taskTitle: "User role management API", taskType: "Story", date: "2026-03-20", hours: 7, user: "Rahul S.", comment: "RBAC endpoints implemented", sprint: "Sprint 2" },
  { id: "L-207", taskId: "T-R02", taskTitle: "Role assignment UI", taskType: "Story", date: "2026-03-20", hours: 6, user: "Priya M.", comment: "Admin role management screens done", sprint: "Sprint 2" },
  { id: "L-208", taskId: "T-T10", taskTitle: "Load balancer config", taskType: "Task", date: "2026-03-23", hours: 5, user: "Amit K.", comment: "Nginx load balancer configured", sprint: "Sprint 2" },
  { id: "L-209", taskId: "T-R03", taskTitle: "Redis caching layer", taskType: "R&N", date: "2026-03-23", hours: 8, user: "Vikram P.", comment: "Redis caching strategy implemented", sprint: "Sprint 2" },
  { id: "L-210", taskId: "T-N06", taskTitle: "In-app notification badge", taskType: "Story", date: "2026-03-24", hours: 5, user: "Sneha R.", comment: "Notification dot and counter UI done", sprint: "Sprint 2" },
  { id: "L-211", taskId: "T-B10", taskTitle: "Notification delivery failure bug", taskType: "Bug", date: "2026-03-24", hours: 3, user: "Rahul S.", comment: "Retry logic added", sprint: "Sprint 2" },
  { id: "L-212", taskId: "T-T11", taskTitle: "End-to-end test suite", taskType: "Task", date: "2026-03-25", hours: 7, user: "Priya M.", comment: "Cypress E2E tests written for auth flows", sprint: "Sprint 2" },
  { id: "L-213", taskId: "T-T12", taskTitle: "SSL certificate setup", taskType: "Task", date: "2026-03-25", hours: 3, user: "Amit K.", comment: "Lets Encrypt certs installed", sprint: "Sprint 2" },
  { id: "L-214", taskId: "T-R04", taskTitle: "API rate limiting middleware", taskType: "Story", date: "2026-03-26", hours: 6, user: "Vikram P.", comment: "Rate limiting per endpoint implemented", sprint: "Sprint 2" },
  { id: "L-215", taskId: "T-N07", taskTitle: "Notification history screen", taskType: "Story", date: "2026-03-26", hours: 4, user: "Sneha R.", comment: "History list and filter UI done", sprint: "Sprint 2" },
  { id: "L-216", taskId: "T-T13", taskTitle: "API documentation", taskType: "Task", date: "2026-03-27", hours: 2, user: "Rahul S.", comment: "Swagger docs published", sprint: "Sprint 2" },
  { id: "L-217", taskId: "T-T14", taskTitle: "Code review and refactor", taskType: "Task", date: "2026-03-28", hours: 7, user: "Vikram P.", comment: "Sprint 2 code review cleanup done", sprint: "Sprint 2" },

  // ── Sprint 3 (total: 102h) ──────────────────────────────────────────────
  { id: "L-301", taskId: "T-A01", taskTitle: "Admin dashboard layout", taskType: "Story", date: "2026-04-07", hours: 8, user: "Rahul S.", comment: "Admin panel scaffolded", sprint: "Sprint 3" },
  { id: "L-302", taskId: "T-A02", taskTitle: "Admin user management table", taskType: "Story", date: "2026-04-07", hours: 8, user: "Priya M.", comment: "Data table with search and filter done", sprint: "Sprint 3" },
  { id: "L-303", taskId: "T-A03", taskTitle: "Kubernetes deployment setup", taskType: "Task", date: "2026-04-08", hours: 8, user: "Amit K.", comment: "K8s manifests created and deployed", sprint: "Sprint 3" },
  { id: "L-304", taskId: "T-A04", taskTitle: "Analytics events integration", taskType: "Story", date: "2026-04-08", hours: 8, user: "Vikram P.", comment: "Mixpanel events tracked", sprint: "Sprint 3" },
  { id: "L-305", taskId: "T-A05", taskTitle: "Reporting dashboard designs", taskType: "Story", date: "2026-04-09", hours: 8, user: "Sneha R.", comment: "Charts and KPIs designed", sprint: "Sprint 3" },
  { id: "L-306", taskId: "T-A06", taskTitle: "Audit log API", taskType: "Story", date: "2026-04-10", hours: 7, user: "Rahul S.", comment: "Audit trail stored and queryable", sprint: "Sprint 3" },
  { id: "L-307", taskId: "T-A07", taskTitle: "Bulk export CSV feature", taskType: "Story", date: "2026-04-10", hours: 7, user: "Priya M.", comment: "CSV export with filters implemented", sprint: "Sprint 3" },
  { id: "L-308", taskId: "T-T20", taskTitle: "Database index optimization", taskType: "Task", date: "2026-04-13", hours: 4, user: "Amit K.", comment: "Slow queries identified and indexed", sprint: "Sprint 3" },
  { id: "L-309", taskId: "T-R10", taskTitle: "GraphQL vs REST evaluation", taskType: "R&N", date: "2026-04-13", hours: 7, user: "Vikram P.", comment: "REST maintained for consistency", sprint: "Sprint 3" },
  { id: "L-310", taskId: "T-A08", taskTitle: "Dark mode design pass", taskType: "Story", date: "2026-04-14", hours: 6, user: "Sneha R.", comment: "Dark theme tokens defined", sprint: "Sprint 3" },
  { id: "L-311", taskId: "T-B20", taskTitle: "Session timeout bug fix", taskType: "Bug", date: "2026-04-14", hours: 4, user: "Rahul S.", comment: "Session refresh interval corrected", sprint: "Sprint 3" },
  { id: "L-312", taskId: "T-T21", taskTitle: "Security penetration test", taskType: "Task", date: "2026-04-15", hours: 6, user: "Priya M.", comment: "Pen test results reviewed and patched", sprint: "Sprint 3" },
  { id: "L-313", taskId: "T-T22", taskTitle: "Auto-scaling policy config", taskType: "Task", date: "2026-04-15", hours: 5, user: "Amit K.", comment: "HPA rules set for API pods", sprint: "Sprint 3" },
  { id: "L-314", taskId: "T-A09", taskTitle: "Real-time dashboard via WebSockets", taskType: "Story", date: "2026-04-16", hours: 8, user: "Vikram P.", comment: "Socket.IO integration done", sprint: "Sprint 3" },
  { id: "L-315", taskId: "T-A10", taskTitle: "Mobile responsive audit", taskType: "Story", date: "2026-04-16", hours: 6, user: "Sneha R.", comment: "All screens checked on mobile viewports", sprint: "Sprint 3" },
  { id: "L-316", taskId: "T-T23", taskTitle: "Sprint 3 code review", taskType: "Task", date: "2026-04-17", hours: 3, user: "Rahul S.", comment: "All PRs reviewed and merged", sprint: "Sprint 3" },
  { id: "L-317", taskId: "T-T24", taskTitle: "Sprint 3 regression testing", taskType: "Task", date: "2026-04-18", hours: 3, user: "Priya M.", comment: "No regressions found", sprint: "Sprint 3" },

  // ── Sprint 4 (total: 23h — active, partial) ─────────────────────────────
  { id: "L-401", taskId: "T-101", taskTitle: "Implement user authentication", taskType: "Story", date: "2026-05-21", hours: 4, user: "Rahul S.", comment: "Completed JWT signing logic", sprint: "Sprint 4" },
  { id: "L-402", taskId: "T-102", taskTitle: "Fix login redirect bug", taskType: "Bug", date: "2026-05-21", hours: 2, user: "Priya M.", comment: "Root cause identified, fix in review", sprint: "Sprint 4" },
  { id: "L-403", taskId: "T-105", taskTitle: "Redis evaluation", taskType: "R&N", date: "2026-05-20", hours: 6, user: "Vikram P.", comment: "Benchmarks done, Redis preferred", sprint: "Sprint 4" },
  { id: "L-404", taskId: "T-103", taskTitle: "Setup CI/CD pipeline", taskType: "Task", date: "2026-05-20", hours: 3, user: "Amit K.", comment: "GitHub Actions workflow created", sprint: "Sprint 4" },
  { id: "L-405", taskId: "T-104", taskTitle: "Design dashboard wireframes", taskType: "Story", date: "2026-05-19", hours: 5, user: "Sneha R.", comment: "All screens completed in Figma", sprint: "Sprint 4" },
  { id: "L-406", taskId: "T-101", taskTitle: "Implement user authentication", taskType: "Story", date: "2026-05-19", hours: 3, user: "Rahul S.", comment: "Refresh token endpoint setup", sprint: "Sprint 4" },
];

const SPRINT_TARGETS: Record<string, number> = {
  "Sprint 1": 120, "Sprint 2": 120, "Sprint 3": 120, "Sprint 4": 120,
};

const typeColors: Record<string, string> = {
  Story: "bg-blue-100 text-blue-700", Bug: "bg-red-100 text-red-700",
  Task: "bg-purple-100 text-purple-700", "R&N": "bg-yellow-100 text-yellow-700",
  Epic: "bg-orange-100 text-orange-700", "Sub-Task": "bg-slate-100 text-slate-600",
};

export default function TrackingPage() {
  const [entries, setEntries] = useState<TimeEntry[]>(initialEntries);
  const [showLogForm, setShowLogForm] = useState(false);
  const [newLog, setNewLog] = useState({ taskId: "", taskTitle: "", taskType: "Task", hours: 1, comment: "", user: "Rahul S.", sprint: "Sprint 4" });
  const [sprintFilter, setSprintFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");

  const addLog = () => {
    if (!newLog.taskTitle || !newLog.hours) return;
    const entry: TimeEntry = {
      id: `L-${String(entries.length + 1).padStart(3, "0")}`,
      taskId: newLog.taskId || `T-${Date.now().toString().slice(-3)}`,
      taskTitle: newLog.taskTitle, taskType: newLog.taskType,
      date: new Date().toISOString().split("T")[0],
      hours: newLog.hours, user: newLog.user, comment: newLog.comment, sprint: newLog.sprint,
    };
    setEntries((prev) => [entry, ...prev]);
    setNewLog({ taskId: "", taskTitle: "", taskType: "Task", hours: 1, comment: "", user: "Rahul S.", sprint: "Sprint 4" });
    setShowLogForm(false);
  };

  const filtered = entries.filter((e) => {
    const ms = sprintFilter === "All" || e.sprint === sprintFilter;
    const mu = userFilter === "All" || e.user === userFilter;
    return ms && mu;
  });

  const totalLogged = filtered.reduce((a, e) => a + e.hours, 0);
  const totalProjectHours = entries.reduce((a, e) => a + e.hours, 0);
  const currentSprintHours = entries.filter((e) => e.sprint === "Sprint 4").reduce((a, e) => a + e.hours, 0);
  const sprints = ["All", ...Array.from(new Set(entries.map((e) => e.sprint))).sort()];

  // Per-sprint hours for breakdown (shown when a specific sprint is selected)
  const sprintBreakdown = Object.entries(SPRINT_TARGETS).map(([name, target]) => {
    const hrs = entries.filter((e) => e.sprint === name).reduce((a, e) => a + e.hours, 0);
    return { name, hrs, target, pct: Math.min(Math.round((hrs / target) * 100), 100), isActive: name === "Sprint 4" };
  });

  return (
    <div className="p-6 space-y-4">
      <ProjectBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Time Tracking</h1>
          <p className="text-sm text-slate-500">Log hours against any task type · all sprints</p>
        </div>
        <button onClick={() => setShowLogForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
          + Log Time
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Project Hours", value: `${totalProjectHours}h`, sub: "across all sprints", color: "bg-purple-500" },
          { label: "Current Sprint Hours", value: `${currentSprintHours}h`, sub: "Sprint 4 (active)", color: "bg-indigo-500" },
          { label: "Log Entries", value: String(entries.length), sub: "all sprints", color: "bg-emerald-500" },
          { label: "Unique Members", value: String(new Set(entries.map((e) => e.user)).size), sub: "contributors", color: "bg-amber-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-4">
            <div className={`text-xs font-medium text-white px-2 py-0.5 rounded ${s.color} w-fit mb-2`}>{s.label}</div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Sprint Hours Breakdown — always visible */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Hours by Sprint</h3>
        <div className="grid grid-cols-4 gap-3">
          {sprintBreakdown.map((sp) => (
            <button key={sp.name} onClick={() => setSprintFilter(sp.name === sprintFilter ? "All" : sp.name)}
              className={`rounded-lg p-3 border text-left transition-all ${sprintFilter === sp.name ? "border-indigo-400 bg-indigo-50" : sp.isActive ? "border-indigo-200 bg-indigo-50/50 hover:border-indigo-300" : "border-slate-100 hover:border-slate-200"}`}>
              <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                {sp.name}{sp.isActive && <span className="text-indigo-600 font-semibold">(Active)</span>}
              </div>
              <div className="text-xl font-bold text-slate-800">{sp.hrs}h</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div className={`h-1.5 rounded-full ${sp.isActive ? "bg-indigo-500" : "bg-green-500"}`} style={{ width: `${sp.pct}%` }} />
              </div>
              <div className="text-xs text-slate-400 mt-1">{sp.pct}% of {sp.target}h target</div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters + Log Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sprint:</span>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
              {sprints.map((s) => (
                <button key={s} onClick={() => setSprintFilter(s)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${sprintFilter === s ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>{s}</button>
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium ml-2">Member:</span>
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white text-slate-600"
              value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
              <option>All</option>
              {teamMembers.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <span className="text-xs text-slate-500">{filtered.length} entries · <strong>{totalLogged}h</strong> {sprintFilter === "All" ? "total project" : sprintFilter}</span>
        </div>

        {showLogForm && (
          <div className="px-4 py-4 bg-indigo-50 border-b border-indigo-100 space-y-3">
            <div className="text-sm font-semibold text-indigo-700">Log Time Entry</div>
            <div className="grid grid-cols-6 gap-3">
              <input className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Task title *"
                value={newLog.taskTitle} onChange={(e) => setNewLog((p) => ({ ...p, taskTitle: e.target.value }))} />
              <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Task ID (optional)"
                value={newLog.taskId} onChange={(e) => setNewLog((p) => ({ ...p, taskId: e.target.value }))} />
              <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                value={newLog.taskType} onChange={(e) => setNewLog((p) => ({ ...p, taskType: e.target.value }))}>
                {["Task", "Story", "Bug", "Epic", "Sub-Task", "Branch Bug", "R&N"].map((t) => <option key={t}>{t}</option>)}
              </select>
              <input type="number" step="0.5" min="0.5" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Hours"
                value={newLog.hours} onChange={(e) => setNewLog((p) => ({ ...p, hours: Number(e.target.value) }))} />
              <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                value={newLog.user} onChange={(e) => setNewLog((p) => ({ ...p, user: e.target.value }))}>
                {teamMembers.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <input className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Comment / activity notes"
                value={newLog.comment} onChange={(e) => setNewLog((p) => ({ ...p, comment: e.target.value }))} />
              <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                value={newLog.sprint} onChange={(e) => setNewLog((p) => ({ ...p, sprint: e.target.value }))}>
                {["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <button onClick={addLog} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Save Log</button>
              <button onClick={() => setShowLogForm(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-sm rounded-lg">Cancel</button>
            </div>
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2">Log ID</th>
              <th className="text-left px-4 py-2">Task</th>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Hours</th>
              <th className="text-left px-4 py-2">Member</th>
              <th className="text-left px-4 py-2">Sprint</th>
              <th className="text-left px-4 py-2">Comment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="px-4 py-2.5 text-slate-400 font-mono text-xs">{e.id}</td>
                <td className="px-4 py-2.5">
                  <div className="text-indigo-600 text-xs font-mono">{e.taskId}</div>
                  <div className="text-slate-700 text-xs">{e.taskTitle}</div>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${typeColors[e.taskType] ?? "bg-gray-100 text-gray-600"}`}>{e.taskType}</span>
                </td>
                <td className="px-4 py-2.5 text-slate-500 text-xs">{e.date}</td>
                <td className="px-4 py-2.5"><span className="font-semibold text-slate-700">{e.hours}h</span></td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-xs text-indigo-700 font-bold">{e.user[0]}</div>
                    <span className="text-slate-600 text-xs">{e.user}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-slate-500 text-xs">{e.sprint}</td>
                <td className="px-4 py-2.5 text-slate-400 text-xs">{e.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
          <span>{filtered.length} log entries</span>
          <span>Showing: <strong>{totalLogged}h</strong> · Project Total: <strong>{totalProjectHours}h</strong></span>
        </div>
      </div>
    </div>
  );
}
