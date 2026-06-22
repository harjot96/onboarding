"use client";
import { useState, useEffect } from "react";
import ProjectBanner from "../_components/ProjectBanner";

type Item = {
  id: string; title: string; type: string; priority: string;
  assignee: string; assignedBy?: string; description?: string;
  startDate?: string; endDate?: string; documents?: string[];
  epicId?: string; sprintId?: string;
  sp?: number; status?: string; blocked?: boolean;
  plannedHours?: number; actualHours?: number;
};
type Risk = { id: string; risk: string; impact: string; probability: string; mitigation: string; closeByDate: string; closed: boolean; preSales?: boolean };
type Milestone = { id: string; name: string; date: string; status: string; items: number };
type Resource = {
  id: string; name: string; role: string;
  availability: "Available" | "Partial" | "Not Available";
  capacityHours: number; allocatedHours: number; skills: string[]; currentTasks: number;
};

const AVAILABLE_SPRINTS = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6", "Sprint 7"];

// Organisation-wide pool — all available talent
const GLOBAL_RESOURCE_POOL: Resource[] = [
  // Already on this project (initialResources is a subset)
  { id: "res1",  name: "Rahul S.",    role: "Backend Lead",        availability: "Partial",       capacityHours: 80, allocatedHours: 60, skills: ["Node.js", "Auth", "API"],             currentTasks: 3 },
  { id: "res2",  name: "Priya M.",    role: "Frontend Dev",        availability: "Available",     capacityHours: 80, allocatedHours: 20, skills: ["React", "UI/UX", "CSS"],              currentTasks: 1 },
  { id: "res3",  name: "Amit K.",     role: "DevOps Engineer",     availability: "Available",     capacityHours: 80, allocatedHours: 15, skills: ["CI/CD", "Docker", "AWS"],             currentTasks: 2 },
  { id: "res4",  name: "Sneha R.",    role: "UI/UX Designer",      availability: "Not Available", capacityHours: 80, allocatedHours: 80, skills: ["Figma", "Design", "Wireframes"],      currentTasks: 4 },
  { id: "res5",  name: "Vikram P.",   role: "Full Stack Dev",      availability: "Partial",       capacityHours: 80, allocatedHours: 45, skills: ["Redis", "Research", "Backend"],       currentTasks: 2 },
  { id: "res6",  name: "Meera J.",    role: "QA Engineer",         availability: "Available",     capacityHours: 80, allocatedHours: 10, skills: ["Testing", "Automation", "QA"],        currentTasks: 0 },
  // Available in the org but not yet added to this project
  { id: "pool1", name: "Arjun K.",    role: "Mobile Developer",    availability: "Available",     capacityHours: 80, allocatedHours: 0,  skills: ["React Native", "iOS", "Android"],     currentTasks: 0 },
  { id: "pool2", name: "Nisha T.",    role: "Data Analyst",        availability: "Available",     capacityHours: 80, allocatedHours: 20, skills: ["SQL", "Power BI", "Python"],          currentTasks: 1 },
  { id: "pool3", name: "Karan S.",    role: "Security Engineer",   availability: "Partial",       capacityHours: 80, allocatedHours: 40, skills: ["Pen Testing", "OWASP", "Auth"],       currentTasks: 2 },
  { id: "pool4", name: "Divya R.",    role: "Business Analyst",    availability: "Available",     capacityHours: 80, allocatedHours: 10, skills: ["Requirements", "BPMN", "Docs"],       currentTasks: 1 },
  { id: "pool5", name: "Rohan M.",    role: "Backend Dev",         availability: "Available",     capacityHours: 80, allocatedHours: 5,  skills: ["Java", "Spring Boot", "Kafka"],       currentTasks: 0 },
  { id: "pool6", name: "Anita P.",    role: "Scrum Master",        availability: "Available",     capacityHours: 80, allocatedHours: 30, skills: ["Agile", "Facilitation", "Jira"],      currentTasks: 3 },
  { id: "pool7", name: "Suresh B.",   role: "Database Admin",      availability: "Not Available", capacityHours: 80, allocatedHours: 80, skills: ["PostgreSQL", "MongoDB", "Redis"],     currentTasks: 5 },
  { id: "pool8", name: "Pooja G.",    role: "Technical Writer",    availability: "Available",     capacityHours: 80, allocatedHours: 0,  skills: ["Docs", "API Docs", "Confluence"],     currentTasks: 0 },
];

// IDs of resources already on this project (start with the original 6)
const initialProjectResourceIds = ["res1", "res2", "res3", "res4", "res5", "res6"];
const initialResources: Resource[] = GLOBAL_RESOURCE_POOL.filter(r => initialProjectResourceIds.includes(r.id));

const fallbackBacklog: Item[] = [
  { id: "E-01", title: "User Management Module",                       type: "Epic",  priority: "High",   assignee: "Rahul S.",  assignedBy: "Vikram P.", description: "Full user lifecycle management including registration, login, roles and permissions.", startDate: "2026-05-01", endDate: "2026-06-30", sp: 40, status: "In Progress", plannedHours: 80, actualHours: 62 },
  { id: "E-02", title: "Notification System",                          type: "Epic",  priority: "Medium", assignee: "Vikram P.", assignedBy: "Rahul S.",  description: "Email, push and in-app notification service.", startDate: "2026-06-01", endDate: "2026-07-15", sp: 24, status: "Planned", plannedHours: 48, actualHours: 0 },
  { id: "S-01", title: "As a user I can register with email/password", type: "Story", priority: "High",   assignee: "Priya M.", assignedBy: "Rahul S.",  startDate: "2026-05-10", endDate: "2026-05-20", documents: ["US_S01_User_Registration_Journey.pdf"], epicId: "E-01", sprintId: "Sprint 4", sp: 8, status: "In Progress", plannedHours: 20, actualHours: 18 },
  { id: "S-02", title: "As a user I can login and receive JWT token",  type: "Story", priority: "High",   assignee: "Priya M.", assignedBy: "Rahul S.",  startDate: "2026-05-20", endDate: "2026-05-25", documents: [], epicId: "E-01", sprintId: "Sprint 4", sp: 5, status: "Done", plannedHours: 12, actualHours: 12 },
  { id: "T-01", title: "Setup project scaffolding and folder structure",type: "Task", priority: "Medium", assignee: "Amit K.",  assignedBy: "Vikram P.", description: "Create base folder structure per architecture doc.", startDate: "2026-05-01", endDate: "2026-05-05", epicId: "E-01", sprintId: "Sprint 4", sp: 3, status: "Done", plannedHours: 8, actualHours: 6 },
  { id: "T-02", title: "Configure CI/CD pipeline with GitHub Actions",  type: "Task", priority: "Medium", assignee: "Amit K.",  assignedBy: "Vikram P.", description: "Setup automated build, test and deploy pipeline.", startDate: "2026-05-05", endDate: "2026-05-12", epicId: "E-01", sprintId: "Sprint 4", sp: 5, status: "In Progress", plannedHours: 12, actualHours: 10 },
  { id: "B-01", title: "Login form doesn't validate on submit",         type: "Bug",  priority: "High",   assignee: "Sneha R.", assignedBy: "Priya M.",  epicId: "E-01", sprintId: "Sprint 4", sp: 2, status: "Open", blocked: true, plannedHours: 4, actualHours: 0 },
  { id: "R-01", title: "Evaluate Redis vs Memcached for caching layer", type: "R&D",  priority: "Low",    assignee: "Vikram P.",assignedBy: "Amit K.",   epicId: "E-02", sp: 2, status: "Open", plannedHours: 8, actualHours: 0 },
  { id: "S-03", title: "As admin I can manage user roles and permissions",type:"Story",priority: "Medium", assignee: "Rahul S.", assignedBy: "Vikram P.", startDate: "2026-05-28", endDate: "2026-06-10", documents: [], epicId: "E-01", sprintId: "Sprint 5", sp: 13, status: "To Do", plannedHours: 32, actualHours: 0 },
];

const fallbackRisks: Risk[] = [
  { id: "R1", risk: "Third-party API rate limiting",   impact: "High",   probability: "Medium", mitigation: "Implement caching and retry logic", closeByDate: "2026-06-15", closed: false },
  { id: "R2", risk: "Team member unavailability",      impact: "Medium", probability: "Low",    mitigation: "Cross-train team members",         closeByDate: "2026-06-30", closed: false },
  { id: "R3", risk: "Scope creep from stakeholders",   impact: "High",   probability: "High",   mitigation: "Change request process",           closeByDate: "2026-05-31", closed: true },
];

