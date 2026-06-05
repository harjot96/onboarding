"use client"

import { useState } from "react"
import ProjectBanner from "../_components/ProjectBanner"

type ProjectModel = {
  id: string
  name: string
  icon: string
  workflow: string
  flexibility: "Very High" | "High" | "Medium" | "Low"
  billing: string
  color: string
  borderColor: string
  headerColor: string
  pillColor: string
  description: string
  keyFields: { label: string; example: string }[]
  phases: string[]
  billingFields: { label: string; placeholder: string }[]
  bestFor: string
}

const FLEXIBILITY_COLOR: Record<string, string> = {
  "Very High": "bg-emerald-100 text-emerald-700",
  High: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-600",
}

const MODELS: ProjectModel[] = [
  {
    id: "saas",
    name: "SaaS",
    icon: "☁️",
    workflow: "Continuous loop",
    flexibility: "Very High",
    billing: "Subscription",
    color: "bg-violet-50",
    borderColor: "border-violet-300",
    headerColor: "bg-violet-600",
    pillColor: "bg-violet-100 text-violet-700",
    description: "Ongoing product development with continuous delivery cycles, feature releases, and subscriber-based revenue.",
    keyFields: [
      { label: "Product Name", example: "ProjectFlow Pro" },
      { label: "Subscription Plan", example: "Starter / Growth / Enterprise" },
      { label: "Monthly Recurring Revenue", example: "₹2,50,000/mo" },
      { label: "Renewal Cycle", example: "Monthly / Annual" },
      { label: "Churn Rate Target", example: "< 2% monthly" },
    ],
    phases: ["Discovery", "Sprint Loop", "Release", "Monitor", "Iterate"],
    billingFields: [
      { label: "Subscription Fee / User", placeholder: "₹999/user/month" },
      { label: "Billing Cycle", placeholder: "Monthly" },
      { label: "Trial Period", placeholder: "14 days" },
    ],
    bestFor: "Product companies building recurring-revenue software",
  },
  {
    id: "tm",
    name: "Time & Material",
    icon: "⏱️",
    workflow: "Sprint-based",
    flexibility: "High",
    billing: "Hourly / Monthly",
    color: "bg-blue-50",
    borderColor: "border-blue-300",
    headerColor: "bg-blue-600",
    pillColor: "bg-blue-100 text-blue-700",
    description: "Client is billed for actual time spent and materials used. Scope can evolve across sprints.",
    keyFields: [
      { label: "Rate Card (per resource)", example: "₹1,200/hr – Sr. Dev" },
      { label: "Monthly Cap", example: "₹5,00,000/month" },
      { label: "Sprint Cadence", example: "2 weeks" },
      { label: "Billing Frequency", example: "Monthly" },
      { label: "Resource Mix", example: "2 Dev, 1 QA, 0.5 PM" },
    ],
    phases: ["Kickoff", "Sprint 1", "Sprint 2", "Sprint N", "Closure"],
    billingFields: [
      { label: "Hourly Rate per Resource", placeholder: "₹1,200 / hr" },
      { label: "Monthly Billing Cap", placeholder: "₹5,00,000" },
      { label: "Billing Cycle", placeholder: "Monthly" },
    ],
    bestFor: "Evolving scope where client wants control over backlog",
  },
  {
    id: "fixed",
    name: "Fixed Price",
    icon: "📌",
    workflow: "Phase-based",
    flexibility: "Low",
    billing: "One-time",
    color: "bg-indigo-50",
    borderColor: "border-indigo-300",
    headerColor: "bg-indigo-600",
    pillColor: "bg-indigo-100 text-indigo-700",
    description: "Agreed scope, timeline, and cost upfront. Changes go through formal change request process.",
    keyFields: [
      { label: "Project Cost", example: "₹18,50,000 (incl. taxes)" },
      { label: "SOW Reference", example: "SOW-2026-0048" },
      { label: "Change Request Policy", example: "Formal sign-off required" },
      { label: "Penalty Clause", example: "2% per week delay" },
      { label: "Warranty Period", example: "90 days post go-live" },
    ],
    phases: ["Requirements", "Design", "Development", "UAT", "Go Live"],
    billingFields: [
      { label: "Total Project Cost", placeholder: "₹18,50,000" },
      { label: "Payment Schedule", placeholder: "25% Advance + milestones" },
      { label: "Tax Type", placeholder: "GST 18%" },
    ],
    bestFor: "Well-defined scope with low risk of change",
  },
  {
    id: "dedicated",
    name: "Dedicated Team",
    icon: "👥",
    workflow: "Agile ongoing",
    flexibility: "High",
    billing: "Monthly per resource",
    color: "bg-teal-50",
    borderColor: "border-teal-300",
    headerColor: "bg-teal-600",
    pillColor: "bg-teal-100 text-teal-700",
    description: "A dedicated offshore/nearshore team working exclusively for the client under their direction.",
    keyFields: [
      { label: "Team Size", example: "6 FTEs" },
      { label: "Monthly Team Cost", example: "₹8,40,000/month" },
      { label: "Contract Duration", example: "12 months" },
      { label: "Notice Period", example: "30 days" },
      { label: "Client Reporting Cadence", example: "Weekly standup" },
    ],
    phases: ["Onboarding", "Month 1", "Month 2", "Month N", "Renewal / Exit"],
    billingFields: [
      { label: "Monthly Rate per Resource", placeholder: "₹1,40,000/resource" },
      { label: "No. of Resources", placeholder: "6" },
      { label: "Contract Term", placeholder: "12 months" },
    ],
    bestFor: "Clients needing full-time embedded engineering capacity",
  },
  {
    id: "bot",
    name: "BOT",
    icon: "🔄",
    workflow: "Phased transfer",
    flexibility: "Medium",
    billing: "Contract-based",
    color: "bg-orange-50",
    borderColor: "border-orange-300",
    headerColor: "bg-orange-600",
    pillColor: "bg-orange-100 text-orange-700",
    description: "Build–Operate–Transfer: vendor builds the team/system, operates it, then transfers ownership to client.",
    keyFields: [
      { label: "Build Phase Duration", example: "6 months" },
      { label: "Operate Phase Duration", example: "12 months" },
      { label: "Transfer Timeline", example: "Month 18–24" },
      { label: "IP Ownership Transfer Date", example: "2027-06-01" },
      { label: "Transition Plan", example: "Knowledge transfer doc" },
    ],
    phases: ["Build", "Operate", "Transfer"],
    billingFields: [
      { label: "Build Phase Cost", placeholder: "₹25,00,000" },
      { label: "Operate Monthly Fee", placeholder: "₹4,00,000/month" },
      { label: "Transfer Fee", placeholder: "₹5,00,000" },
    ],
    bestFor: "Clients wanting to eventually own a fully operational team/product",
  },
  {
    id: "staffaug",
    name: "Staff Augmentation",
    icon: "➕",
    workflow: "Task-based",
    flexibility: "High",
    billing: "Monthly per person",
    color: "bg-cyan-50",
    borderColor: "border-cyan-300",
    headerColor: "bg-cyan-600",
    pillColor: "bg-cyan-100 text-cyan-700",
    description: "Individual resources placed with the client team to fill specific skill gaps, working under client management.",
    keyFields: [
      { label: "Resource Name & Role", example: "Rahul S. – Backend Lead" },
      { label: "Skills Required", example: "Node.js, AWS, Docker" },
      { label: "Start Date", example: "2026-07-01" },
      { label: "Monthly Rate", example: "₹1,60,000/person" },
      { label: "Minimum Commitment", example: "3 months" },
    ],
    phases: ["Resource Selection", "Onboarding", "Active Deployment", "Extension / Exit"],
    billingFields: [
      { label: "Monthly Rate per Person", placeholder: "₹1,60,000" },
      { label: "No. of Resources", placeholder: "2" },
      { label: "Minimum Lock-in", placeholder: "3 months" },
    ],
    bestFor: "Filling specific skill gaps within an existing client team",
  },
  {
    id: "outcome",
    name: "Outcome-based",
    icon: "🎯",
    workflow: "KPI-based",
    flexibility: "Medium",
    billing: "Performance-based",
    color: "bg-rose-50",
    borderColor: "border-rose-300",
    headerColor: "bg-rose-600",
    pillColor: "bg-rose-100 text-rose-700",
    description: "Billing tied to agreed KPIs and business outcomes — not time or deliverables.",
    keyFields: [
      { label: "Success KPIs", example: "99.9% uptime, < 2s load" },
      { label: "Measurement Cadence", example: "Monthly review" },
      { label: "Base Fee", example: "₹3,00,000/month" },
      { label: "Performance Bonus", example: "+20% on KPI hit" },
      { label: "Penalty Clause", example: "-10% if below threshold" },
    ],
    phases: ["Goal Setting", "Baseline", "Execution", "KPI Review", "Payout"],
    billingFields: [
      { label: "Base Monthly Fee", placeholder: "₹3,00,000" },
      { label: "Performance Bonus %", placeholder: "20%" },
      { label: "KPI Measurement Period", placeholder: "Monthly" },
    ],
    bestFor: "Clients who want vendor skin-in-the-game for results",
  },
  {
    id: "milestone",
    name: "Milestone",
    icon: "🏁",
    workflow: "Stage-based",
    flexibility: "Medium",
    billing: "Phase payments",
    color: "bg-amber-50",
    borderColor: "border-amber-300",
    headerColor: "bg-amber-600",
    pillColor: "bg-amber-100 text-amber-700",
    description: "Payments unlocked on achieving predefined project milestones — combines fixed scope with phased billing.",
    keyFields: [
      { label: "Milestone Name", example: "MVP Delivery" },
      { label: "Milestone Amount", example: "₹5,55,000 (30%)" },
      { label: "Acceptance Criteria", example: "Signed UAT report" },
      { label: "Due Date", example: "2026-08-15" },
      { label: "Payment Terms", example: "Net 15 after sign-off" },
    ],
    phases: ["M1: Kickoff", "M2: Requirements", "M3: MVP", "M4: UAT", "M5: Go Live"],
    billingFields: [
      { label: "No. of Milestones", placeholder: "5" },
      { label: "Total Project Value", placeholder: "₹18,50,000" },
      { label: "Payment on Each Milestone", placeholder: "% of total" },
    ],
    bestFor: "Projects with clear stages where client pays on verified completion",
  },
]

