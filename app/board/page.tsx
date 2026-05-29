"use client";
import { useState } from "react";
import ProjectBanner from "../_components/ProjectBanner";

type BoardType = "Scrum" | "Kanban" | "Waterfall";
type TaskType = "Task" | "Epic" | "Bug" | "Story" | "Branch Bug" | "Sub-Task" | "R&N";
type WorkflowStatus = "To Do" | "In Progress" | "Review" | "Testing" | "Reopen" | "Done";

type Task = {
  id: string; title: string; type: TaskType; status: WorkflowStatus;
  assignee: string; sp: number; dueDate: string; priority: string;
  sprint: string; tags: string[]; subTasks?: string[]; epicId?: string; storyId?: string;
};

type Epic = { id: string; title: string; description: string; startDate: string; endDate: string; status: string };
type Story = { id: string; title: string; epicId: string; sp: number; status: string };
type Milestone = { id: string; name: string; date: string; status: string };

const WORKFLOW: WorkflowStatus[] = ["To Do", "In Progress", "Review", "Testing", "Reopen", "Done"];

const EPICS: Epic[] = [
  { id: "E-01", title: "User Management Module", description: "Full user lifecycle management including registration, login, roles and permissions.", startDate: "2026-05-01", endDate: "2026-06-30", status: "In Progress" },
  { id: "E-02", title: "Notification System", description: "Email, push and in-app notifications.", startDate: "2026-06-01", endDate: "2026-07-15", status: "Planned" },
];

const STORIES: Story[] = [
  { id: "S-01", title: "As a user I can register with email/password", epicId: "E-01", sp: 5, status: "In Progress" },
  { id: "S-02", title: "As a user I can login and receive JWT token", epicId: "E-01", sp: 3, status: "Done" },
  { id: "S-03", title: "As admin I can manage user roles and permissions", epicId: "E-01", sp: 8, status: "To Do" },
  { id: "S-04", title: "As a user I receive email notifications", epicId: "E-02", sp: 5, status: "To Do" },
];

const MILESTONES: Milestone[] = [
  { id: "M1", name: "MVP Release", date: "Jun 15, 2026", status: "On Track" },
  { id: "M2", name: "Beta Launch", date: "Jul 30, 2026", status: "At Risk" },
  { id: "M3", name: "v1.0 Production", date: "Sep 1, 2026", status: "Planned" },
];

const WATERFALL_PHASES = ["Requirements", "Design", "Development", "Testing", "Deployment"];

const initialTasks: Task[] = [
  { id: "T-101", title: "Implement user authentication module", type: "Story", status: "In Progress", assignee: "Rahul S.", sp: 5, dueDate: "2026-05-25", priority: "High", sprint: "Sprint 4", tags: ["backend", "auth"], epicId: "E-01", storyId: "S-01" },
  { id: "T-102", title: "Fix login page redirect after OAuth", type: "Bug", status: "Review", assignee: "Priya M.", sp: 2, dueDate: "2026-05-22", priority: "High", sprint: "Sprint 4", tags: ["frontend"] },
  { id: "T-103", title: "Setup CI/CD pipeline with GitHub Actions", type: "Task", status: "To Do", assignee: "Amit K.", sp: 3, dueDate: "2026-05-28", priority: "Medium", sprint: "Sprint 4", tags: ["devops"] },
  { id: "T-104", title: "Design dashboard wireframes in Figma", type: "Story", status: "Done", assignee: "Sneha R.", sp: 4, dueDate: "2026-05-20", priority: "Medium", sprint: "Sprint 4", tags: ["design"], storyId: "S-02" },
  { id: "T-105", title: "Evaluate Redis vs Memcached for caching", type: "R&N", status: "Testing", assignee: "Vikram P.", sp: 8, dueDate: "2026-05-27", priority: "Low", sprint: "Sprint 4", tags: ["research"] },
  { id: "T-106", title: "User registration form validation", type: "Sub-Task", status: "In Progress", assignee: "Priya M.", sp: 1, dueDate: "2026-05-23", priority: "High", sprint: "Sprint 4", tags: ["frontend"], storyId: "S-01" },
  { id: "T-107", title: "Main branch has broken CSS import", type: "Branch Bug", status: "Reopen", assignee: "Amit K.", sp: 1, dueDate: "2026-05-21", priority: "High", sprint: "Sprint 4", tags: ["urgent"] },
  { id: "T-108", title: "Admin panel – role management UI", type: "Story", status: "To Do", assignee: "Rahul S.", sp: 8, dueDate: "2026-06-05", priority: "Medium", sprint: "Sprint 5", tags: ["frontend", "admin"], epicId: "E-01", storyId: "S-03" },
  { id: "T-109", title: "API rate limiting middleware", type: "Task", status: "To Do", assignee: "Vikram P.", sp: 3, dueDate: "2026-06-08", priority: "Medium", sprint: "Sprint 5", tags: ["backend"] },
];

