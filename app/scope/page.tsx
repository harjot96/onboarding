"use client";
import { useState, useEffect } from "react";
import ProjectBanner from "../_components/ProjectBanner";

type Item = {
  id: string; title: string; type: string; priority: string;
  sp?: number; assignee: string; description?: string;
  startDate?: string; endDate?: string; documents?: string[];
};
type Risk = { id: string; risk: string; impact: string; probability: string; mitigation: string; closeByDate: string; closed: boolean };
type Milestone = { id: string; name: string; date: string; status: string; items: number };

const fallbackBacklog: Item[] = [
  { id: "E-01", title: "User Management Module", type: "Epic", priority: "High", assignee: "Rahul S.", description: "Full user lifecycle management including registration, login, roles and permissions.", startDate: "2026-05-01", endDate: "2026-06-30" },
  { id: "E-02", title: "Notification System", type: "Epic", priority: "Medium", assignee: "Vikram P.", description: "Email, push and in-app notification service.", startDate: "2026-06-01", endDate: "2026-07-15" },
  { id: "S-01", title: "As a user I can register with email/password", type: "Story", priority: "High", sp: 5, assignee: "Priya M.", startDate: "2026-05-10", endDate: "2026-05-20", documents: [] },
  { id: "S-02", title: "As a user I can login and receive JWT token", type: "Story", priority: "High", sp: 3, assignee: "Priya M.", startDate: "2026-05-20", endDate: "2026-05-25", documents: [] },
  { id: "T-01", title: "Setup project scaffolding and folder structure", type: "Task", priority: "Medium", sp: 2, assignee: "Amit K.", description: "Create base folder structure per architecture doc.", startDate: "2026-05-01", endDate: "2026-05-05" },
  { id: "T-02", title: "Configure CI/CD pipeline with GitHub Actions", type: "Task", priority: "Medium", sp: 3, assignee: "Amit K.", description: "Setup automated build, test and deploy pipeline.", startDate: "2026-05-05", endDate: "2026-05-12" },
  { id: "B-01", title: "Login form doesn't validate on submit", type: "Bug", priority: "High", sp: 1, assignee: "Sneha R." },
  { id: "R-01", title: "Evaluate Redis vs Memcached for caching layer", type: "R&N", priority: "Low", sp: 5, assignee: "Vikram P." },
  { id: "S-03", title: "As admin I can manage user roles and permissions", type: "Story", priority: "Medium", sp: 8, assignee: "Rahul S.", startDate: "2026-05-28", endDate: "2026-06-10", documents: [] },
];

const fallbackRisks: Risk[] = [
  { id: "R1", risk: "Third-party API rate limiting", impact: "High", probability: "Medium", mitigation: "Implement caching and retry logic", closeByDate: "2026-06-15", closed: false },
  { id: "R2", risk: "Team member unavailability", impact: "Medium", probability: "Low", mitigation: "Cross-train team members", closeByDate: "2026-06-30", closed: false },
  { id: "R3", risk: "Scope creep from stakeholders", impact: "High", probability: "High", mitigation: "Change request process", closeByDate: "2026-05-31", closed: true },
];

const fallbackMilestones: Milestone[] = [
  { id: "M1", name: "MVP Release", date: "2026-06-15", status: "On Track", items: 12 },
  { id: "M2", name: "Beta Launch", date: "2026-07-30", status: "At Risk", items: 8 },
  { id: "M3", name: "v1.0 Production", date: "2026-09-01", status: "Planned", items: 20 },
];

