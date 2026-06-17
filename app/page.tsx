"use client";
import Link from "next/link";
import ProjectBanner from "./_components/ProjectBanner";

const stats = [
  { label: "Total Tasks", value: "142", sub: "+12 this week", color: "bg-indigo-500" },
  { label: "Active Sprints", value: "3", sub: "2 on track", color: "bg-emerald-500" },
  { label: "Open Bugs", value: "18", sub: "5 critical", color: "bg-red-500" },
  { label: "Hours Logged", value: "486", sub: "this month", color: "bg-amber-500" },
];

const recentTasks = [
  { id: "T-101", title: "Implement user authentication", type: "Story", status: "In Progress", assignee: "Rahul S.", sp: 5 },
  { id: "T-102", title: "Fix login page redirect bug", type: "Bug", status: "Review", assignee: "Priya M.", sp: 2 },
  { id: "T-103", title: "Setup CI/CD pipeline", type: "Task", status: "To Do", assignee: "Amit K.", sp: 3 },
  { id: "T-104", title: "Design dashboard wireframes", type: "Story", status: "Done", assignee: "Sneha R.", sp: 4 },
  { id: "T-105", title: "Database schema migration", type: "R&D", status: "Testing", assignee: "Vikram P.", sp: 8 },
];

const typeColors: Record<string, string> = {
  Story: "bg-blue-100 text-blue-700",
  Bug: "bg-red-100 text-red-700",
  Task: "bg-purple-100 text-purple-700",
  Epic: "bg-orange-100 text-orange-700",
  "R&D": "bg-yellow-100 text-yellow-700",
};

const statusColors: Record<string, string> = {
  "To Do": "bg-slate-100 text-slate-600",
  "In Progress": "bg-blue-100 text-blue-700",
  Review: "bg-purple-100 text-purple-700",
  Testing: "bg-amber-100 text-amber-700",
  Done: "bg-green-100 text-green-700",
  Reopen: "bg-red-100 text-red-700",
};

const sprints = [
  { name: "Sprint 4", start: "May 15", end: "May 28", capacity: 40, used: 38, tasks: 12, done: 8 },
  { name: "Sprint 5", start: "May 29", end: "Jun 11", capacity: 40, used: 22, tasks: 8, done: 2 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <ProjectBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back — here&apos;s your project overview</p>
        </div>
        <div className="text-sm text-slate-500">May 21, 2026</div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center text-white text-sm font-bold`}>
              {s.value.slice(0, 3)}
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-sm font-medium text-slate-600">{s.label}</div>
              <div className="text-xs text-slate-400">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-700">Recent Tasks</h2>
            <Link href="/board" className="text-xs text-indigo-600 hover:underline">View Board →</Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100">
                <th className="text-left pb-2">ID</th>
                <th className="text-left pb-2">Title</th>
                <th className="text-left pb-2">Type</th>
                <th className="text-left pb-2">Status</th>
                <th className="text-left pb-2">SP</th>
                <th className="text-left pb-2">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2 text-indigo-600 font-mono text-xs">{t.id}</td>
                  <td className="py-2 text-slate-700 max-w-[180px] truncate">{t.title}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[t.type] ?? "bg-gray-100 text-gray-600"}`}>{t.type}</span>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[t.status] ?? "bg-gray-100"}`}>{t.status}</span>
                  </td>
                  <td className="py-2 text-slate-500">{t.sp}</td>
                  <td className="py-2 text-slate-500 text-xs">{t.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">Active Sprints</h2>
            <Link href="/planning" className="text-xs text-indigo-600 hover:underline">Manage →</Link>
          </div>
          {sprints.map((s) => {
            const pct = Math.round((s.used / s.capacity) * 100);
            const over = s.used > s.capacity;
            return (
              <div key={s.name} className="border border-slate-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700 text-sm">{s.name}</span>
                  <span className={`text-xs font-bold ${over ? "text-red-600" : "text-emerald-600"}`}>{pct}%</span>
                </div>
                <div className="text-xs text-slate-400 mb-2">{s.start} – {s.end}</div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                  <div className={`h-1.5 rounded-full ${over ? "bg-red-500" : "bg-indigo-500"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{s.used}h / {s.capacity}h</span>
                  <span>{s.done}/{s.tasks} done</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { href: "/scope", icon: "📋", label: "Scope & Backlog", desc: "Manage WBS, epics, stories" },
          { href: "/planning", icon: "📅", label: "Sprint Planning", desc: "Estimate & schedule sprints" },
          { href: "/board", icon: "🗂", label: "Task Board", desc: "Kanban workflow execution" },
          { href: "/tracking", icon: "⏱", label: "Time Tracking", desc: "Log hours & track cost" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow group">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600">{item.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
