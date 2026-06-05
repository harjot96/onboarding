# ProjectFlow – PM Suite — Full Build Specification

## Stack
- **Next.js 16.2.6** (App Router, Turbopack) — `npm run dev` serves at http://localhost:3000
- **React 19**, **TypeScript 5**, **Tailwind CSS v4**
- **Lucide React** for icons (installed as `lucide-react`)
- No backend, no database — all state is client-side (`useState`) with `localStorage` persistence
- Dev: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && npm run dev`

---

## Project Structure
```
app/
├── layout.tsx                   # Root layout — wraps every page with <Sidebar>
├── globals.css                  # Tailwind base import
├── page.tsx                     # / → Dashboard
├── _components/
│   ├── Sidebar.tsx              # Collapsible nav; default CRM-only; toggle shows all
│   └── ProjectBanner.tsx        # Top banner showing active project from localStorage
├── onboarding/page.tsx          # /onboarding → Project Onboarding (CRM pre-fill)
├── scope/page.tsx               # /scope       → Scope & Backlog
├── planning/page.tsx            # /planning     → Sprint Planning & Estimation
├── board/page.tsx               # /board        → Kanban/Scrum Task Board
├── tracking/page.tsx            # /tracking     → Time Tracking & Time Logs
├── salary/page.tsx              # /salary       → Salary Cost per resource
└── project-cost/page.tsx        # /project-cost → Project Cost Overview
```

---

## Design System

### Color Palette (Tailwind classes)
| Token | Class | Usage |
|---|---|---|
| Page bg | `bg-slate-100` | `<body>` |
| Sidebar bg | `bg-slate-900` | Sidebar |
| Primary | `indigo-600` | Active nav, primary buttons, highlights |
| Success/CRM | `green-600` / `emerald-600` | CRM banner, success states |
| White card | `bg-white rounded-xl shadow-sm` | All cards/panels |
| Muted text | `text-slate-500` | Secondary labels |
| Border | `border-slate-200` | Input borders, table separators |

### Badge/Status Color Maps (used across all pages)
```ts
// Task type colors
const typeColors: Record<string, string> = {
  Story: "bg-blue-100 text-blue-700",
  Bug: "bg-red-100 text-red-700",
  Task: "bg-purple-100 text-purple-700",
  Epic: "bg-orange-100 text-orange-700",
  "R&N": "bg-yellow-100 text-yellow-700",
  "Branch Bug": "bg-red-200 text-red-800",
  "Sub-Task": "bg-slate-100 text-slate-600",
}

// Task status colors
const statusColors: Record<string, string> = {
  "To Do": "bg-slate-100 text-slate-600",
  "In Progress": "bg-blue-100 text-blue-700",
  Review: "bg-purple-100 text-purple-700",
  Testing: "bg-amber-100 text-amber-700",
  Done: "bg-green-100 text-green-700",
  Reopen: "bg-red-100 text-red-700",
  Closed: "bg-gray-100 text-gray-700",
}

// Priority colors
const priorityColors: Record<string, string> = {
  High: "text-red-600 bg-red-50",
  Medium: "text-amber-600 bg-amber-50",
  Low: "text-green-600 bg-green-50",
}

// Impact / risk severity
const impactColors: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
}
```

### Form Input Pattern
```tsx
<input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
<select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
```

### Section Card Pattern (header + table)
```tsx
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
    <div>
      <h3 className="font-semibold text-slate-700">Title</h3>
      <p className="text-xs text-slate-400 mt-0.5">Subtitle</p>
    </div>
    <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">+ Add</button>
  </div>
  {/* inline add form appears here when shown */}
  <table className="w-full text-sm">…</table>
</div>
```

### Conventions
- `"use client"` only when component uses `useState`, `useEffect`, `usePathname`, `useRouter`, or browser APIs
- Tailwind utility classes only — no CSS modules
- IDs use string prefixes: `M1`, `R1`, `B1`, `P1`, `C1` for milestone/risk/billing/payment/contact
- New items get IDs like `` `M${list.length + 10}` `` to avoid collisions
- Money formatted as `` `₹${Math.round(n).toLocaleString("en-IN")}` ``

---

## localStorage Keys

| Key | Written by | Read by | Contents |
|---|---|---|---|
| `pm_onboarding_draft` | Onboarding (800ms debounce) | Onboarding (on mount) | Full onboarding form state |
| `pm_active_project` | Onboarding (Save & Initiate) | ProjectBanner, Scope, Salary, ProjectCost | Initiated project data object |
| `pm_scope_seed_ts` | Scope (after seeding) | Scope | Timestamp to prevent re-seed |
| `pm_logged_hours_by_user` | Tracking | Salary, ProjectCost | `Record<userName, totalHours>` |
| `pm_hours_by_sprint` | Tracking | ProjectCost | `Record<sprintName, hours>` |
| `pm_overtime_by_user` | Tracking/Board | Salary | `Record<userName, overtimeHours>` |
| `pm_salary_rates` | Salary | ProjectCost | `Record<userName, {monthlySalary, workingHoursPerMonth, ratePerHour}>` |
| `pm_salary_allocated` | Salary | ProjectCost | `Record<userName, allocatedHours>` |

---

## Data Flow
```
CRM_PREFILL (constant in onboarding/page.tsx)
    ↓ auto-fills form fields on first load
Onboarding page useState (project, milestones, risks, billingItems, paymentMilestones, contacts, orgOwnership)
    ↓ 800ms debounce auto-save on every state change
localStorage["pm_onboarding_draft"]
    ↓ "Save & Initiate Project" button → initiateProject()
localStorage["pm_active_project"]  →  ProjectBanner (reads on every page)
    ↓ useEffect on Scope mount
Scope page seeds backlog epics from p.milestones, tasks from p.billingItems
    ↓ Board page — task comments log hours
Tracking page writes pm_logged_hours_by_user, pm_hours_by_sprint, pm_overtime_by_user
    ↓
Salary page reads logged hours, writes pm_salary_rates, pm_salary_allocated
    ↓
ProjectCost reads all salary/tracking keys → cost breakdown
```

---

## Component: `app/layout.tsx`
```tsx
// NO "use client" — server component
import type { Metadata } from "next"
import "./globals.css"
import Sidebar from "./_components/Sidebar"