const typeColors: Record<string, string> = {
  Story: "bg-blue-100 text-blue-700 border-blue-200",
  Bug: "bg-red-100 text-red-700 border-red-200",
  Task: "bg-purple-100 text-purple-700 border-purple-200",
  Epic: "bg-orange-100 text-orange-700 border-orange-200",
  "Branch Bug": "bg-red-200 text-red-800 border-red-300",
  "Sub-Task": "bg-slate-100 text-slate-600 border-slate-200",
  "R&N": "bg-yellow-100 text-yellow-700 border-yellow-200",
};
const priorityDot: Record<string, string> = { High: "bg-red-500", Medium: "bg-amber-400", Low: "bg-green-400" };
const statusBg: Record<WorkflowStatus, string> = {
  "To Do": "bg-slate-50 border-slate-200", "In Progress": "bg-blue-50 border-blue-200",
  Review: "bg-purple-50 border-purple-200", Testing: "bg-amber-50 border-amber-200",
  Reopen: "bg-red-50 border-red-200", Done: "bg-green-50 border-green-200",
};
const statusHeader: Record<WorkflowStatus, string> = {
  "To Do": "bg-slate-400", "In Progress": "bg-blue-500", Review: "bg-purple-500",
  Testing: "bg-amber-500", Reopen: "bg-red-500", Done: "bg-green-500",
};
const boardTypeStyle: Record<BoardType, string> = {
  Scrum: "border-indigo-500 bg-indigo-600", Kanban: "border-teal-500 bg-teal-600", Waterfall: "border-amber-500 bg-amber-600",
};
const milestoneStatusColor: Record<string, string> = {
  "On Track": "bg-green-500", "At Risk": "bg-amber-500", Planned: "bg-slate-400",
};