const typeColors: Record<string, string> = {
  Story: "bg-blue-100 text-blue-700", Bug: "bg-red-100 text-red-700",
  Task: "bg-purple-100 text-purple-700", Epic: "bg-orange-100 text-orange-700", "R&N": "bg-yellow-100 text-yellow-700",
};
const priorityColors: Record<string, string> = {
  High: "text-red-600 bg-red-50", Medium: "text-amber-600 bg-amber-50", Low: "text-green-600 bg-green-50",
};
const impactColors: Record<string, string> = {
  High: "bg-red-100 text-red-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-green-100 text-green-700",
};
const milestoneStatusStyle: Record<string, string> = {
  "On Track": "bg-green-100 text-green-700", "At Risk": "bg-amber-100 text-amber-700", Planned: "bg-slate-100 text-slate-500",
};
const milestoneStatusDot: Record<string, string> = {
  "On Track": "bg-green-500", "At Risk": "bg-amber-500", Planned: "bg-slate-300",
};

const BLANK_ITEM = { title: "", type: "Story", priority: "Medium", sp: 3, assignee: "", description: "", startDate: "", endDate: "" };
const BLANK_RISK = { risk: "", impact: "Medium", probability: "Medium", mitigation: "", closeByDate: "", closed: false };

// Convert onboarding risk status → scope closed boolean
function riskStatusToClosed(status: string) { return status === "Closed" || status === "Mitigated"; }
// Convert onboarding milestone status → scope milestone status
function msStatus(s: string) {
  if (s === "Completed") return "On Track";
  if (s === "In Progress") return "On Track";
  if (s === "Delayed") return "At Risk";
  return "Planned";
}