export default function ProjectTypesPage() {
  const [selected, setSelected] = useState<ProjectModel>(MODELS[2])
  const [tab, setTab] = useState<"fields" | "billing" | "phases">("fields")

  function handleSelect(id: string) {
    const m = MODELS.find((m) => m.id === id)
    if (m) { setSelected(m); setTab("fields") }
  }

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <ProjectBanner />

      {/* Header + Dropdown selector */}
      <div className={`rounded-2xl border-2 ${selected.borderColor} ${selected.color} px-6 py-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Project Type Guide</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selected.icon}</span>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{selected.name}</h1>
                <p className="text-sm text-slate-500 mt-0.5">{selected.description}</p>
              </div>
            </div>
          </div>

          {/* Dropdown */}
          <div className="shrink-0">
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Switch Project Type</label>
            <select
              value={selected.id}
              onChange={(e) => handleSelect(e.target.value)}
              className="border-2 border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold bg-white text-slate-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none shadow-sm min-w-[220px] cursor-pointer"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick-stat strip */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-200 text-xs">
            <span className="text-slate-400 font-medium">Workflow</span>
            <span className="font-semibold text-slate-700">{selected.workflow}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-200 text-xs">
            <span className="text-slate-400 font-medium">Flexibility</span>
            <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${FLEXIBILITY_COLOR[selected.flexibility]}`}>{selected.flexibility}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-200 text-xs">
            <span className="text-slate-400 font-medium">Billing</span>
            <span className="font-semibold text-slate-700">{selected.billing}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-200 text-xs">
            <span className="text-slate-400 font-medium">Best for</span>
            <span className="font-semibold text-slate-700">{selected.bestFor}</span>
          </div>
        </div>
      </div>

      {/* Model pill switcher */}
      <div className="flex flex-wrap gap-2">
        {MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelect(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              selected.id === m.id
                ? `${m.pillColor} border-current shadow-sm scale-105`
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <span>{m.icon}</span>{m.name}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className={`flex border-b border-slate-100`}>
          {(["fields", "billing", "phases"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3.5 text-sm font-medium transition-colors ${
                tab === t
                  ? `border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50`
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {t === "fields" ? "Key Onboarding Fields" : t === "billing" ? "Billing Configuration" : "Phase Timeline"}
            </button>
          ))}
          <div className="ml-auto flex items-center px-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${selected.pillColor}`}>
              {selected.icon} {selected.name}
            </span>
          </div>
        </div>

        {/* Key Fields tab */}
        {tab === "fields" && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* CRM auto-fill fields */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Auto-filled from CRM</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Project Name", example: "Alpha Web Application Suite" },
                    { label: "Project ID", example: "PRJ-2026-0048" },
                    { label: "Client Name", example: "Nexgen Technologies Pvt. Ltd." },
                    { label: "Currency", example: "INR ₹" },
                    { label: "Start Date", example: "2026-06-01" },
                    { label: "End Date", example: "2026-09-30" },
                    { label: "Description", example: "Full-stack web application suite…" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                      <span className="text-xs text-slate-600 font-medium">{f.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono">{f.example}</span>
                        <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-medium">CRM</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model-specific fields */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${selected.headerColor}`} />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{selected.name} — Required fields</p>
                </div>
                <div className="space-y-2">
                  {selected.keyFields.map((f) => (
                    <div key={f.label} className={`flex items-center justify-between rounded-lg px-3 py-2.5 border ${selected.color} ${selected.borderColor}`}>
                      <span className="text-xs text-slate-700 font-semibold">{f.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{f.example}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${selected.pillColor}`}>Required</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Unique note per model */}
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
                  <strong>Note:</strong> For <strong>{selected.name}</strong>, fields above replace or extend the standard Fixed Price form. Ensure these are captured before initiating the project.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Setup tab */}
        {tab === "billing" && (
          <div className="p-6 space-y-5">
            <div className={`rounded-xl px-5 py-3 text-white text-sm font-semibold flex items-center gap-2 ${selected.headerColor}`}>
              <span className="text-xl">{selected.icon}</span>
              {selected.name} — Billing Model: {selected.billing}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {selected.billingFields.map((f) => (
                <div key={f.label}>
                  <label className="text-xs text-slate-700 font-semibold block mb-1">{f.label}</label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 bg-slate-50"
                    placeholder={f.placeholder}
                    readOnly
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Project Cost <span className="text-slate-400 font-normal">(Inclusive of taxes, if any)</span></label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" placeholder="Enter amount" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Project Description / Scope Summary <span className="text-green-600 font-normal">(CRM · editable)</span></label>
                <textarea rows={4} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  defaultValue="Full-stack web application suite covering user management, notifications, analytics dashboard, and admin portal." />
              </div>
              <div className={`rounded-xl border-2 ${selected.borderColor} ${selected.color} p-4 flex flex-col justify-center space-y-2`}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Billing Summary</p>
                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between"><span className="text-slate-500">Model</span><span className="font-semibold text-slate-700">{selected.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Workflow</span><span className="font-semibold text-slate-700">{selected.workflow}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Billing type</span><span className="font-semibold text-slate-700">{selected.billing}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Flexibility</span>
                    <span className={`font-semibold text-xs px-2 py-0.5 rounded-full ${FLEXIBILITY_COLOR[selected.flexibility]}`}>{selected.flexibility}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">{selected.bestFor}</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-500">
              <strong className="text-slate-700">Billing note:</strong> For <strong>{selected.name}</strong> projects, billing follows a <strong>{selected.billing.toLowerCase()}</strong> model aligned to the <strong>{selected.workflow.toLowerCase()}</strong> workflow.
            </div>
          </div>
        )}

        {/* Phase Timeline tab */}
        {tab === "phases" && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Timeline */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Lifecycle Phases</p>
                <div className="relative">
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200" />
                  <div className="space-y-3">
                    {selected.phases.map((ph, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 z-10 ${selected.headerColor}`}>
                          {i + 1}
                        </div>
                        <div className={`flex-1 rounded-lg px-4 py-3 border-2 ${i === 0 ? selected.borderColor + " " + selected.color : "border-slate-100 bg-slate-50"}`}>
                          <p className="text-sm font-semibold text-slate-700">{ph}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {i === 0
                              ? "Project initiation, team setup, stakeholder alignment"
                              : i === selected.phases.length - 1
                              ? "Final delivery, client sign-off, handover & closure"
                              : "Active execution, reviews, client feedback & iteration"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* All models mini-comparison */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">All Models at a Glance</p>
                <div className="space-y-2">
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelect(m.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 text-left transition-all ${
                        selected.id === m.id ? `${m.color} ${m.borderColor}` : "bg-slate-50 border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <span className="text-lg shrink-0">{m.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700">{m.name}</p>
                        <p className="text-xs text-slate-400 truncate">{m.workflow} · {m.billing}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${FLEXIBILITY_COLOR[m.flexibility]}`}>{m.flexibility}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
