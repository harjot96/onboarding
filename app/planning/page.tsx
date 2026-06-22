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
  id: string; title: string; type: string;
  hours: number; hoursLogged: number; assignee: string; status: string;
  attachedStoryId?: string;
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
    id: "SP-1", name: "Sprint 1", startDate: "2026-03-03", endDate: "2026-03-14",
    capacity: 80, allocated: 78, velocity: 34, status: "Completed", boardType: "Scrum",
    linkedMilestones: ["MVP Release"], linkedEpics: ["E-01"], linkedStories: ["S-01"], linkedTasks: ["T-01", "T-02"],
    stories: [
      { id: "S-P1-01", title: "Project scaffolding & folder structure", type: "Story", hours: 20, hoursLogged: 20, assignee: "Amit K.", status: "Done" },
      { id: "T-P1-01", title: "CI/CD pipeline setup", type: "Task", hours: 14, hoursLogged: 14, assignee: "Amit K.", status: "Done" },
      { id: "T-P1-02", title: "Authentication foundations", type: "Task", hours: 24, hoursLogged: 22, assignee: "Rahul S.", status: "Done" },
      { id: "T-P1-03", title: "Database schema design", type: "Task", hours: 18, hoursLogged: 18, assignee: "Vikram P.", status: "Done" },
      { id: "B-P1-01", title: "Fix local env Docker compose", type: "Bug", hours: 4, hoursLogged: 4, assignee: "Sneha R.", status: "Done" },
    ],
  },
  {
    id: "SP-2", name: "Sprint 2", startDate: "2026-03-17", endDate: "2026-03-28",
    capacity: 80, allocated: 76, velocity: 30, status: "Completed", boardType: "Scrum",
    linkedMilestones: ["MVP Release", "Beta Launch"], linkedEpics: ["E-01", "E-02"], linkedStories: ["S-02", "S-03"], linkedTasks: ["T-103"],
    stories: [
      { id: "S-P2-01", title: "Notification service — email & push", type: "Story", hours: 24, hoursLogged: 24, assignee: "Vikram P.", status: "Done" },
      { id: "S-P2-02", title: "Role management & permissions", type: "Story", hours: 22, hoursLogged: 20, assignee: "Rahul S.", status: "Done" },
      { id: "T-P2-01", title: "Dashboard layout components", type: "Task", hours: 16, hoursLogged: 15, assignee: "Priya M.", status: "Done" },
      { id: "B-P2-01", title: "Session token expiry bug", type: "Bug", hours: 6, hoursLogged: 6, assignee: "Sneha R.", status: "Done" },
    ],
  },
  {
    id: "SP-3", name: "Sprint 3", startDate: "2026-04-07", endDate: "2026-04-18",
    capacity: 80, allocated: 72, velocity: 28, status: "Completed", boardType: "Scrum",
    linkedMilestones: ["Beta Launch"], linkedEpics: ["E-01", "E-02"], linkedStories: ["S-03"], linkedTasks: ["T-109"],
    stories: [
      { id: "S-P3-01", title: "API integrations — third party services", type: "Story", hours: 28, hoursLogged: 26, assignee: "Rahul S.", status: "Done" },
      { id: "T-P3-01", title: "Performance optimisations", type: "Task", hours: 18, hoursLogged: 18, assignee: "Vikram P.", status: "Done" },
      { id: "T-P3-02", title: "Automated testing setup", type: "Task", hours: 16, hoursLogged: 14, assignee: "Meera J.", status: "Done" },
      { id: "R-P3-01", title: "Redis vs Memcached benchmark", type: "R&D", hours: 10, hoursLogged: 10, assignee: "Vikram P.", status: "Done" },
    ],
  },
  {
    id: "SP-4", name: "Sprint 4", startDate: "2026-05-15", endDate: "2026-05-28",
    capacity: 80, allocated: 76, velocity: 32, status: "Active", boardType: "Scrum",
    linkedMilestones: ["MVP Release"], linkedEpics: ["E-01"], linkedStories: ["S-01", "S-02"], linkedTasks: ["T-101", "T-103"],
    stories: [
      { id: "S-01", title: "User registration flow", type: "Story", hours: 20, hoursLogged: 18, assignee: "Rahul S.", status: "In Progress" },
      { id: "S-02", title: "JWT authentication", type: "Story", hours: 12, hoursLogged: 12, assignee: "Priya M.", status: "Done" },
      { id: "T-01", title: "CI/CD setup", type: "Task", hours: 10, hoursLogged: 6, assignee: "Amit K.", status: "In Progress", attachedStoryId: "S-01" },
      { id: "T-103", title: "Setup CI/CD pipeline with GitHub Actions", type: "Task", hours: 12, hoursLogged: 0, assignee: "Amit K.", status: "To Do", attachedStoryId: "S-02" },
      { id: "B-01", title: "Login redirect bug", type: "Bug", hours: 4, hoursLogged: 4, assignee: "Sneha R.", status: "Done", attachedStoryId: "S-02" },
    ],
  },
  {
    id: "SP-5", name: "Sprint 5", startDate: "2026-05-29", endDate: "2026-06-11",
    capacity: 80, allocated: 45, velocity: 32, status: "Planned", boardType: "Scrum",
    linkedMilestones: ["MVP Release", "Beta Launch"], linkedEpics: ["E-01", "E-02"], linkedStories: ["S-03"], linkedTasks: ["T-109"],
    stories: [
      { id: "S-03", title: "Admin role management", type: "Story", hours: 32, hoursLogged: 0, assignee: "Rahul S.", status: "To Do" },
      { id: "R-01", title: "Redis evaluation", type: "R&D", hours: 13, hoursLogged: 0, assignee: "Vikram P.", status: "To Do" },
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
  Task: "bg-purple-100 text-purple-700", "R&D": "bg-yellow-100 text-yellow-700",
  Epic: "bg-orange-100 text-orange-700",
};
const statusColors: Record<string, string> = {
  "To Do": "bg-slate-100 text-slate-600", "In Progress": "bg-blue-100 text-blue-700", Done: "bg-green-100 text-green-700",
};
const boardTypeStyle: Record<BoardType, string> = {
  Scrum: "bg-indigo-100 text-indigo-700",
  Kanban: "bg-teal-100 text-teal-700",
  Waterfall: "bg-amber-100 text-amber-700",
};

const BLANK_ITEM = { title: "", type: "Story", hours: 8, assignee: "", status: "To Do", attachedStoryId: "" };

export default function PlanningPage() {
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [selectedSprint, setSelectedSprint] = useState<Sprint>(initialSprints[0]);
  const [showNewSprintForm, setShowNewSprintForm] = useState(false);
  const [newSprint, setNewSprint] = useState({ name: "", startDate: "", endDate: "", capacity: 80, boardType: "Scrum" as BoardType });

  // Add item form
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItem, setNewItem] = useState({ ...BLANK_ITEM });

  // Item detail modal
  const [selectedItem, setSelectedItem] = useState<SprintStory | null>(null);

  const [showPastSprints, setShowPastSprints] = useState(false);

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

  const addSprintItem = () => {
    if (!newItem.title.trim()) return;
    const prefix = newItem.type === "Story" ? "S" : newItem.type === "Bug" ? "B" : "T";
    const item: SprintStory = {
      id: `${prefix}-${Date.now().toString().slice(-4)}`,
      title: newItem.title,
      type: newItem.type,
      hours: newItem.hours,
      hoursLogged: 0,
      assignee: newItem.assignee,
      status: "To Do",
      attachedStoryId: newItem.attachedStoryId || undefined,
    };
    const updatedSprints = sprints.map((s) =>
      s.id === selectedSprint.id ? { ...s, stories: [...s.stories, item] } : s
    );
    setSprints(updatedSprints);
    setSelectedSprint(updatedSprints.find((s) => s.id === selectedSprint.id)!);
    setNewItem({ ...BLANK_ITEM });
    setShowAddItemForm(false);
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
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-600">Sprints</h2>
        <button onClick={() => setShowPastSprints(p => !p)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${showPastSprints ? "bg-slate-700 text-white border-slate-700" : "border-slate-300 text-slate-500 hover:bg-slate-100"}`}>
          {showPastSprints ? "Hide Past Sprints" : "Show Past Sprints"}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {sprints.filter(sp => showPastSprints || sp.status !== "Completed").map((sp) => {
          const pct = sp.capacity > 0 ? Math.round((sp.allocated / sp.capacity) * 100) : 0;
          const over = sp.allocated > sp.capacity;
          const isSelected = selectedSprint.id === sp.id;
          return (
            <button key={sp.id} onClick={() => { setSelectedSprint(sp); setShowAddItemForm(false); }}
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

      {/* ── Sprint Detail — Full Width ── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
            <button
              onClick={() => { setNewItem({ ...BLANK_ITEM, type: "Story" }); setShowAddItemForm(true); }}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              + Add Story
            </button>
            <button
              onClick={() => { setNewItem({ ...BLANK_ITEM, type: "Task" }); setShowAddItemForm(true); }}
              className="px-3 py-1.5 text-sm border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-50">
              + Add Task
            </button>
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

        {/* Add Item Inline Form */}
        {showAddItemForm && (
          <div className="px-4 py-4 bg-indigo-50 border-b border-indigo-100 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-indigo-700">New Sprint Item</span>
              <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
                value={newItem.type} onChange={(e) => setNewItem((p) => ({ ...p, type: e.target.value }))}>
                {["Story", "Task", "Bug", "R&D", "Sub-Task"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <input className="flex-1 min-w-48 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Title *"
                value={newItem.title} onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addSprintItem()} />
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-slate-500 shrink-0">Est. Hrs</label>
                <input type="number" className="w-16 border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                  value={newItem.hours} onChange={(e) => setNewItem((p) => ({ ...p, hours: Number(e.target.value) }))} />
              </div>
              <input className="w-32 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Assignee"
                value={newItem.assignee} onChange={(e) => setNewItem((p) => ({ ...p, assignee: e.target.value }))} />
              {newItem.type !== "Story" && (
                <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                  value={newItem.attachedStoryId} onChange={(e) => setNewItem((p) => ({ ...p, attachedStoryId: e.target.value }))}>
                  <option value="">📎 Attach to Story…</option>
                  {ALL_STORIES.map((s) => <option key={s.id} value={s.id}>{s.id}: {s.title.slice(0, 35)}</option>)}
                </select>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={addSprintItem} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Add</button>
              <button onClick={() => setShowAddItemForm(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-sm rounded-lg">Cancel</button>
            </div>
          </div>
        )}

        {selectedSprint.boardType !== "Scrum" && (
          <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
            <span className="text-amber-600 text-sm">ℹ</span>
            <span className="text-xs text-amber-700">
              <strong>{selectedSprint.boardType} mode:</strong> Sprint planning columns (velocity, story linking) are disabled. Items flow continuously without sprint capacity constraints.
            </span>
          </div>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Est. Hrs</th>
              <th className="text-left px-4 py-2">Logged</th>
              <th className="text-left px-4 py-2">Remaining</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Assignee</th>
              <th className="text-left px-4 py-2">Attachment</th>
            </tr>
          </thead>
          <tbody>
            {selectedSprint.stories.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-slate-400 text-sm">No stories in this sprint yet — click + Add Story or + Add Task</td></tr>
            ) : (
              selectedSprint.stories.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => setSelectedItem(s)}
                      className="text-indigo-600 font-mono text-xs font-medium underline underline-offset-2 hover:text-indigo-800 cursor-pointer">
                      {s.id}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-slate-700">{s.title}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[s.type] ?? "bg-gray-100 text-gray-600"}`}>{s.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{s.hours}h</td>
                  <td className="px-4 py-2.5">
                    <span className={s.hoursLogged >= s.hours ? "text-green-600 font-medium" : "text-slate-500"}>{s.hoursLogged}h</span>
                  </td>
                  <td className="px-4 py-2.5">
                    {(() => {
                      const rem = Math.max(0, s.hours - s.hoursLogged);
                      return <span className={rem === 0 ? "text-green-600 font-medium" : rem < s.hours * 0.25 ? "text-amber-600 font-medium" : "text-slate-500"}>{rem}h</span>;
                    })()}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[s.status] ?? "bg-gray-100"}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs">{s.assignee}</td>
                  <td className="px-4 py-2.5">
                    {s.attachedStoryId ? (
                      <button onClick={() => {
                        const linkedStory = selectedSprint.stories.find(st => st.id === s.attachedStoryId)
                          ?? { id: s.attachedStoryId ?? "", title: ALL_STORIES.find(st => st.id === s.attachedStoryId)?.title ?? s.attachedStoryId ?? "", type: "Story", hours: 0, hoursLogged: 0, assignee: "", status: "To Do" };
                        setSelectedItem(linkedStory);
                      }} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline">
                        <span>📎</span>
                        <span className="font-mono text-xs">{s.attachedStoryId}</span>
                      </button>
                    ) : s.type === "Story" ? (
                      <button onClick={() => setSelectedItem(s)} className="text-xs text-blue-500 font-mono hover:underline">Story →</button>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
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

      {/* ── Sprint Metrics Row (moved from sidebar) ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Sprint Metrics */}
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

        {/* Linked Milestones */}
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

        {/* All Sprints Timeline */}
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

        {/* Sprint Hours Bar Chart */}
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

        {/* Velocity Bar Chart */}
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

      {/* ── Capacity Planner ── */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Capacity Planner</h2>
          <p className="text-xs text-slate-400 mt-0.5">Per-member sprint capacity vs allocation — overallocation highlighted in red</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wide bg-slate-50">
              <th className="px-5 py-3 text-left">Member</th>
              <th className="px-5 py-3 text-left">Role</th>
              <th className="px-5 py-3 text-center">Capacity (h)</th>
              <th className="px-5 py-3 text-center">Allocated (h)</th>
              <th className="px-5 py-3 text-center">Available (h)</th>
              <th className="px-5 py-3 text-left">Utilization</th>
              <th className="px-5 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Rahul S.",  role: "Backend Lead",    capacity: 80, allocated: 72 },
              { name: "Priya M.",  role: "Frontend Dev",    capacity: 80, allocated: 60 },
              { name: "Amit K.",   role: "DevOps Engineer", capacity: 80, allocated: 54 },
              { name: "Sneha R.",  role: "UI/UX Designer",  capacity: 80, allocated: 80 },
              { name: "Vikram P.", role: "Full Stack Dev",  capacity: 80, allocated: 66 },
              { name: "Meera J.",  role: "QA Engineer",     capacity: 80, allocated: 44 },
            ].map((m, i) => {
              const avail = m.capacity - m.allocated;
              const pct = Math.round((m.allocated / m.capacity) * 100);
              const over = m.allocated > m.capacity;
              const warn = pct >= 90;
              return (
                <tr key={m.name} className={`border-t border-slate-50 ${i % 2 === 0 ? "" : "bg-slate-50/50"} ${over ? "bg-red-50" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${over ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"}`}>{m.name[0]}</div>
                      <span className="font-medium text-slate-800">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{m.role}</td>
                  <td className="px-5 py-3 text-center font-mono text-slate-700">{m.capacity}h</td>
                  <td className={`px-5 py-3 text-center font-mono font-semibold ${over ? "text-red-600" : warn ? "text-amber-600" : "text-slate-700"}`}>{m.allocated}h</td>
                  <td className={`px-5 py-3 text-center font-mono ${avail <= 0 ? "text-red-500" : "text-emerald-600"}`}>{avail}h</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${over ? "bg-red-500" : warn ? "bg-amber-400" : "bg-indigo-500"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <span className={`text-xs font-medium w-9 text-right ${over ? "text-red-600" : warn ? "text-amber-600" : "text-slate-600"}`}>{pct}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${over ? "bg-red-100 text-red-700" : warn ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                      {over ? "Overloaded" : warn ? "Near Full" : "OK"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Overallocation warning */}
        {[80, 72, 66, 60, 54, 44].some((a, i) => a > 80) === false && (
          <div className="px-5 py-3 border-t border-slate-50 bg-amber-50">
            <p className="text-xs text-amber-700 font-medium">⚠ Rahul S. and Sneha R. are at or near full capacity — consider redistributing tasks before sprint start.</p>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[520px] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                    selectedItem.type === "Story" ? "bg-blue-100 text-blue-700 border-blue-200" :
                    selectedItem.type === "Bug" ? "bg-red-100 text-red-700 border-red-200" :
                    "bg-purple-100 text-purple-700 border-purple-200"
                  }`}>{selectedItem.type}</span>
                  <span className="text-xs text-indigo-600 font-mono font-medium">{selectedItem.id}</span>
                </div>
                <h2 className="font-semibold text-slate-800 text-base">{selectedItem.title}</h2>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400 text-xs block mb-0.5">Assignee</span>
                  <div className="font-medium text-slate-700">{selectedItem.assignee || "Unassigned"}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block mb-0.5">Status</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[selectedItem.status] ?? "bg-gray-100"}`}>{selectedItem.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block mb-0.5">Hours</span>
                  <div className="font-medium text-slate-700">{selectedItem.hoursLogged}h / {selectedItem.hours}h logged</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block mb-0.5">Sprint</span>
                  <div className="font-medium text-slate-700">{selectedSprint.name}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block mb-0.5">Board Type</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${boardTypeStyle[selectedSprint.boardType]}`}>{selectedSprint.boardType}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Hours Progress</span>
                  <span className="font-medium text-slate-600">{selectedItem.hours > 0 ? Math.round((selectedItem.hoursLogged / selectedItem.hours) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${selectedItem.hoursLogged >= selectedItem.hours ? "bg-green-500" : "bg-indigo-500"}`}
                    style={{ width: `${Math.min(selectedItem.hours > 0 ? (selectedItem.hoursLogged / selectedItem.hours) * 100 : 0, 100)}%` }} />
                </div>
              </div>

              {/* Attached User Story */}
              {selectedItem.attachedStoryId && (
                <div>
                  <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                    <span>📎</span> Attached User Story
                  </div>
                  <button
                    onClick={() => {
                      const linkedStory = selectedSprint.stories.find(st => st.id === selectedItem.attachedStoryId)
                        ?? { id: selectedItem.attachedStoryId!, title: ALL_STORIES.find(st => st.id === selectedItem.attachedStoryId)?.title ?? selectedItem.attachedStoryId!, type: "Story", hours: 0, hoursLogged: 0, assignee: "", status: "To Do" };
                      setSelectedItem(linkedStory);
                    }}
                    className="w-full flex items-start gap-3 px-3 py-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 hover:border-blue-300 transition-colors text-left">
                    <div className="px-1.5 py-0.5 bg-blue-100 rounded text-xs font-mono text-blue-700 shrink-0 mt-0.5">{selectedItem.attachedStoryId}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-700">
                        {ALL_STORIES.find((s) => s.id === selectedItem.attachedStoryId)?.title ?? selectedItem.attachedStoryId}
                      </div>
                      <div className="text-xs text-blue-500 mt-0.5">Click to open story →</div>
                    </div>
                  </button>
                </div>
              )}

              {/* If it IS a story, show its own details */}
              {selectedItem.type === "Story" && (
                <div>
                  <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                    <span>📖</span> Story Details
                  </div>
                  <div className="px-3 py-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-slate-700">
                    {(() => {
                      const fullStory = ALL_STORIES.find((s) => s.id === selectedItem.id);
                      return fullStory
                        ? <div><span className="font-mono text-blue-600 text-xs">{fullStory.id}</span> · {fullStory.title}</div>
                        : <div className="text-xs text-slate-500">{selectedItem.title}</div>;
                    })()}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-1 border-t border-slate-100">
                <button onClick={() => setSelectedItem(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
