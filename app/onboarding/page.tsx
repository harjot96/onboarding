"use client";
import { useState, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type ProjectMilestone = { id: string; name: string; dueDate: string; deliverable: string; status: string };
type RiskItem = { id: string; description: string; impact: string; probability: string; mitigation: string; owner: string; status: string };
type BillingLineItem = { id: string; description: string; category: string; qty: number; unitPrice: number };
type PaymentMilestone = { id: string; name: string; pct: number; dueDate: string; status: string };
type ContactRow = { id: string; role: string; name: string; designation: string; department: string; email: string; phone: string };

// ── Prefilled CRM data ─────────────────────────────────────────────────────
const CRM_PREFILL = {
  projectName: "Alpha Web Application Suite",
  projectId: "PRJ-2026-0048",
  clientName: "Nexgen Technologies Pvt. Ltd.",
  dealValue: 1850000,
  salesRep: "Arjun Mehta",
  closedDate: "2026-05-26",
  leadId: "CRM-LEAD-7721",
  dealStage: "Closed Won",
};

const PROJECT_TYPES = ["Fixed Price", "Time & Material", "Retainer", "Milestone-Based", "Hybrid"];
const CURRENCIES = ["INR ₹", "USD $", "EUR €", "GBP £", "AED د.إ"];
const TAX_TYPES = ["GST 18%", "GST 12%", "GST 5%", "VAT 5%", "VAT 15%", "Service Tax", "Withholding Tax", "Tax Exempt"];
const PAYMENT_TERMS = ["Net 15", "Net 30", "Net 45", "Net 60", "Advance 100%", "50% Advance + 50% on Delivery", "Milestone-Based"];
const ORG_MEMBERS = ["", "Priya Desai", "Rohit Verma", "Sunita Rao", "Aditya Joshi", "Meena Pillai", "Vikram Patel", "Arjun Mehta", "Deepa Nair", "Sanjay Kulkarni", "Neha Gupta", "Rajan Iyer"];
const IMPACT_OPTS = ["High", "Medium", "Low"];
const STATUS_OPTS_MILESTONE = ["Planned", "In Progress", "Completed", "Delayed"];
const STATUS_OPTS_RISK = ["Open", "Mitigated", "Closed", "Escalated"];
const BILLING_CATEGORIES = ["Development", "Design", "Consulting", "Testing", "Support", "Infrastructure", "License", "Training", "Other"];
const PAYMENT_STATUSES = ["Pending", "Invoiced", "Received", "Overdue"];
const CONTACT_COLORS = [
  "bg-purple-100 text-purple-700", "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700", "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700", "bg-cyan-100 text-cyan-700",
  "bg-violet-100 text-violet-700", "bg-orange-100 text-orange-700",
];
const DRAFT_KEY = "pm_onboarding_draft";

// ── Initial data ───────────────────────────────────────────────────────────
const initMilestones: ProjectMilestone[] = [
  { id: "M1", name: "Project Kickoff", dueDate: "2026-06-05", deliverable: "Kickoff meeting & signed SOW", status: "Planned" },
  { id: "M2", name: "Requirements Freeze", dueDate: "2026-06-20", deliverable: "BRD & FRD documents", status: "Planned" },
  { id: "M3", name: "MVP Delivery", dueDate: "2026-08-15", deliverable: "Working MVP on staging", status: "Planned" },
  { id: "M4", name: "UAT Sign-off", dueDate: "2026-09-10", deliverable: "Signed UAT report", status: "Planned" },
  { id: "M5", name: "Go Live", dueDate: "2026-09-30", deliverable: "Production deployment", status: "Planned" },
];

const initRisks: RiskItem[] = [
  { id: "R1", description: "Scope creep from client change requests", impact: "High", probability: "High", mitigation: "Enforce formal change request process with sign-off", owner: "Project Manager", status: "Open" },
  { id: "R2", description: "Delay in client feedback cycles", impact: "Medium", probability: "Medium", mitigation: "Weekly review cadence; 3-day SLA on approvals", owner: "Project POC", status: "Open" },
  { id: "R3", description: "Third-party API integration failure", impact: "High", probability: "Low", mitigation: "Mock APIs in parallel; fallback strategy documented", owner: "Tech Lead", status: "Open" },
];

const initBillingItems: BillingLineItem[] = [
  { id: "B1", description: "Web Application Development (Frontend + Backend)", category: "Development", qty: 1000, unitPrice: 1200 },
  { id: "B2", description: "UI/UX Design & Prototyping", category: "Design", qty: 200, unitPrice: 900 },
  { id: "B3", description: "DevOps & Infrastructure Setup", category: "Infrastructure", qty: 120, unitPrice: 1100 },
  { id: "B4", description: "QA & Testing", category: "Testing", qty: 160, unitPrice: 800 },
  { id: "B5", description: "Project Management & Consulting", category: "Consulting", qty: 140, unitPrice: 1500 },
];

const initPaymentMilestones: PaymentMilestone[] = [
  { id: "P1", name: "Advance on Agreement Signing", pct: 25, dueDate: "2026-06-05", status: "Pending" },
  { id: "P2", name: "On Requirements Freeze", pct: 20, dueDate: "2026-06-20", status: "Pending" },
  { id: "P3", name: "On MVP Delivery", pct: 30, dueDate: "2026-08-15", status: "Pending" },
  { id: "P4", name: "On UAT Sign-off", pct: 15, dueDate: "2026-09-10", status: "Pending" },
  { id: "P5", name: "On Go Live", pct: 10, dueDate: "2026-09-30", status: "Pending" },
];

const initContacts: ContactRow[] = [
  { id: "C1", role: "Signing Authority", name: "Rajesh Kumar", designation: "Chief Executive Officer", department: "Executive", email: "rajesh.kumar@nexgen-tech.in", phone: "+91 98450 12345" },
  { id: "C2", role: "Accounts POC", name: "Deepa Sharma", designation: "Finance Manager", department: "Finance & Accounts", email: "deepa.sharma@nexgen-tech.in", phone: "+91 98450 67890" },
  { id: "C3", role: "Client Implementation Contact", name: "Kiran Nair", designation: "Senior Product Manager", department: "Product", email: "kiran.nair@nexgen-tech.in", phone: "+91 99001 23456" },
];

const impactColor: Record<string, string> = {
  High: "bg-red-100 text-red-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-green-100 text-green-700",
};
const statusColor: Record<string, string> = {
  Planned: "bg-slate-100 text-slate-500", "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700", Delayed: "bg-red-100 text-red-600",
  Open: "bg-red-100 text-red-700", Mitigated: "bg-amber-100 text-amber-700",
  Closed: "bg-green-100 text-green-700", Escalated: "bg-purple-100 text-purple-700",
  Pending: "bg-slate-100 text-slate-500", Invoiced: "bg-blue-100 text-blue-700",
  Received: "bg-green-100 text-green-700", Overdue: "bg-red-100 text-red-700",
};

// ── Component ──────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  // Project details
  const [project, setProject] = useState({
    name: CRM_PREFILL.projectName, id: CRM_PREFILL.projectId,
    type: "Fixed Price", currency: "INR ₹",
    startDate: "2026-06-01", endDate: "2026-09-30",
    budget: CRM_PREFILL.dealValue,
    description: "Full-stack web application suite covering user management, notifications, analytics dashboard, and admin portal.",
  });

  const [milestones, setMilestones] = useState<ProjectMilestone[]>(initMilestones);
  const [editMilestone, setEditMilestone] = useState<ProjectMilestone | null>(null);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Omit<ProjectMilestone, "id">>({ name: "", dueDate: "", deliverable: "", status: "Planned" });

  const [risks, setRisks] = useState<RiskItem[]>(initRisks);
  const [editRisk, setEditRisk] = useState<RiskItem | null>(null);
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [newRisk, setNewRisk] = useState<Omit<RiskItem, "id">>({ description: "", impact: "Medium", probability: "Medium", mitigation: "", owner: "", status: "Open" });

  const [clientCompany, setClientCompany] = useState({
    name: CRM_PREFILL.clientName, industry: "Information Technology",
    website: "www.nexgen-tech.in", headquarters: "Bangalore, Karnataka, India",
    companySize: "501–1000 employees", registrationNo: "U72900KA2015PTC081234",
    taxId: "29AABCN1234F1Z5", incorporationDate: "2015-03-12",
  });

  const [clientAccount, setClientAccount] = useState({
    billingAddress: "No. 42, Koramangala 5th Block, Bangalore – 560095",
    accountNo: "ACCT-NXT-00482", paymentTerms: "Net 30",
    currency: "INR ₹", poNumber: "PO-2026-NXT-0091",
    poDate: "2026-05-28",
  });

  const [contacts, setContacts] = useState<ContactRow[]>(initContacts);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState<Omit<ContactRow, "id">>({ role: "", name: "", designation: "", department: "", email: "", phone: "" });

  const [orgOwnership, setOrgOwnership] = useState({
    salesRep: CRM_PREFILL.salesRep, accountManager: "Priya Desai",
    projectManager: "Rohit Verma", deliveryLead: "Sunita Rao",
    technicalLead: "Aditya Joshi", billingOwner: "Meena Pillai",
    supportLead: "", escalationManager: "Vikram Patel",
  });

  const [billingItems, setBillingItems] = useState<BillingLineItem[]>(initBillingItems);
  const [inclusiveTax, setInclusiveTax] = useState(true);
  const [taxType, setTaxType] = useState("GST 18%");
  const [editBilling, setEditBilling] = useState<BillingLineItem | null>(null);
  const [showAddBilling, setShowAddBilling] = useState(false);
  const [newBilling, setNewBilling] = useState<Omit<BillingLineItem, "id">>({ description: "", category: "Development", qty: 1, unitPrice: 0 });

  const [paymentMilestones, setPaymentMilestones] = useState<PaymentMilestone[]>(initPaymentMilestones);
  const [editPayment, setEditPayment] = useState<PaymentMilestone | null>(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState<Omit<PaymentMilestone, "id">>({ name: "", pct: 0, dueDate: "", status: "Pending" });

  const [saved, setSaved] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  const initiateProject = () => {
    const projectData = {
      projectName: project.name,
      projectId: project.id,
      clientName: clientCompany.name,
      clientIndustry: clientCompany.industry,
      dealValue: project.budget,
      budget: project.budget,
      currency: project.currency,
      projectType: project.type,
      startDate: project.startDate,
      endDate: project.endDate,
      description: project.description,
      salesRep: orgOwnership.salesRep,
      projectManager: orgOwnership.projectManager,
      accountManager: orgOwnership.accountManager,
      technicalLead: orgOwnership.technicalLead,
      deliveryLead: orgOwnership.deliveryLead,
      billingOwner: orgOwnership.billingOwner,
      milestones,
      risks,
      billingItems,
      paymentMilestones,
      contacts,
      grandTotal,
      taxType,
      inclusiveTax,
      initiatedAt: new Date().toISOString(),
    };
    localStorage.setItem("pm_active_project", JSON.stringify(projectData));
    // clear stale scope seed so scope page reseeds from fresh project data
    localStorage.removeItem("pm_scope_seed_ts");
    setSaved(true);
    setTimeout(() => { window.location.href = "/scope"; }, 1200);
  };

  // ── Billing calculations ──
  const subtotal = billingItems.reduce((a, b) => a + b.qty * b.unitPrice, 0);
  const taxRate = taxType.includes("18") ? 0.18 : taxType.includes("12") ? 0.12 : taxType.includes("15") ? 0.15 : taxType.includes("5%") ? 0.05 : taxType === "Tax Exempt" ? 0 : 0.18;
  const taxAmount = inclusiveTax ? subtotal * taxRate : 0;
  const grandTotal = inclusiveTax ? subtotal + taxAmount : subtotal;
  const totalPaymentPct = paymentMilestones.reduce((a, p) => a + p.pct, 0);

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  // ── Auto-save: restore from localStorage on mount ──
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      if (d.project) setProject(d.project);
      if (d.milestones) setMilestones(d.milestones);
      if (d.risks) setRisks(d.risks);
      if (d.clientCompany) setClientCompany(d.clientCompany);
      if (d.clientAccount) setClientAccount(d.clientAccount);
      if (d.contacts) setContacts(d.contacts.map((c: ContactRow) =>
        c.role === "Project POC" ? { ...c, role: "Client Implementation Contact" } : c
      ));
      if (d.orgOwnership) setOrgOwnership(d.orgOwnership);
      if (d.billingItems) setBillingItems(d.billingItems);
      if (d.inclusiveTax !== undefined) setInclusiveTax(d.inclusiveTax);
      if (d.taxType) setTaxType(d.taxType);
      if (d.paymentMilestones) setPaymentMilestones(d.paymentMilestones);
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-save: persist to localStorage on every state change ──
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        project, milestones, risks, clientCompany, clientAccount,
        contacts, orgOwnership, billingItems, inclusiveTax, taxType, paymentMilestones,
      }));
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 800);
    return () => clearTimeout(t);
  }, [project, milestones, risks, clientCompany, clientAccount, contacts, orgOwnership, billingItems, inclusiveTax, taxType, paymentMilestones]);

  // ── Milestone helpers ──
  const saveMilestone = () => {
    if (!editMilestone) return;
    setMilestones((p) => p.map((m) => m.id === editMilestone.id ? editMilestone : m));
    setEditMilestone(null);
  };
  const addMilestone = () => {
    if (!newMilestone.name) return;
    setMilestones((p) => [...p, { ...newMilestone, id: `M${p.length + 10}` }]);
    setNewMilestone({ name: "", dueDate: "", deliverable: "", status: "Planned" });
    setShowAddMilestone(false);
  };
  const deleteMilestone = (id: string) => setMilestones((p) => p.filter((m) => m.id !== id));

  // ── Risk helpers ──
  const saveRisk = () => {
    if (!editRisk) return;
    setRisks((p) => p.map((r) => r.id === editRisk.id ? editRisk : r));
    setEditRisk(null);
  };
  const addRisk = () => {
    if (!newRisk.description) return;
    setRisks((p) => [...p, { ...newRisk, id: `R${p.length + 10}` }]);
    setNewRisk({ description: "", impact: "Medium", probability: "Medium", mitigation: "", owner: "", status: "Open" });
    setShowAddRisk(false);
  };

  // ── Billing helpers ──
  const saveBilling = () => {
    if (!editBilling) return;
    setBillingItems((p) => p.map((b) => b.id === editBilling.id ? editBilling : b));
    setEditBilling(null);
  };
  const addBilling = () => {
    if (!newBilling.description) return;
    setBillingItems((p) => [...p, { ...newBilling, id: `B${p.length + 10}` }]);
    setNewBilling({ description: "", category: "Development", qty: 1, unitPrice: 0 });
    setShowAddBilling(false);
  };
  const deleteBilling = (id: string) => setBillingItems((p) => p.filter((b) => b.id !== id));

  // ── Payment milestone helpers ──
  const savePayment = () => {
    if (!editPayment) return;
    setPaymentMilestones((p) => p.map((pm) => pm.id === editPayment.id ? editPayment : pm));
    setEditPayment(null);
  };
  const addPayment = () => {
    if (!newPayment.name) return;
    setPaymentMilestones((p) => [...p, { ...newPayment, id: `P${p.length + 10}` }]);
    setNewPayment({ name: "", pct: 0, dueDate: "", status: "Pending" });
    setShowAddPayment(false);
  };

  // ── Contact helpers ──
  const updateContact = (id: string, field: keyof ContactRow, value: string) =>
    setContacts((p) => p.map((c) => c.id === id ? { ...c, [field]: value } : c));
  const deleteContact = (id: string) => setContacts((p) => p.filter((c) => c.id !== id));
  const addContact = () => {
    if (!newContact.role) return;
    setContacts((p) => [...p, { ...newContact, id: `C${p.length + 10}` }]);
    setNewContact({ role: "", name: "", designation: "", department: "", email: "", phone: "" });
    setShowAddContact(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* ── CRM Banner ── */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🏆</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-lg">Lead Won — Project Onboarding</span>
                <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">CRM Auto-Filled</span>
                {autoSaved && (
                  <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-full animate-pulse">
                    ✓ Auto-saved
                  </span>
                )}
              </div>
              <div className="text-green-100 text-sm mt-0.5">
                Lead <span className="font-mono font-semibold">{CRM_PREFILL.leadId}</span> marked as <strong>Closed Won</strong> on {CRM_PREFILL.closedDate} by {CRM_PREFILL.salesRep}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-green-100 text-xs">Deal Value</div>
              <div className="text-2xl font-bold">{fmt(CRM_PREFILL.dealValue)}</div>
            </div>
            <button onClick={initiateProject}
              className="px-5 py-2.5 bg-white text-green-700 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors shadow">
              {saved ? "✓ Saved!" : "Save & Initiate Project"}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — PROJECT DETAILS
      ══════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">1</div>
          <h2 className="text-lg font-bold text-slate-800">Project Details</h2>
        </div>

        {/* Project details form */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Project Name</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                value={project.name} onChange={(e) => setProject((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Project ID <span className="text-indigo-500">(auto)</span></label>
              <input readOnly className="w-full border border-slate-100 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500 font-mono"
                value={project.id} />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Project Type</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                value={project.type} onChange={(e) => setProject((p) => ({ ...p, type: e.target.value }))}>
                {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Currency</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                value={project.currency} onChange={(e) => setProject((p) => ({ ...p, currency: e.target.value }))}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Project Budget</label>
              <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                value={project.budget} onChange={(e) => setProject((p) => ({ ...p, budget: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Start Date</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                value={project.startDate} onChange={(e) => setProject((p) => ({ ...p, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">End Date</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                value={project.endDate} onChange={(e) => setProject((p) => ({ ...p, endDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Project Description / Scope Summary</label>
            <textarea rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              value={project.description} onChange={(e) => setProject((p) => ({ ...p, description: e.target.value }))} />
          </div>
        </div>

        {/* Project Milestones */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-700">Project Milestones</h3>
              <p className="text-xs text-slate-400 mt-0.5">Key deliverables and target dates</p>
            </div>
            <button onClick={() => setShowAddMilestone(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">+ Add Milestone</button>
          </div>
          {showAddMilestone && (
            <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
              <div className="grid grid-cols-4 gap-3 mb-2">
                <input className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Milestone name *"
                  value={newMilestone.name} onChange={(e) => setNewMilestone((p) => ({ ...p, name: e.target.value }))} />
                <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                  value={newMilestone.dueDate} onChange={(e) => setNewMilestone((p) => ({ ...p, dueDate: e.target.value }))} />
                <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                  value={newMilestone.status} onChange={(e) => setNewMilestone((p) => ({ ...p, status: e.target.value }))}>
                  {STATUS_OPTS_MILESTONE.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <input className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Deliverable description"
                  value={newMilestone.deliverable} onChange={(e) => setNewMilestone((p) => ({ ...p, deliverable: e.target.value }))} />
                <button onClick={addMilestone} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg">Save</button>
                <button onClick={() => setShowAddMilestone(false)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs rounded-lg">Cancel</button>
              </div>
            </div>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2">Milestone</th>
                <th className="text-left px-4 py-2">Deliverable</th>
                <th className="text-left px-4 py-2">Due Date</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) =>
                editMilestone?.id === m.id ? (
                  <tr key={m.id} className="border-b border-indigo-50 bg-indigo-50">
                    <td className="px-4 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editMilestone.name} onChange={(e) => setEditMilestone({ ...editMilestone, name: e.target.value })} /></td>
                    <td className="px-4 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editMilestone.deliverable} onChange={(e) => setEditMilestone({ ...editMilestone, deliverable: e.target.value })} /></td>
                    <td className="px-4 py-2"><input type="date" className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editMilestone.dueDate} onChange={(e) => setEditMilestone({ ...editMilestone, dueDate: e.target.value })} /></td>
                    <td className="px-4 py-2">
                      <select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editMilestone.status} onChange={(e) => setEditMilestone({ ...editMilestone, status: e.target.value })}>
                        {STATUS_OPTS_MILESTONE.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2 flex gap-1">
                      <button onClick={saveMilestone} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Save</button>
                      <button onClick={() => setEditMilestone(null)} className="px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded">Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-700 text-sm">{m.name}</td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs">{m.deliverable}</td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs">{m.dueDate}</td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor[m.status] ?? "bg-slate-100 text-slate-500"}`}>{m.status}</span></td>
                    <td className="px-4 py-2.5 flex gap-1">
                      <button onClick={() => setEditMilestone({ ...m })} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200">Edit</button>
                      <button onClick={() => deleteMilestone(m.id)} className="px-2 py-1 text-xs bg-red-50 text-red-500 rounded hover:bg-red-100">✕</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Project Cost Breakdown */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-700">Project Cost Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Itemised billing — services, hours, or deliverables</p>
            </div>
            <button onClick={() => setShowAddBilling(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">+ Add Line Item</button>
          </div>
          {showAddBilling && (
            <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
              <div className="grid grid-cols-5 gap-3">
                <input className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Description *"
                  value={newBilling.description} onChange={(e) => setNewBilling((p) => ({ ...p, description: e.target.value }))} />
                <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white"
                  value={newBilling.category} onChange={(e) => setNewBilling((p) => ({ ...p, category: e.target.value }))}>
                  {BILLING_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input type="number" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Qty / Hours"
                  value={newBilling.qty} onChange={(e) => setNewBilling((p) => ({ ...p, qty: Number(e.target.value) }))} />
                <input type="number" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Unit Price"
                  value={newBilling.unitPrice} onChange={(e) => setNewBilling((p) => ({ ...p, unitPrice: Number(e.target.value) }))} />
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={addBilling} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg">Save</button>
                <button onClick={() => setShowAddBilling(false)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs rounded-lg">Cancel</button>
              </div>
            </div>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2">Description</th>
                <th className="text-left px-4 py-2">Category</th>
                <th className="text-right px-4 py-2">Qty / Hrs</th>
                <th className="text-right px-4 py-2">Unit Price</th>
                <th className="text-right px-4 py-2">Amount</th>
                <th className="text-center px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billingItems.map((b) =>
                editBilling?.id === b.id ? (
                  <tr key={b.id} className="border-b border-indigo-50 bg-indigo-50">
                    <td className="px-3 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editBilling.description} onChange={(e) => setEditBilling({ ...editBilling, description: e.target.value })} /></td>
                    <td className="px-3 py-2">
                      <select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editBilling.category} onChange={(e) => setEditBilling({ ...editBilling, category: e.target.value })}>
                        {BILLING_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2"><input type="number" className="w-20 border border-slate-200 rounded px-2 py-1 text-xs bg-white text-right" value={editBilling.qty} onChange={(e) => setEditBilling({ ...editBilling, qty: Number(e.target.value) })} /></td>
                    <td className="px-3 py-2"><input type="number" className="w-24 border border-slate-200 rounded px-2 py-1 text-xs bg-white text-right" value={editBilling.unitPrice} onChange={(e) => setEditBilling({ ...editBilling, unitPrice: Number(e.target.value) })} /></td>
                    <td className="px-3 py-2 text-right text-xs font-semibold text-indigo-600">{fmt(editBilling.qty * editBilling.unitPrice)}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1 justify-center">
                        <button onClick={saveBilling} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Save</button>
                        <button onClick={() => setEditBilling(null)} className="px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded">Cancel</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-700">{b.description}</td>
                    <td className="px-4 py-2.5"><span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-medium">{b.category}</span></td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{b.qty.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{fmt(b.unitPrice)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-indigo-600">{fmt(b.qty * b.unitPrice)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => setEditBilling({ ...b })} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200">Edit</button>
                        <button onClick={() => deleteBilling(b.id)} className="px-2 py-1 text-xs bg-red-50 text-red-500 rounded hover:bg-red-100">✕</button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Risk Register */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-700">Risk Register</h3>
              <p className="text-xs text-slate-400 mt-0.5">Identified risks with mitigation plans</p>
            </div>
            <button onClick={() => setShowAddRisk(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">+ Add Risk</button>
          </div>
          {showAddRisk && (
            <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100 space-y-2">
              <div className="grid grid-cols-4 gap-3">
                <input className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Risk description *"
                  value={newRisk.description} onChange={(e) => setNewRisk((p) => ({ ...p, description: e.target.value }))} />
                <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white" value={newRisk.impact} onChange={(e) => setNewRisk((p) => ({ ...p, impact: e.target.value }))}>
                  {IMPACT_OPTS.map((v) => <option key={v}>{v}</option>)}
                </select>
                <select className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white" value={newRisk.probability} onChange={(e) => setNewRisk((p) => ({ ...p, probability: e.target.value }))}>
                  {IMPACT_OPTS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <input className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Mitigation strategy"
                  value={newRisk.mitigation} onChange={(e) => setNewRisk((p) => ({ ...p, mitigation: e.target.value }))} />
                <input className="w-36 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Owner"
                  value={newRisk.owner} onChange={(e) => setNewRisk((p) => ({ ...p, owner: e.target.value }))} />
                <button onClick={addRisk} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg">Save</button>
                <button onClick={() => setShowAddRisk(false)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs rounded-lg">Cancel</button>
              </div>
            </div>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2">Risk Description</th>
                <th className="text-left px-4 py-2">Impact</th>
                <th className="text-left px-4 py-2">Probability</th>
                <th className="text-left px-4 py-2">Mitigation</th>
                <th className="text-left px-4 py-2">Owner</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r) =>
                editRisk?.id === r.id ? (
                  <tr key={r.id} className="border-b border-indigo-50 bg-indigo-50">
                    <td className="px-3 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editRisk.description} onChange={(e) => setEditRisk({ ...editRisk, description: e.target.value })} /></td>
                    <td className="px-3 py-2"><select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editRisk.impact} onChange={(e) => setEditRisk({ ...editRisk, impact: e.target.value })}>{IMPACT_OPTS.map((v) => <option key={v}>{v}</option>)}</select></td>
                    <td className="px-3 py-2"><select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editRisk.probability} onChange={(e) => setEditRisk({ ...editRisk, probability: e.target.value })}>{IMPACT_OPTS.map((v) => <option key={v}>{v}</option>)}</select></td>
                    <td className="px-3 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editRisk.mitigation} onChange={(e) => setEditRisk({ ...editRisk, mitigation: e.target.value })} /></td>
                    <td className="px-3 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editRisk.owner} onChange={(e) => setEditRisk({ ...editRisk, owner: e.target.value })} /></td>
                    <td className="px-3 py-2"><select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editRisk.status} onChange={(e) => setEditRisk({ ...editRisk, status: e.target.value })}>{STATUS_OPTS_RISK.map((s) => <option key={s}>{s}</option>)}</select></td>
                    <td className="px-3 py-2 flex gap-1"><button onClick={saveRisk} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Save</button><button onClick={() => setEditRisk(null)} className="px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded">Cancel</button></td>
                  </tr>
                ) : (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-700 text-xs max-w-xs">{r.description}</td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColor[r.impact]}`}>{r.impact}</span></td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColor[r.probability]}`}>{r.probability}</span></td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs max-w-xs">{r.mitigation}</td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs">{r.owner}</td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor[r.status] ?? "bg-slate-100 text-slate-500"}`}>{r.status}</span></td>
                    <td className="px-4 py-2.5"><button onClick={() => setEditRisk({ ...r })} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200">Edit</button></td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — CLIENT INFORMATION
      ══════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">2</div>
          <h2 className="text-lg font-bold text-slate-800">Client Company Information</h2>
        </div>

        {/* Client Company Information */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs">🏢</span>
            Client Company Information
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Company Name", key: "name" },
              { label: "Industry", key: "industry" },
              { label: "Website", key: "website" },
              { label: "Headquarters / Registered Address", key: "headquarters" },
              { label: "Company Size", key: "companySize" },
              { label: "Incorporation Date", key: "incorporationDate" },
              { label: "Registration / CIN Number", key: "registrationNo" },
              { label: "GST / Tax ID", key: "taxId" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-xs text-slate-400 font-medium block mb-1">{label}</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  value={(clientCompany as Record<string, string>)[key]}
                  onChange={(e) => setClientCompany((p) => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Client Billing Information */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center text-emerald-600 text-xs">💳</span>
            Client Billing Information
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <label className="text-xs text-slate-400 font-medium block mb-1">Billing Address</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                value={clientAccount.billingAddress} onChange={(e) => setClientAccount((p) => ({ ...p, billingAddress: e.target.value }))} />
            </div>
            {[
              { label: "Account Number", key: "accountNo" },
              { label: "Payment Terms", key: "paymentTerms", isSelect: true, opts: PAYMENT_TERMS },
              { label: "Billing Currency", key: "currency", isSelect: true, opts: CURRENCIES },
              { label: "PO Number", key: "poNumber" },
              { label: "PO Date", key: "poDate", type: "date" },
            ].map(({ label, key, isSelect, opts, type }) => (
              <div key={key}>
                <label className="text-xs text-slate-400 font-medium block mb-1">{label}</label>
                {isSelect ? (
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                    value={(clientAccount as Record<string, string>)[key]}
                    onChange={(e) => setClientAccount((p) => ({ ...p, [key]: e.target.value }))}>
                    {opts!.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={type ?? "text"} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                    value={(clientAccount as Record<string, string>)[key]}
                    onChange={(e) => setClientAccount((p) => ({ ...p, [key]: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Milestones */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-700">Payment Milestones</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Payment schedule linked to project deliverables ·
                <span className={`ml-1 font-semibold ${totalPaymentPct > 100 ? "text-red-600" : totalPaymentPct === 100 ? "text-green-600" : "text-amber-600"}`}>
                  {totalPaymentPct}% allocated{totalPaymentPct < 100 ? ` · ${100 - totalPaymentPct}% remaining` : " ✓"}
                </span>
              </p>
            </div>
            <button onClick={() => setShowAddPayment(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">+ Add Milestone</button>
          </div>
          {showAddPayment && (
            <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
              <div className="grid grid-cols-4 gap-3">
                <input className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Milestone name *"
                  value={newPayment.name} onChange={(e) => setNewPayment((p) => ({ ...p, name: e.target.value }))} />
                <input type="number" min="0" max="100" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="% of total"
                  value={newPayment.pct} onChange={(e) => setNewPayment((p) => ({ ...p, pct: Number(e.target.value) }))} />
                <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                  value={newPayment.dueDate} onChange={(e) => setNewPayment((p) => ({ ...p, dueDate: e.target.value }))} />
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={addPayment} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg">Save</button>
                <button onClick={() => setShowAddPayment(false)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs rounded-lg">Cancel</button>
              </div>
            </div>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2">Payment Milestone</th>
                <th className="text-right px-4 py-2">% of Total</th>
                <th className="text-right px-4 py-2">Amount</th>
                <th className="text-left px-4 py-2">Due Date</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-center px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentMilestones.map((pm) =>
                editPayment?.id === pm.id ? (
                  <tr key={pm.id} className="border-b border-indigo-50 bg-indigo-50">
                    <td className="px-3 py-2"><input className="w-full border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editPayment.name} onChange={(e) => setEditPayment({ ...editPayment, name: e.target.value })} /></td>
                    <td className="px-3 py-2"><input type="number" min="0" max="100" className="w-16 border border-slate-200 rounded px-2 py-1 text-xs bg-white text-right" value={editPayment.pct} onChange={(e) => setEditPayment({ ...editPayment, pct: Number(e.target.value) })} /></td>
                    <td className="px-3 py-2 text-right text-xs font-semibold text-indigo-600">{fmt((editPayment.pct / 100) * grandTotal)}</td>
                    <td className="px-3 py-2"><input type="date" className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editPayment.dueDate} onChange={(e) => setEditPayment({ ...editPayment, dueDate: e.target.value })} /></td>
                    <td className="px-3 py-2">
                      <select className="border border-slate-200 rounded px-2 py-1 text-xs bg-white" value={editPayment.status} onChange={(e) => setEditPayment({ ...editPayment, status: e.target.value })}>
                        {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1 justify-center">
                        <button onClick={savePayment} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Save</button>
                        <button onClick={() => setEditPayment(null)} className="px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded">Cancel</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={pm.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-700 font-medium">{pm.name}</td>
                    <td className="px-4 py-2.5 text-right"><span className="text-sm font-semibold text-slate-700">{pm.pct}%</span></td>
                    <td className="px-4 py-2.5 text-right font-semibold text-indigo-600">{fmt((pm.pct / 100) * grandTotal)}</td>
                    <td className="px-4 py-2.5 text-slate-500 text-sm">{pm.dueDate}</td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor[pm.status] ?? "bg-slate-100 text-slate-500"}`}>{pm.status}</span></td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => setEditPayment({ ...pm })} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 w-full">Edit</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td className="px-4 py-2.5 font-bold text-slate-700">Total</td>
                <td className={`px-4 py-2.5 text-right font-bold text-base ${totalPaymentPct > 100 ? "text-red-600" : totalPaymentPct === 100 ? "text-green-600" : "text-amber-600"}`}>{totalPaymentPct}%</td>
                <td className="px-4 py-2.5 text-right font-bold text-indigo-700 text-base">{fmt(grandTotal)}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Billing Details / Tax & Totals */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 text-xs">📋</span>
            Billing Details / Project Cost
          </h3>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Inclusive of Taxes</span>
              <button onClick={() => setInclusiveTax((p) => !p)}
                className={`relative w-11 h-6 rounded-full transition-colors ${inclusiveTax ? "bg-indigo-600" : "bg-slate-200"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${inclusiveTax ? "translate-x-5" : ""}`} />
              </button>
              {inclusiveTax && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">ON</span>
              )}
            </div>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Tax Type</span>
              <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                {TAX_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal (before tax)</span><span className="font-semibold">{fmt(subtotal)}</span>
            </div>
            {inclusiveTax && taxType !== "Tax Exempt" && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>{taxType}</span>
                <span className="font-semibold">{fmt(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-slate-800 border-t border-slate-200 pt-2 mt-2">
              <span>Grand Total</span><span className="text-indigo-700 text-lg">{fmt(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Client Implementation Contact */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-700">Client Contact Information</h3>
              <p className="text-xs text-slate-400 mt-0.5">Signing authority · Accounts POC · Client Implementation Contact · Additional contacts</p>
            </div>
            <button onClick={() => setShowAddContact(true)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">+ Add Contact</button>
          </div>

          {showAddContact && (
            <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
              <div className="grid grid-cols-6 gap-3">
                <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Role / Title *"
                  value={newContact.role} onChange={(e) => setNewContact((p) => ({ ...p, role: e.target.value }))} />
                <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Full Name"
                  value={newContact.name} onChange={(e) => setNewContact((p) => ({ ...p, name: e.target.value }))} />
                <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Designation"
                  value={newContact.designation} onChange={(e) => setNewContact((p) => ({ ...p, designation: e.target.value }))} />
                <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Department"
                  value={newContact.department} onChange={(e) => setNewContact((p) => ({ ...p, department: e.target.value }))} />
                <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Email"
                  value={newContact.email} onChange={(e) => setNewContact((p) => ({ ...p, email: e.target.value }))} />
                <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white" placeholder="Phone"
                  value={newContact.phone} onChange={(e) => setNewContact((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={addContact} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg">Save</button>
                <button onClick={() => setShowAddContact(false)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs rounded-lg">Cancel</button>
              </div>
            </div>
          )}

          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-2 w-36">Role</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Designation</th>
                <th className="text-left px-4 py-2">Department</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Phone</th>
                <th className="text-left px-4 py-2 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, idx) => (
                <tr key={c.id} className="border-b border-slate-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${CONTACT_COLORS[idx % CONTACT_COLORS.length]}`}>{c.role}</span>
                  </td>
                  {(["name", "designation", "department", "email", "phone"] as (keyof ContactRow)[]).map((field) => (
                    <td key={field} className="px-4 py-2.5">
                      <input className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                        value={c[field]} onChange={(e) => updateContact(c.id, field, e.target.value)} />
                    </td>
                  ))}
                  <td className="px-4 py-2.5">
                    {idx >= 3 && (
                      <button onClick={() => deleteContact(c.id)} className="px-2 py-1 text-xs bg-red-50 text-red-500 rounded hover:bg-red-100">✕</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Organizational Ownership */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 text-xs">🏛</span>
            Organizational Ownership
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-normal">Internal team responsible for this account</span>
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Sales Representative", key: "salesRep", note: "auto" },
              { label: "Account Manager", key: "accountManager" },
              { label: "Project Manager", key: "projectManager" },
              { label: "Delivery Lead", key: "deliveryLead" },
              { label: "Technical Lead", key: "technicalLead" },
              { label: "Billing Owner", key: "billingOwner" },
              { label: "Support Lead", key: "supportLead" },
              { label: "Escalation Manager", key: "escalationManager" },
            ].map(({ label, key, note }) => (
              <div key={key}>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  {label}{note && <span className="ml-1 text-indigo-400">(auto)</span>}
                </label>
                {note ? (
                  <input readOnly className="w-full border border-slate-100 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500 focus:outline-none"
                    value={(orgOwnership as Record<string, string>)[key]} />
                ) : (
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                    value={(orgOwnership as Record<string, string>)[key]}
                    onChange={(e) => setOrgOwnership((p) => ({ ...p, [key]: e.target.value }))}>
                    {ORG_MEMBERS.map((m) => <option key={m} value={m}>{m || "— Select —"}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Save CTA ── */}
      <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="text-sm text-indigo-700">
          <span className="font-semibold">Ready to initiate?</span> All details will be saved and the project will be created in the system.
        </div>
        <button onClick={initiateProject}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow">
          {saved ? "✓ Project Initiated!" : "Save & Initiate Project"}
        </button>
      </div>
    </div>
  );
}