export default function ScopePage() {
  const [activeTab, setActiveTab] = useState("Backlog");
  const [backlog, setBacklog] = useState<Item[]>(fallbackBacklog);
  const [risks, setRisks] = useState<Risk[]>(fallbackRisks);
  const [milestones, setMilestones] = useState<Milestone[]>(fallbackMilestones);
  const [seeded, setSeeded] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<typeof BLANK_ITEM>({ ...BLANK_ITEM });
  const [filterType, setFilterType] = useState("All");
  const [wbsUploaded, setWbsUploaded] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [editModal, setEditModal] = useState<Item | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Item>>({});
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [editingRiskId, setEditingRiskId] = useState<string | null>(null);
  const [riskEdit, setRiskEdit] = useState<Risk | null>(null);
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [newRisk, setNewRisk] = useState<typeof BLANK_RISK>({ ...BLANK_RISK });

  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneEdit, setMilestoneEdit] = useState<Milestone | null>(null);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ name: "", date: "", status: "Planned", items: 0 });

  // ── Seed from onboarding project data ──
  useEffect(() => {
    const raw = localStorage.getItem("pm_active_project");
    if (!raw) return;
    const seedTs = localStorage.getItem("pm_scope_seed_ts");
    try {
      const p = JSON.parse(raw);
      // Only reseed when onboarding was saved after last seed
      if (seedTs && seedTs >= p.initiatedAt) return;

      // Build backlog: one Epic per onboarding milestone + one Task per billing category
      const epics: Item[] = (p.milestones ?? []).map((m: { name: string; deliverable: string; dueDate: string }, i: number) => ({
        id: `E-${String(i + 1).padStart(2, "0")}`,
        title: m.name,
        type: "Epic",
        priority: "High",
        assignee: p.projectManager ?? "",
        description: m.deliverable,
        startDate: p.startDate ?? "",
        endDate: m.dueDate,
      }));

      const billingCategoryTasks: Item[] = [];
      const seen = new Set<string>();
      (p.billingItems ?? []).forEach((b: { category: string; description: string }, i: number) => {
        if (seen.has(b.category)) return;
        seen.add(b.category);
        billingCategoryTasks.push({
          id: `T-${String(i + 1).padStart(2, "0")}`,
          title: b.description,
          type: "Task",
          priority: "Medium",
          sp: 5,
          assignee: p.technicalLead ?? "",
          startDate: p.startDate ?? "",
          endDate: p.endDate ?? "",
        });
      });

      setBacklog([...epics, ...billingCategoryTasks]);

      // Risks from onboarding
      const scopeRisks: Risk[] = (p.risks ?? []).map((r: { id: string; description: string; impact: string; probability: string; mitigation: string; status: string }) => ({
        id: r.id,
        risk: r.description,
        impact: r.impact,
        probability: r.probability,
        mitigation: r.mitigation,
        closeByDate: "",
        closed: riskStatusToClosed(r.status),
      }));
      if (scopeRisks.length) setRisks(scopeRisks);

      // Milestones from onboarding
      const scopeMilestones: Milestone[] = (p.milestones ?? []).map((m: { id: string; name: string; dueDate: string; status: string }) => ({
        id: m.id,
        name: m.name,
        date: m.dueDate,
        status: msStatus(m.status),
        items: 0,
      }));
      if (scopeMilestones.length) setMilestones(scopeMilestones);

      localStorage.setItem("pm_scope_seed_ts", p.initiatedAt);
      setSeeded(true);
    } catch {}
  }, []);

  /* ── helpers ── */
  const handleAIGenerate = () => {
    setAiLoading(true);
    setTimeout(() => {
      setBacklog((p) => [...p,
        { id: "AI-01", title: "Implement notification service", type: "Story", priority: "Medium", sp: 5, assignee: "", startDate: "", endDate: "", documents: [] },
        { id: "AI-02", title: "Add audit logging for DB mutations", type: "Task", priority: "High", sp: 3, assignee: "", description: "Log all write operations to audit table.", startDate: "", endDate: "" },
        { id: "AI-03", title: "Build reporting dashboard", type: "Epic", priority: "Medium", assignee: "", description: "Analytics dashboard for project metrics.", startDate: "", endDate: "" },
      ]);
      setAiLoading(false);
    }, 1500);
  };

  const addItem = () => {
    if (!newItem.title.trim()) return;
    const id = `NEW-${Date.now().toString().slice(-4)}`;
    setBacklog((p) => [...p, { ...newItem, id, sp: newItem.type === "Epic" ? undefined : newItem.sp, documents: newItem.type === "Story" ? [] : undefined }]);
    setNewItem({ ...BLANK_ITEM });
    setShowAddForm(false);
  };

  const openEditModal = (item: Item) => {
    setEditModal(item);
    setEditDraft({ title: item.title, priority: item.priority, assignee: item.assignee, description: item.description ?? "", startDate: item.startDate ?? "", endDate: item.endDate ?? "", sp: item.sp, documents: item.documents ? [...item.documents] : undefined });
  };
  const saveEditModal = () => {
    if (!editModal) return;
    setBacklog((p) => p.map((i) => i.id === editModal.id ? { ...i, ...editDraft } : i));
    setEditModal(null);
  };
  const simulateDocUpload = () => {
    setUploadingDoc(true);
    setTimeout(() => {
      setEditDraft((p) => ({ ...p, documents: [...(p.documents ?? []), `Doc_${Date.now().toString().slice(-4)}.pdf`] }));
      setUploadingDoc(false);
    }, 900);
  };

  const startEditRisk = (r: Risk) => { setEditingRiskId(r.id); setRiskEdit({ ...r }); };
  const saveRisk = () => {
    if (!riskEdit) return;
    setRisks((p) => p.map((r) => r.id === riskEdit.id ? riskEdit : r));
    setEditingRiskId(null); setRiskEdit(null);
  };
  const addRisk = () => {
    if (!newRisk.risk.trim()) return;
    setRisks((p) => [...p, { ...newRisk, id: `R${p.length + 10}` }]);
    setNewRisk({ ...BLANK_RISK });
    setShowAddRisk(false);
  };
  const toggleRiskClosed = (id: string) => setRisks((p) => p.map((r) => r.id === id ? { ...r, closed: !r.closed } : r));

  const startEditMilestone = (m: Milestone) => { setEditingMilestoneId(m.id); setMilestoneEdit({ ...m }); };
  const saveMilestone = () => {
    if (!milestoneEdit) return;
    setMilestones((p) => p.map((m) => m.id === milestoneEdit.id ? milestoneEdit : m));
    setEditingMilestoneId(null); setMilestoneEdit(null);
  };
  const addMilestone = () => {
    if (!newMilestone.name.trim()) return;
    setMilestones((p) => [...p, { ...newMilestone, id: `M${p.length + 10}` }]);
    setNewMilestone({ name: "", date: "", status: "Planned", items: 0 });
    setShowAddMilestone(false);
  };

  const filtered = filterType === "All" ? backlog : backlog.filter((i) => i.type === filterType);
  const isEpic = newItem.type === "Epic";
  const isStory = newItem.type === "Story";
  const isTaskLike = ["Task", "Sub-Task", "R&N"].includes(newItem.type);

  return (
    <div className="p-6 space-y-4">
      {/* Project context banner */}
      <ProjectBanner />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Scope Definition & Backlog</h1>
          <p className="text-sm text-slate-500">
            {seeded ? "Pre-populated from onboarding — refine epics, add stories & tasks" : "Upload WBS, generate tasks with AI, manage epics & stories"}
          </p>
        </div>
        {seeded && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">✓ Seeded from Project Onboarding</span>
        )}
      </div>

      {/* WBS Upload + AI */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-4">
        <div className="flex-1">
          <div className="font-semibold text-slate-700 mb-1">Upload WBS</div>
          <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${wbsUploaded ? "border-green-400 bg-green-50" : "border-slate-200 hover:border-indigo-400"}`}
            onClick={() => setWbsUploaded(true)}>
            {wbsUploaded ? <div className="text-green-600 font-medium">✓ WBS_ProjectAlpha_v2.xlsx uploaded</div>
              : <><div className="text-2xl mb-1">📁</div><div className="text-sm text-slate-500">Click to upload WBS (.xlsx, .csv, .pdf)</div></>}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="font-semibold text-slate-700 mb-1">AI Task Generation</div>
          <button onClick={handleAIGenerate} disabled={aiLoading || !wbsUploaded}
            className="w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {aiLoading ? "Generating…" : "✨ Generate Tasks from WBS via AI"}
          </button>
          <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">📊 PERT Estimation (Optional)</button>
          <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">📝 Dev Team Separate Estimate (Optional)</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {["Backlog", "Risk Register", "Milestones & Releases"].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === t ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>{t}</button>
        ))}
      </div>

      {/* ══ BACKLOG TAB ══ */}
      {activeTab === "Backlog" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-600">Filter:</span>
              {["All", "Epic", "Story", "Task", "Bug", "R&N"].map((f) => (
                <button key={f} onClick={() => setFilterType(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === f ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{f}</button>
              ))}
            </div>
            <button onClick={() => setShowAddForm(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">+ Add Item</button>
          </div>

          {showAddForm && (
            <div className="px-4 py-4 bg-indigo-50 border-b border-indigo-100 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-indigo-700">New Backlog Item</span>
                <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
                  value={newItem.type} onChange={(e) => setNewItem((p) => ({ ...p, type: e.target.value }))}>
                  {["Story", "Task", "Bug", "Epic", "R&N", "Sub-Task", "Branch Bug"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <input className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Title *"
                  value={newItem.title} onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))} />
                <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                  value={newItem.priority} onChange={(e) => setNewItem((p) => ({ ...p, priority: e.target.value }))}>
                  {["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
                </select>
                <input className="w-32 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Assignee"
                  value={newItem.assignee} onChange={(e) => setNewItem((p) => ({ ...p, assignee: e.target.value }))} />
                {!isEpic && (
                  <input type="number" className="w-16 border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white" placeholder="SP"
                    value={newItem.sp} onChange={(e) => setNewItem((p) => ({ ...p, sp: Number(e.target.value) }))} />
                )}
              </div>
              {(isEpic || isTaskLike) && (
                <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white resize-none h-16"
                  placeholder={isEpic ? "Epic description (goal & scope)…" : "Task description…"}
                  value={newItem.description} onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))} />
              )}
              {(isEpic || isStory || isTaskLike) && (
                <div className="flex gap-3 items-center">
                  <label className="text-xs text-slate-500 shrink-0">Start Date</label>
                  <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                    value={newItem.startDate} onChange={(e) => setNewItem((p) => ({ ...p, startDate: e.target.value }))} />
                  <label className="text-xs text-slate-500 shrink-0">End Date</label>
                  <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                    value={newItem.endDate} onChange={(e) => setNewItem((p) => ({ ...p, endDate: e.target.value }))} />
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={addItem} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">Save</button>
                <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-sm rounded-lg">Cancel</button>
              </div>
            </div>
          )}

          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Title / Dates</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Priority</th>
                <th className="text-left px-4 py-2">SP</th>
                <th className="text-left px-4 py-2">Assignee</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2.5">
                    <button onClick={() => openEditModal(item)} className="text-indigo-600 font-mono text-xs font-medium underline underline-offset-2 hover:text-indigo-800 cursor-pointer">{item.id}</button>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="text-slate-700 font-medium text-sm">{item.title}</div>
                    {item.description && <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{item.description}</div>}
                    {(item.startDate || item.endDate) && (
                      <div className="text-xs text-slate-400 mt-0.5">{item.startDate || "—"} → {item.endDate || "TBD"}</div>
                    )}
                    {item.documents && item.documents.length > 0 && (
                      <div className="text-xs text-indigo-500 mt-0.5">📎 {item.documents.length} doc{item.documents.length > 1 ? "s" : ""}</div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[item.type] ?? "bg-gray-100 text-gray-600"}`}>{item.type}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[item.priority] ?? ""}`}>{item.priority}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 text-sm">{item.sp != null ? `${item.sp} pts` : <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-sm">{item.assignee || <span className="text-slate-300 italic">Unassigned</span>}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => openEditModal(item)} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>{filtered.length} items · {backlog.filter(i => i.type === "Epic").length} epics · {backlog.filter(i => i.type === "Story").length} stories · {backlog.filter(i => i.type === "Task").length} tasks</span>
            <span>Total SP: {filtered.reduce((a, i) => a + (i.sp ?? 0), 0)}</span>
          </div>
        </div>
      )}

      {/* ══ RISK REGISTER TAB ══ */}
      {activeTab === "Risk Register" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-700">Risk Register</h3>
              {seeded && <p className="text-xs text-slate-400 mt-0.5">Pre-populated from onboarding risk assessment</p>}
            </div>
            <button onClick={() => setShowAddRisk(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">+ Add Risk</button>
          </div>

          {showAddRisk && (
            <div className="px-4 py-4 bg-indigo-50 border-b border-indigo-100 space-y-3">
              <div className="text-sm font-semibold text-indigo-700 mb-1">New Risk</div>
              <div className="grid grid-cols-2 gap-3">
                <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white col-span-2" placeholder="Risk description *"
                  value={newRisk.risk} onChange={(e) => setNewRisk((p) => ({ ...p, risk: e.target.value }))} />
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                  value={newRisk.impact} onChange={(e) => setNewRisk((p) => ({ ...p, impact: e.target.value }))}>
                  <option value="">Impact…</option>{["High", "Medium", "Low"].map((v) => <option key={v}>{v}</option>)}
                </select>
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                  value={newRisk.probability} onChange={(e) => setNewRisk((p) => ({ ...p, probability: e.target.value }))}>
                  <option value="">Probability…</option>{["High", "Medium", "Low"].map((v) => <option key={v}>{v}</option>)}
                </select>
                <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white col-span-2" placeholder="Mitigation strategy"
                  value={newRisk.mitigation} onChange={(e) => setNewRisk((p) => ({ ...p, mitigation: e.target.value }))} />
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 shrink-0">Close By</label>
                  <input type="date" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                    value={newRisk.closeByDate} onChange={(e) => setNewRisk((p) => ({ ...p, closeByDate: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={addRisk} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg">Save Risk</button>
                <button onClick={() => setShowAddRisk(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-sm rounded-lg">Cancel</button>
              </div>
            </div>
          )}

          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2">ID</th>
                <th className="text-left px-4 py-2">Risk Description</th>
                <th className="text-left px-4 py-2">Impact</th>
                <th className="text-left px-4 py-2">Probability</th>
                <th className="text-left px-4 py-2">Mitigation</th>
                <th className="text-left px-4 py-2">Close By</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r) => (
                editingRiskId === r.id && riskEdit ? (
                  <tr key={r.id} className="border-b border-indigo-100 bg-indigo-50">
                    <td className="px-4 py-2 text-slate-400 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={riskEdit.risk} onChange={(e) => setRiskEdit({ ...riskEdit, risk: e.target.value })} /></td>
                    <td className="px-4 py-2"><select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={riskEdit.impact} onChange={(e) => setRiskEdit({ ...riskEdit, impact: e.target.value })}>{["High", "Medium", "Low"].map((v) => <option key={v}>{v}</option>)}</select></td>
                    <td className="px-4 py-2"><select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={riskEdit.probability} onChange={(e) => setRiskEdit({ ...riskEdit, probability: e.target.value })}>{["High", "Medium", "Low"].map((v) => <option key={v}>{v}</option>)}</select></td>
                    <td className="px-4 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={riskEdit.mitigation} onChange={(e) => setRiskEdit({ ...riskEdit, mitigation: e.target.value })} /></td>
                    <td className="px-4 py-2"><input type="date" className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={riskEdit.closeByDate} onChange={(e) => setRiskEdit({ ...riskEdit, closeByDate: e.target.value })} /></td>
                    <td className="px-4 py-2"><label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={riskEdit.closed} onChange={(e) => setRiskEdit({ ...riskEdit, closed: e.target.checked })} /><span className="text-xs">{riskEdit.closed ? "Closed" : "Open"}</span></label></td>
                    <td className="px-4 py-2 flex gap-1"><button onClick={saveRisk} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Save</button><button onClick={() => { setEditingRiskId(null); setRiskEdit(null); }} className="px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded">Cancel</button></td>
                  </tr>
                ) : (
                  <tr key={r.id} className={`border-b border-slate-50 hover:bg-slate-50 ${r.closed ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3 text-slate-700">{r.risk}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColors[r.impact]}`}>{r.impact}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColors[r.probability]}`}>{r.probability}</span></td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{r.mitigation}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{r.closeByDate || "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleRiskClosed(r.id)}
                        className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${r.closed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {r.closed ? "Closed" : "Open"}
                      </button>
                    </td>
                    <td className="px-4 py-3"><button onClick={() => startEditRisk(r)} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200">Edit</button></td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ══ MILESTONES TAB ══ */}
      {activeTab === "Milestones & Releases" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-700">Deliverables / Milestones / Releases</h3>
              {seeded && <p className="text-xs text-slate-400 mt-0.5">Imported from project onboarding milestones</p>}
            </div>
            <button onClick={() => setShowAddMilestone(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">+ Add Milestone</button>
          </div>

          {showAddMilestone && (
            <div className="bg-white rounded-xl shadow-sm p-4 border-2 border-indigo-200 space-y-3">
              <div className="text-sm font-semibold text-indigo-700">New Milestone</div>
              <div className="grid grid-cols-4 gap-3">
                <input className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Milestone name *"
                  value={newMilestone.name} onChange={(e) => setNewMilestone((p) => ({ ...p, name: e.target.value }))} />
                <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  value={newMilestone.date} onChange={(e) => setNewMilestone((p) => ({ ...p, date: e.target.value }))} />
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                  value={newMilestone.status} onChange={(e) => setNewMilestone((p) => ({ ...p, status: e.target.value }))}>
                  {["On Track", "At Risk", "Planned"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={addMilestone} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg">Save</button>
                <button onClick={() => setShowAddMilestone(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-sm rounded-lg">Cancel</button>
              </div>
            </div>
          )}

          {milestones.map((m) => (
            editingMilestoneId === m.id && milestoneEdit ? (
              <div key={m.id} className="bg-white rounded-xl shadow-sm p-4 border-2 border-indigo-300 space-y-3">
                <div className="text-sm font-semibold text-indigo-700">Edit Milestone</div>
                <div className="grid grid-cols-4 gap-3">
                  <input className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Name"
                    value={milestoneEdit.name} onChange={(e) => setMilestoneEdit({ ...milestoneEdit, name: e.target.value })} />
                  <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    value={milestoneEdit.date} onChange={(e) => setMilestoneEdit({ ...milestoneEdit, date: e.target.value })} />
                  <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                    value={milestoneEdit.status} onChange={(e) => setMilestoneEdit({ ...milestoneEdit, status: e.target.value })}>
                    {["On Track", "At Risk", "Planned"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input type="number" className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Items count"
                    value={milestoneEdit.items} onChange={(e) => setMilestoneEdit({ ...milestoneEdit, items: Number(e.target.value) })} />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveMilestone} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg">Save</button>
                  <button onClick={() => { setEditingMilestoneId(null); setMilestoneEdit(null); }} className="px-4 py-2 bg-slate-200 text-slate-600 text-sm rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <div key={m.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full shrink-0 ${milestoneStatusDot[m.status] ?? "bg-slate-300"}`} />
                <div className="flex-1">
                  <div className="font-semibold text-slate-700">{m.name}</div>
                  <div className="text-sm text-slate-400">Target: {m.date}{m.items > 0 ? ` · ${m.items} backlog items` : ""}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${milestoneStatusStyle[m.status] ?? "bg-slate-100 text-slate-500"}`}>{m.status}</span>
                <button onClick={() => startEditMilestone(m)} className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Edit</button>
              </div>
            )
          ))}
        </div>
      )}

      {/* Unified Item Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[editModal.type] ?? "bg-gray-100 text-gray-600"}`}>{editModal.type}</span>
                <span className="text-xs text-slate-400 font-mono">{editModal.id}</span>
              </div>
              <button onClick={() => setEditModal(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Title</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={editDraft.title ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Priority</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={editDraft.priority ?? "Medium"} onChange={(e) => setEditDraft((p) => ({ ...p, priority: e.target.value }))}>
                    {["High", "Medium", "Low"].map((pr) => <option key={pr}>{pr}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Assignee</label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={editDraft.assignee ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, assignee: e.target.value }))} />
                </div>
              </div>
              {editModal.type !== "Epic" && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Story Points</label>
                  <input type="number" min="0" className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={editDraft.sp ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, sp: Number(e.target.value) }))} />
                </div>
              )}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={editDraft.description ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, description: e.target.value }))} placeholder="Describe this item…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Start Date</label>
                  <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={editDraft.startDate ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, startDate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">End Date</label>
                  <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={editDraft.endDate ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, endDate: e.target.value }))} />
                </div>
              </div>
              {editModal.type === "Story" && (
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2">Attached Documents</div>
                  {(!editDraft.documents || editDraft.documents.length === 0)
                    ? <div className="text-sm text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-lg mb-2">No documents attached yet</div>
                    : <div className="space-y-1.5 mb-2">{editDraft.documents.map((doc, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-red-500">📄</span>
                          <span className="flex-1 text-sm text-slate-700">{doc}</span>
                          <span className="text-xs text-slate-400">PDF</span>
                        </div>
                      ))}</div>}
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors" onClick={simulateDocUpload}>
                    {uploadingDoc ? <div className="text-indigo-600 font-medium text-sm">Uploading…</div>
                      : <><div className="text-2xl mb-1">📎</div><div className="text-sm font-medium text-slate-600">Click to attach document</div></>}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-1 border-t border-slate-100">
                <button onClick={saveEditModal} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">Save Changes</button>
                <button onClick={() => setEditModal(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