const fallbackMilestones: Milestone[] = [
  { id: "M1", name: "MVP Release",      date: "2026-06-15", status: "On Track", items: 12 },
  { id: "M2", name: "Beta Launch",      date: "2026-07-30", status: "At Risk",  items: 8 },
  { id: "M3", name: "v1.0 Production",  date: "2026-09-01", status: "Planned",  items: 20 },
];

const typeColors: Record<string, string> = {
  Story: "bg-blue-100 text-blue-700", Bug: "bg-red-100 text-red-700",
  Task: "bg-purple-100 text-purple-700", Epic: "bg-orange-100 text-orange-700", "R&D": "bg-yellow-100 text-yellow-700",
};
const priorityColors: Record<string, string> = {
  High: "text-red-600 bg-red-50", Medium: "text-amber-600 bg-amber-50", Low: "text-green-600 bg-green-50",
};
const impactColors: Record<string, string> = {
  High: "bg-red-100 text-red-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-green-100 text-green-700",
};
const availabilityStyle: Record<Resource["availability"], string> = {
  "Available":     "bg-green-100 text-green-700 border-green-200",
  "Partial":       "bg-amber-100 text-amber-700 border-amber-200",
  "Not Available": "bg-red-100 text-red-700 border-red-200",
};
const availabilityDot: Record<Resource["availability"], string> = {
  "Available": "bg-green-500", "Partial": "bg-amber-400", "Not Available": "bg-red-500",
};
const milestoneStatusStyle: Record<string, string> = {
  "On Track": "bg-green-100 text-green-700", "At Risk": "bg-amber-100 text-amber-700", Planned: "bg-slate-100 text-slate-500",
};
const milestoneStatusDot: Record<string, string> = {
  "On Track": "bg-green-500", "At Risk": "bg-amber-500", Planned: "bg-slate-300",
};

const BLANK_ITEM = { title: "", type: "Story", priority: "Medium", assignee: "", assignedBy: "", description: "", startDate: "", endDate: "", epicId: "", sprintId: "", sp: 0, status: "Open", blocked: false, plannedHours: 0, actualHours: 0 };
const BLANK_RISK = { risk: "", impact: "Medium", probability: "Medium", mitigation: "", closeByDate: "", closed: false };
const BLANK_RESOURCE: Omit<Resource, "id"> = { name: "", role: "", availability: "Available", capacityHours: 80, allocatedHours: 0, skills: [], currentTasks: 0 };

function riskStatusToClosed(status: string) { return status === "Closed" || status === "Mitigated"; }
function msStatus(s: string) {
  if (s === "Completed" || s === "In Progress") return "On Track";
  if (s === "Delayed") return "At Risk";
  return "Planned";
}

