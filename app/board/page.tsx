"use client";
import { useState, useEffect } from "react";
import ProjectBanner from "../_components/ProjectBanner";
import CRMBadge from "../_components/CRMBadge";

type BoardType = "Scrum" | "Kanban" | "Waterfall";
type TaskType = "Task" | "Epic" | "Bug" | "Story" | "Branch Bug" | "Sub-Task" | "R&D";

type Comment = {
  id: string; author: string; text: string; hoursLogged: number; timestamp: string;
};

type Task = {
  id: string; title: string; type: TaskType; status: string;
  assignee: string; assignedBy?: string; dueDate: string; priority: string;
  sprint: string; tags: string[]; subTasks?: string[]; epicId?: string; storyId?: string;
  documents?: string[];
  estimatedHours: number; loggedHours: number; comments: Comment[];
};

type Epic = { id: string; title: string; description: string; startDate: string; endDate: string; status: string };
type Story = { id: string; title: string; epicId: string; status: string };
type Milestone = { id: string; name: string; date: string; status: string };

const DEFAULT_WORKFLOW = ["Backlog Ready", "To Do", "In Progress", "Code Review", "QA Done", "Testing", "Reopen", "Done", "Closed"];

const EPICS: Epic[] = [
  { id: "E-01", title: "User Management Module", description: "Full user lifecycle management including registration, login, roles and permissions.", startDate: "2026-05-01", endDate: "2026-06-30", status: "In Progress" },
  { id: "E-02", title: "Notification System", description: "Email, push and in-app notifications.", startDate: "2026-06-01", endDate: "2026-07-15", status: "Planned" },
];

const STORIES: Story[] = [
  { id: "S-01", title: "As a user I can register with email/password", epicId: "E-01", status: "In Progress" },
  { id: "S-02", title: "As a user I can login and receive JWT token",  epicId: "E-01", status: "Done" },
  { id: "S-03", title: "As admin I can manage user roles and permissions", epicId: "E-01", status: "To Do" },
  { id: "S-04", title: "As a user I receive email notifications",       epicId: "E-02", status: "To Do" },
];

const MILESTONES: Milestone[] = [
  { id: "M1", name: "MVP Release", date: "Jun 15, 2026", status: "On Track" },
  { id: "M2", name: "Beta Launch", date: "Jul 30, 2026", status: "At Risk" },
  { id: "M3", name: "v1.0 Production", date: "Sep 1, 2026", status: "Planned" },
];

const WATERFALL_PHASES = ["Requirements", "Design", "Development", "Testing", "Deployment"];