// Reusable Kanban Column component
function KanbanColumn({ col, tasks, onSelect }: { col: WorkflowStatus; tasks: Task[]; onSelect: (t: Task) => void }) {
  return (
    <div className={`flex flex-col w-48 shrink-0 mx-1.5 rounded-xl border ${statusBg[col]} overflow-hidden`}>
      <div className={`${statusHeader[col]} px-3 py-2 flex items-center justify-between`}>
        <span className="text-white text-xs font-semibold">{col}</span>
        <span className="bg-white/30 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg p-2.5 shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-white hover:border-indigo-200" onClick={() => onSelect(task)}>
            <div className="flex items-start justify-between gap-1 mb-1.5">
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${typeColors[task.type] ?? "bg-gray-100"}`}>{task.type}</span>
              <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${priorityDot[task.priority] ?? "bg-gray-300"}`} />
            </div>
            <p className="text-xs font-medium text-slate-700 leading-snug mb-1.5">{task.title}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-500 font-mono">{task.id}</span>
              <span className="text-xs text-slate-400">{task.sp}sp</span>
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
  const [newTask, setNewTask] = useState<{ title: string; type: TaskType; priority: string; assignee: string; sp: number; sprint: string; description: string; startDate: string; endDate: string }>({
    title: "", type: "Task", priority: "Medium", assignee: "", sp: 3, sprint: "Sprint 4", description: "", startDate: "", endDate: "",
  });

  const moveTask = (taskId: string, newStatus: WorkflowStatus) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
    if (selectedTask?.id === taskId) setSelectedTask((prev) => prev ? { ...prev, status: newStatus } : null);
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = { id: `T-${Date.now().toString().slice(-4)}`, ...newTask, status: "To Do", dueDate: "", tags: [] };
    setTasks((prev) => [...prev, task]);
    setNewTask({ title: "", type: "Task", priority: "Medium", assignee: "", sp: 3, sprint: "Sprint 4", description: "", startDate: "", endDate: "" });
    setShowAddTask(false);
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
      <div className="px-6 pt-4"><ProjectBanner /></div>
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

        {/* Milestones bar – always visible */}
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
            <p className="text-xs text-slate-500">Workflow: To Do → In Progress → Review → Testing → Reopen → Done</p>
          </div>
          <div className="flex items-center gap-2">
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
              {["All", "Task", "Story", "Bug", "Epic", "Branch Bug", "Sub-Task", "R&N"].map((t) => <option key={t}>{t}</option>)}
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
              {["Task", "Story", "Bug", "Epic", "Branch Bug", "Sub-Task", "R&N"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
              value={newTask.priority} onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}>
              {["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
            </select>
            <input className="w-28 border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white" placeholder="Assignee"
              value={newTask.assignee} onChange={(e) => setNewTask((p) => ({ ...p, assignee: e.target.value }))} />
            <input type="number" className="w-14 border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white" placeholder="SP"
              value={newTask.sp} onChange={(e) => setNewTask((p) => ({ ...p, sp: Number(e.target.value) }))} />
            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
              value={newTask.sprint} onChange={(e) => setNewTask((p) => ({ ...p, sprint: e.target.value }))}>
              {["Sprint 4", "Sprint 5", "Sprint 6"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white" placeholder="Description (optional)"
              value={newTask.description} onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))} />
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
          {/* Left panel: Epics + Stories (mandatory) */}
          <div className="w-64 shrink-0 border-r border-slate-200 bg-white overflow-y-auto flex flex-col">
            {/* Epics */}
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

            {/* User Stories */}
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
                  <div className="text-xs text-slate-400 mt-0.5">{story.sp} pts</div>
                </div>
              ))}
            </div>
          </div>

          {/* Kanban columns */}
          <div className="flex flex-1 overflow-x-auto p-3">
            {WORKFLOW.map((col) => (
              <KanbanColumn key={col} col={col} tasks={filtered.filter((t) => t.status === col)} onSelect={setSelectedTask} />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ KANBAN BOARD ═══════════════ */}
      {boardType === "Kanban" && (
        <div className="flex flex-1 overflow-hidden">
          {/* Optional epics/stories toggle panel */}
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
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 overflow-x-auto p-3">
            {WORKFLOW.map((col) => (
              <KanbanColumn key={col} col={col} tasks={filtered.filter((t) => t.status === col)} onSelect={setSelectedTask} />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ WATERFALL BOARD ═══════════════ */}
      {boardType === "Waterfall" && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Phase-based backlog */}
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
                    {/* Phase progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1 mt-1.5">
                      <div className="h-1 rounded-full bg-amber-400" style={{ width: `${Math.min((phTasks.filter((t) => t.status === "Done").length / Math.max(phTasks.length, 1)) * 100, 100)}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional: Stories */}
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
                </div>
              ))}
            </div>
          </div>

          {/* Right: Task board for selected phase */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
              <span className="text-sm font-semibold text-amber-800">Phase: {selectedPhase}</span>
              <span className="text-xs text-amber-600">— Epics optional in Waterfall</span>
            </div>
            <div className="flex flex-1 overflow-x-auto p-3">
              {WORKFLOW.map((col) => (
                <KanbanColumn key={col} col={col} tasks={filtered.filter((t) => t.status === col)} onSelect={setSelectedTask} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelectedTask(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${typeColors[selectedTask.type] ?? ""}`}>{selectedTask.type}</span>
                  <span className="text-xs text-indigo-500 font-mono">{selectedTask.id}</span>
                </div>
                <h2 className="font-semibold text-slate-800">{selectedTask.title}</h2>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-400 text-xs">Assignee</span><div className="font-medium text-slate-700 mt-0.5">{selectedTask.assignee || "Unassigned"}</div></div>
                <div><span className="text-slate-400 text-xs">Priority</span><div className="font-medium text-slate-700 mt-0.5">{selectedTask.priority}</div></div>
                <div><span className="text-slate-400 text-xs">Story Points</span><div className="font-medium text-slate-700 mt-0.5">{selectedTask.sp}</div></div>
                <div><span className="text-slate-400 text-xs">Sprint</span><div className="font-medium text-slate-700 mt-0.5">{selectedTask.sprint}</div></div>
                {selectedTask.epicId && <div><span className="text-slate-400 text-xs">Epic</span><div className="font-medium text-orange-700 mt-0.5">{selectedTask.epicId}</div></div>}
                {selectedTask.storyId && <div><span className="text-slate-400 text-xs">User Story</span><div className="font-medium text-blue-700 mt-0.5">{selectedTask.storyId}</div></div>}
                <div><span className="text-slate-400 text-xs">Due Date</span><div className="font-medium text-slate-700 mt-0.5">{selectedTask.dueDate || "—"}</div></div>
                <div><span className="text-slate-400 text-xs">Status</span><div className="font-medium text-slate-700 mt-0.5">{selectedTask.status}</div></div>
              </div>

              {selectedTask.subTasks && selectedTask.subTasks.length > 0 && (
                <div>
                  <div className="text-sm text-slate-400 mb-1">Sub-tasks</div>
                  {selectedTask.subTasks.map((st, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600 py-1 border-b border-slate-50">
                      <input type="checkbox" className="rounded" readOnly /> {st}
                    </div>
                  ))}
                </div>
              )}

              <div>
                <div className="text-sm text-slate-400 mb-2">Move to Status</div>
                <div className="flex flex-wrap gap-2">
                  {WORKFLOW.filter((s) => s !== selectedTask.status).map((s) => (
                    <button key={s} onClick={() => moveTask(selectedTask.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-80 ${statusBg[s]}`}>
                      → {s}
                    </button>
                  ))}
                </div>
              </div>

              {selectedTask.tags.length > 0 && (
                <div>
                  <div className="text-sm text-slate-400 mb-1">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedTask.tags.map((tag) => (
                      <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                      <span className="text-xs text-slate-400">{s.sp}sp</span>
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