function ResourceSelector({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string; resources: Resource[] }) {
  return (
    <div className="flex-1 min-w-36">
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— {label} —</option>
        {initialResources.map((r) => (
          <option key={r.id} value={r.name}>
            {r.availability === "Available" ? "✓" : r.availability === "Partial" ? "~" : "✗"} {r.name} · {r.role}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ScopePage() {
  const [activeTab, setActiveTab] = useState("Backlog");
  const [backlog, setBacklog] = useState<Item[]>(fallbackBacklog);
  const [risks, setRisks] = useState<Risk[]>(fallbackRisks);
  const [milestones, setMilestones] = useState<Milestone[]>(fallbackMilestones);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [seeded, setSeeded] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<typeof BLANK_ITEM>({ ...BLANK_ITEM });
  const [aiPanel, setAiPanel] = useState<"none" | "story" | "sprint" | "resource">("none");
  const [aiStoryInput, setAiStoryInput] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSprintSuggested, setAiSprintSuggested] = useState(false);
  const [aiResourceSuggested, setAiResourceSuggested] = useState(false);
  const [quickActionItem, setQuickActionItem] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("All");
  const [wbsUploaded, setWbsUploaded] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [pertPanel, setPertPanel] = useState(false);
  const [pertItems, setPertItems] = useState<Record<string, { o: number; m: number; p: number }>>(
    () => Object.fromEntries(fallbackBacklog.map(i => [i.id, { o: 0, m: 0, p: 0 }]))
  );
  const [devEstPanel, setDevEstPanel] = useState(false);
  const [devEstUploaded, setDevEstUploaded] = useState(false);
  // Dev estimates: per-item hours from the uploaded file
  const [devEstHours, setDevEstHours] = useState<Record<string, number>>({ "T-01": 10, "T-02": 14, "S-01": 20, "S-02": 12, "B-01": 4 });
  // Win estimate snapshot (project bid hours — from onboarding billing qty or fallback)
  const [winEstHours] = useState<Record<string, number>>({ "E-01": 80, "E-02": 48, "S-01": 20, "S-02": 12, "T-01": 8, "T-02": 12, "B-01": 4, "R-01": 8, "S-03": 32 });

  const [editModal, setEditModal] = useState<Item | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Item>>({});
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [userStoryViewer, setUserStoryViewer] = useState<string | null>(null);

  const [editingRiskId, setEditingRiskId] = useState<string | null>(null);
  const [riskEdit, setRiskEdit] = useState<Risk | null>(null);
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [newRisk, setNewRisk] = useState<typeof BLANK_RISK>({ ...BLANK_RISK });

  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneEdit, setMilestoneEdit] = useState<Milestone | null>(null);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ name: "", date: "", status: "Planned", items: 0 });

  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [resourceEdit, setResourceEdit] = useState<Resource | null>(null);
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState<Omit<Resource, "id">>({ ...BLANK_RESOURCE });

  // Pool browser modal
  const [showPoolModal, setShowPoolModal] = useState(false);
  const [poolSelection, setPoolSelection] = useState<string[]>([]);
  const [poolSearch, setPoolSearch] = useState("");

  const togglePoolSelect = (id: string) =>
    setPoolSelection(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const addFromPool = () => {
    const toAdd = GLOBAL_RESOURCE_POOL.filter(r => poolSelection.includes(r.id));
    setResources(prev => [...prev, ...toAdd]);
    setPoolSelection([]);
    setShowPoolModal(false);
  };

  const removeFromProject = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  useEffect(() => {
    const raw = localStorage.getItem("pm_active_project");
    if (!raw) return;
    const seedTs = localStorage.getItem("pm_scope_seed_ts");
    try {
      const p = JSON.parse(raw);
      if (seedTs && seedTs >= p.initiatedAt) return;
      const epics: Item[] = (p.milestones ?? []).map((m: { name: string; deliverable: string; dueDate: string }, i: number) => ({
        id: `E-${String(i + 1).padStart(2, "0")}`, title: m.name, type: "Epic", priority: "High",
        assignee: p.projectManager ?? "", assignedBy: "",
        description: m.deliverable, startDate: p.startDate ?? "", endDate: m.dueDate,
      }));
      const billingCategoryTasks: Item[] = [];
      const seen = new Set<string>();
      (p.billingItems ?? []).forEach((b: { category: string; description: string }, i: number) => {
        if (seen.has(b.category)) return;
        seen.add(b.category);
        billingCategoryTasks.push({ id: `T-${String(i + 1).padStart(2, "0")}`, title: b.description, type: "Task", priority: "Medium", assignee: p.technicalLead ?? "", assignedBy: p.projectManager ?? "", startDate: p.startDate ?? "", endDate: p.endDate ?? "", epicId: epics[0]?.id ?? "" });
      });
      setBacklog([...epics, ...billingCategoryTasks]);
      const scopeRisks: Risk[] = (p.risks ?? []).map((r: { id: string; description: string; impact: string; probability: string; mitigation: string; status: string }) => ({ id: r.id, risk: r.description, impact: r.impact, probability: r.probability, mitigation: r.mitigation, closeByDate: "", closed: riskStatusToClosed(r.status), preSales: true }));
      if (scopeRisks.length) setRisks(scopeRisks);
      const scopeMilestones: Milestone[] = (p.milestones ?? []).map((m: { id: string; name: string; dueDate: string; status: string }) => ({ id: m.id, name: m.name, date: m.dueDate, status: msStatus(m.status), items: 0 }));
      if (scopeMilestones.length) setMilestones(scopeMilestones);
      localStorage.setItem("pm_scope_seed_ts", p.initiatedAt);
      setSeeded(true);
    } catch {}
  }, []);

  const handleAIGenerate = () => {
    setAiLoading(true);
    setTimeout(() => {
      setBacklog((p) => [...p,
        { id: "AI-01", title: "Implement notification service", type: "Story", priority: "Medium", assignee: "", startDate: "", endDate: "", documents: [], epicId: "E-02", sprintId: "Sprint 5" },
        { id: "AI-02", title: "Add audit logging for DB mutations", type: "Task", priority: "High", assignee: "", description: "Log all write operations to audit table.", startDate: "", endDate: "", epicId: "E-01" },
        { id: "AI-03", title: "Build reporting dashboard", type: "Epic", priority: "Medium", assignee: "", description: "Analytics dashboard for project metrics.", startDate: "", endDate: "" },
      ]);
      setAiLoading(false);
    }, 1500);
  };

  const addItem = () => {
    if (!newItem.title.trim()) return;
    const id = `NEW-${Date.now().toString().slice(-4)}`;
    setBacklog((p) => [...p, { ...newItem, id, documents: ["Story", "R&D"].includes(newItem.type) ? [] : undefined }]);
    setNewItem({ ...BLANK_ITEM });
    setShowAddForm(false);
  };

  const openEditModal = (item: Item) => {
    setEditModal(item);
    setEditDraft({ title: item.title, priority: item.priority, assignee: item.assignee, assignedBy: item.assignedBy ?? "", description: item.description ?? "", startDate: item.startDate ?? "", endDate: item.endDate ?? "", documents: item.documents ? [...item.documents] : undefined, epicId: item.epicId ?? "", sprintId: item.sprintId ?? "" });
  };
  const saveEditModal = () => {
    if (!editModal) return;
    setBacklog((p) => p.map((i) => i.id === editModal.id ? { ...i, ...editDraft } : i));
    setEditModal(null);
  };
  const simulateDocUpload = () => {
    setUploadingDoc(true);
    setTimeout(() => { setEditDraft((p) => ({ ...p, documents: [...(p.documents ?? []), `Doc_${Date.now().toString().slice(-4)}.pdf`] })); setUploadingDoc(false); }, 900);
  };

  const startEditRisk = (r: Risk) => { setEditingRiskId(r.id); setRiskEdit({ ...r }); };
  const saveRisk = () => { if (!riskEdit) return; setRisks((p) => p.map((r) => r.id === riskEdit.id ? riskEdit : r)); setEditingRiskId(null); setRiskEdit(null); };
  const addRisk = () => { if (!newRisk.risk.trim()) return; setRisks((p) => [...p, { ...newRisk, id: `R${p.length + 10}` }]); setNewRisk({ ...BLANK_RISK }); setShowAddRisk(false); };
  const toggleRiskClosed = (id: string) => setRisks((p) => p.map((r) => r.id === id ? { ...r, closed: !r.closed } : r));

  const startEditMilestone = (m: Milestone) => { setEditingMilestoneId(m.id); setMilestoneEdit({ ...m }); };
  const saveMilestone = () => { if (!milestoneEdit) return; setMilestones((p) => p.map((m) => m.id === milestoneEdit.id ? milestoneEdit : m)); setEditingMilestoneId(null); setMilestoneEdit(null); };
  const addMilestone = () => { if (!newMilestone.name.trim()) return; setMilestones((p) => [...p, { ...newMilestone, id: `M${p.length + 10}` }]); setNewMilestone({ name: "", date: "", status: "Planned", items: 0 }); setShowAddMilestone(false); };

  const startEditResource = (r: Resource) => { setEditingResourceId(r.id); setResourceEdit({ ...r }); };
  const saveResource = () => { if (!resourceEdit) return; setResources((p) => p.map((r) => r.id === resourceEdit.id ? resourceEdit : r)); setEditingResourceId(null); setResourceEdit(null); };
  const addResource = () => { if (!newResource.name.trim()) return; setResources((p) => [...p, { ...newResource, id: `res${Date.now()}` }]); setNewResource({ ...BLANK_RESOURCE }); setShowAddResource(false); };

  const filtered = filterType === "All" ? backlog : backlog.filter((i) => i.type === filterType);
  const epicsInBacklog = backlog.filter((i) => i.type === "Epic");
  const isEpic = newItem.type === "Epic";
  const isStory = newItem.type === "Story";
  const isTaskLike = ["Task", "Sub-Task", "R&D", "Branch Bug"].includes(newItem.type);

  const availCount = resources.filter(r => r.availability === "Available").length;
  const partialCount = resources.filter(r => r.availability === "Partial").length;
  const unavailCount = resources.filter(r => r.availability === "Not Available").length;

  return (
    <div className="p-6 space-y-4">
      <ProjectBanner />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Scope Definition & Backlog</h1>
          <p className="text-sm text-slate-500">
            {seeded ? "Pre-populated from onboarding — refine epics, add stories & tasks" : "Upload WBS, generate tasks with AI, manage epics & stories"}
          </p>
        </div>
        {seeded && <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">✓ Seeded from Project Onboarding</span>}
      </div>

      {/* ── Backlog Health Dashboard ── */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: "Total Epics", value: backlog.filter(i => i.type === "Epic").length, color: "bg-orange-500", icon: "🔷", sub: "epics" },
          { label: "Stories", value: backlog.filter(i => i.type === "Story").length, color: "bg-blue-500", icon: "📖", sub: "user stories" },
          { label: "Tasks", value: backlog.filter(i => i.type === "Task").length, color: "bg-purple-500", icon: "✓", sub: "tasks" },
          { label: "Open Bugs", value: backlog.filter(i => i.type === "Bug").length, color: "bg-red-500", icon: "🐛", sub: "unresolved" },
          { label: "Sprint Ready", value: backlog.filter(i => i.sprintId).length, color: "bg-indigo-500", icon: "⚡", sub: "assigned to sprint" },
          { label: "Blocked", value: backlog.filter(i => i.blocked).length, color: "bg-rose-600", icon: "🚫", sub: "need attention" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm p-3.5 flex items-center gap-3">
            <div className={`w-9 h-9 ${c.color} rounded-xl flex items-center justify-center text-white text-base shrink-0`}>{c.icon}</div>
            <div className="min-w-0">
              <div className="text-xl font-bold text-slate-800">{c.value}</div>
              <div className="text-xs text-slate-500 leading-tight">{c.label}</div>
              <div className="text-xs text-slate-400">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── WBS Upload + AI Features ── */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="font-semibold text-slate-700 mb-1">Upload WBS</div>
            <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${wbsUploaded ? "border-green-400 bg-green-50" : "border-slate-200 hover:border-indigo-400"}`} onClick={() => {
              setWbsUploaded(true);
              // Auto-generate PERT estimates from plannedHours (O=0.6×, M=1×, P=1.5×)
              setPertItems(prev => {
                const next = { ...prev };
                backlog.forEach(item => {
                  if (item.plannedHours && item.plannedHours > 0) {
                    const m = item.plannedHours;
                    next[item.id] = { o: Math.round(m * 0.6), m, p: Math.round(m * 1.5) };
                  }
                });
                return next;
              });
              setPertPanel(true);
            }}>
              {wbsUploaded ? <div className="text-green-600 font-medium">✓ WBS_ProjectAlpha_v2.xlsx uploaded</div>
                : <><div className="text-2xl mb-1">📁</div><div className="text-sm text-slate-500">Click to upload WBS (.xlsx, .csv, .pdf)</div></>}
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="font-semibold text-slate-700 mb-1">AI Features ✨</div>
            <button onClick={handleAIGenerate} disabled={aiLoading || !wbsUploaded} className="w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {aiLoading ? "Generating…" : "✨ Generate Tasks from WBS"}
            </button>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: "story" as const, label: "AI User Story Generator", icon: "📖" },
                { key: "sprint" as const, label: "AI Sprint Planning", icon: "🗓" },
                { key: "resource" as const, label: "AI Resource Allocation", icon: "👥" },
              ].map(btn => (
                <button key={btn.key} onClick={() => setAiPanel(p => p === btn.key ? "none" : btn.key)}
                  className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center gap-1 ${aiPanel === btn.key ? "bg-violet-600 text-white border-violet-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  <span className="text-base">{btn.icon}</span>
                  <span className="leading-tight text-center">{btn.label}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100">
              <button onClick={() => { setPertPanel(p => !p); setDevEstPanel(false); }}
                className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center gap-1 ${pertPanel ? "bg-amber-600 text-white border-amber-600" : "border-amber-200 text-amber-700 hover:bg-amber-50"}`}>
                <span className="text-base">📐</span>
                <span className="leading-tight text-center">PERT Estimation</span>
              </button>
              <button onClick={() => { setDevEstPanel(p => !p); setPertPanel(false); }}
                className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center gap-1 ${devEstPanel ? "bg-teal-600 text-white border-teal-600" : "border-teal-200 text-teal-700 hover:bg-teal-50"}`}>
                <span className="text-base">📊</span>
                <span className="leading-tight text-center">Dev Team Estimation</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Story Generator panel */}
        {aiPanel === "story" && (
          <div className="border border-violet-200 bg-violet-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-violet-800">📖 AI User Story Generator</span>
              <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">Input → Epics + Stories + Tasks + AC + DoD</span>
            </div>
            <input value={aiStoryInput} onChange={e => setAiStoryInput(e.target.value)}
              placeholder="Describe a module (e.g. 'User Authentication Module with email/password and OAuth')"
              className="w-full border border-violet-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-violet-300 focus:outline-none bg-white" />
            <button
              onClick={() => {
                if (!aiStoryInput.trim()) return;
                setAiGenerating(true);
                setTimeout(() => {
                  setBacklog(p => [...p,
                    { id: `AI-E${Date.now().toString().slice(-3)}`, title: aiStoryInput, type: "Epic", priority: "High", assignee: "Rahul S.", assignedBy: "", sp: 40, status: "Planned", plannedHours: 80, actualHours: 0 },
                    { id: `AI-S${Date.now().toString().slice(-3)}`, title: `As a user I can ${aiStoryInput.toLowerCase().includes("auth") ? "register and login securely" : "use " + aiStoryInput}`, type: "Story", priority: "High", assignee: "Priya M.", assignedBy: "Rahul S.", sp: 8, status: "Open", plannedHours: 20, actualHours: 0 },
                    { id: `AI-T${Date.now().toString().slice(-3)}`, title: `Implement ${aiStoryInput} backend API`, type: "Task", priority: "High", assignee: "Rahul S.", assignedBy: "Vikram P.", sp: 5, status: "Open", plannedHours: 12, actualHours: 0 },
                  ]);
                  setAiStoryInput("");
                  setAiGenerating(false);
                  setAiPanel("none");
                }, 1200);
              }}
              disabled={aiGenerating || !aiStoryInput.trim()}
              className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 disabled:opacity-50">
              {aiGenerating ? "Generating…" : "✨ Generate Stories & Tasks"}
            </button>
          </div>
        )}

        {/* AI Sprint Planning panel */}
        {aiPanel === "sprint" && (
          <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-blue-800">🗓 AI Sprint Planning</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Based on capacity · velocity · priority</span>
            </div>
            {!aiSprintSuggested ? (
              <button onClick={() => { setAiSprintSuggested(true); }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                ✨ Auto-suggest Sprint Allocation
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-blue-700 font-medium">Suggested sprint plan based on team capacity (80h) and backlog priority:</p>
                {[
                  { sprint: "Sprint 4 (Active)", items: ["S-01: User registration (8 SP)", "T-01: Scaffolding (3 SP)", "T-02: CI/CD (5 SP)", "B-01: Login bug (2 SP)"], sp: 18, capacity: "76%" },
                  { sprint: "Sprint 5", items: ["S-03: Role management (13 SP)", "R-01: Redis research (2 SP)"], sp: 15, capacity: "56%" },
                  { sprint: "Sprint 6", items: ["S-02: JWT login (5 SP)", "E-02: Notifications planning (8 SP)"], sp: 13, capacity: "49%" },
                ].map(sg => (
                  <div key={sg.sprint} className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-slate-700">{sg.sprint}</span>
                      <span className="text-xs text-indigo-600 font-medium">{sg.sp} SP · {sg.capacity} capacity</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {sg.items.map(item => <span key={item} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{item}</span>)}
                    </div>
                  </div>
                ))}
                <button onClick={() => setAiSprintSuggested(false)} className="text-xs text-blue-600 hover:underline">Reset</button>
              </div>
            )}
          </div>
        )}

        {/* AI Resource Allocation panel */}
        {aiPanel === "resource" && (
          <div className="border border-teal-200 bg-teal-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-teal-800">👥 AI Resource Allocation</span>
              <span className="text-xs bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full">Based on skills & workload</span>
            </div>
            {!aiResourceSuggested ? (
              <button onClick={() => setAiResourceSuggested(true)}
                className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700">
                ✨ Suggest Resource Assignment
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-teal-700 font-medium">Recommended assignments based on skills and current workload:</p>
                {[
                  { role: "Frontend", name: "Priya M.", tasks: "User registration UI, Login form", reason: "React skills, low workload (1 task)", color: "bg-blue-100 text-blue-700" },
                  { role: "Backend", name: "Rahul S.", tasks: "Auth module, API development", reason: "Node.js + Auth skills, 3 active tasks", color: "bg-indigo-100 text-indigo-700" },
                  { role: "DevOps", name: "Amit K.", tasks: "CI/CD pipeline, Docker setup", reason: "CI/CD + AWS skills, 2 active tasks", color: "bg-amber-100 text-amber-700" },
                  { role: "QA", name: "Meera J.", tasks: "Test automation, Bug verification", reason: "Testing skills, 0 active tasks — ideal", color: "bg-green-100 text-green-700" },
                ].map(r => (
                  <div key={r.role} className="bg-white rounded-lg p-3 border border-teal-200 flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.color} shrink-0`}>{r.role}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-slate-700">{r.name}</span>
                      <span className="text-xs text-slate-400 ml-2">→ {r.tasks}</span>
                    </div>
                    <span className="text-xs text-slate-400 italic shrink-0 hidden xl:block">{r.reason}</span>
                  </div>
                ))}
                <button onClick={() => setAiResourceSuggested(false)} className="text-xs text-teal-600 hover:underline">Reset</button>
              </div>
            )}
          </div>
        )}

        {/* PERT Estimation panel */}
        {pertPanel && (
          <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-amber-800">📐 PERT Estimation</span>
                <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">E = (O + 4M + P) / 6</span>
              </div>
              <button onClick={() => setPertPanel(false)} className="text-amber-400 hover:text-amber-700 text-lg leading-none">×</button>
            </div>
            <p className="text-xs text-amber-700">Enter Optimistic (O), Most Likely (M), and Pessimistic (P) hours for each item. PERT estimate = (O + 4M + P) ÷ 6.</p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              <div className="grid grid-cols-6 gap-2 text-xs text-amber-700 font-semibold px-2">
                <div className="col-span-2">Item</div><div className="text-center">O (hrs)</div><div className="text-center">M (hrs)</div><div className="text-center">P (hrs)</div><div className="text-center">PERT Est.</div>
              </div>
              {backlog.filter(i => i.type !== "Epic").map(item => {
                const p = pertItems[item.id] ?? { o: 0, m: 0, p: 0 };
                const pert = p.m > 0 ? Math.round(((p.o + 4 * p.m + p.p) / 6) * 10) / 10 : 0;
                const sd = p.m > 0 ? Math.round(((p.p - p.o) / 6) * 10) / 10 : 0;
                return (
                  <div key={item.id} className="grid grid-cols-6 gap-2 items-center bg-white rounded-lg px-2 py-2 border border-amber-100">
                    <div className="col-span-2">
                      <div className="text-xs font-mono text-amber-700">{item.id}</div>
                      <div className="text-xs text-slate-600 truncate">{item.title}</div>
                    </div>
                    {(["o", "m", "p"] as const).map(k => (
                      <input key={k} type="number" min={0} value={p[k] || ""}
                        onChange={e => setPertItems(prev => ({ ...prev, [item.id]: { ...prev[item.id] ?? { o: 0, m: 0, p: 0 }, [k]: Number(e.target.value) } }))}
                        className="w-full border border-amber-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-amber-400" placeholder="0" />
                    ))}
                    <div className="text-center">
                      {pert > 0 ? (
                        <div>
                          <div className="text-sm font-bold text-amber-700">{pert}h</div>
                          <div className="text-xs text-amber-500">±{sd}h</div>
                        </div>
                      ) : <span className="text-slate-300 text-xs">—</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 pt-1 border-t border-amber-100">
              <button onClick={() => {
                setBacklog(prev => prev.map(item => {
                  const p = pertItems[item.id];
                  if (!p || p.m === 0) return item;
                  const pert = Math.round(((p.o + 4 * p.m + p.p) / 6) * 10) / 10;
                  return { ...item, plannedHours: pert };
                }));
                setPertPanel(false);
              }} className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700">
                Apply PERT Estimates to Backlog
              </button>
              <button onClick={() => setPertPanel(false)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200">Cancel</button>
            </div>
          </div>
        )}

        {/* Dev Team Estimation panel */}
        {devEstPanel && (
          <div className="border border-teal-200 bg-teal-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-teal-800">📊 Dev Team Estimation</span>
                <span className="text-xs bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full">Upload team estimates in Excel / CSV</span>
              </div>
              <button onClick={() => setDevEstPanel(false)} className="text-teal-400 hover:text-teal-700 text-lg leading-none">×</button>
            </div>
            <p className="text-xs text-teal-700">Dev team can upload their story-point or hour estimates as an Excel/CSV file. Expected columns: <span className="font-mono bg-teal-100 px-1 rounded">ID, Title, EstHours, AssignedTo, Notes</span></p>
            <div className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${devEstUploaded ? "border-green-400 bg-green-50" : "border-teal-300 hover:border-teal-500 hover:bg-teal-100"}`}
              onClick={() => { if (!devEstUploaded) setTimeout(() => setDevEstUploaded(true), 800); }}>
              {devEstUploaded
                ? <div className="text-green-600 font-medium text-sm">✓ DevTeam_Estimates_Sprint4.xlsx uploaded — 12 tasks imported</div>
                : <><div className="text-3xl mb-2">📊</div><div className="text-sm font-medium text-teal-700">Click to upload estimation file</div><div className="text-xs text-teal-500 mt-1">.xlsx, .csv, .xls accepted</div></>}
            </div>
            {devEstUploaded && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-teal-800">3-Way Estimation Comparison</div>
                <div className="overflow-x-auto rounded-lg border border-teal-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-teal-100 text-teal-700">
                        <th className="px-3 py-2 text-left">ID</th>
                        <th className="px-3 py-2 text-left">Title</th>
                        <th className="px-3 py-2 text-center">Assigned To</th>
                        <th className="px-3 py-2 text-center bg-amber-50 text-amber-700">🏆 Win Est.</th>
                        <th className="px-3 py-2 text-center bg-amber-50 text-amber-700">📐 PERT Est.</th>
                        <th className="px-3 py-2 text-center bg-teal-50 text-teal-700">📊 Dev Est.</th>
                        <th className="px-3 py-2 text-center">Δ vs Win</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-teal-50">
                      {[
                        { id: "T-01", title: "Setup project scaffolding", dev: "Amit K." },
                        { id: "T-02", title: "Configure CI/CD pipeline", dev: "Amit K." },
                        { id: "S-01", title: "User registration flow", dev: "Priya M." },
                        { id: "S-02", title: "JWT authentication", dev: "Priya M." },
                        { id: "B-01", title: "Login redirect bug", dev: "Sneha R." },
                      ].map(r => {
                        const win = winEstHours[r.id] ?? 0;
                        const pp = pertItems[r.id];
                        const pert = pp && pp.m > 0 ? Math.round(((pp.o + 4 * pp.m + pp.p) / 6) * 10) / 10 : null;
                        const devH = devEstHours[r.id] ?? 0;
                        const delta = win > 0 ? devH - win : null;
                        return (
                          <tr key={r.id} className="bg-white hover:bg-teal-50">
                            <td className="px-3 py-2 font-mono text-teal-700">{r.id}</td>
                            <td className="px-3 py-2 text-slate-700">{r.title}</td>
                            <td className="px-3 py-2 text-center text-slate-500">{r.dev}</td>
                            <td className="px-3 py-2 text-center font-semibold bg-amber-50 text-amber-700">{win > 0 ? `${win}h` : "—"}</td>
                            <td className="px-3 py-2 text-center font-semibold bg-amber-50 text-amber-700">{pert != null ? `${pert}h` : <span className="text-slate-300">—</span>}</td>
                            <td className="px-3 py-2 text-center font-bold bg-teal-50 text-teal-700">
                              <input type="number" min={0} value={devH}
                                onChange={e => setDevEstHours(prev => ({ ...prev, [r.id]: Number(e.target.value) }))}
                                className="w-14 text-center border border-teal-200 rounded px-1 py-0.5 bg-white text-teal-700 font-bold" />
                            </td>
                            <td className={`px-3 py-2 text-center font-semibold ${delta == null ? "text-slate-300" : delta > 0 ? "text-red-600" : delta < 0 ? "text-green-600" : "text-slate-500"}`}>
                              {delta == null ? "—" : delta > 0 ? `+${delta}h` : delta < 0 ? `${delta}h` : "0h"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => {
                    setBacklog(prev => prev.map(item => {
                      return item.id in devEstHours ? { ...item, plannedHours: devEstHours[item.id] } : item;
                    }));
                    setDevEstPanel(false);
                  }} className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700">
                    Import Dev Estimates to Backlog
                  </button>
                  <button onClick={() => setDevEstUploaded(false)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200">Re-upload</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {["Backlog", "Risk Register", "Milestones & Releases", "Resources"].map((t) => (
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
              {["All", "Epic", "Story", "Task", "Bug", "R&D"].map((f) => (
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
                  {["Story", "Task", "Bug", "Epic", "R&D", "Sub-Task", "Branch Bug"].map((t) => <option key={t}>{t}</option>)}
                </select>
                <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                  value={newItem.priority} onChange={(e) => setNewItem((p) => ({ ...p, priority: e.target.value }))}>
                  {["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Title *"
                value={newItem.title} onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))} />
              {/* Resource assignment */}
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-44">
                  <label className="text-xs text-slate-500 block mb-1">Assignee</label>
                  <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                    value={newItem.assignee} onChange={(e) => setNewItem((p) => ({ ...p, assignee: e.target.value }))}>
                    <option value="">— Select Assignee —</option>
                    {resources.map((r) => (
                      <option key={r.id} value={r.name} disabled={r.availability === "Not Available"}>
                        {r.availability === "Available" ? "✓" : r.availability === "Partial" ? "~" : "✗"} {r.name} · {r.role}{r.availability === "Not Available" ? " (unavailable)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-44">
                  <label className="text-xs text-slate-500 block mb-1">Assigned By</label>
                  <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                    value={newItem.assignedBy} onChange={(e) => setNewItem((p) => ({ ...p, assignedBy: e.target.value }))}>
                    <option value="">— Assigned By —</option>
                    {resources.map((r) => <option key={r.id} value={r.name}>{r.name} · {r.role}</option>)}
                  </select>
                </div>
              </div>
              {!isEpic && (
                <div className="flex gap-3 items-end flex-wrap">
                  <div className="flex-1 min-w-44">
                    <label className="text-xs text-slate-500 block mb-1">Link to Epic</label>
                    <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                      value={newItem.epicId} onChange={(e) => setNewItem((p) => ({ ...p, epicId: e.target.value }))}>
                      <option value="">— None —</option>
                      {epicsInBacklog.map((e) => <option key={e.id} value={e.id}>{e.id}: {e.title}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 min-w-44">
                    <label className="text-xs text-slate-500 block mb-1">Sprint</label>
                    <select className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                      value={newItem.sprintId} onChange={(e) => setNewItem((p) => ({ ...p, sprintId: e.target.value }))}>
                      <option value="">— Unplanned —</option>
                      {AVAILABLE_SPRINTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}
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

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1200px]">
              <thead>
                <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-2">ID</th>
                  <th className="text-left px-4 py-2">Title / Dates</th>
                  <th className="text-left px-4 py-2">Type</th>
                  <th className="text-left px-4 py-2">Priority</th>
                  <th className="text-center px-3 py-2">Est. Hrs</th>
                  <th className="text-center px-3 py-2">Logged</th>
                  <th className="text-center px-3 py-2">Remaining</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-center px-3 py-2">⚑</th>
                  <th className="text-left px-4 py-2">Epic Link</th>
                  <th className="text-left px-4 py-2">Sprint</th>
                  <th className="text-left px-4 py-2">Assignee</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const res = resources.find(r => r.name === item.assignee);
                  const progress = item.plannedHours && item.plannedHours > 0
                    ? Math.min(100, Math.round((item.actualHours ?? 0) / item.plannedHours * 100)) : 0;
                  return (
                    <tr key={item.id} className={`border-b border-slate-50 hover:bg-slate-50 relative group ${item.blocked ? "bg-red-50/40" : ""}`}>
                      <td className="px-4 py-2.5">
                        <button onClick={() => openEditModal(item)} className="text-indigo-600 font-mono text-xs font-medium underline underline-offset-2 hover:text-indigo-800">{item.id}</button>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="text-slate-700 font-medium text-sm">{item.title}</div>
                        {item.description && <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{item.description}</div>}
                        {(item.startDate || item.endDate) && <div className="text-xs text-slate-400 mt-0.5">{item.startDate || "—"} → {item.endDate || "TBD"}</div>}
                      </td>
                      <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[item.type] ?? "bg-gray-100 text-gray-600"}`}>{item.type}</span></td>
                      <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[item.priority] ?? ""}`}>{item.priority}</span></td>
                      <td className="px-3 py-2.5 text-center">
                        {item.plannedHours ? <span className="text-xs font-semibold text-indigo-600">{item.plannedHours}h</span> : <span className="text-slate-300 text-xs">—</span>}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {item.actualHours != null ? <span className={`text-xs font-semibold ${(item.actualHours ?? 0) >= (item.plannedHours ?? 0) && (item.plannedHours ?? 0) > 0 ? "text-green-600" : "text-slate-600"}`}>{item.actualHours}h</span> : <span className="text-slate-300 text-xs">—</span>}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {item.plannedHours ? (() => {
                          const rem = Math.max(0, (item.plannedHours ?? 0) - (item.actualHours ?? 0));
                          return <span className={`text-xs font-semibold ${rem === 0 ? "text-green-600" : rem < (item.plannedHours ?? 1) * 0.25 ? "text-amber-600" : "text-slate-500"}`}>{rem}h</span>;
                        })() : <span className="text-slate-300 text-xs">—</span>}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          item.status === "Done" ? "bg-green-100 text-green-700" :
                          item.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                          item.status === "Open" ? "bg-slate-100 text-slate-600" :
                          item.status === "To Do" ? "bg-slate-100 text-slate-500" :
                          "bg-amber-100 text-amber-600"
                        }`}>{item.status || "Open"}</span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {item.blocked
                          ? <span className="text-red-500 font-bold text-sm" title="Blocked">🚫</span>
                          : <span className="text-slate-200 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        {item.epicId ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 font-mono">{item.epicId}</span>
                          : item.type === "Epic" ? <span className="text-slate-300 text-xs">—</span>
                          : <span className="text-slate-300 text-xs italic">Unlinked</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        {item.sprintId ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700">{item.sprintId}</span>
                          : <span className="text-slate-300 text-xs italic">Unplanned</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          {res && <div className={`w-2 h-2 rounded-full shrink-0 ${availabilityDot[res.availability]}`} />}
                          <span className="text-slate-600 text-xs">{item.assignee || <span className="text-slate-300 italic">Unassigned</span>}</span>
                        </div>
                        {res && <div className="text-xs text-slate-400 mt-0.5">{res.role}</div>}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="relative">
                          <button onClick={() => setQuickActionItem(quickActionItem === item.id ? null : item.id)}
                            className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 flex items-center gap-1">
                            Actions <span className="text-slate-400">▾</span>
                          </button>
                          {quickActionItem === item.id && (
                            <div className="absolute right-0 top-7 z-20 bg-white rounded-xl shadow-lg border border-slate-200 py-1 min-w-[140px]">
                              <button onClick={() => { openEditModal(item); setQuickActionItem(null); }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">✏️ Edit</button>
                              <button onClick={() => { setBacklog(p => p.map(i => i.id === item.id ? { ...i, sprintId: "Sprint 5" } : i)); setQuickActionItem(null); }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">📦 Move to Sprint 5</button>
                              <button onClick={() => { const clone = { ...item, id: `CLONE-${Date.now().toString().slice(-4)}`, title: `[Copy] ${item.title}` }; setBacklog(p => [...p, clone]); setQuickActionItem(null); }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">📋 Clone</button>
                              {item.type !== "Bug" && (
                                <button onClick={() => { setBacklog(p => p.map(i => i.id === item.id ? { ...i, type: "Bug", priority: "High" } : i)); setQuickActionItem(null); }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600">🐛 Convert to Bug</button>
                              )}
                              <button onClick={() => { setBacklog(p => p.map(i => i.id === item.id ? { ...i, blocked: !i.blocked } : i)); setQuickActionItem(null); }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-amber-50 hover:text-amber-600">{item.blocked ? "✅ Unblock" : "🚫 Mark Blocked"}</button>
                              <div className="border-t border-slate-100 my-1" />
                              <button onClick={() => { setBacklog(p => p.filter(i => i.id !== item.id)); setQuickActionItem(null); }}
                                className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">🗑 Archive</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>{filtered.length} items · {backlog.filter(i => i.type === "Epic").length} epics · {backlog.filter(i => i.type === "Story").length} stories · {backlog.filter(i => i.type === "Task").length} tasks</span>
            <span>{backlog.filter(i => i.type === "Story" && (i.documents?.length ?? 0) > 0).length} stories with attachments</span>
          </div>
        </div>
      )}

      {/* ══ RISK REGISTER TAB ══ */}
      {activeTab === "Risk Register" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-700">Risk Register</h3>
              {seeded && <p className="text-xs text-slate-400 mt-0.5">Pre-populated from pre-sales / onboarding — fully editable. <span className="text-amber-600 font-medium">🔁 Pre-sales risks carried forward.</span></p>}
            </div>
            <button onClick={() => setShowAddRisk(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">+ Add Risk</button>
          </div>
          {showAddRisk && (
            <div className="px-4 py-4 bg-indigo-50 border-b border-indigo-100 space-y-3">
              <div className="text-sm font-semibold text-indigo-700 mb-1">New Risk</div>
              <div className="grid grid-cols-2 gap-3">
                <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white col-span-2" placeholder="Risk description *" value={newRisk.risk} onChange={(e) => setNewRisk((p) => ({ ...p, risk: e.target.value }))} />
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" value={newRisk.impact} onChange={(e) => setNewRisk((p) => ({ ...p, impact: e.target.value }))}>
                  <option value="">Impact…</option>{["High", "Medium", "Low"].map((v) => <option key={v}>{v}</option>)}
                </select>
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" value={newRisk.probability} onChange={(e) => setNewRisk((p) => ({ ...p, probability: e.target.value }))}>
                  <option value="">Probability…</option>{["High", "Medium", "Low"].map((v) => <option key={v}>{v}</option>)}
                </select>
                <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white col-span-2" placeholder="Mitigation strategy" value={newRisk.mitigation} onChange={(e) => setNewRisk((p) => ({ ...p, mitigation: e.target.value }))} />
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 shrink-0">Close By</label>
                  <input type="date" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" value={newRisk.closeByDate} onChange={(e) => setNewRisk((p) => ({ ...p, closeByDate: e.target.value }))} />
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
                <th className="text-left px-4 py-2">ID</th><th className="text-left px-4 py-2">Risk Description</th>
                <th className="text-left px-4 py-2">Impact</th><th className="text-left px-4 py-2">Probability</th>
                <th className="text-left px-4 py-2">Mitigation</th><th className="text-left px-4 py-2">Close By</th>
                <th className="text-left px-4 py-2">Source</th>
                <th className="text-left px-4 py-2">Status</th><th className="text-left px-4 py-2">Actions</th>
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
                    <td className="px-4 py-2"><span className="text-xs text-slate-400">{riskEdit.preSales ? "Pre-sales" : "Project"}</span></td>
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
                      {r.preSales
                        ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">🔁 Pre-sales</span>
                        : <span className="text-xs text-slate-400 italic">Project</span>}
                    </td>
                    <td className="px-4 py-3"><button onClick={() => toggleRiskClosed(r.id)} className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${r.closed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{r.closed ? "Closed" : "Open"}</button></td>
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
              {seeded && <p className="text-xs text-slate-400 mt-0.5">Imported from onboarding — fully editable</p>}
            </div>
            <button onClick={() => setShowAddMilestone(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">+ Add Milestone</button>
          </div>
          {showAddMilestone && (
            <div className="bg-white rounded-xl shadow-sm p-4 border-2 border-indigo-200 space-y-3">
              <div className="text-sm font-semibold text-indigo-700">New Milestone</div>
              <div className="grid grid-cols-4 gap-3">
                <input className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Milestone name *" value={newMilestone.name} onChange={(e) => setNewMilestone((p) => ({ ...p, name: e.target.value }))} />
                <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm" value={newMilestone.date} onChange={(e) => setNewMilestone((p) => ({ ...p, date: e.target.value }))} />
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" value={newMilestone.status} onChange={(e) => setNewMilestone((p) => ({ ...p, status: e.target.value }))}>
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
                  <input className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Name" value={milestoneEdit.name} onChange={(e) => setMilestoneEdit({ ...milestoneEdit, name: e.target.value })} />
                  <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm" value={milestoneEdit.date} onChange={(e) => setMilestoneEdit({ ...milestoneEdit, date: e.target.value })} />
                  <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" value={milestoneEdit.status} onChange={(e) => setMilestoneEdit({ ...milestoneEdit, status: e.target.value })}>
                    {["On Track", "At Risk", "Planned"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input type="number" className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Items count" value={milestoneEdit.items} onChange={(e) => setMilestoneEdit({ ...milestoneEdit, items: Number(e.target.value) })} />
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
                  <div className="text-sm text-slate-400">Release: {m.date}{m.items > 0 ? ` · ${m.items} backlog items` : ""}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${milestoneStatusStyle[m.status] ?? "bg-slate-100 text-slate-500"}`}>{m.status}</span>
                <button onClick={() => startEditMilestone(m)} className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Edit</button>
              </div>
            )
          ))}
        </div>
      )}

      {/* ══ RESOURCES TAB ══ */}
      {activeTab === "Resources" && (
        <div className="space-y-4">
          {/* HR sync banner */}
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            <span className="text-lg shrink-0">🔗</span>
            <div>
              <span className="font-semibold">Resource pool synced from HR Module.</span>
              {" "}Availability, roles, and capacity are automatically pulled from your HR system. Changes made here are local overrides for this project only.
            </div>
            <span className="ml-auto text-xs text-blue-500 shrink-0">Last synced: today</span>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Project Team", value: resources.length, color: "bg-slate-50 border-slate-200", text: "text-slate-700" },
              { label: "Available", value: availCount, color: "bg-green-50 border-green-200", text: "text-green-700" },
              { label: "Partial", value: partialCount, color: "bg-amber-50 border-amber-200", text: "text-amber-700" },
              { label: "Not Available", value: unavailCount, color: "bg-red-50 border-red-200", text: "text-red-700" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
                <div className="text-xs text-slate-500 mb-1">{s.label}</div>
                <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-700">Project Team</h3>
                <p className="text-xs text-slate-400 mt-0.5">{resources.length} member{resources.length !== 1 ? "s" : ""} assigned to this project · Assignee dropdowns pull from this list</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setShowPoolModal(true); setPoolSelection([]); setPoolSearch(""); }}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 flex items-center gap-1.5">
                  <span>👥</span> Browse Resource Pool
                </button>
                <button onClick={() => setShowAddResource(true)} className="px-3 py-1.5 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50">+ Add Manually</button>
              </div>
            </div>

            {showAddResource && (
              <div className="px-4 py-4 bg-indigo-50 border-b border-indigo-100 space-y-3">
                <div className="text-sm font-semibold text-indigo-700">New Resource</div>
                <div className="grid grid-cols-3 gap-3">
                  <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Full name *" value={newResource.name} onChange={(e) => setNewResource((p) => ({ ...p, name: e.target.value }))} />
                  <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Role / Designation" value={newResource.role} onChange={(e) => setNewResource((p) => ({ ...p, role: e.target.value }))} />
                  <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" value={newResource.availability} onChange={(e) => setNewResource((p) => ({ ...p, availability: e.target.value as Resource["availability"] }))}>
                    {["Available", "Partial", "Not Available"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 shrink-0">Capacity (hrs/sprint)</label>
                    <input type="number" className="flex-1 border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white" value={newResource.capacityHours} onChange={(e) => setNewResource((p) => ({ ...p, capacityHours: Number(e.target.value) }))} />
                  </div>
                  <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Skills (comma-separated)" onChange={(e) => setNewResource((p) => ({ ...p, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} />
                </div>
                <div className="flex gap-2">
                  <button onClick={addResource} className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg">Add Resource</button>
                  <button onClick={() => setShowAddResource(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-sm rounded-lg">Cancel</button>
                </div>
              </div>
            )}

            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Role</th>
                  <th className="text-left px-4 py-2">Availability</th>
                  <th className="text-left px-4 py-2">Capacity (Sprint)</th>
                  <th className="text-left px-4 py-2">Active Tasks</th>
                  <th className="text-left px-4 py-2">Skills</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => {
                  const allocPct = r.capacityHours > 0 ? Math.min(100, Math.round((r.allocatedHours / r.capacityHours) * 100)) : 0;
                  const isEditing = editingResourceId === r.id && resourceEdit;
                  return isEditing ? (
                    <tr key={r.id} className="border-b border-indigo-100 bg-indigo-50">
                      <td className="px-4 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={resourceEdit.name} onChange={(e) => setResourceEdit({ ...resourceEdit, name: e.target.value })} /></td>
                      <td className="px-4 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={resourceEdit.role} onChange={(e) => setResourceEdit({ ...resourceEdit, role: e.target.value })} /></td>
                      <td className="px-4 py-2">
                        <select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={resourceEdit.availability} onChange={(e) => setResourceEdit({ ...resourceEdit, availability: e.target.value as Resource["availability"] })}>
                          {["Available", "Partial", "Not Available"].map((v) => <option key={v}>{v}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <input type="number" className="w-16 border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={resourceEdit.allocatedHours} onChange={(e) => setResourceEdit({ ...resourceEdit, allocatedHours: Number(e.target.value) })} />
                          <span className="text-xs text-slate-400">/ {resourceEdit.capacityHours}h</span>
                        </div>
                      </td>
                      <td className="px-4 py-2"><input type="number" className="w-16 border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={resourceEdit.currentTasks} onChange={(e) => setResourceEdit({ ...resourceEdit, currentTasks: Number(e.target.value) })} /></td>
                      <td className="px-4 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" defaultValue={resourceEdit.skills.join(", ")} onChange={(e) => setResourceEdit({ ...resourceEdit, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} /></td>
                      <td className="px-4 py-2 flex gap-1">
                        <button onClick={saveResource} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Save</button>
                        <button onClick={() => { setEditingResourceId(null); setResourceEdit(null); }} className="px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded">Cancel</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">{r.name[0]}</div>
                          <span className="font-medium text-slate-700 text-sm">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-sm">{r.role}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${availabilityStyle[r.availability]}`}>
                          {r.availability === "Available" ? "✓ Available" : r.availability === "Partial" ? "~ Partial" : "✗ Not Available"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-600 mb-1">{r.allocatedHours}h / {r.capacityHours}h ({allocPct}%)</div>
                        <div className="w-32 bg-slate-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${allocPct >= 100 ? "bg-red-500" : allocPct >= 70 ? "bg-amber-400" : "bg-green-500"}`} style={{ width: `${allocPct}%` }} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-semibold text-slate-700">{r.currentTasks}</span>
                        <div className="text-xs text-slate-400">tasks</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.skills.map((s) => <span key={s} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{s}</span>)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => startEditResource(r)} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200">Edit</button>
                          <button onClick={() => removeFromProject(r.id)}
                            className="px-2 py-1 text-xs bg-red-50 text-red-500 border border-red-100 rounded hover:bg-red-100 transition-colors"
                            title="Remove from project (returns to pool)">
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ RESOURCE POOL BROWSER MODAL ══ */}
      {showPoolModal && (() => {
        const projectIds = new Set(resources.map(r => r.id));
        const poolResources = GLOBAL_RESOURCE_POOL.filter(r => !projectIds.has(r.id));
        const filtered = poolSearch.trim()
          ? poolResources.filter(r =>
              r.name.toLowerCase().includes(poolSearch.toLowerCase()) ||
              r.role.toLowerCase().includes(poolSearch.toLowerCase()) ||
              r.skills.some(s => s.toLowerCase().includes(poolSearch.toLowerCase()))
            )
          : poolResources;

        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowPoolModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between shrink-0">
                <div>
                  <h2 className="font-semibold text-slate-800 text-base">Resource Pool</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Synced from HR Module · {poolResources.length} resource{poolResources.length !== 1 ? "s" : ""} available · Select to add to this project
                  </p>
                </div>
                <button onClick={() => setShowPoolModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
              </div>

              {/* Search + filter */}
              <div className="px-5 py-3 border-b border-slate-100 shrink-0">
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Search by name, role or skill…"
                  value={poolSearch}
                  onChange={e => setPoolSearch(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Resource list */}
              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    {poolResources.length === 0 ? "All resources from the pool are already on this project." : "No resources match your search."}
                  </div>
                ) : (
                  filtered.map(r => {
                    const selected = poolSelection.includes(r.id);
                    const allocPct = r.capacityHours > 0 ? Math.min(100, Math.round((r.allocatedHours / r.capacityHours) * 100)) : 0;
                    return (
                      <label key={r.id}
                        className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${selected ? "border-indigo-400 bg-indigo-50" : "border-slate-100 bg-white hover:border-slate-300"} ${r.availability === "Not Available" ? "opacity-60" : ""}`}>
                        <input type="checkbox" className="w-4 h-4 accent-indigo-600 shrink-0"
                          checked={selected}
                          disabled={r.availability === "Not Available"}
                          onChange={() => r.availability !== "Not Available" && togglePoolSelect(r.id)} />
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-base font-bold text-indigo-600 shrink-0">{r.name[0]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-800 text-sm">{r.name}</span>
                            <span className="text-xs text-slate-400">{r.role}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${availabilityStyle[r.availability]}`}>
                              {r.availability === "Available" ? "✓ Available" : r.availability === "Partial" ? "~ Partial" : "✗ Unavailable"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1.5">
                              <div className="w-20 bg-slate-100 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${allocPct >= 100 ? "bg-red-500" : allocPct >= 70 ? "bg-amber-400" : "bg-green-500"}`} style={{ width: `${allocPct}%` }} />
                              </div>
                              <span className="text-xs text-slate-400">{r.allocatedHours}/{r.capacityHours}h</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {r.skills.slice(0, 3).map(s => <span key={s} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{s}</span>)}
                            </div>
                          </div>
                        </div>
                        {r.availability === "Not Available" && (
                          <span className="text-xs text-red-400 shrink-0">Fully booked</span>
                        )}
                      </label>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50 rounded-b-2xl">
                <span className="text-sm text-slate-500">
                  {poolSelection.length > 0 ? <span className="font-semibold text-indigo-600">{poolSelection.length} selected</span> : "Select resources to add"}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setShowPoolModal(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-300">Cancel</button>
                  <button onClick={addFromPool} disabled={poolSelection.length === 0}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Add {poolSelection.length > 0 ? `${poolSelection.length} ` : ""}to Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ EDIT ITEM MODAL ══ */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[620px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={editDraft.assignee ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, assignee: e.target.value }))}>
                    <option value="">— Select Assignee —</option>
                    {resources.map((r) => (
                      <option key={r.id} value={r.name} disabled={r.availability === "Not Available"}>
                        {r.availability === "Available" ? "✓" : r.availability === "Partial" ? "~" : "✗"} {r.name} · {r.role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Assigned By</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={editDraft.assignedBy ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, assignedBy: e.target.value }))}>
                    <option value="">— Assigned By —</option>
                    {resources.map((r) => <option key={r.id} value={r.name}>{r.name} · {r.role}</option>)}
                  </select>
                </div>
                {editModal.type !== "Epic" && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Link to Epic</label>
                      <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        value={editDraft.epicId ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, epicId: e.target.value }))}>
                        <option value="">— None —</option>
                        {epicsInBacklog.map((e) => <option key={e.id} value={e.id}>{e.id}: {e.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Link to Story</label>
                      <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        value={(editDraft as Record<string,unknown>).storyId as string ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, storyId: e.target.value }))}>
                        <option value="">— None —</option>
                        {backlog.filter((i) => i.type === "Story").map((s) => <option key={s.id} value={s.id}>{s.id}: {s.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Link to Milestone</label>
                      <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        value={(editDraft as Record<string,unknown>).milestoneId as string ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, milestoneId: e.target.value }))}>
                        <option value="">— None —</option>
                        {milestones.map((m) => <option key={m.id} value={m.id}>{m.id}: {m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Sprint</label>
                      <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        value={editDraft.sprintId ?? ""} onChange={(e) => setEditDraft((p) => ({ ...p, sprintId: e.target.value }))}>
                        <option value="">— Unplanned —</option>
                        {AVAILABLE_SPRINTS.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
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
              {(editModal.type === "Story" || editModal.type === "R&D") && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><span className="text-lg">📎</span><div className="text-sm font-medium text-slate-700">Attachments</div></div>
                  {(!editDraft.documents || editDraft.documents.length === 0)
                    ? <div className="text-sm text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-lg mb-2">No attachments yet</div>
                    : <div className="space-y-1.5 mb-2">{editDraft.documents.map((doc, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-red-500">📄</span>
                          <button onClick={() => doc === "US_S01_User_Registration_Journey.pdf" ? setUserStoryViewer(doc) : alert(`Opening: ${doc}`)} className="flex-1 text-sm text-indigo-600 hover:text-indigo-800 text-left hover:underline">{doc}</button>
                          <span className="text-xs text-slate-400">PDF</span>
                          <button onClick={() => setEditDraft((p) => ({ ...p, documents: (p.documents ?? []).filter((_, j) => j !== i) }))} className="text-xs text-red-400 hover:text-red-600">✕</button>
                        </div>
                      ))}</div>}
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors" onClick={simulateDocUpload}>
                    {uploadingDoc ? <div className="text-indigo-600 font-medium text-sm">Uploading…</div>
                      : <><div className="text-2xl mb-1">📎</div><div className="text-sm font-medium text-slate-600">Click to attach document</div><div className="text-xs text-slate-400 mt-0.5">.pdf, .docx, .xlsx, .png</div></>}
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

      {/* User Story Viewer */}
      {userStoryViewer && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4" onClick={() => setUserStoryViewer(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <div className="text-xs text-slate-400 font-mono mb-0.5">US-S01 · User Registration Journey</div>
                <div className="font-semibold text-slate-800 text-lg">User Story — New User Registration &amp; Onboarding</div>
              </div>
              <button onClick={() => setUserStoryViewer(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
            </div>
            <div className="px-6 py-5 space-y-5 text-sm text-slate-700">
              {/* Header cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                  <div className="text-xs text-indigo-500 font-medium mb-0.5">Role</div>
                  <div className="font-semibold text-indigo-800">New Visitor</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <div className="text-xs text-emerald-500 font-medium mb-0.5">Goal</div>
                  <div className="font-semibold text-emerald-800">Register an account</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                  <div className="text-xs text-amber-500 font-medium mb-0.5">Benefit</div>
                  <div className="font-semibold text-amber-800">Access the platform</div>
                </div>
              </div>

              {/* Story statement */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 italic text-slate-600">
                "As a <strong className="text-slate-800 not-italic">new visitor</strong>, I want to <strong className="text-slate-800 not-italic">create an account using my email or Google/GitHub OAuth</strong>, so that I can <strong className="text-slate-800 not-italic">access the platform and start managing projects immediately</strong>."
              </div>

              {/* User Journey */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">User Journey</div>
                <div className="space-y-2">
                  {[
                    { step: "1", icon: "🌐", title: "Land on homepage", detail: "User arrives at the marketing page via search, referral, or direct link. They see a clear CTA: \"Get Started Free\"." },
                    { step: "2", icon: "📋", title: "Navigate to Sign Up", detail: "User clicks CTA and is directed to /register. Page shows email+password form and OAuth options (Google, GitHub)." },
                    { step: "3", icon: "✏️", title: "Fill in details", detail: "User enters full name, work email, password (min 8 chars, 1 special char). Real-time inline validation shows green checkmarks." },
                    { step: "4", icon: "🔐", title: "Submit form", detail: "User clicks \"Create Account\". System validates uniqueness of email. If duplicate, shows inline error. If valid, sends verification email." },
                    { step: "5", icon: "📧", title: "Email verification", detail: "User receives \"Verify your email\" email within 60 seconds. Clicks the link which has a 24-hour expiry token." },
                    { step: "6", icon: "✅", title: "Account confirmed", detail: "Clicking the link verifies the account. User is automatically signed in and redirected to /onboarding." },
                    { step: "7", icon: "🎉", title: "Onboarding wizard", detail: "3-step wizard: (1) Set up workspace name, (2) Invite teammates (optional), (3) Choose project template. User can skip to dashboard." },
                    { step: "8", icon: "🏠", title: "Reach Dashboard", detail: "User lands on the main dashboard with a sample project pre-loaded. In-app tooltip tour begins (dismissible)." },
                  ].map(({ step, icon, title, detail }) => (
                    <div key={step} className="flex gap-3 items-start">
                      <div className="shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center mt-0.5">{step}</div>
                      <div className="flex-1 bg-white border border-slate-100 rounded-lg px-3 py-2.5 shadow-sm">
                        <div className="font-medium text-slate-700 mb-0.5">{icon} {title}</div>
                        <div className="text-slate-500 text-xs leading-relaxed">{detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acceptance Criteria */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Acceptance Criteria</div>
                <ul className="space-y-1.5">
                  {[
                    "User can register with a unique email and a password meeting complexity requirements",
                    "OAuth registration via Google and GitHub creates an account without requiring a password",
                    "Duplicate email registration shows a clear inline error within 500ms",
                    "Verification email is delivered within 60 seconds and link expires after 24 hours",
                    "Unverified accounts cannot access any authenticated routes",
                    "On first login, the onboarding wizard is shown (can be dismissed and resumed later)",
                    "All form interactions are WCAG 2.1 AA accessible (keyboard navigable, screen-reader friendly)",
                  ].map((ac, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                      <span>{ac}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Definition of Done */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Definition of Done</div>
                <ul className="space-y-1.5">
                  {[
                    "Unit + integration tests cover happy path and all error branches (≥ 80% coverage)",
                    "E2E test for email registration and OAuth registration both pass in CI",
                    "Security: passwords hashed with bcrypt (cost ≥ 12); tokens are single-use and server-validated",
                    "No personal data logged to stdout or log files",
                    "QA sign-off on mobile (375px) and desktop (1440px) breakpoints",
                    "Product Owner demo acceptance",
                  ].map((dod, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="text-indigo-400 mt-0.5 shrink-0">◆</span>
                      <span>{dod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer meta */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-400">
                <span>Est. Hrs: <strong className="text-slate-600">20h</strong></span>
                <span>Priority: <strong className="text-rose-600">High</strong></span>
                <span>Linked Epic: <strong className="text-slate-600">E-01</strong></span>
                <span>Sprint: <strong className="text-slate-600">Sprint 1</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