const initialTasks: Task[] = [
  { id: "T-101", title: "Implement user authentication module", type: "Story", status: "In Progress", assignee: "Rahul S.", assignedBy: "Vikram P.", dueDate: "2026-05-25", priority: "High", sprint: "Sprint 4", tags: ["backend", "auth"], epicId: "E-01", storyId: "S-01", estimatedHours: 20, loggedHours: 23, comments: [{ id: "c1", author: "Rahul S.", text: "Completed JWT middleware, starting session handling.", hoursLogged: 4, timestamp: "2026-05-22 10:30" }, { id: "c2", author: "Rahul S.", text: "OAuth integration done.", hoursLogged: 4, timestamp: "2026-05-23 15:00" }, { id: "c3", author: "Rahul S.", text: "Edge cases for token refresh took longer than expected.", hoursLogged: 15, timestamp: "2026-05-24 18:00" }] },
  { id: "T-102", title: "Fix login page redirect after OAuth", type: "Bug", status: "Review", assignee: "Priya M.", assignedBy: "Rahul S.", dueDate: "2026-05-22", priority: "High", sprint: "Sprint 4", tags: ["frontend"], epicId: "E-01", estimatedHours: 6, loggedHours: 5, comments: [{ id: "c4", author: "Priya M.", text: "Root cause: missing redirect URI in config. Fix applied.", hoursLogged: 5, timestamp: "2026-05-21 14:00" }] },
  { id: "T-103", title: "Setup CI/CD pipeline with GitHub Actions", type: "Task", status: "To Do", assignee: "Amit K.", assignedBy: "Vikram P.", dueDate: "2026-05-28", priority: "Medium", sprint: "Sprint 4", tags: ["devops"], estimatedHours: 12, loggedHours: 0, comments: [] },
  { id: "T-104", title: "Design dashboard wireframes in Figma", type: "Story", status: "Done", assignee: "Sneha R.", assignedBy: "Rahul S.", dueDate: "2026-05-20", priority: "Medium", sprint: "Sprint 4", tags: ["design"], storyId: "S-02", estimatedHours: 16, loggedHours: 16, comments: [{ id: "c5", author: "Sneha R.", text: "All wireframes signed off by product.", hoursLogged: 8, timestamp: "2026-05-19 17:00" }, { id: "c6", author: "Sneha R.", text: "Revisions done after review.", hoursLogged: 8, timestamp: "2026-05-20 12:00" }] },
  { id: "T-105", title: "Evaluate Redis vs Memcached for caching", type: "R&D", status: "Testing", assignee: "Vikram P.", assignedBy: "Amit K.", dueDate: "2026-05-27", priority: "Low", sprint: "Sprint 4", tags: ["research"], estimatedHours: 10, loggedHours: 13.5, comments: [{ id: "c7", author: "Vikram P.", text: "Redis wins on persistence & pub/sub. Deeper analysis on cluster mode required.", hoursLogged: 7, timestamp: "2026-05-24 11:00" }, { id: "c8", author: "Vikram P.", text: "Cluster mode benchmarks completed — took 3.5h extra over estimate.", hoursLogged: 6.5, timestamp: "2026-05-25 16:00" }] },
  { id: "T-106", title: "User registration form validation", type: "Sub-Task", status: "In Progress", assignee: "Priya M.", assignedBy: "Rahul S.", dueDate: "2026-05-23", priority: "High", sprint: "Sprint 4", tags: ["frontend"], storyId: "S-01", estimatedHours: 4, loggedHours: 2, comments: [] },
  { id: "T-107", title: "Main branch has broken CSS import", type: "Branch Bug", status: "Reopen", assignee: "Amit K.", assignedBy: "Priya M.", dueDate: "2026-05-21", priority: "High", sprint: "Sprint 4", tags: ["urgent"], estimatedHours: 3, loggedHours: 4, comments: [{ id: "c9", author: "Amit K.", text: "Initial fix failed on prod build. Traced to webpack config conflict — 1h over estimate.", hoursLogged: 4, timestamp: "2026-05-21 09:00" }] },
  { id: "T-108", title: "Admin panel – role management UI", type: "Story", status: "To Do", assignee: "Rahul S.", assignedBy: "Vikram P.", dueDate: "2026-06-05", priority: "Medium", sprint: "Sprint 5", tags: ["frontend", "admin"], epicId: "E-01", storyId: "S-03", estimatedHours: 32, loggedHours: 0, comments: [] },
  { id: "T-109", title: "API rate limiting middleware", type: "Task", status: "To Do", assignee: "Vikram P.", assignedBy: "Amit K.", dueDate: "2026-06-08", priority: "Medium", sprint: "Sprint 5", tags: ["backend"], estimatedHours: 8, loggedHours: 0, comments: [] },
];

const typeColors: Record<string, string> = {
  Story: "bg-blue-100 text-blue-700 border-blue-200",
  Bug: "bg-red-100 text-red-700 border-red-200",
  Task: "bg-purple-100 text-purple-700 border-purple-200",
  Epic: "bg-orange-100 text-orange-700 border-orange-200",
  "Branch Bug": "bg-red-200 text-red-800 border-red-300",
  "Sub-Task": "bg-slate-100 text-slate-600 border-slate-200",
  "R&D": "bg-yellow-100 text-yellow-700 border-yellow-200",
};
const priorityDot: Record<string, string> = { High: "bg-red-500", Medium: "bg-amber-400", Low: "bg-green-400" };

const STATUS_STYLES: Record<string, { bg: string; header: string; text: string }> = {
  "Backlog Ready": { bg: "bg-sky-50 border-sky-200",       header: "bg-sky-500",     text: "text-sky-700" },
  "To Do":         { bg: "bg-slate-50 border-slate-200",   header: "bg-slate-400",   text: "text-slate-600" },
  "In Progress":   { bg: "bg-blue-50 border-blue-200",     header: "bg-blue-500",    text: "text-blue-700" },
  "Code Review":   { bg: "bg-violet-50 border-violet-200", header: "bg-violet-500",  text: "text-violet-700" },
  "QA Done":       { bg: "bg-emerald-50 border-emerald-200", header: "bg-emerald-500", text: "text-emerald-700" },
  "Review":        { bg: "bg-purple-50 border-purple-200", header: "bg-purple-500",  text: "text-purple-700" },
  "Testing":       { bg: "bg-amber-50 border-amber-200",   header: "bg-amber-500",   text: "text-amber-700" },
  "Reopen":        { bg: "bg-red-50 border-red-200",       header: "bg-red-500",     text: "text-red-700" },
  "Done":          { bg: "bg-green-50 border-green-200",   header: "bg-green-500",   text: "text-green-700" },
  "Closed":        { bg: "bg-gray-50 border-gray-300",     header: "bg-gray-600",    text: "text-gray-700" },
};
function getStatusStyle(status: string) {
  return STATUS_STYLES[status] ?? { bg: "bg-slate-50 border-slate-200", header: "bg-slate-500", text: "text-slate-600" };
}