export const metadata: Metadata = { title: "ProjectFlow – PM Suite", description: "Project Management Suite" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-slate-100 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  )
}
```

---

## Component: `app/_components/Sidebar.tsx`
`"use client"` — uses `usePathname`, `useState`

### Nav items
```ts
const nav = [
  { href: "/onboarding", label: "Project Onboarding", icon: "🏆", group: "CRM" },
  { href: "/",           label: "Dashboard",           icon: "⊞", group: "Project" },
  { href: "/scope",      label: "Scope & Backlog",     icon: "📋", group: "Project" },
  { href: "/board",      label: "Task Board",          icon: "🗂", group: "Project" },
  { href: "/planning",   label: "Planning & Sprints",  icon: "📅", group: "Project" },
  { href: "/tracking",   label: "Time Tracking",       icon: "⏱", group: "Project" },
  { href: "/project-cost", label: "Project Cost",      icon: "📊", group: "Finance" },
  { href: "/salary",     label: "Salary Cost",         icon: "💰", group: "Finance" },
]
```

### Behavior
- `const [crmOnly, setCrmOnly] = useState(true)` — default CRM-only
- `visibleGroups = crmOnly ? ["CRM"] : ["CRM", "Project", "Finance"]`
- Toggle button renders hamburger lines (1 line when crmOnly, 3 lines when expanded)
- Active link: `bg-indigo-600 text-white`; inactive: `text-slate-300 hover:bg-slate-800 hover:text-white`
- Width: `w-56`; sidebar bg: `bg-slate-900`
- Footer shows: "Alpha Web App" + "info@iprofit.in"

---

## Component: `app/_components/ProjectBanner.tsx`
`"use client"` — uses `useEffect`, `useState`

- Reads `pm_active_project` from localStorage on mount; returns `null` if absent
- Layout: `bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-center gap-4 flex-wrap`
- Left: indigo "P" avatar circle, project name (bold), client · projectId (mono) · projectType
- Right: date range, budget formatted `₹X,XX,XXX`, PM badge

---

## Page: `app/page.tsx` — Dashboard
`"use client"`

### Stat cards (grid-cols-4)
```ts
const stats = [
  { label: "Total Tasks",    value: "142", sub: "+12 this week", color: "bg-indigo-500" },
  { label: "Active Sprints", value: "3",   sub: "2 on track",    color: "bg-emerald-500" },
  { label: "Open Bugs",      value: "18",  sub: "5 critical",    color: "bg-red-500" },
  { label: "Hours Logged",   value: "486", sub: "this month",    color: "bg-amber-500" },
]
```

### Recent Tasks table (col-span-2 in grid-cols-3)
Columns: ID (indigo mono), Title, Type badge, Status badge, SP, Assignee
```ts
const recentTasks = [
  { id:"T-101", title:"Implement user authentication",  type:"Story", status:"In Progress", assignee:"Rahul S.",  sp:5 },
  { id:"T-102", title:"Fix login page redirect bug",    type:"Bug",   status:"Review",      assignee:"Priya M.",  sp:2 },
  { id:"T-103", title:"Setup CI/CD pipeline",           type:"Task",  status:"To Do",       assignee:"Amit K.",   sp:3 },
  { id:"T-104", title:"Design dashboard wireframes",    type:"Story", status:"Done",        assignee:"Sneha R.",  sp:4 },
  { id:"T-105", title:"Database schema migration",      type:"R&N",   status:"Testing",     assignee:"Vikram P.", sp:8 },
]
```

### Active Sprints panel (1 col)
```ts
const sprints = [
  { name:"Sprint 4", start:"May 15", end:"May 28", capacity:40, used:38, tasks:12, done:8 },
  { name:"Sprint 5", start:"May 29", end:"Jun 11", capacity:40, used:22, tasks:8,  done:2 },
]
```
Each sprint: name + % + progress bar + `used/capacity h` + `done/tasks done`

### Quick Links (grid-cols-4)
Cards: Scope & Backlog (`/scope`), Sprint Planning (`/planning`), Task Board (`/board`), Time Tracking (`/tracking`)

---

## Page: `app/onboarding/page.tsx` — Project Onboarding
`"use client"` — largest page (~940 lines)

### All types
```ts
type ProjectMilestone = { id: string; name: string; dueDate: string; deliverable: string; status: string }
type RiskItem = { id: string; description: string; impact: string; probability: string; mitigation: string; owner: string; status: string }
type BillingLineItem = { id: string; description: string; category: string; qty: number; unitPrice: number }
type PaymentMilestone = { id: string; name: string; pct: number; dueDate: string; status: string }
type ContactRow = { id: string; role: string; name: string; designation: string; department: string; email: string; phone: string }
```

### All constants
```ts
const CRM_PREFILL = {
  projectName: "Alpha Web Application Suite",
  projectId: "PRJ-2026-0048",
  clientName: "Nexgen Technologies Pvt. Ltd.",
  dealValue: 1850000,
  salesRep: "Arjun Mehta",
  closedDate: "2026-05-26",
  leadId: "CRM-LEAD-7721",
  dealStage: "Closed Won",
}
const PROJECT_TYPES = ["Fixed Price", "Time & Material", "Retainer", "Milestone-Based", "Hybrid"]
const CURRENCIES = ["INR ₹", "USD $", "EUR €", "GBP £", "AED د.إ"]
const TAX_TYPES = ["GST 18%", "GST 12%", "GST 5%", "VAT 5%", "VAT 15%", "Service Tax", "Withholding Tax", "Tax Exempt"]
const PAYMENT_TERMS = ["Net 15", "Net 30", "Net 45", "Net 60", "Advance 100%", "50% Advance + 50% on Delivery", "Milestone-Based"]
const ORG_MEMBERS = ["", "Priya Desai", "Rohit Verma", "Sunita Rao", "Aditya Joshi", "Meena Pillai", "Vikram Patel", "Arjun Mehta", "Deepa Nair", "Sanjay Kulkarni", "Neha Gupta", "Rajan Iyer"]
const IMPACT_OPTS = ["High", "Medium", "Low"]
const STATUS_OPTS_MILESTONE = ["Planned", "In Progress", "Completed", "Delayed"]
const STATUS_OPTS_RISK = ["Open", "Mitigated", "Closed", "Escalated"]
const BILLING_CATEGORIES = ["Development", "Design", "Consulting", "Testing", "Support", "Infrastructure", "License", "Training", "Other"]
const PAYMENT_STATUSES = ["Pending", "Invoiced", "Received", "Overdue"]
const CONTACT_COLORS = [
  "bg-purple-100 text-purple-700", "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700", "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700", "bg-cyan-100 text-cyan-700",
  "bg-violet-100 text-violet-700", "bg-orange-100 text-orange-700",
]
const DRAFT_KEY = "pm_onboarding_draft"
```

### Status / color maps
```ts
const impactColor: Record<string, string> = {
  High: "bg-red-100 text-red-700", Medium: "bg-amber-100 text-amber-700", Low: "bg-green-100 text-green-700",
}
const statusColor: Record<string, string> = {
  Planned: "bg-slate-100 text-slate-500", "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700", Delayed: "bg-red-100 text-red-600",
  Open: "bg-red-100 text-red-700", Mitigated: "bg-amber-100 text-amber-700",
  Closed: "bg-green-100 text-green-700", Escalated: "bg-purple-100 text-purple-700",
  Pending: "bg-slate-100 text-slate-500", Invoiced: "bg-blue-100 text-blue-700",
  Received: "bg-green-100 text-green-700", Overdue: "bg-red-100 text-red-700",
}
```

### Initial data
```ts
const initMilestones: ProjectMilestone[] = [
  { id:"M1", name:"Project Kickoff",        dueDate:"2026-06-05", deliverable:"Kickoff meeting & signed SOW",  status:"Planned" },
  { id:"M2", name:"Requirements Freeze",    dueDate:"2026-06-20", deliverable:"BRD & FRD documents",           status:"Planned" },
  { id:"M3", name:"MVP Delivery",           dueDate:"2026-08-15", deliverable:"Working MVP on staging",        status:"Planned" },
  { id:"M4", name:"UAT Sign-off",           dueDate:"2026-09-10", deliverable:"Signed UAT report",            status:"Planned" },
  { id:"M5", name:"Go Live",                dueDate:"2026-09-30", deliverable:"Production deployment",        status:"Planned" },
]
const initRisks: RiskItem[] = [
  { id:"R1", description:"Scope creep from client change requests", impact:"High",   probability:"High",   mitigation:"Enforce formal change request process with sign-off", owner:"Project Manager", status:"Open" },
  { id:"R2", description:"Delay in client feedback cycles",         impact:"Medium", probability:"Medium", mitigation:"Weekly review cadence; 3-day SLA on approvals",       owner:"Project POC",     status:"Open" },
  { id:"R3", description:"Third-party API integration failure",     impact:"High",   probability:"Low",    mitigation:"Mock APIs in parallel; fallback strategy documented", owner:"Tech Lead",       status:"Open" },
]
const initBillingItems: BillingLineItem[] = [
  { id:"B1", description:"Web Application Development (Frontend + Backend)", category:"Development",    qty:1000, unitPrice:1200 },
  { id:"B2", description:"UI/UX Design & Prototyping",                       category:"Design",         qty:200,  unitPrice:900  },
  { id:"B3", description:"DevOps & Infrastructure Setup",                    category:"Infrastructure", qty:120,  unitPrice:1100 },
  { id:"B4", description:"QA & Testing",                                     category:"Testing",        qty:160,  unitPrice:800  },
  { id:"B5", description:"Project Management & Consulting",                  category:"Consulting",     qty:140,  unitPrice:1500 },
]
const initPaymentMilestones: PaymentMilestone[] = [
  { id:"P1", name:"Advance on Agreement Signing", pct:25, dueDate:"2026-06-05", status:"Pending" },
  { id:"P2", name:"On Requirements Freeze",       pct:20, dueDate:"2026-06-20", status:"Pending" },
  { id:"P3", name:"On MVP Delivery",              pct:30, dueDate:"2026-08-15", status:"Pending" },
  { id:"P4", name:"On UAT Sign-off",              pct:15, dueDate:"2026-09-10", status:"Pending" },
  { id:"P5", name:"On Go Live",                   pct:10, dueDate:"2026-09-30", status:"Pending" },
]
const initContacts: ContactRow[] = [
  { id:"C1", role:"Signing Authority",             name:"Rajesh Kumar", designation:"Chief Executive Officer", department:"Executive",         email:"rajesh.kumar@nexgen-tech.in",  phone:"+91 98450 12345" },
  { id:"C2", role:"Accounts POC",                  name:"Deepa Sharma", designation:"Finance Manager",         department:"Finance & Accounts", email:"deepa.sharma@nexgen-tech.in",  phone:"+91 98450 67890" },
  { id:"C3", role:"Client Implementation Contact", name:"Kiran Nair",   designation:"Senior Product Manager",  department:"Product",            email:"kiran.nair@nexgen-tech.in",    phone:"+91 99001 23456" },
]
```

### Initial client/org state
```ts
// clientCompany
{ name: CRM_PREFILL.clientName, industry: "Information Technology", website: "www.nexgen-tech.in",
  headquarters: "Bangalore, Karnataka, India", companySize: "501–1000 employees",
  registrationNo: "U72900KA2015PTC081234", taxId: "29AABCN1234F1Z5", incorporationDate: "2015-03-12" }

