"use client";
import { useState } from "react";
import ProjectBanner from "../_components/ProjectBanner";

type BoardType = "Scrum" | "Kanban" | "Waterfall";

type Sprint = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  capacity: number;
  allocated: number;
  velocity: number;
  status: "Active" | "Planned" | "Completed";
  boardType: BoardType;
  linkedMilestones: string[];
  linkedEpics: string[];
  linkedStories: string[];
  linkedTasks: string[];
  stories: SprintStory[];
};

type SprintStory = {
  id: string; title: string; type: string; sp: number;
  hours: number; hoursLogged: number; assignee: string; status: string;
};

const SPRINT_PROGRESS = [
  { name: "Sprint 1", totalHrs: 120, loggedHrs: 118, tasks: 15, done: 15, velocity: 34 },
  { name: "Sprint 2", totalHrs: 120, loggedHrs: 115, tasks: 13, done: 12, velocity: 30 },
  { name: "Sprint 3", totalHrs: 120, loggedHrs: 102, tasks: 11, done: 10, velocity: 28 },
  { name: "Sprint 4 (Active)", totalHrs: 120, loggedHrs: 46, tasks: 12, done: 4, velocity: null },
];

const MILESTONES = ["MVP Release", "Beta Launch", "v1.0 Production", "Performance Audit"];
const ALL_EPICS = [
  { id: "E-01", title: "User Management Module" },
  { id: "E-02", title: "Notification System" },
  { id: "AI-03", title: "Build reporting dashboard" },
];
const ALL_STORIES = [
  { id: "S-01", title: "As a user I can register with email/password" },
  { id: "S-02", title: "As a user I can login and receive JWT token" },
  { id: "S-03", title: "As admin I can manage user roles and permissions" },
];
const ALL_TASKS = [
  { id: "T-01", title: "Setup project scaffolding" },
  { id: "T-02", title: "Configure CI/CD pipeline" },
  { id: "T-101", title: "Implement user authentication module" },
  { id: "T-103", title: "Setup CI/CD pipeline with GitHub Actions" },
  { id: "T-109", title: "API rate limiting middleware" },
];

const initialSprints: Sprint[] = [
  {
    id: "SP-4", name: "Sprint 4", startDate: "2026-05-15", endDate: "2026-05-28",
    capacity: 80, allocated: 76, velocity: 32, status: "Active", boardType: "Scrum",
    linkedMilestones: ["MVP Release"], linkedEpics: ["E-01"], linkedStories: ["S-01", "S-02"], linkedTasks: ["T-101"],
    stories: [
      { id: "S-01", title: "User registration flow", type: "Story", sp: 5, hours: 20, hoursLogged: 18, assignee: "Rahul S.", status: "In Progress" },
      { id: "S-02", title: "JWT authentication", type: "Story", sp: 3, hours: 12, hoursLogged: 12, assignee: "Priya M.", status: "Done" },
      { id: "T-01", title: "CI/CD setup", type: "Task", sp: 3, hours: 10, hoursLogged: 6, assignee: "Amit K.", status: "In Progress" },
      { id: "B-01", title: "Login redirect bug", type: "Bug", sp: 1, hours: 4, hoursLogged: 4, assignee: "Sneha R.", status: "Done" },
    ],
  },
  {
    id: "SP-5", name: "Sprint 5", startDate: "2026-05-29", endDate: "2026-06-11",
    capacity: 80, allocated: 45, velocity: 32, status: "Planned", boardType: "Scrum",
    linkedMilestones: ["MVP Release", "Beta Launch"], linkedEpics: ["E-01", "E-02"], linkedStories: ["S-03"], linkedTasks: ["T-109"],
    stories: [
      { id: "S-03", title: "Admin role management", type: "Story", sp: 8, hours: 32, hoursLogged: 0, assignee: "Rahul S.", status: "To Do" },
      { id: "R-01", title: "Redis evaluation", type: "R&N", sp: 5, hours: 13, hoursLogged: 0, assignee: "Vikram P.", status: "To Do" },
    ],
  },
  {
    id: "SP-6", name: "Sprint 6", startDate: "2026-06-12", endDate: "2026-06-25",
    capacity: 80, allocated: 0, velocity: 32, status: "Planned", boardType: "Kanban",
    linkedMilestones: ["Beta Launch"], linkedEpics: [], linkedStories: [], linkedTasks: [],
    stories: [],
  },
];