const boardTypeStyle: Record<BoardType, string> = {
  Scrum: "border-indigo-500 bg-indigo-600", Kanban: "border-teal-500 bg-teal-600", Waterfall: "border-amber-500 bg-amber-600",
};
const milestoneStatusColor: Record<string, string> = {
  "On Track": "bg-green-500", "At Risk": "bg-amber-500", Planned: "bg-slate-400",
};

function KanbanColumn({ col, tasks, onSelect, onDrop }: { col: string; tasks: Task[]; onSelect: (t: Task) => void; onDrop: (taskId: string, newStatus: string) => void }) {
  const style = getStatusStyle(col);
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      className={`flex flex-col w-48 shrink-0 mx-1.5 rounded-xl border transition-all ${style.bg} overflow-hidden ${dragOver ? "ring-2 ring-indigo-400 scale-[1.01] shadow-lg" : ""}`}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOver(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false); }}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const id = e.dataTransfer.getData("taskId"); if (id) onDrop(id, col); }}
    >
      <div className={`${style.header} px-3 py-2 flex items-center justify-between`}>
        <span className="text-white text-xs font-semibold">{col}</span>
        <span className="bg-white/30 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[60px]">
        {tasks.map((task) => (
          <div key={task.id}
            draggable
            onDragStart={(e) => { e.dataTransfer.setData("taskId", task.id); e.dataTransfer.effectAllowed = "move"; (e.currentTarget as HTMLElement).style.opacity = "0.5"; }}
            onDragEnd={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            className="bg-white rounded-lg p-2.5 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border border-white hover:border-indigo-200 select-none"
            onClick={() => onSelect(task)}>
            <div className="flex items-start justify-between gap-1 mb-1.5">
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${typeColors[task.type] ?? "bg-gray-100"}`}>{task.type}</span>
              <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${priorityDot[task.priority] ?? "bg-gray-300"}`} />
            </div>
            <p className="text-xs font-medium text-slate-700 leading-snug mb-1.5">{task.title}</p>
            {/* Epic link chip */}
            {task.epicId && (
              <div className="mb-1">
                <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-mono">{task.epicId}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-500 font-mono">{task.id}</span>
              {/* 📎 only for Story type */}
              {task.type === "Story" && (
                task.storyId ? (
                  <span className="flex items-center gap-0.5 text-blue-500 text-xs" title={`Linked to ${task.storyId}`}>
                    <span>📎</span>
                    <span className="font-mono">{task.storyId}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-red-400 text-xs" title="No user story linked — required before Done">
                    <span>📎</span>
                    <span>Not linked</span>
                  </span>
                )
              )}
            </div>
            {task.assignee && (
              <div className="mt-1.5 flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center text-xs text-indigo-700 font-bold">{task.assignee[0]}</div>
                <span className="text-xs text-slate-400">{task.assignee.split(" ")[0]}</span>
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && <div className="text-center py-6 text-xs text-slate-300">No tasks</div>}
      </div>
    </div>
  );
}

export default function BoardPage() {
  const [boardType, setBoardType] = useState<BoardType>("Scrum");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [sprintFilter, setSprintFilter] = useState("Sprint 4");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedPhase, setSelectedPhase] = useState("Development");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<{ title: string; type: TaskType; priority: string; assignee: string; sprint: string; description: string; startDate: string; endDate: string; epicId: string; storyId: string }>({
    title: "", type: "Task", priority: "Medium", assignee: "", sprint: "Sprint 4", description: "", startDate: "", endDate: "", epicId: "", storyId: "",
  });

  // Workflow customization
  const [workflow, setWorkflow] = useState<string[]>(DEFAULT_WORKFLOW);
  const [showWorkflowEditor, setShowWorkflowEditor] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const PROTECTED = ["To Do", "Done", "Closed"];

  // Publish task estimates + overtime per user to localStorage whenever tasks change
  useEffect(() => {
    try {
      const estimates: Record<string, { assignee: string; estimatedHours: number; loggedHours: number }> = {};
      const overtimeByUser: Record<string, number> = {};
      tasks.forEach((t) => {
        estimates[t.id] = { assignee: t.assignee, estimatedHours: t.estimatedHours, loggedHours: t.loggedHours };
        const ot = t.loggedHours - t.estimatedHours;
        if (ot > 0 && t.assignee) {
          overtimeByUser[t.assignee] = Math.round(((overtimeByUser[t.assignee] ?? 0) + ot) * 10) / 10;
        }
      });
      localStorage.setItem("pm_task_estimates",  JSON.stringify(estimates));
      localStorage.setItem("pm_overtime_by_user", JSON.stringify(overtimeByUser));
    } catch {}
  }, [tasks]);

  // Story → Done guard
  const [doneWarning, setDoneWarning] = useState<string | null>(null);

  // Log hours + comment form (inside task modal)
  const [logEntry, setLogEntry] = useState({ hours: "", comment: "", author: "" });

  const submitLogEntry = (taskId: string) => {
    const hrs = parseFloat(logEntry.hours);
    if (!logEntry.comment.trim() && !hrs) return;
    const newComment: Comment = {
      id: `cm-${Date.now()}`,
      author: logEntry.author.trim() || "You",
      text: logEntry.comment.trim(),
      hoursLogged: isNaN(hrs) ? 0 : hrs,
      timestamp: new Date().toLocaleString("en-IN", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
    };
    setTasks((prev) => prev.map((t) => t.id === taskId
      ? { ...t, loggedHours: t.loggedHours + newComment.hoursLogged, comments: [newComment, ...t.comments] }
      : t
    ));
    setSelectedTask((prev) => prev && prev.id === taskId
      ? { ...prev, loggedHours: prev.loggedHours + newComment.hoursLogged, comments: [newComment, ...prev.comments] }
      : prev
    );
    setLogEntry({ hours: "", comment: "", author: "" });
  };

  const moveTask = (taskId: string, newStatus: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task?.type === "Story" && (newStatus === "Done" || newStatus === "Closed") && !task.storyId) {
      setDoneWarning(taskId);
      return;
    }
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
    if (selectedTask?.id === taskId) setSelectedTask((prev) => prev ? { ...prev, status: newStatus } : null);
    setDoneWarning(null);
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = { id: `T-${Date.now().toString().slice(-4)}`, ...newTask, status: "To Do", dueDate: "", tags: [], estimatedHours: 0, loggedHours: 0, comments: [] };
    setTasks((prev) => [...prev, task]);
    setNewTask({ title: "", type: "Task", priority: "Medium", assignee: "", sprint: "Sprint 4", description: "", startDate: "", endDate: "", epicId: "", storyId: "" });
    setShowAddTask(false);
  };

  const addCustomStatus = () => {
    const name = newStatusName.trim();
    if (!name || workflow.includes(name)) return;
    setWorkflow((prev) => {
      const doneIdx = prev.indexOf("Done");
      const next = [...prev];
      next.splice(doneIdx, 0, name);
      return next;
    });
    setNewStatusName("");
  };

  const removeStatus = (status: string) => {
    if (PROTECTED.includes(status)) return;
    setWorkflow((prev) => prev.filter((s) => s !== status));
    setTasks((prev) => prev.map((t) => t.status === status ? { ...t, status: "To Do" } : t));
  };

  const filtered = tasks.filter((t) => {
    const matchSprint = sprintFilter === "All" || t.sprint === sprintFilter;
    const matchType = typeFilter === "All" || t.type === typeFilter;
    return matchSprint && matchType;
  });

  const sprints = ["All", ...Array.from(new Set(tasks.map((t) => t.sprint)))];

  const hasEpics = EPICS.length > 0;
  const hasStories = STORIES.length > 0;
  const scrumValid = boardType !== "Scrum" || (hasEpics && hasStories);

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 flex items-center gap-3 flex-wrap"><ProjectBanner /><CRMBadge /></div>

      {/* Header */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 mt-3">
        {/* Board Type Selector */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-semibold text-slate-600">Board Type:</span>
          <div className="flex gap-1.5">
            {(["Scrum", "Kanban", "Waterfall"] as BoardType[]).map((bt) => (
              <button key={bt} onClick={() => setBoardType(bt)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${boardType === bt ? `${boardTypeStyle[bt]} text-white` : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {bt}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-400 ml-2">
            {boardType === "Scrum" && "Iterative · Epics & Stories mandatory · Sprint-based"}
            {boardType === "Kanban" && "Continuous flow · Epics & Stories optional · WIP limits"}
            {boardType === "Waterfall" && "Phase-based delivery · Backlog + Kanban hybrid · Stories optional"}
          </div>
        </div>

        {/* Milestones bar */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Milestones:</span>
          <div className="flex gap-2">
            {MILESTONES.map((m) => (
              <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-full border border-slate-200">
                <div className={`w-2 h-2 rounded-full ${milestoneStatusColor[m.status]}`} />
                <span className="text-xs text-slate-700 font-medium">{m.name}</span>
                <span className="text-xs text-slate-400">{m.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-800">{boardType} Board</h1>
            <p className="text-xs text-slate-500">
              Workflow: {workflow.join(" → ")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowWorkflowEditor(true)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-1">
              ⚙ Customize Workflow
            </button>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
              {sprints.map((s) => (
                <button key={s} onClick={() => setSprintFilter(s)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${sprintFilter === s ? "bg-white shadow text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
                  {s}
                </button>
              ))}
            </div>
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs bg-white text-slate-600"
              value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              {["All", "Task", "Story", "Bug", "Epic", "Branch Bug", "Sub-Task", "R&D"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <button onClick={() => setShowAddTask(true)}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors">
              + Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100 space-y-2">
          <div className="flex items-center gap-3">
            <input className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white" placeholder="Task title *"
              value={newTask.title} onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))} />
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
              value={newTask.type} onChange={(e) => setNewTask((p) => ({ ...p, type: e.target.value as TaskType }))}>
              {["Task", "Story", "Bug", "Epic", "Branch Bug", "Sub-Task", "R&D"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
              value={newTask.priority} onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}>
              {["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
            </select>
            <input className="w-28 border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white" placeholder="Assignee"
              value={newTask.assignee} onChange={(e) => setNewTask((p) => ({ ...p, assignee: e.target.value }))} />
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
              value={newTask.sprint} onChange={(e) => setNewTask((p) => ({ ...p, sprint: e.target.value }))}>
              {["Sprint 4", "Sprint 5", "Sprint 6"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
              value={newTask.epicId} onChange={(e) => setNewTask((p) => ({ ...p, epicId: e.target.value }))}>
              <option value="">— Link to Epic —</option>
              {EPICS.map((e) => <option key={e.id} value={e.id}>{e.id}: {e.title}</option>)}
            </select>
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
              value={newTask.storyId} onChange={(e) => setNewTask((p) => ({ ...p, storyId: e.target.value }))}>
              <option value="">— Link to User Story —</option>
              {STORIES.map((s) => <option key={s.id} value={s.id}>{s.id}: {s.title.slice(0, 40)}</option>)}
            </select>
            <label className="text-xs text-slate-500 shrink-0">Start</label>
            <input type="date" className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
              value={newTask.startDate} onChange={(e) => setNewTask((p) => ({ ...p, startDate: e.target.value }))} />
            <label className="text-xs text-slate-500 shrink-0">End</label>
            <input type="date" className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
              value={newTask.endDate} onChange={(e) => setNewTask((p) => ({ ...p, endDate: e.target.value }))} />
            <button onClick={addTask} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg">Add</button>
            <button onClick={() => setShowAddTask(false)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Scrum mandatory warning */}
      {boardType === "Scrum" && !scrumValid && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 flex items-center gap-2 text-sm text-red-700">
          <span>⚠</span> Scrum board requires linked Epics and User Stories. Go to Planning → Link Items to configure.
        </div>
      )}

      {/* ═══════════════ SCRUM BOARD ═══════════════ */}
      {boardType === "Scrum" && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 shrink-0 border-r border-slate-200 bg-white overflow-y-auto flex flex-col">
            <div className="px-3 py-2 bg-orange-50 border-b border-orange-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-700">EPICS</span>
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Mandatory</span>
              </div>
            </div>
            <div className="p-2 space-y-2 border-b border-slate-100">
              {EPICS.map((epic) => (
                <div key={epic.id} className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => setSelectedEpic(epic)}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-mono text-orange-600">{epic.id}</span>
                    <span className={`ml-auto text-xs px-1.5 py-0.5 rounded ${epic.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{epic.status}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-700 leading-snug">{epic.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{epic.startDate} → {epic.endDate}</div>
                  <div className="text-xs text-orange-600 mt-0.5 hover:underline">View details →</div>
                </div>
              ))}
            </div>
            <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-700">USER STORIES</span>
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Mandatory</span>
              </div>
            </div>
            <div className="p-2 space-y-1.5">
              {STORIES.map((story) => (
                <div key={story.id} className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-mono text-blue-600">{story.id}</span>
                    <span className={`ml-auto text-xs px-1 py-0.5 rounded ${story.status === "Done" ? "bg-green-100 text-green-700" : story.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{story.status}</span>
                  </div>
                  <div className="text-xs text-slate-700 leading-snug">{story.title}</div>
                  <div className="text-xs text-orange-500 mt-0.5 font-mono">{story.epicId}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 overflow-x-auto p-3">
            {workflow.map((col) => (
              <KanbanColumn key={col} col={col} tasks={filtered.filter((t) => t.status === col)} onSelect={setSelectedTask} onDrop={moveTask} />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ KANBAN BOARD ═══════════════ */}
      {boardType === "Kanban" && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-56 shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
            <div className="px-3 py-2 bg-teal-50 border-b border-teal-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-teal-700">EPICS</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Optional</span>
              </div>
            </div>
            <div className="p-2 space-y-1.5 border-b border-slate-100">
              {EPICS.map((epic) => (
                <div key={epic.id} className="bg-slate-50 border border-slate-200 rounded-lg p-2 cursor-pointer hover:bg-orange-50 transition-colors" onClick={() => setSelectedEpic(epic)}>
                  <div className="text-xs font-mono text-orange-600">{epic.id}</div>
                  <div className="text-xs text-slate-700 leading-snug">{epic.title}</div>
                </div>
              ))}
            </div>
            <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-700">STORIES</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Optional</span>
              </div>
            </div>
            <div className="p-2 space-y-1.5">
              {STORIES.map((story) => (
                <div key={story.id} className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <div className="text-xs font-mono text-blue-600">{story.id}</div>
                  <div className="text-xs text-slate-600 leading-snug">{story.title}</div>
                  <div className="text-xs text-orange-500 font-mono mt-0.5">{story.epicId}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 overflow-x-auto p-3">
            {workflow.map((col) => (
              <KanbanColumn key={col} col={col} tasks={filtered.filter((t) => t.status === col)} onSelect={setSelectedTask} onDrop={moveTask} />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ WATERFALL BOARD ═══════════════ */}
      {boardType === "Waterfall" && (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 shrink-0 border-r border-slate-200 bg-white overflow-y-auto">
            <div className="px-3 py-2 bg-amber-50 border-b border-amber-100">
              <span className="text-xs font-semibold text-amber-700">PHASES / BACKLOG</span>
            </div>
            <div className="p-2 space-y-1">
              {WATERFALL_PHASES.map((phase) => {
                const phTasks = tasks.filter((t) =>
                  (phase === "Development" && ["In Progress", "To Do"].includes(t.status)) ||
                  (phase === "Testing" && ["Testing", "Review"].includes(t.status)) ||
                  (phase === "Deployment" && t.status === "Done") ||
                  (phase === "Requirements" && t.type === "Story") ||
                  (phase === "Design" && t.tags?.includes("design"))
                );
                return (
                  <button key={phase} onClick={() => setSelectedPhase(phase)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedPhase === phase ? "border-amber-400 bg-amber-50" : "border-slate-100 hover:bg-slate-50"}`}>
                    <div className={`text-xs font-semibold ${selectedPhase === phase ? "text-amber-700" : "text-slate-600"}`}>{phase}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{phTasks.length} items</div>
                    <div className="w-full bg-slate-100 rounded-full h-1 mt-1.5">
                      <div className="h-1 rounded-full bg-amber-400" style={{ width: `${Math.min((phTasks.filter((t) => t.status === "Done").length / Math.max(phTasks.length, 1)) * 100, 100)}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-3 py-2 bg-blue-50 border-t border-slate-100 border-b border-blue-100 mt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-700">USER STORIES</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-1 py-0.5 rounded">Optional</span>
              </div>
            </div>
            <div className="p-2 space-y-1.5">
              {STORIES.slice(0, 3).map((story) => (
                <div key={story.id} className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <div className="text-xs font-mono text-blue-600">{story.id}</div>
                  <div className="text-xs text-slate-600 leading-snug truncate">{story.title}</div>
                  <div className="text-xs text-orange-500 font-mono mt-0.5">{story.epicId}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
              <span className="text-sm font-semibold text-amber-800">Phase: {selectedPhase}</span>
              <span className="text-xs text-amber-600">— Epics optional in Waterfall</span>
            </div>
            <div className="flex flex-1 overflow-x-auto p-3">
              {workflow.map((col) => (
                <KanbanColumn key={col} col={col} tasks={filtered.filter((t) => t.status === col)} onSelect={setSelectedTask} onDrop={moveTask} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════ WORKFLOW CUSTOMIZATION MODAL ════ */}
      {showWorkflowEditor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowWorkflowEditor(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[480px]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-800">Customize Workflow</h2>
                <p className="text-xs text-slate-400 mt-0.5">Add or remove status columns · To Do, Done & Closed are protected</p>
              </div>
              <button onClick={() => setShowWorkflowEditor(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Current statuses */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Current Statuses</div>
                <div className="space-y-2">
                  {workflow.map((status) => {
                    const style = getStatusStyle(status);
                    const isProtected = PROTECTED.includes(status);
                    return (
                      <div key={status} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${style.bg}`}>
                        <div className={`w-3 h-3 rounded-full ${style.header} shrink-0`} />
                        <span className={`flex-1 text-sm font-medium ${style.text}`}>{status}</span>
                        {isProtected ? (
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Protected</span>
                        ) : (
                          <button onClick={() => removeStatus(status)}
                            className="text-xs text-red-500 hover:text-red-700 px-2 py-0.5 hover:bg-red-50 rounded transition-colors">
                            Remove
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Add new status */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Add Custom Status</div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Status name (e.g. QA Review, UAT…)"
                    value={newStatusName}
                    onChange={(e) => setNewStatusName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomStatus()}
                  />
                  <button onClick={addCustomStatus} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Add</button>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">New status is inserted before "Done". Tasks in removed statuses revert to "To Do".</p>
              </div>
              {/* Restore defaults */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button onClick={() => setWorkflow([...DEFAULT_WORKFLOW])} className="text-xs text-slate-500 hover:text-slate-700 underline">
                  Restore defaults
                </button>
                <button onClick={() => setShowWorkflowEditor(false)} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Done</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (() => {
        const remaining = Math.max(0, selectedTask.estimatedHours - selectedTask.loggedHours);
        const pct = selectedTask.estimatedHours > 0 ? Math.min(100, Math.round((selectedTask.loggedHours / selectedTask.estimatedHours) * 100)) : 0;
        const over = selectedTask.loggedHours > selectedTask.estimatedHours;
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => { setSelectedTask(null); setDoneWarning(null); setLogEntry({ hours: "", comment: "", author: "" }); }}>
            <div className="bg-white rounded-2xl shadow-2xl w-[560px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${typeColors[selectedTask.type] ?? ""}`}>{selectedTask.type}</span>
                    <span className="text-xs text-indigo-500 font-mono">{selectedTask.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusStyle(selectedTask.status).bg} border`}>{selectedTask.status}</span>
                  </div>
                  <h2 className="font-semibold text-slate-800 text-base">{selectedTask.title}</h2>
                </div>
                <button onClick={() => { setSelectedTask(null); setDoneWarning(null); }} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
              </div>

              <div className="px-5 py-4 space-y-5">

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-400 text-xs">Assignee</span>
                    <div className="font-medium text-slate-700 mt-0.5 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center text-xs text-indigo-700 font-bold shrink-0">{(selectedTask.assignee || "?")[0]}</div>
                      {selectedTask.assignee || "Unassigned"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs">Assigned By</span>
                    <div className="font-medium text-slate-700 mt-0.5 flex items-center gap-1.5">
                      {selectedTask.assignedBy ? (
                        <>
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold shrink-0">{selectedTask.assignedBy[0]}</div>
                          {selectedTask.assignedBy}
                        </>
                      ) : <span className="text-slate-400 italic text-xs">Not set</span>}
                    </div>
                  </div>
                  <div><span className="text-slate-400 text-xs">Priority</span><div className="font-medium text-slate-700 mt-0.5">{selectedTask.priority}</div></div>
                  <div><span className="text-slate-400 text-xs">Sprint</span><div className="font-medium text-slate-700 mt-0.5">{selectedTask.sprint}</div></div>
                  <div><span className="text-slate-400 text-xs">Due Date</span><div className="font-medium text-slate-700 mt-0.5">{selectedTask.dueDate || "—"}</div></div>
                  {selectedTask.epicId && (
                    <div>
                      <span className="text-slate-400 text-xs">Epic</span>
                      <div className="mt-0.5">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 font-mono">{selectedTask.epicId}</span>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">{EPICS.find(e => e.id === selectedTask.epicId)?.title}</div>
                      </div>
                    </div>
                  )}
                  {selectedTask.storyId && (
                    <div>
                      <span className="text-slate-400 text-xs flex items-center gap-1">📎 User Story</span>
                      <div className="mt-0.5">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 font-mono">{selectedTask.storyId}</span>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">{STORIES.find(s => s.id === selectedTask.storyId)?.title}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Hours Section ── */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                  <div className="text-sm font-semibold text-slate-700">Hours</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                      <div className="text-xs text-slate-400 mb-1">Estimated</div>
                      <div className="text-xl font-bold text-slate-700">{selectedTask.estimatedHours}<span className="text-xs font-normal text-slate-400 ml-0.5">h</span></div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                      <div className="text-xs text-slate-400 mb-1">Logged</div>
                      <div className={`text-xl font-bold ${over ? "text-red-600" : "text-indigo-600"}`}>{selectedTask.loggedHours}<span className="text-xs font-normal text-slate-400 ml-0.5">h</span></div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-slate-100">
                      <div className="text-xs text-slate-400 mb-1">Remaining</div>
                      <div className={`text-xl font-bold ${over ? "text-red-600" : remaining === 0 ? "text-green-600" : "text-amber-600"}`}>{over ? 0 : remaining}<span className="text-xs font-normal text-slate-400 ml-0.5">h</span></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{pct}% logged{over && <span className="text-red-500 font-medium ml-1">— {selectedTask.loggedHours - selectedTask.estimatedHours}h over estimate</span>}</span>
                      <span>{selectedTask.loggedHours}h / {selectedTask.estimatedHours}h</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full transition-all ${over ? "bg-red-500" : pct === 100 ? "bg-green-500" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                {/* Subtasks */}
                {selectedTask.subTasks && selectedTask.subTasks.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-2">Sub-tasks</div>
                    {selectedTask.subTasks.map((st, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 py-1 border-b border-slate-50">
                        <input type="checkbox" className="rounded" readOnly /> {st}
                      </div>
                    ))}
                  </div>
                )}

                {/* Story-link warnings */}
                {selectedTask.type === "Story" && !selectedTask.storyId && (
                  <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    <span className="text-base leading-none mt-0.5">📎</span>
                    <div><span className="font-semibold">No User Story linked.</span> Required before moving to Done or Closed.</div>
                  </div>
                )}
                {doneWarning === selectedTask.id && (
                  <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-300 rounded-lg text-xs text-red-800">
                    <span className="text-base leading-none mt-0.5">🚫</span>
                    <div className="flex-1"><span className="font-semibold">Cannot mark as Done.</span> Link a User Story (📎) first via Planning → Link Items.</div>
                    <button onClick={() => setDoneWarning(null)} className="text-red-400 hover:text-red-600 font-bold shrink-0">×</button>
                  </div>
                )}

                {/* Move to status */}
                <div>
                  <div className="text-sm font-semibold text-slate-700 mb-2">Move to Status</div>
                  <div className="flex flex-wrap gap-2">
                    {workflow.filter((s) => s !== selectedTask.status).map((s) => {
                      const style = getStatusStyle(s);
                      const blocked = selectedTask.type === "Story" && (s === "Done" || s === "Closed") && !selectedTask.storyId;
                      return (
                        <button key={s} onClick={() => moveTask(selectedTask.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${blocked ? "opacity-40 cursor-not-allowed" : "hover:opacity-80"} ${style.bg}`}
                          title={blocked ? "Link a User Story first" : undefined}>
                          → {s}{blocked && " 🔒"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tags */}
                {selectedTask.tags.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-1">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTask.tags.map((tag) => (
                        <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Log Hours & Comment ── */}
                <div className="border border-indigo-100 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-indigo-50 border-b border-indigo-100">
                    <span className="text-sm font-semibold text-indigo-700">Log Hours & Comment</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex gap-2">
                      <input
                        className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="Hours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={logEntry.hours}
                        onChange={(e) => setLogEntry((p) => ({ ...p, hours: e.target.value }))}
                      />
                      <input
                        className="w-32 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="Your name"
                        value={logEntry.author}
                        onChange={(e) => setLogEntry((p) => ({ ...p, author: e.target.value }))}
                      />
                      <input
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="Add a comment…"
                        value={logEntry.comment}
                        onChange={(e) => setLogEntry((p) => ({ ...p, comment: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && submitLogEntry(selectedTask.id)}
                      />
                      <button
                        onClick={() => submitLogEntry(selectedTask.id)}
                        disabled={!logEntry.comment.trim() && !logEntry.hours}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">
                        Log
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Activity Log ── */}
                <div>
                  <div className="text-sm font-semibold text-slate-700 mb-2">Activity Log</div>
                  {selectedTask.comments.length === 0 ? (
                    <div className="text-xs text-slate-400 py-4 text-center border border-dashed border-slate-200 rounded-lg">No activity yet — log hours or add a comment above</div>
                  ) : (
                    <div className="space-y-2">
                      {selectedTask.comments.map((c) => (
                        <div key={c.id} className="flex gap-3 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="w-7 h-7 rounded-full bg-indigo-200 flex items-center justify-center text-xs text-indigo-700 font-bold shrink-0 mt-0.5">{(c.author || "?")[0]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-slate-700">{c.author}</span>
                              {c.hoursLogged > 0 && (
                                <span className="px-1.5 py-0.5 rounded text-xs bg-indigo-100 text-indigo-700 font-medium">+{c.hoursLogged}h logged</span>
                              )}
                              <span className="text-xs text-slate-400 ml-auto">{c.timestamp}</span>
                            </div>
                            {c.text && <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{c.text}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* Epic Detail Modal */}
      {selectedEpic && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelectedEpic(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[500px]" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">Epic</span>
                <span className="text-xs font-mono text-orange-600">{selectedEpic.id}</span>
              </div>
              <button onClick={() => setSelectedEpic(null)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <h2 className="font-bold text-slate-800 text-base">{selectedEpic.title}</h2>
              <div>
                <div className="text-xs text-slate-400 mb-1">Description</div>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedEpic.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-xs text-slate-400 mb-1">Start Date</div><div className="font-medium text-slate-700">{selectedEpic.startDate}</div></div>
                <div><div className="text-xs text-slate-400 mb-1">End Date</div><div className="font-medium text-slate-700">{selectedEpic.endDate}</div></div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-2">Linked Stories</div>
                <div className="space-y-1.5">
                  {STORIES.filter((s) => s.epicId === selectedEpic.id).map((s) => (
                    <div key={s.id} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                      <span className="text-xs font-mono text-blue-600">{s.id}</span>
                      <span className="flex-1 text-xs text-slate-700">{s.title}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${s.status === "Done" ? "bg-green-100 text-green-700" : s.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-2">Linked Tasks</div>
                <div className="space-y-1.5">
                  {tasks.filter((t) => t.epicId === selectedEpic.id).slice(0, 5).map((t) => (
                    <div key={t.id} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs font-mono text-indigo-600">{t.id}</span>
                      <span className="flex-1 text-xs text-slate-700 truncate">{t.title}</span>
                      <span className="text-xs text-slate-400">{t.sprint}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setSelectedEpic(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