// clientAccount
{ billingAddress: "No. 42, Koramangala 5th Block, Bangalore – 560095",
  accountNo: "ACCT-NXT-00482", paymentTerms: "Net 30", currency: "INR ₹",
  poNumber: "PO-2026-NXT-0091", poDate: "2026-05-28" }

// orgOwnership
{ salesRep: CRM_PREFILL.salesRep, accountManager: "Priya Desai", projectManager: "Rohit Verma",
  deliveryLead: "Sunita Rao", technicalLead: "Aditya Joshi", billingOwner: "Meena Pillai",
  supportLead: "", escalationManager: "Vikram Patel" }

// project
{ name: CRM_PREFILL.projectName, id: CRM_PREFILL.projectId, type: "Fixed Price", currency: "INR ₹",
  startDate: "2026-06-01", endDate: "2026-09-30", budget: CRM_PREFILL.dealValue,
  description: "Full-stack web application suite covering user management, notifications, analytics dashboard, and admin portal." }
```

### Billing calculations
```ts
const subtotal = billingItems.reduce((a, b) => a + b.qty * b.unitPrice, 0)
const taxRate = taxType.includes("18") ? 0.18 : taxType.includes("12") ? 0.12
  : taxType.includes("15") ? 0.15 : taxType.includes("5%") ? 0.05
  : taxType === "Tax Exempt" ? 0 : 0.18