const typeColors: Record<string, string> = {
  Story: "bg-blue-100 text-blue-700", Bug: "bg-red-100 text-red-700",
  Task: "bg-purple-100 text-purple-700", "R&N": "bg-yellow-100 text-yellow-700",
};
const statusColors: Record<string, string> = {
  "To Do": "bg-slate-100 text-slate-600", "In Progress": "bg-blue-100 text-blue-700", Done: "bg-green-100 text-green-700",
};
const boardTypeStyle: Record<BoardType, string> = {
  Scrum: "bg-indigo-100 text-indigo-700",
  Kanban: "bg-teal-100 text-teal-700",
  Waterfall: "bg-amber-100 text-amber-700",
};

export default function PlanningPage() {
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [selectedSprint, setSelectedSprint] = useState<Sprint>(initialSprints[0]);
  const [showNewSprintForm, setShowNewSprintForm] = useState(false);
  const [newSprint, setNewSprint] = useState({ name: "", startDate: "", endDate: "", capacity: 80, boardType: "Scrum" as BoardType });

  // Link items modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkSelection, setLinkSelection] = useState({
    epics: [] as string[], stories: [] as string[], tasks: [] as string[], milestones: [] as string[],
  });

  const addSprint = () => {
    if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) return;
    const sp: Sprint = {
      id: `SP-${Date.now().toString().slice(-3)}`, name: newSprint.name,
      startDate: newSprint.startDate, endDate: newSprint.endDate,
      capacity: newSprint.capacity, allocated: 0, velocity: 32,
      status: "Planned", boardType: newSprint.boardType,
      linkedMilestones: [], linkedEpics: [], linkedStories: [], linkedTasks: [],
      stories: [],
    };
    const updated = [...sprints, sp];
    setSprints(updated);
    setSelectedSprint(sp);
    setShowNewSprintForm(false);
    setNewSprint({ name: "", startDate: "", endDate: "", capacity: 80, boardType: "Scrum" });
  };

  const openLinkModal = () => {
    setLinkSelection({
      epics: [...selectedSprint.linkedEpics],
      stories: [...selectedSprint.linkedStories],
      tasks: [...selectedSprint.linkedTasks],
      milestones: [...selectedSprint.linkedMilestones],
    });
    setShowLinkModal(true);
  };

  const saveLinkModal = () => {
    const updated = sprints.map((s) =>
      s.id === selectedSprint.id
        ? { ...s, linkedEpics: linkSelection.epics, linkedStories: linkSelection.stories, linkedTasks: linkSelection.tasks, linkedMilestones: linkSelection.milestones }
        : s
    );
    setSprints(updated);
    const fresh = updated.find((s) => s.id === selectedSprint.id)!;
    setSelectedSprint(fresh);
    setShowLinkModal(false);
  };

  const toggleLink = (key: "epics" | "stories" | "tasks" | "milestones", id: string) => {
    setLinkSelection((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((x) => x !== id) : [...prev[key], id],
    }));
  };

  const totalHours = selectedSprint.stories.reduce((a, s) => a + s.hours, 0);
  const loggedHours = selectedSprint.stories.reduce((a, s) => a + s.hoursLogged, 0);
  const remainingHours = totalHours - loggedHours;
  const overCapacity = selectedSprint.allocated > selectedSprint.capacity;
  const velocityPrediction = selectedSprint.capacity > 0
    ? Math.round((selectedSprint.allocated / selectedSprint.capacity) * selectedSprint.velocity)
    : 0;

  const isScrumMandatory = selectedSprint.boardType === "Scrum";
  const missingEpics = isScrumMandatory && selectedSprint.linkedEpics.length === 0;
  const missingStories = isScrumMandatory && selectedSprint.linkedStories.length === 0;

  return (
    <div className="p-6 space-y-4">
      <ProjectBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Planning, Scheduling & Estimation</h1>
          <p className="text-sm text-slate-500">Sprint planning, board type, velocity prediction, and milestone linking</p>
        </div>
        <button onClick={() => setShowNewSprintForm(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
          + New Sprint / Phase
        </button>
      </div>

      {/* New Sprint Form */}
      {showNewSprintForm && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-slate-700">Create Sprint / Phase</h3>
          <div className="grid grid-cols-5 gap-3">
            <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Sprint Name"
              value={newSprint.name} onChange={(e) => setNewSprint((p) => ({ ...p, name: e.target.value }))} />
            <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
              value={newSprint.startDate} onChange={(e) => setNewSprint((p) => ({ ...p, startDate: e.target.value }))} />
            <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
              value={newSprint.endDate} onChange={(e) => setNewSprint((p) => ({ ...p, endDate: e.target.value }))} />
            <input type="number" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Capacity (hrs)"
              value={newSprint.capacity} onChange={(e) => setNewSprint((p) => ({ ...p, capacity: Number(e.target.value) }))} />
          </div>

          {/* Board Type Step */}
          <div>
            <div className="text-sm font-medium text-slate-700 mb-2">Select Board Type for this Sprint</div>
            <div className="grid grid-cols-3 gap-3">
              {(["Scrum", "Kanban", "Waterfall"] as BoardType[]).map((bt) => (
                <button key={bt} onClick={() => setNewSprint((p) => ({ ...p, boardType: bt }))}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${newSprint.boardType === bt ? "border-indigo-500 bg-white shadow" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                  <div className={`px-2 py-0.5 rounded text-xs font-medium w-fit mb-1.5 ${boardTypeStyle[bt]}`}>{bt}</div>
                  <div className="text-xs text-slate-500">
                    {bt === "Scrum" && "Iterative sprints · Epics & Stories mandatory · Velocity tracking"}
                    {bt === "Kanban" && "Continuous flow · No sprint limit · Epics & Stories optional"}
                    {bt === "Waterfall" && "Phase-based delivery · Backlog + task columns · Stories optional"}
                  </div>
                </button>
              ))}
            </div>
            {newSprint.boardType === "Scrum" && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ⚠ Scrum board requires at least one linked Epic and one linked User Story before starting the sprint.
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={addSprint} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Create Sprint</button>
            <button onClick={() => setShowNewSprintForm(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      {/* Sprint Cards */}
      <div className="grid grid-cols-4 gap-3">
        {sprints.map((sp) => {
          const pct = sp.capacity > 0 ? Math.round((sp.allocated / sp.capacity) * 100) : 0;
          const over = sp.allocated > sp.capacity;
          const isSelected = selectedSprint.id === sp.id;
          return (
            <button key={sp.id} onClick={() => setSelectedSprint(sp)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                over
                  ? isSelected ? "border-red-500 bg-red-50" : "border-red-300 bg-red-50 hover:border-red-500"
                  : isSelected ? "border-indigo-500 bg-indigo-50" : "border-slate-100 bg-white hover:border-slate-300"
              }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-semibold text-sm ${over ? "text-red-700" : "text-slate-700"}`}>{sp.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${sp.status === "Active" ? "bg-green-100 text-green-700" : sp.status === "Completed" ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-700"}`}>
                  {sp.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${boardTypeStyle[sp.boardType]}`}>{sp.boardType}</span>
                {over && <span className="text-xs font-bold text-red-600">⚠ OVERSHOOT</span>}
              </div>
              <div className="text-xs text-slate-400 mb-2">{sp.startDate} → {sp.endDate}</div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                <div className={`h-1.5 rounded-full ${over ? "bg-red-500" : "bg-indigo-500"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <div className={`text-xs font-semibold ${over ? "text-red-600" : "text-slate-500"}`}>
                {sp.allocated}h / {sp.capacity}h{over && <span className="ml-1">({pct}% — over!)</span>}
              </div>
              <div className="flex gap-2 mt-2 text-xs text-slate-400">
                <span>🏔 {sp.linkedEpics.length} epics</span>
                <span>📖 {sp.linkedStories.length} stories</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Scrum mandatory warnings */}
      {(missingEpics || missingStories) && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-red-500 text-lg">⚠</span>
          <div className="text-sm text-red-700">
            <span className="font-semibold">Scrum board validation:</span>{" "}
            {missingEpics && "At least one Epic must be linked."}{" "}
            {missingStories && "At least one User Story must be linked."}
            {" "}Go to <strong>Link Items</strong> below to fix this.
          </div>
        </div>
      )}

      {/* Sprint Detail */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-700">{selectedSprint.name} – Task Breakdown</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${boardTypeStyle[selectedSprint.boardType]}`}>{selectedSprint.boardType}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Milestones: {selectedSprint.linkedMilestones.length > 0 ? selectedSprint.linkedMilestones.join(", ") : "None linked"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={openLinkModal}
                className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                🔗 Link Items
              </button>
              <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">+ Add Story</button>
            </div>
          </div>

          {/* Linked items summary */}
          {(selectedSprint.linkedEpics.length > 0 || selectedSprint.linkedStories.length > 0 || selectedSprint.linkedTasks.length > 0) && (
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-1.5">
              {selectedSprint.linkedEpics.map((eid) => {
                const epic = ALL_EPICS.find((e) => e.id === eid);
                return epic ? (
                  <span key={eid} className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700 border border-orange-200">🏔 {epic.title}</span>
                ) : null;
              })}
              {selectedSprint.linkedStories.map((sid) => {
                const story = ALL_STORIES.find((s) => s.id === sid);
                return story ? (
                  <span key={sid} className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">📖 {story.id}</span>
                ) : null;
              })}
              {selectedSprint.linkedTasks.map((tid) => {
                const task = ALL_TASKS.find((t) => t.id === tid);
                return task ? (
                  <span key={tid} className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 border border-purple-200">✓ {task.id}</span>
                ) : null;
              })}
            </div>
          )}

          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Title</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">SP</th>
                <th className="text-left px-4 py-2">Est. Hrs</th>
                <th className="text-left px-4 py-2">Logged</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Assignee</th>
              </tr>
            </thead>
            <tbody>
              {selectedSprint.stories.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-slate-400 text-sm">No stories in this sprint yet</td></tr>
              ) : (
                selectedSprint.stories.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-indigo-600 font-mono text-xs">{s.id}</td>
                    <td className="px-4 py-2.5 text-slate-700">{s.title}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[s.type] ?? "bg-gray-100 text-gray-600"}`}>{s.type}</span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{s.sp}</td>
                    <td className="px-4 py-2.5 text-slate-500">{s.hours}h</td>
                    <td className="px-4 py-2.5">
                      <span className={s.hoursLogged >= s.hours ? "text-green-600 font-medium" : "text-slate-500"}>{s.hoursLogged}h</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[s.status] ?? "bg-gray-100"}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs">{s.assignee}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {selectedSprint.stories.length > 0 && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex gap-6">
              <span>Items: {selectedSprint.stories.length}</span>
              <span>Total Est: {totalHours}h</span>
              <span className="text-amber-600">Remaining: {remainingHours}h</span>
              <span className="text-green-600">Logged: {loggedHours}h</span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm">Sprint Metrics</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Capacity Used</span>
                  <span className={`font-bold ${overCapacity ? "text-red-600" : "text-slate-700"}`}>{selectedSprint.allocated}h / {selectedSprint.capacity}h</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${overCapacity ? "bg-red-500" : "bg-indigo-500"}`}
                    style={{ width: `${Math.min((selectedSprint.allocated / selectedSprint.capacity) * 100, 100)}%` }} />
                </div>
                {overCapacity && <p className="text-xs text-red-600 mt-1 font-medium">⚠ Over capacity — reduce allocation</p>}
              </div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Velocity (last sprint)</span><span className="font-semibold text-slate-700">{selectedSprint.velocity} pts</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Predicted velocity</span><span className="font-semibold text-indigo-600">{velocityPrediction} pts</span></div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Board Type</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${boardTypeStyle[selectedSprint.boardType]}`}>{selectedSprint.boardType}</span>
              </div>
            </div>
          </div>

          {/* Linked milestones */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h4 className="font-semibold text-slate-700 mb-2 text-sm">Linked Milestones</h4>
            {selectedSprint.linkedMilestones.length === 0 ? (
              <p className="text-xs text-slate-400">No milestones linked</p>
            ) : (
              <div className="space-y-1.5">
                {selectedSprint.linkedMilestones.map((m) => (
                  <div key={m} className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />{m}
                  </div>
                ))}
              </div>
            )}
            <button onClick={openLinkModal} className="mt-2 text-xs text-indigo-600 hover:underline">Edit links →</button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm">All Sprints Timeline</h4>
            <div className="space-y-2">
              {sprints.map((sp) => (
                <div key={sp.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${sp.status === "Active" ? "bg-green-500" : sp.status === "Completed" ? "bg-slate-300" : "bg-blue-400"}`} />
                  <span className={`flex-1 text-xs ${sp.id === selectedSprint.id ? "font-semibold text-indigo-600" : "text-slate-500"}`}>{sp.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${boardTypeStyle[sp.boardType]}`}>{sp.boardType[0]}</span>
                  <span className="text-xs text-slate-400">{sp.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SPRINT PROGRESS ── */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-slate-800 mt-2">Sprint Progress</h2>
        <div className="grid grid-cols-2 gap-4">
          {SPRINT_PROGRESS.map((sp) => {
            const hrPct = Math.round((sp.loggedHrs / sp.totalHrs) * 100);
            const donePct = Math.round((sp.done / sp.tasks) * 100);
            const isActive = sp.name.includes("Active");
            const isOver = sp.loggedHrs > sp.totalHrs;
            return (
              <div key={sp.name} className={`rounded-xl shadow-sm p-5 border-l-4 ${isOver ? "bg-red-50 border-red-500" : isActive ? "bg-white border-indigo-500" : "bg-white border-green-400"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className={`font-semibold ${isOver ? "text-red-700" : "text-slate-700"}`}>{sp.name}</h3>
                    <p className={`text-xs mt-0.5 ${isOver ? "text-red-500 font-medium" : "text-slate-400"}`}>
                      {sp.done}/{sp.tasks} tasks · {sp.loggedHrs}h/{sp.totalHrs}h logged{isOver && " — OVERSHOOT"}
                    </p>
                  </div>
                  {sp.velocity !== null ? (
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${isOver ? "text-red-600" : "text-indigo-600"}`}>{sp.velocity}</div>
                      <div className="text-xs text-slate-400">velocity (pts)</div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-amber-600">In Progress</div>
                      <div className="text-xs text-slate-400">velocity pending</div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Hours Logged</span>
                      <span className={`font-medium ${isOver ? "text-red-600" : ""}`}>{hrPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${isOver ? "bg-red-500" : isActive ? "bg-indigo-500" : "bg-green-500"}`} style={{ width: `${Math.min(hrPct, 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Tasks Done</span><span className="font-medium">{donePct}%</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${donePct === 100 ? "bg-green-500" : donePct > 60 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${donePct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Sprint Hours Bar Chart ── */}
        <div className="bg-white rounded-xl shadow-sm p-5 mt-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-slate-700 text-sm">Sprint Hours — Allocated vs Logged</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block bg-indigo-500" /> Allocated</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block bg-green-500" /> Logged (on track)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block bg-red-500" /> Logged (overshoot)</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-3">Hours per sprint · logged bar turns red when exceeding total allocated hours</p>
          <svg viewBox="0 0 600 240" className="w-full" style={{ maxHeight: 240 }} role="img" aria-label="Sprint hours bar chart">
            {[0, 30, 60, 90, 120].map((v) => {
              const y = 20 + 180 - (v / 130) * 180;
              return (
                <g key={v}>
                  <line x1={45} y1={y} x2={580} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                  <text x={40} y={y + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v}</text>
                </g>
              );
            })}
            {SPRINT_PROGRESS.map((sp, i) => {
              const N = SPRINT_PROGRESS.length;
              const groupW = 535 / N;
              const barW = groupW * 0.33;
              const gx = 45 + i * groupW;
              const b1x = gx + groupW * 0.06;
              const b2x = b1x + barW + 5;
              const isOver = sp.loggedHrs > sp.totalHrs;
              const allocH = (Math.min(sp.totalHrs, 130) / 130) * 180;
              const logH = (Math.min(sp.loggedHrs, 130) / 130) * 180;
              const allocY = 200 - allocH;
              const logY = 200 - logH;
              const midX = gx + groupW / 2;
              return (
                <g key={sp.name}>
                  <rect x={b1x} y={allocY} width={barW} height={allocH} rx={3} fill="#6366f1" opacity={0.85} />
                  <rect x={b2x} y={logY} width={barW} height={logH} rx={3} fill={isOver ? "#ef4444" : "#22c55e"} opacity={0.9} />
                  <text x={b1x + barW / 2} y={allocY - 3} textAnchor="middle" fontSize={9} fill="#6366f1" fontWeight="600">{sp.totalHrs}</text>
                  <text x={b2x + barW / 2} y={logY - 3} textAnchor="middle" fontSize={9} fill={isOver ? "#ef4444" : "#16a34a"} fontWeight="600">{sp.loggedHrs}</text>
                  <text x={midX} y={220} textAnchor="middle" fontSize={10} fill="#64748b">{sp.name.replace(" (Active)", "")}</text>
                </g>
              );
            })}
            <line x1={45} y1={20} x2={45} y2={200} stroke="#cbd5e1" strokeWidth={1} />
            <line x1={45} y1={200} x2={580} y2={200} stroke="#cbd5e1" strokeWidth={1} />
            <text x={14} y={110} fontSize={10} fill="#94a3b8" transform="rotate(-90,14,110)" textAnchor="middle">Hours</text>
          </svg>
        </div>

        {/* ── Velocity Bar Chart ── */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-slate-700 text-sm">Sprint Velocity</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block bg-indigo-500" /> Velocity (pts)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded inline-block bg-indigo-200 border border-dashed border-indigo-400" /> Active (pending)</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-3">Story points delivered per sprint · trend line connects completed sprints</p>
          <svg viewBox="0 0 600 210" className="w-full" style={{ maxHeight: 210 }} role="img" aria-label="Sprint velocity chart">
            {[0, 10, 20, 30, 40].map((v) => {
              const y = 20 + 155 - (v / 40) * 155;
              return (
                <g key={v}>
                  <line x1={45} y1={y} x2={580} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                  <text x={40} y={y + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v}</text>
                </g>
              );
            })}
            {(() => {
              const N = SPRINT_PROGRESS.length;
              const groupW = 535 / N;
              const barW = groupW * 0.5;
              const completedPoints: { cx: number; cy: number }[] = [];
              const bars = SPRINT_PROGRESS.map((sp, i) => {
                const gx = 45 + i * groupW;
                const bx = gx + (groupW - barW) / 2;
                const midX = gx + groupW / 2;
                const isActive = sp.velocity === null;
                const velVal = isActive ? 18 : sp.velocity!;
                const barH = (velVal / 40) * 155;
                const barY = 175 - barH;
                if (!isActive) completedPoints.push({ cx: midX, cy: barY });
                return (
                  <g key={sp.name}>
                    {isActive
                      ? <rect x={bx} y={barY} width={barW} height={barH} rx={3} fill="#a5b4fc" opacity={0.4} stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4,3" />
                      : <rect x={bx} y={barY} width={barW} height={barH} rx={3} fill="#6366f1" opacity={0.85} />}
                    {!isActive && <text x={midX} y={barY - 4} textAnchor="middle" fontSize={10} fill="#4338ca" fontWeight="700">{sp.velocity}</text>}
                    {isActive && <text x={midX} y={barY - 4} textAnchor="middle" fontSize={9} fill="#6366f1">pending</text>}
                    <text x={midX} y={195} textAnchor="middle" fontSize={10} fill="#64748b">{sp.name.replace(" (Active)", "")}</text>
                  </g>
                );
              });
              const trendPath = completedPoints.length >= 2
                ? `M ${completedPoints.map((p) => `${p.cx},${p.cy}`).join(" L ")}` : null;
              return (
                <>
                  {bars}
                  {trendPath && <path d={trendPath} fill="none" stroke="#6366f1" strokeWidth={2} strokeDasharray="5,3" opacity={0.7} />}
                  {completedPoints.map((p, idx) => (
                    <circle key={idx} cx={p.cx} cy={p.cy} r={4} fill="#6366f1" stroke="white" strokeWidth={2} />
                  ))}
                </>
              );
            })()}
            <line x1={45} y1={20} x2={45} y2={175} stroke="#cbd5e1" strokeWidth={1} />
            <line x1={45} y1={175} x2={580} y2={175} stroke="#cbd5e1" strokeWidth={1} />
            <text x={14} y={100} fontSize={10} fill="#94a3b8" transform="rotate(-90,14,100)" textAnchor="middle">Pts</text>
          </svg>
        </div>
      </div>

      {/* Link Items Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[640px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-800">Link Items to {selectedSprint.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedSprint.boardType === "Scrum" ? "Epics & Stories are mandatory for Scrum board" : "Epics & Stories are optional"}
                </p>
              </div>
              <button onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="px-5 py-4 space-y-5">

              {/* Milestones */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-slate-700">Milestones</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Always required</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {MILESTONES.map((m) => (
                    <label key={m} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${linkSelection.milestones.includes(m) ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"}`}>
                      <input type="checkbox" className="rounded" checked={linkSelection.milestones.includes(m)} onChange={() => toggleLink("milestones", m)} />
                      <span className="text-sm text-slate-700">{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Epics */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-slate-700">Epics</h3>
                  {selectedSprint.boardType === "Scrum"
                    ? <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Mandatory (Scrum)</span>
                    : <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Optional</span>}
                </div>
                <div className="space-y-1.5">
                  {ALL_EPICS.map((e) => (
                    <label key={e.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${linkSelection.epics.includes(e.id) ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:bg-slate-50"}`}>
                      <input type="checkbox" checked={linkSelection.epics.includes(e.id)} onChange={() => toggleLink("epics", e.id)} />
                      <span className="text-xs font-mono text-orange-600">{e.id}</span>
                      <span className="text-sm text-slate-700">{e.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* User Stories */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-slate-700">User Stories</h3>
                  {selectedSprint.boardType === "Scrum"
                    ? <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Mandatory (Scrum)</span>
                    : <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Optional</span>}
                </div>
                <div className="space-y-1.5">
                  {ALL_STORIES.map((s) => (
                    <label key={s.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${linkSelection.stories.includes(s.id) ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                      <input type="checkbox" checked={linkSelection.stories.includes(s.id)} onChange={() => toggleLink("stories", s.id)} />
                      <span className="text-xs font-mono text-blue-600">{s.id}</span>
                      <span className="text-sm text-slate-700">{s.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-slate-700">Tasks</h3>
                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Optional (all boards)</span>
                </div>
                <div className="space-y-1.5">
                  {ALL_TASKS.map((t) => (
                    <label key={t.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${linkSelection.tasks.includes(t.id) ? "border-purple-400 bg-purple-50" : "border-slate-200 hover:bg-slate-50"}`}>
                      <input type="checkbox" checked={linkSelection.tasks.includes(t.id)} onChange={() => toggleLink("tasks", t.id)} />
                      <span className="text-xs font-mono text-purple-600">{t.id}</span>
                      <span className="text-sm text-slate-700">{t.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1 border-t border-slate-100">
                <button onClick={saveLinkModal} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Save Links</button>
                <button onClick={() => setShowLinkModal(false)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