const taxAmount = inclusiveTax ? subtotal * taxRate : 0
const grandTotal = inclusiveTax ? subtotal + taxAmount : subtotal
const totalPaymentPct = paymentMilestones.reduce((a, p) => a + p.pct, 0)
```

### Auto-save: restore (useEffect on mount)
Reads `pm_onboarding_draft`, restores all state objects. Migrates old `"Project POC"` role → `"Client Implementation Contact"` in contacts.

### Auto-save: persist (useEffect on every state change)
800ms debounce, serializes all state to `pm_onboarding_draft`. Shows `autoSaved = true` for 2 seconds.

### initiateProject()
```ts
const initiateProject = () => {
  const projectData = { projectName, projectId, clientName, clientIndustry, dealValue, budget, currency,
    projectType, startDate, endDate, description, salesRep, projectManager, accountManager,
    technicalLead, deliveryLead, billingOwner, milestones, risks, billingItems, paymentMilestones,
    contacts, grandTotal, taxType, inclusiveTax, initiatedAt: new Date().toISOString() }
  localStorage.setItem("pm_active_project", JSON.stringify(projectData))
  localStorage.removeItem("pm_scope_seed_ts")
  setSaved(true)
  setTimeout(() => { window.location.href = "/scope" }, 1200)
}
```

### Page layout (top to bottom)
1. **CRM Banner** — `bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white`
   - Left: trophy emoji, "Lead Won — Project Onboarding", "CRM Auto-Filled" badge, lead ID + closed date + sales rep text
   - When `autoSaved`: `✓ Auto-saved` animated pulse badge
   - Right: deal value (large), "Save & Initiate Project" button (white bg, green text)

2. **Section 1 — Project Details** (numbered indigo badge "1")
   - **Project details form** (white card):
     - Row 1: grid-cols-3 — Project Name, Project ID (read-only), Project Type
     - Row 2: grid-cols-4 — Currency, Budget, Start Date, End Date
     - Row 3: full-width textarea — Description
   - **Project Milestones** table: Milestone, Deliverable, Due Date, Status, Actions (Edit/Delete)
     - Inline add form on "+ Add Milestone" (indigo-50 bg)
     - Inline row edit on "Edit" button
   - **Project Cost Breakdown** table: Description, Category, Qty/Hrs, Unit Price, Amount, Actions
   - **Risk Register** table: Risk Description, Impact, Probability, Mitigation, Owner, Status, Actions

3. **Section 2 — Client Information** (numbered indigo badge "2")
   - **Client Company Information** — grid-cols-3: company name, industry, website, HQ, company size, incorporation date, registration no, GST/tax ID
   - **Client Billing Information** — grid-cols-3: billing address (col-span-3), account no, payment terms, billing currency, PO number, PO date
   - **Payment Milestones** table: name, % of total, INR amount (calculated from grandTotal), due date, status, actions
     - Footer: total % row (green if 100%, amber if <100%, red if >100%)
   - **Billing Details / Tax** panel: inclusive tax toggle (custom pill), tax type select, subtotal + tax + grand total display
   - **Client Contact Information** table: role badge (CONTACT_COLORS), name, designation, department, email, phone; inline editable fields; first 3 rows non-deletable
   - **Organizational Ownership** grid-cols-4: salesRep (read-only), accountManager, projectManager, deliveryLead, technicalLead, billingOwner, supportLead, escalationManager (all dropdowns)

4. **Save CTA** — indigo-50 panel: "Ready to initiate?" text + "Save & Initiate Project" button

### Inline edit / add pattern
Every table uses: `editX` state for current editing row (copy of item), `showAddX` boolean for add form. Edit row renders `<input>` instead of text, add form renders above table in `bg-indigo-50 border-b border-indigo-100`.

---

## Page: `app/scope/page.tsx` — Scope & Backlog
`"use client"`

### Types
```ts
type Item = {
  id: string; title: string; type: string; priority: string;
  assignee: string; assignedBy?: string; description?: string;
  startDate?: string; endDate?: string; documents?: string[];
  epicId?: string; sprintId?: string;
}
type Risk = { id: string; risk: string; impact: string; probability: string; mitigation: string; closeByDate: string; closed: boolean }
type Milestone = { id: string; name: string; date: string; status: string; items: number }
type Resource = {
  id: string; name: string; role: string;
  availability: "Available" | "Partial" | "Not Available";
  capacityHours: number; allocatedHours: number; skills: string[]; currentTasks: number;
}
```

### Constants
```ts
const AVAILABLE_SPRINTS = ["Sprint 1","Sprint 2","Sprint 3","Sprint 4","Sprint 5","Sprint 6","Sprint 7"]

// Full org pool — 14 people
const GLOBAL_RESOURCE_POOL: Resource[] = [
  { id:"res1",  name:"Rahul S.",  role:"Backend Lead",    availability:"Partial",       capacityHours:80, allocatedHours:60, skills:["Node.js","Auth","API"],            currentTasks:3 },
  { id:"res2",  name:"Priya M.",  role:"Frontend Dev",    availability:"Available",     capacityHours:80, allocatedHours:20, skills:["React","UI/UX","CSS"],             currentTasks:1 },
  { id:"res3",  name:"Amit K.",   role:"DevOps Engineer", availability:"Available",     capacityHours:80, allocatedHours:15, skills:["CI/CD","Docker","AWS"],            currentTasks:2 },
  { id:"res4",  name:"Sneha R.",  role:"UI/UX Designer",  availability:"Not Available", capacityHours:80, allocatedHours:80, skills:["Figma","Design","Wireframes"],     currentTasks:4 },
  { id:"res5",  name:"Vikram P.", role:"Full Stack Dev",  availability:"Partial",       capacityHours:80, allocatedHours:45, skills:["Redis","Research","Backend"],      currentTasks:2 },
  { id:"res6",  name:"Meera J.",  role:"QA Engineer",     availability:"Available",     capacityHours:80, allocatedHours:10, skills:["Testing","Automation","QA"],       currentTasks:0 },
  { id:"pool1", name:"Arjun K.",  role:"Mobile Developer",  availability:"Available",     capacityHours:80, allocatedHours:0,  skills:["React Native","iOS","Android"],    currentTasks:0 },
  { id:"pool2", name:"Nisha T.",  role:"Data Analyst",      availability:"Available",     capacityHours:80, allocatedHours:20, skills:["SQL","Power BI","Python"],         currentTasks:1 },
  { id:"pool3", name:"Karan S.",  role:"Security Engineer", availability:"Partial",       capacityHours:80, allocatedHours:40, skills:["Pen Testing","OWASP","Auth"],      currentTasks:2 },
  { id:"pool4", name:"Divya R.",  role:"Business Analyst",  availability:"Available",     capacityHours:80, allocatedHours:10, skills:["Requirements","BPMN","Docs"],      currentTasks:1 },
  { id:"pool5", name:"Rohan M.",  role:"Backend Dev",       availability:"Available",     capacityHours:80, allocatedHours:5,  skills:["Java","Spring Boot","Kafka"],      currentTasks:0 },
  { id:"pool6", name:"Anita P.",  role:"Scrum Master",      availability:"Available",     capacityHours:80, allocatedHours:30, skills:["Agile","Facilitation","Jira"],     currentTasks:3 },
  { id:"pool7", name:"Suresh B.", role:"Database Admin",    availability:"Not Available", capacityHours:80, allocatedHours:80, skills:["PostgreSQL","MongoDB","Redis"],    currentTasks:5 },
  { id:"pool8", name:"Pooja G.",  role:"Technical Writer",  availability:"Available",     capacityHours:80, allocatedHours:0,  skills:["Docs","API Docs","Confluence"],    currentTasks:0 },
]
const initialProjectResourceIds = ["res1","res2","res3","res4","res5","res6"]
```

### Fallback data
```ts
const fallbackBacklog: Item[] = [
  { id:"E-01", title:"User Management Module",                        type:"Epic",  priority:"High",   assignee:"Rahul S.",  assignedBy:"Vikram P.", description:"Full user lifecycle management including registration, login, roles and permissions.", startDate:"2026-05-01", endDate:"2026-06-30" },
  { id:"E-02", title:"Notification System",                           type:"Epic",  priority:"Medium", assignee:"Vikram P.", assignedBy:"Rahul S.",  description:"Email, push and in-app notification service.", startDate:"2026-06-01", endDate:"2026-07-15" },
  { id:"S-01", title:"As a user I can register with email/password",  type:"Story", priority:"High",   assignee:"Priya M.",  assignedBy:"Rahul S.",  startDate:"2026-05-10", endDate:"2026-05-20", documents:[], epicId:"E-01", sprintId:"Sprint 4" },
  { id:"S-02", title:"As a user I can login and receive JWT token",   type:"Story", priority:"High",   assignee:"Priya M.",  assignedBy:"Rahul S.",  startDate:"2026-05-20", endDate:"2026-05-25", documents:[], epicId:"E-01", sprintId:"Sprint 4" },
  { id:"T-01", title:"Setup project scaffolding and folder structure", type:"Task",  priority:"Medium", assignee:"Amit K.",   assignedBy:"Vikram P.", description:"Create base folder structure per architecture doc.", startDate:"2026-05-01", endDate:"2026-05-05", epicId:"E-01", sprintId:"Sprint 4" },
  { id:"T-02", title:"Configure CI/CD pipeline with GitHub Actions",  type:"Task",  priority:"Medium", assignee:"Amit K.",   assignedBy:"Vikram P.", description:"Setup automated build, test and deploy pipeline.", startDate:"2026-05-05", endDate:"2026-05-12", epicId:"E-01", sprintId:"Sprint 4" },
  { id:"B-01", title:"Login form doesn't validate on submit",         type:"Bug",   priority:"High",   assignee:"Sneha R.",  assignedBy:"Priya M.",  epicId:"E-01", sprintId:"Sprint 4" },
  { id:"R-01", title:"Evaluate Redis vs Memcached for caching layer", type:"R&N",   priority:"Low",    assignee:"Vikram P.", assignedBy:"Amit K.",   epicId:"E-02" },
  { id:"S-03", title:"As admin I can manage user roles and permissions", type:"Story", priority:"Medium", assignee:"Rahul S.", assignedBy:"Vikram P.", startDate:"2026-05-28", endDate:"2026-06-10", documents:[], epicId:"E-01", sprintId:"Sprint 5" },
]
const fallbackRisks: Risk[] = [
  { id:"R1", risk:"Third-party API rate limiting",  impact:"High",   probability:"Medium", mitigation:"Implement caching and retry logic", closeByDate:"2026-06-15", closed:false },
  { id:"R2", risk:"Team member unavailability",     impact:"Medium", probability:"Low",    mitigation:"Cross-train team members",         closeByDate:"2026-06-30", closed:false },
  { id:"R3", risk:"Scope creep from stakeholders",  impact:"High",   probability:"High",   mitigation:"Change request process",           closeByDate:"2026-05-31", closed:true  },
]
const fallbackMilestones: Milestone[] = [
  { id:"M1", name:"MVP Release",     date:"2026-06-15", status:"On Track", items:12 },
  { id:"M2", name:"Beta Launch",     date:"2026-07-30", status:"At Risk",  items:8  },
  { id:"M3", name:"v1.0 Production", date:"2026-09-01", status:"Planned",  items:20 },
]
```

### Seeding from onboarding (useEffect on mount)
```ts
// If pm_active_project exists and pm_scope_seed_ts is absent or older than p.initiatedAt:
// 1. Map p.milestones → Epic items (E-01, E-02, ...)
// 2. Map p.billingItems (dedupe by category) → Task items (T-01, T-02, ...)
// 3. Map p.risks → Risk items
// 4. Map p.milestones → Milestone cards
// 5. localStorage.setItem("pm_scope_seed_ts", p.initiatedAt)
// 6. setSeeded(true) → shows "✓ Seeded from Project Onboarding" badge
```

### Tabs: `["Backlog", "Risk Register", "Milestones & Releases", "Resources"]`

### Tab: Backlog
- Filter pills: All, Epic, Story, Task, Bug, R&N
- "+ Add Item" → inline form:
  - Type select + Priority select
  - Title input
  - Assignee select (from project resources, shows availability icon ✓/~/✗)
  - Assigned By select
  - Epic link select (epics in backlog)
  - Sprint select (AVAILABLE_SPRINTS)
  - Start/End Date (for Epics, Stories, Tasks)
  - Description textarea (for Epics, Tasks)
- Table columns: ID (underline clickable), Title + description + dates, Type badge, Priority badge, Epic Link badge (orange/mono), Sprint badge (indigo), Assignee (dot + name + role), Assigned By, Attachments (📎 for Stories), Actions
- **Edit Item Modal** (620px): all fields editable; Stories show document attachments (click area → 900ms fake upload adds `Doc_XXXX.pdf`)
- Footer: `N items · X epics · Y stories · Z tasks`

### Tab: Risk Register
- Table: ID, Risk Description, Impact, Probability, Mitigation, Close By, Status (clickable toggle Open↔Closed), Actions (Edit)
- Closed risks shown at 60% opacity
- Add form + inline row edit

### Tab: Milestones & Releases
- Cards (not table): status dot, name, target date, item count, status badge
- Status dot colors: On Track=green-500, At Risk=amber-500, Planned=slate-300
- Status badge: On Track=green-100/green-700, At Risk=amber-100/amber-700, Planned=slate-100/slate-500
- Inline edit card on "Edit"

### Tab: Resources
- Blue HR sync banner
- Summary grid-cols-4 cards: Project Team, Available (green), Partial (amber), Not Available (red)
- Table: avatar (initial letter in indigo circle), Name, Role, Availability badge, Capacity bar, Active Tasks, Skills chips, Edit + Remove buttons
- **Browse Resource Pool** modal (700px): search bar, checkboxes, capacity bars, skills; "Add N to Project" button; disabled if Not Available
- "Add Manually" inline form

### Availability styles
```ts
const availabilityStyle: Record<Resource["availability"], string> = {
  "Available":     "bg-green-100 text-green-700 border-green-200",
  "Partial":       "bg-amber-100 text-amber-700 border-amber-200",
  "Not Available": "bg-red-100 text-red-700 border-red-200",
}
const availabilityDot: Record<Resource["availability"], string> = {
  "Available":"bg-green-500", "Partial":"bg-amber-400", "Not Available":"bg-red-500"
}
```

### WBS / AI panel (always visible at top)
- Upload zone: click toggles `wbsUploaded`; when true shows "✓ WBS_ProjectAlpha_v2.xlsx uploaded"
- AI Generate button: disabled until `wbsUploaded`; 1.5s setTimeout then pushes AI-01, AI-02, AI-03 items
- PERT Estimation + Dev Estimate buttons: visual only (no action)

---

## Page: `app/planning/page.tsx` — Planning & Sprints
`"use client"`

### Types
```ts
type BoardType = "Scrum" | "Kanban" | "Waterfall"
type Sprint = {
  id: string; name: string; startDate: string; endDate: string;
  capacity: number; allocated: number; velocity: number;
  status: "Active" | "Planned" | "Completed"; boardType: BoardType;
  linkedMilestones: string[]; linkedEpics: string[]; linkedStories: string[]; linkedTasks: string[];
  stories: SprintStory[];
}
type SprintStory = {
  id: string; title: string; type: string;
  hours: number; hoursLogged: number; assignee: string; status: string;
  attachedStoryId?: string;
}
```

### Constants
```ts
const SPRINT_PROGRESS = [
  { name:"Sprint 1",          totalHrs:120, loggedHrs:118, tasks:15, done:15, velocity:34   },
  { name:"Sprint 2",          totalHrs:120, loggedHrs:115, tasks:13, done:12, velocity:30   },
  { name:"Sprint 3",          totalHrs:120, loggedHrs:102, tasks:11, done:10, velocity:28   },
  { name:"Sprint 4 (Active)", totalHrs:120, loggedHrs:46,  tasks:12, done:4,  velocity:null },
]
const MILESTONES = ["MVP Release","Beta Launch","v1.0 Production","Performance Audit"]
const ALL_EPICS = [
  { id:"E-01", title:"User Management Module" },
  { id:"E-02", title:"Notification System" },
  { id:"AI-03", title:"Build reporting dashboard" },
]
const ALL_STORIES = [
  { id:"S-01", title:"As a user I can register with email/password" },
  { id:"S-02", title:"As a user I can login and receive JWT token" },
  { id:"S-03", title:"As admin I can manage user roles and permissions" },
]
const ALL_TASKS = [
  { id:"T-01",  title:"Setup project scaffolding" },
  { id:"T-02",  title:"Configure CI/CD pipeline" },
  { id:"T-101", title:"Implement user authentication module" },
  { id:"T-103", title:"Setup CI/CD pipeline with GitHub Actions" },
  { id:"T-109", title:"API rate limiting middleware" },
]
const boardTypeStyle: Record<BoardType, string> = {
  Scrum: "bg-indigo-100 text-indigo-700",
  Kanban: "bg-teal-100 text-teal-700",
  Waterfall: "bg-amber-100 text-amber-700",
}
```

### Initial sprints
- SP-4 Sprint 4: Active, Scrum, 76/80h, linked MVP Release + E-01 + S-01/S-02 + T-101; 4 stories (S-01 In Progress, S-02 Done, T-01 In Progress, B-01 Done)
- SP-5 Sprint 5: Planned, Scrum, 45/80h, linked MVP Release+Beta Launch + E-01+E-02; 2 stories (S-03 To Do, R-01 To Do)
- SP-6 Sprint 6: Planned, Kanban, 0h, no links, no stories

### Derived metrics
```ts
const totalHours = selectedSprint.stories.reduce((a, s) => a + s.hours, 0)
const loggedHours = selectedSprint.stories.reduce((a, s) => a + s.hoursLogged, 0)
const remainingHours = totalHours - loggedHours
const overCapacity = selectedSprint.allocated > selectedSprint.capacity
const velocityPrediction = Math.round((selectedSprint.allocated / selectedSprint.capacity) * selectedSprint.velocity)
```

### Page layout
1. Header + "+ New Sprint / Phase" button
2. **New Sprint form** (collapsible): name, start date, end date, capacity, 3 board type selector cards with descriptions and Scrum warning
3. **Sprint cards** (grid-cols-4): capacity bar, status badge, board type badge, overshoot warning (red border+bg), epics/stories count
4. **Scrum validation warning** (if Active Scrum sprint missing epics or stories)
5. **Sprint Detail panel** (full width white card):
   - Header: sprint name + board type badge + milestones subtitle + "🔗 Link Items" + "+ Add Story" + "+ Add Task"
   - Linked chips strip (orange=epics, blue=stories, purple=tasks)
   - Add item form (inline, collapsible)
   - Table: ID (clickable→modal), Title, Type, Est. Hrs, Logged (green if complete), Status, Assignee, Attachment (📎 linked story)
   - Footer: items, total est, remaining (amber), logged (green)
6. **Sprint metrics row** (grid-cols-3): Metrics card, Linked Milestones card, All Sprints Timeline card
7. **Sprint Progress** (grid-cols-2): 4 sprint cards (red border if overshoot, indigo if active, green+border if done); each has hour progress bar + tasks done bar
8. **Sprint Hours Bar Chart** (SVG 600×240): paired bars per sprint, indigo=allocated, green/red=logged
9. **Sprint Velocity Chart** (SVG 600×210): bars with dashed trend line through completed sprints

### Modals
- **Item Detail Modal** (520px): type + ID, title, assignee, status, hours progress bar, board type, attached story details, story details if type=Story
- **Link Items Modal** (640px): checkboxes for Milestones (always required), Epics (mandatory Scrum / optional others), Stories (mandatory Scrum / optional), Tasks (optional all)

---

## Page: `app/board/page.tsx` — Task Board
`"use client"`

### Types
```ts
type BoardType = "Scrum" | "Kanban" | "Waterfall"
type TaskType = "Task" | "Epic" | "Bug" | "Story" | "Branch Bug" | "Sub-Task" | "R&N"
type Comment = { id: string; author: string; text: string; hoursLogged: number; timestamp: string }
type Task = {
  id: string; title: string; type: TaskType; status: string;
  assignee: string; assignedBy?: string; dueDate: string; priority: string;
  sprint: string; tags: string[]; subTasks?: string[]; epicId?: string; storyId?: string;
  documents?: string[]; estimatedHours: number; loggedHours: number; comments: Comment[];
}
type Epic = { id: string; title: string; description: string; startDate: string; endDate: string; status: string }
type Story = { id: string; title: string; epicId: string; status: string }
type Milestone = { id: string; name: string; date: string; status: string }
```

### Constants
```ts
const DEFAULT_WORKFLOW = ["To Do", "In Progress", "Review", "Testing", "Reopen", "Done", "Closed"]
const WATERFALL_PHASES = ["Requirements", "Design", "Development", "Testing", "Deployment"]
const STATUS_STYLES: Record<string, { bg: string; header: string; text: string }> = {
  "To Do":       { bg:"bg-slate-50 border-slate-200",   header:"bg-slate-400",  text:"text-slate-600" },
  "In Progress": { bg:"bg-blue-50 border-blue-200",     header:"bg-blue-500",   text:"text-blue-700"  },
  "Review":      { bg:"bg-purple-50 border-purple-200", header:"bg-purple-500", text:"text-purple-700"},
  "Testing":     { bg:"bg-amber-50 border-amber-200",   header:"bg-amber-500",  text:"text-amber-700" },
  "Reopen":      { bg:"bg-red-50 border-red-200",       header:"bg-red-500",    text:"text-red-700"   },
  "Done":        { bg:"bg-green-50 border-green-200",   header:"bg-green-500",  text:"text-green-700" },
  "Closed":      { bg:"bg-gray-50 border-gray-300",     header:"bg-gray-600",   text:"text-gray-700"  },
}
const priorityDot: Record<string, string> = { High:"bg-red-500", Medium:"bg-amber-400", Low:"bg-green-400" }
```

### 9 initial tasks
```ts
// Sprint 4 tasks:
T-101: Story, In Progress, Rahul S., 20 est / 23 logged (overshoot), 3 comments
T-102: Bug, Review, Priya M., 6 est / 5 logged, 1 comment
T-103: Task, To Do, Amit K., 12 est / 0 logged, 0 comments
T-104: Story, Done, Sneha R., 16 est / 16 logged, 2 comments
T-105: R&N, Testing, Vikram P., 10 est / 13.5 logged (overshoot), 2 comments
T-106: Sub-Task, In Progress, Priya M., 4 est / 2 logged
T-107: Branch Bug, Reopen, Amit K., 3 est / 4 logged (overshoot), 1 comment
// Sprint 5:
T-108: Story, To Do, Rahul S., 32 est / 0 logged
T-109: Task, To Do, Vikram P., 8 est / 0 logged
```

### Board state
```ts
const [boardType, setBoardType] = useState<BoardType>("Scrum")
const [selectedSprint, setSelectedSprint] = useState("Sprint 4")
const [tasks, setTasks] = useState<Task[]>(initialTasks)
const [selectedTask, setSelectedTask] = useState<Task | null>(null)
const [showEpicView, setShowEpicView] = useState(false)
const [showAddForm, setShowAddForm] = useState(false)
const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
```

### Layout
1. Header: title, board type selector (Scrum/Kanban/Waterfall tabs), sprint selector dropdown, "Epic View" toggle button, "+ Add Task" button
2. **Kanban board** (horizontal scroll): each column = `w-72 shrink-0 rounded-xl border-2`
   - Column header: colored stripe + status label + task count badge
   - Task cards (draggable simulation — no actual DnD library):
     - Type badge + priority dot + title
     - Epic badge (if linked), sprint tag
     - Assignee chip + due date
     - Mini progress bar (logged/estimated %)
     - Overshoot `⚠` warning if over
     - Tags as small chips
     - Comment count
     - Click → Task Detail Modal
3. **Epic View** (when toggled): swimlanes grouped by epic

### Task Detail Modal (600px)
- Header: type badge, ID, priority dot, title
- Body grid: assignee, assigned by, sprint, epic link, story link, due date, tags
- **Hours & Comments** (key feature):
  - `loggedHours / estimatedHours h` + progress bar
  - Red overshoot warning if logged > estimated
  - Comments list (scrollable): author, timestamp, text, hours-logged badge
  - "Log Hours + Comment" form: number input + textarea + "Add Log" button
  - On save: increment `task.loggedHours`, add comment to front of `task.comments`
- Status select: moves task to different column (updates task.status in state)
- Documents section for Story/Task types
- Sub-tasks checklist

### localStorage sync (board)
When hours logged, compute new totals per user and write to `pm_logged_hours_by_user` and update `pm_overtime_by_user`.

---

## Page: `app/tracking/page.tsx` — Time Tracking
`"use client"`

### Type
```ts
type TimeEntry = {
  id: string; taskId: string; taskTitle: string; taskType: string;
  date: string; hours: number; user: string; comment: string; sprint: string;
}
```

### Members
`const BASE_MEMBERS = ["Rahul S.", "Priya M.", "Amit K.", "Sneha R.", "Vikram P."]`

### 80+ initial entries across 4 sprints
Sprint totals: Sprint 1 = 118h, Sprint 2 = 115h, Sprint 3 = 102h, Sprint 4 = 23h (active)
Each entry: id (L-XXX), taskId, taskTitle, taskType, date (YYYY-MM-DD), hours (2-8), user, comment, sprint

Sprint 4 entries (L-401 to L-406):
```ts
{ id:"L-401", taskId:"T-101", taskTitle:"Implement user authentication", taskType:"Story", date:"2026-05-21", hours:4, user:"Rahul S.",  comment:"Completed JWT signing logic",         sprint:"Sprint 4" },
{ id:"L-402", taskId:"T-102", taskTitle:"Fix login redirect bug",         taskType:"Bug",   date:"2026-05-21", hours:2, user:"Priya M.",  comment:"Root cause identified, fix in review", sprint:"Sprint 4" },
{ id:"L-403", taskId:"T-105", taskTitle:"Redis evaluation",               taskType:"R&N",   date:"2026-05-20", hours:6, user:"Vikram P.", comment:"Benchmarks done, Redis preferred",     sprint:"Sprint 4" },
{ id:"L-404", taskId:"T-103", taskTitle:"Setup CI/CD pipeline",           taskType:"Task",  date:"2026-05-20", hours:3, user:"Amit K.",   comment:"GitHub Actions workflow created",      sprint:"Sprint 4" },
{ id:"L-405", taskId:"T-104", taskTitle:"Design dashboard wireframes",    taskType:"Story", date:"2026-05-19", hours:5, user:"Sneha R.",  comment:"All screens completed in Figma",       sprint:"Sprint 4" },
{ id:"L-406", taskId:"T-101", taskTitle:"Implement user authentication",  taskType:"Story", date:"2026-05-19", hours:3, user:"Rahul S.",  comment:"Refresh token endpoint setup",         sprint:"Sprint 4" },
```

### localStorage sync (useEffect on entries change)
```ts
// Compute totals:
const hoursByUser = entries.reduce((acc, e) => ({ ...acc, [e.user]: (acc[e.user] ?? 0) + e.hours }), {})
const hoursBySprint = entries.reduce((acc, e) => ({ ...acc, [e.sprint]: (acc[e.sprint] ?? 0) + e.hours }), {})
localStorage.setItem("pm_logged_hours_by_user", JSON.stringify(hoursByUser))
localStorage.setItem("pm_hours_by_sprint", JSON.stringify(hoursBySprint))
```

### Tabs: Log, Timesheets, Analytics

### Tab: Log
- Filter bar: User (All + members), Sprint (All + Sprint 1-4), Task Type (All + Story/Task/Bug/R&N/Epic)
- "+ Add Time Log" form: Task ID, Task Title, Task Type, Date, Hours (number), User (select), Comment, Sprint
- Table: Task ID (indigo mono), Task Title, Type badge, Date, Hours (bold indigo; >8 red, >6 amber), User, Sprint, Comment
- Footer: N entries · X.Yh total · avg per entry

### Tab: Timesheets
- User tabs (one per member)
- Per-user: grouped by sprint, shows each entry as a row, subtotals per sprint
- Or weekly calendar view showing hours per day

### Tab: Analytics
- Stat cards: Total Hours, Total Entries, Active Members, Sprints Tracked
- Hours by user: horizontal bars
- Sprint hours trend: SVG bar chart comparing sprints
- Hours by task type: breakdown chart

---

## Page: `app/salary/page.tsx` — Salary Cost
`"use client"`

### Types
```ts
type Availability = "Available" | "Partial" | "Not Available"
type ProjectResource = {
  id: string; name: string; role: string; avatar: string; // single letter
  availability: Availability;
  allocatedHours: number;        // hours allocated to project per sprint
  sprintCapacity: number;        // total sprint capacity
  monthlySalary: number;         // gross monthly salary (INR)
  workingHoursPerMonth: number;  // default 160
}
```

### Initial resources
```ts
{ id:"r1", name:"Rahul S.",  role:"Backend Lead",    avatar:"R", availability:"Partial",       allocatedHours:60, sprintCapacity:80, monthlySalary:160000, workingHoursPerMonth:160 },
{ id:"r2", name:"Priya M.",  role:"Frontend Dev",    avatar:"P", availability:"Available",     allocatedHours:80, sprintCapacity:80, monthlySalary:140000, workingHoursPerMonth:160 },
{ id:"r3", name:"Amit K.",   role:"DevOps Engineer", avatar:"A", availability:"Available",     allocatedHours:80, sprintCapacity:80, monthlySalary:150000, workingHoursPerMonth:160 },
{ id:"r4", name:"Sneha R.",  role:"UI/UX Designer",  avatar:"S", availability:"Not Available", allocatedHours:0,  sprintCapacity:80, monthlySalary:120000, workingHoursPerMonth:160 },
{ id:"r5", name:"Vikram P.", role:"Full Stack Dev",  avatar:"V", availability:"Partial",       allocatedHours:45, sprintCapacity:80, monthlySalary:180000, workingHoursPerMonth:160 },
{ id:"r6", name:"Meera J.",  role:"QA Engineer",     avatar:"M", availability:"Available",     allocatedHours:80, sprintCapacity:80, monthlySalary:100000, workingHoursPerMonth:160 },
```

### Calculations
```ts
function ratePerHour(r: ProjectResource) { return r.monthlySalary / r.workingHoursPerMonth }
// projectCost = ratePerHour × projectHoursLogged (from localStorage pm_logged_hours_by_user)
// projectedMonthlyCost = ratePerHour × allocatedHours
// overtimeCost = ratePerHour × overtimeHours × 1.5
```

### Pre-computed initial values
```ts
const INITIAL_PROJECT_HOURS: Record<string, number> = {
  "Rahul S.":73, "Priya M.":69, "Amit K.":62, "Vikram P.":85, "Sneha R.":64,
}
// Overtime hours (from board task overshoots)
const [overtimeByUser] = useState({ "Rahul S.":3, "Vikram P.":3.5, "Amit K.":1 })
```

### localStorage read + publish
- On mount: reads `pm_logged_hours_by_user` (updates projectHours state) and `pm_overtime_by_user`
- On every resource change: writes `pm_salary_rates` and `pm_salary_allocated`

### Layout
1. Header: "Salary & Resource Cost" title
2. **Summary KPI cards** (grid-cols-4):
   - Total Monthly Payroll (sum of all monthlySalaries)
   - Project Cost To Date (sum of ratePerHour × projectHours for each user)
   - Overtime Cost (sum of ratePerHour × 1.5 × overtimeHours)
   - Avg Rate / Hour (weighted average)
3. **Resource Cost Table**:
   - Avatar (indigo circle with initial), Name, Role, Availability badge
   - Monthly Salary (editable in edit mode)
   - Working Hrs/Month (editable)
   - Rate/Hr (computed, read-only)
   - Project Hrs Logged (from localStorage)
   - Project Cost To Date (computed)
   - Projected Monthly Cost (ratePerHour × allocatedHours)
   - Overtime Hrs + Cost
   - Edit/Save/Cancel actions
4. Total row (bold) at bottom
5. Charts section (grid-cols-2): cost breakdown per person, payroll vs project cost comparison

---

## Page: `app/project-cost/page.tsx` — Project Cost Overview
`"use client"`

### Currency & billing month selectors
```ts
const CURRENCIES = [
  { symbol:"₹", code:"INR" }, { symbol:"$", code:"USD" }, { symbol:"€", code:"EUR" },
  { symbol:"£", code:"GBP" }, { symbol:"¥", code:"JPY" }, { symbol:"د.إ", code:"AED" },
  { symbol:"S$", code:"SGD" }, { symbol:"A$", code:"AUD" }, { symbol:"C$", code:"CAD" },
]
const BILLING_MONTHS = ["2026-03","2026-04","2026-05","2026-06","2026-07","2026-08","2026-09"]
const SPRINT_CONFIG = [
  { sprint:"Sprint 1", estHours:120, status:"Completed" },
  { sprint:"Sprint 2", estHours:120, status:"Completed" },
  { sprint:"Sprint 3", estHours:120, status:"Completed" },
  { sprint:"Sprint 4", estHours:120, status:"Active"    },
  { sprint:"Sprint 5", estHours:120, status:"Planned"   },
  { sprint:"Sprint 6", estHours:120, status:"Planned"   },
]
```

### Fallback data (when localStorage empty)
```ts
FALLBACK_RATES = { "Rahul S.":{monthlySalary:160000,workingHoursPerMonth:160,ratePerHour:1000}, … }
FALLBACK_HOURS_BY_USER = { "Rahul S.":73, "Priya M.":69, "Amit K.":62, "Vikram P.":85, "Sneha R.":64 }
FALLBACK_HOURS_BY_SPRINT = { "Sprint 1":118, "Sprint 2":115, "Sprint 3":102, "Sprint 4":23 }
FALLBACK_ALLOC = { "Rahul S.":60, "Priya M.":80, "Amit K.":80, "Sneha R.":0, "Vikram P.":45 }
```

### Working days helper
```ts
function getWorkingDays(yearMonth: string): number {
  const [year, month] = yearMonth.split("-").map(Number)
  let count = 0
  for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
    const dow = new Date(year, month - 1, day).getDay()
    if (dow !== 0 && dow !== 6) count++
  }
  return count
}
```

### localStorage read (useEffect on mount)
Reads and merges: `pm_salary_rates`, `pm_salary_allocated`, `pm_logged_hours_by_user`, `pm_hours_by_sprint`. Falls back to FALLBACK values.

### Layout
1. **Header**: currency selector + billing month selector (right-aligned)
2. **KPI cards** (grid-cols-4):
   - Total Project Budget (from pm_active_project.budget, formatted in selected currency)
   - Cost Incurred To Date (sum of ratePerHour × loggedHours per user)
   - Budget Remaining (budget - incurred)
   - Budget Utilization % with mini progress bar (red if >90%)
3. **Cost by Sprint table**:
   - Sprint name, Status badge, Est. Hours, Actual Hours (from FALLBACK_HOURS_BY_SPRINT / LS), Cost (avg rate × actual hours), overshoot indicator
   - Footer totals row
4. **Cost by Resource table**:
   - Name, Role, Rate/Hr, Logged Hours, Cost To Date, Allocated Hours (sprint), Projected Monthly
5. **Working Days section** (for selected billing month):
   - Shows working days count, daily rate per resource, projected monthly cost per resource
6. **Charts** (grid-cols-2):
   - Budget allocation (from onboarding billing items — pie/bar)
   - Cost trend by sprint (estimated vs actual bars)

---

## Implementation Rules for Claude Code

### "use client" rule
Only add to files using: `useState`, `useEffect`, `useRef`, `usePathname`, `useRouter`, or `localStorage`/`window`. Root layout and page-level server components must NOT have it.

### Simulate everything (no backend)
- File uploads: click handler toggles a boolean or pushes a fake filename after `setTimeout`
- AI generation: `setTimeout(1500)` then push pre-defined items to state array
- "Save & Initiate": `localStorage.setItem(...)` then `window.location.href = "/scope"`

### CRUD table pattern (consistent across all pages)
1. `showAdd` boolean → renders indigo-50 inline form above table
2. `editingId` string (or `editX` object) → matching row renders `<input>`/`<select>` instead of text
3. Save: commit state, clear editing
4. Cancel: clear editing without saving
5. Delete: filter item from array

### Modal pattern
```tsx
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(null)}>
  <div className="bg-white rounded-2xl shadow-2xl w-[Xpx] max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
    …
  </div>
</div>
```

### SVG Charts (no external chart library)
Use raw `<svg>` with manual coordinate math. Planning page has working examples of bar and line charts. Pattern: `viewBox="0 0 600 240"`, gridlines as `<line>`, bars as `<rect>`, labels as `<text>`, trend as `<path>`.

### Tailwind v4
`globals.css` needs only: `@import "tailwindcss";`
Use utility classes only — no `@apply` in components. All Tailwind v4 classes work as expected.

---

## Dev Commands
```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
npm run dev      # http://localhost:3000
npm run build
npm start
npm run lint
```

## GitHub
`https://github.com/SharinaIprofit/onboarding` — branch `main`
