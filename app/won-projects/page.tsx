"use client";
import { useState, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Stage = "Lead" | "Proposal" | "Negotiation" | "Won" | "Converted";

type DeliveryHealth = {
  health: "On Track" | "At Risk" | "Delayed";
  milestoneDone: number;
  milestoneTotal: number;
  invoiceReceived: number;
  invoiceTotal: number;
};
type DealSource = "CRM" | "Government RFP";
type ProjectType = "Fixed Price" | "Time & Material" | "Bot Development" | "SaaS" | "Retainer" | "Milestone-Based";

type WBSItem = { id: string; code: string; title: string; type: string; hours: number; category: string };

type CRMProject = {
  id: string;
  name: string;
  projectId: string;
  projectType: ProjectType;
  dealSource: DealSource;
  stage: Stage;
  client: { name: string; industry: string; website: string; headquarters: string; companySize: string; registrationNo: string; taxId: string; incorporationDate: string };
  clientContact: { name: string; designation: string; department: string; email: string; phone: string };
  billingInfo: { address: string; accountNo: string; paymentTerms: string; poNumber: string; poDate: string };
  spoc: string;
  spocRole: string;
  salesRep: string;
  totalCost: number;
  currency: string;
  deliveryMonths: number;
  startDate: string;
  endDate: string;
  agreementSigned: boolean;
  agreementRef: string;
  agreementDate: string;
  closedDate: string;
  notes: string;
  wbsItems: WBSItem[];
  milestones: { id: string; name: string; dueDate: string; deliverable: string; status: string }[];
  risks: { id: string; description: string; impact: string; probability: string; mitigation: string; owner: string; status: string }[];
  billingItems: { id: string; description: string; category: string; qty: number; unitPrice: number }[];
  paymentMilestones: { id: string; name: string; pct: number; dueDate: string; status: string }[];
  contacts: { id: string; role: string; name: string; designation: string; department: string; email: string; phone: string }[];
  orgOwnership: { salesRep: string; accountManager: string; projectManager: string; deliveryLead: string; technicalLead: string; billingOwner: string; supportLead: string; escalationManager: string };
  convertedDate?: string;
  convertedSource?: string;
};

// ── Static data ────────────────────────────────────────────────────────────
const INITIAL_PROJECTS: CRMProject[] = [
  {
    id: "WP-001", name: "Alpha Web Application Suite", projectId: "PRJ-2026-0048",
    projectType: "Fixed Price", dealSource: "CRM", stage: "Won",
    client: { name: "Nexgen Technologies Pvt. Ltd.", industry: "Information Technology", website: "www.nexgen-tech.in", headquarters: "Bangalore, Karnataka", companySize: "501–1000 employees", registrationNo: "U72900KA2015PTC081234", taxId: "29AABCN1234F1Z5", incorporationDate: "2015-03-12" },
    clientContact: { name: "Rajesh Kumar", designation: "Chief Executive Officer", department: "Executive", email: "rajesh.kumar@nexgen-tech.in", phone: "+91 98450 12345" },
    billingInfo: { address: "No. 42, Koramangala 5th Block, Bangalore – 560095", accountNo: "ACCT-NXT-00482", paymentTerms: "Net 30", poNumber: "PO-2026-NXT-0091", poDate: "2026-05-28" },
    spoc: "Arjun Mehta", spocRole: "Sales Manager", salesRep: "Arjun Mehta",
    totalCost: 1850000, currency: "INR ₹", deliveryMonths: 4,
    startDate: "2026-06-01", endDate: "2026-09-30",
    agreementSigned: true, agreementRef: "AGR-2026-NXT-0091", agreementDate: "2026-05-28", closedDate: "2026-05-26",
    notes: "Full-stack web application suite covering user management, notifications, analytics dashboard, and admin portal.",
    wbsItems: [
      { id: "W-E01", code: "1.0", title: "User Management Module", type: "Epic", hours: 240, category: "Development" },
      { id: "W-E02", code: "2.0", title: "Notification System", type: "Epic", hours: 120, category: "Development" },
      { id: "W-S01", code: "1.1", title: "User Registration & Authentication", type: "Story", hours: 40, category: "Backend" },
      { id: "W-S02", code: "1.2", title: "Role-Based Access Control", type: "Story", hours: 32, category: "Backend" },
      { id: "W-T01", code: "0.1", title: "Project Scaffolding & CI/CD", type: "Task", hours: 24, category: "DevOps" },
      { id: "W-T02", code: "0.2", title: "UI/UX Design & Wireframes", type: "Task", hours: 48, category: "Design" },
    ],
    milestones: [
      { id: "M1", name: "Project Kickoff", dueDate: "2026-06-05", deliverable: "Kickoff meeting & signed SOW", status: "Planned" },
      { id: "M2", name: "Requirements Freeze", dueDate: "2026-06-20", deliverable: "BRD & FRD documents", status: "Planned" },
      { id: "M3", name: "MVP Delivery", dueDate: "2026-08-15", deliverable: "Working MVP on staging", status: "Planned" },
      { id: "M4", name: "UAT Sign-off", dueDate: "2026-09-10", deliverable: "Signed UAT report", status: "Planned" },
      { id: "M5", name: "Go Live", dueDate: "2026-09-30", deliverable: "Production deployment", status: "Planned" },
    ],
    risks: [
      { id: "R1", description: "Scope creep from client change requests", impact: "High", probability: "High", mitigation: "Enforce formal change request process with sign-off", owner: "Project Manager", status: "Open" },
      { id: "R2", description: "Delay in client feedback cycles", impact: "Medium", probability: "Medium", mitigation: "Weekly review cadence; 3-day SLA on approvals", owner: "Project Manager", status: "Open" },
      { id: "R3", description: "Third-party API integration failure", impact: "High", probability: "Low", mitigation: "Mock APIs in parallel; fallback strategy documented", owner: "Tech Lead", status: "Open" },
    ],
    billingItems: [
      { id: "B1", description: "Web Application Development (Frontend + Backend)", category: "Development", qty: 1000, unitPrice: 1200 },
      { id: "B2", description: "UI/UX Design & Prototyping", category: "Design", qty: 200, unitPrice: 900 },
      { id: "B3", description: "DevOps & Infrastructure Setup", category: "Infrastructure", qty: 120, unitPrice: 1100 },
      { id: "B4", description: "QA & Testing", category: "Testing", qty: 160, unitPrice: 800 },
      { id: "B5", description: "Project Management & Consulting", category: "Consulting", qty: 140, unitPrice: 1500 },
    ],
    paymentMilestones: [
      { id: "P1", name: "Advance on Agreement Signing", pct: 25, dueDate: "2026-06-05", status: "Pending" },
      { id: "P2", name: "On Requirements Freeze", pct: 20, dueDate: "2026-06-20", status: "Pending" },
      { id: "P3", name: "On MVP Delivery", pct: 30, dueDate: "2026-08-15", status: "Pending" },
      { id: "P4", name: "On UAT Sign-off", pct: 15, dueDate: "2026-09-10", status: "Pending" },
      { id: "P5", name: "On Go Live", pct: 10, dueDate: "2026-09-30", status: "Pending" },
    ],
    contacts: [
      { id: "C1", role: "Signing Authority", name: "Rajesh Kumar", designation: "Chief Executive Officer", department: "Executive", email: "rajesh.kumar@nexgen-tech.in", phone: "+91 98450 12345" },
      { id: "C2", role: "Accounts POC", name: "Deepa Sharma", designation: "Finance Manager", department: "Finance & Accounts", email: "deepa.sharma@nexgen-tech.in", phone: "+91 98450 67890" },
      { id: "C3", role: "Client Implementation Contact", name: "Kiran Nair", designation: "Senior Product Manager", department: "Product", email: "kiran.nair@nexgen-tech.in", phone: "+91 99001 23456" },
    ],
    orgOwnership: { salesRep: "Arjun Mehta", accountManager: "Priya Desai", projectManager: "Rohit Verma", deliveryLead: "Sunita Rao", technicalLead: "Aditya Joshi", billingOwner: "Meena Pillai", supportLead: "", escalationManager: "Vikram Patel" },
  },
  {
    id: "WP-002", name: "Smart City Digital Governance Portal", projectId: "PRJ-2026-0051",
    projectType: "Fixed Price", dealSource: "Government RFP", stage: "Won",
    client: { name: "Ministry of Urban Development", industry: "Government", website: "www.urbandev.gov.in", headquarters: "New Delhi", companySize: "Government Entity", registrationNo: "GOV-UD-MH-2005", taxId: "07AAACG9999A1ZZ", incorporationDate: "2005-01-01" },
    clientContact: { name: "Dr. Suresh Iyer", designation: "Project Director", department: "IT & Digital Services", email: "suresh.iyer@urbandev.gov.in", phone: "+91 11 2303 6000" },
    billingInfo: { address: "Urban Development Ministry, Nirman Bhavan, New Delhi – 110011", accountNo: "ACCT-GOV-00099", paymentTerms: "Net 45", poNumber: "RFP-GOV-2026-UD-0044", poDate: "2026-06-10" },
    spoc: "Priya Desai", spocRole: "Account Manager", salesRep: "Priya Desai",
    totalCost: 4500000, currency: "INR ₹", deliveryMonths: 8,
    startDate: "2026-07-01", endDate: "2027-02-28",
    agreementSigned: false, agreementRef: "RFP-GOV-2026-UD-0044", agreementDate: "", closedDate: "2026-06-10",
    notes: "Government portal for citizen services, grievance redressal, and smart city dashboard. Agreement pending final government committee approval.",
    wbsItems: [
      { id: "G-E01", code: "1.0", title: "Citizen Services Portal", type: "Epic", hours: 400, category: "Development" },
      { id: "G-E02", code: "2.0", title: "Admin & Governance Dashboard", type: "Epic", hours: 320, category: "Development" },
      { id: "G-S01", code: "1.1", title: "Citizen Registration & eKYC", type: "Story", hours: 60, category: "Backend" },
      { id: "G-T01", code: "0.1", title: "Security Audit & Compliance Setup", type: "Task", hours: 80, category: "Security" },
    ],
    milestones: [
      { id: "M1", name: "Agreement Sign-off", dueDate: "2026-07-05", deliverable: "Signed agreement & PO", status: "Planned" },
      { id: "M2", name: "Phase 1 — Citizen Portal", dueDate: "2026-10-15", deliverable: "Citizen portal on staging", status: "Planned" },
      { id: "M3", name: "Phase 2 — Admin Dashboard", dueDate: "2026-12-20", deliverable: "Admin module UAT", status: "Planned" },
      { id: "M4", name: "Go Live", dueDate: "2027-02-28", deliverable: "Full production launch", status: "Planned" },
    ],
    risks: [
      { id: "R1", description: "Government approval delays", impact: "High", probability: "Medium", mitigation: "Regular follow-up with nodal officer; buffer in timeline", owner: "Project Manager", status: "Open" },
      { id: "R2", description: "Data privacy compliance (IT Act 2000)", impact: "High", probability: "Low", mitigation: "Legal review and DPA documentation", owner: "Tech Lead", status: "Open" },
    ],
    billingItems: [
      { id: "B1", description: "Phase 1 — Citizen Services Portal", category: "Development", qty: 2000, unitPrice: 1100 },
      { id: "B2", description: "Phase 2 — Admin & Governance Module", category: "Development", qty: 1500, unitPrice: 1100 },
      { id: "B3", description: "Security Audit & Penetration Testing", category: "Testing", qty: 200, unitPrice: 1500 },
    ],
    paymentMilestones: [
      { id: "P1", name: "On Agreement Signing", pct: 20, dueDate: "2026-07-05", status: "Pending" },
      { id: "P2", name: "Phase 1 Delivery", pct: 35, dueDate: "2026-10-15", status: "Pending" },
      { id: "P3", name: "Phase 2 Delivery", pct: 30, dueDate: "2026-12-20", status: "Pending" },
      { id: "P4", name: "Final Go Live", pct: 15, dueDate: "2027-02-28", status: "Pending" },
    ],
    contacts: [
      { id: "C1", role: "Signing Authority", name: "Dr. Suresh Iyer", designation: "Project Director", department: "IT & Digital", email: "suresh.iyer@urbandev.gov.in", phone: "+91 11 2303 6000" },
      { id: "C2", role: "Accounts POC", name: "Anand Mehrotra", designation: "Finance Controller", department: "Finance", email: "anand.mehrotra@urbandev.gov.in", phone: "+91 11 2303 6100" },
    ],
    orgOwnership: { salesRep: "Priya Desai", accountManager: "Rohit Verma", projectManager: "Sunita Rao", deliveryLead: "Aditya Joshi", technicalLead: "Aditya Joshi", billingOwner: "Meena Pillai", supportLead: "", escalationManager: "Vikram Patel" },
  },
  {
    id: "WP-003", name: "FinTrack Mobile Banking App", projectId: "PRJ-2026-0039",
    projectType: "Time & Material", dealSource: "CRM", stage: "Converted",
    client: { name: "CapFirst Financial Services Ltd.", industry: "Banking & Finance", website: "www.capfirst.in", headquarters: "Mumbai, Maharashtra", companySize: "201–500 employees", registrationNo: "U65100MH2010PLC201234", taxId: "27AABCC1234G1ZR", incorporationDate: "2010-06-15" },
    clientContact: { name: "Meera Nambiar", designation: "VP — Digital Products", department: "Digital Banking", email: "meera.nambiar@capfirst.in", phone: "+91 99001 55678" },
    billingInfo: { address: "CapFirst House, BKC, Mumbai – 400051", accountNo: "ACCT-CAP-00331", paymentTerms: "Net 15", poNumber: "PO-2026-CAP-0072", poDate: "2026-03-25" },
    spoc: "Rohit Verma", spocRole: "Business Development", salesRep: "Rohit Verma",
    totalCost: 1200000, currency: "INR ₹", deliveryMonths: 3,
    startDate: "2026-04-01", endDate: "2026-06-30",
    agreementSigned: true, agreementRef: "AGR-2026-CAP-0072", agreementDate: "2026-03-25", closedDate: "2026-03-20",
    notes: "React Native mobile app for retail banking. Already converted and in active development.",
    wbsItems: [
      { id: "F-E01", code: "1.0", title: "Core Banking Mobile App", type: "Epic", hours: 200, category: "Mobile" },
      { id: "F-S01", code: "1.1", title: "Account Dashboard & Transactions", type: "Story", hours: 40, category: "Mobile" },
    ],
    milestones: [
      { id: "M1", name: "Alpha Release", dueDate: "2026-05-15", deliverable: "Internal alpha build", status: "Completed" },
      { id: "M2", name: "Beta Release", dueDate: "2026-06-15", deliverable: "Beta on TestFlight", status: "In Progress" },
      { id: "M3", name: "App Store Launch", dueDate: "2026-06-30", deliverable: "Public launch", status: "Planned" },
    ],
    risks: [],
    billingItems: [
      { id: "B1", description: "Mobile App Development (React Native)", category: "Development", qty: 600, unitPrice: 1400 },
      { id: "B2", description: "Backend API & Integration", category: "Development", qty: 200, unitPrice: 1200 },
    ],
    paymentMilestones: [
      { id: "P1", name: "Advance", pct: 30, dueDate: "2026-04-01", status: "Received" },
      { id: "P2", name: "Alpha Delivery", pct: 40, dueDate: "2026-05-15", status: "Received" },
      { id: "P3", name: "Go Live", pct: 30, dueDate: "2026-06-30", status: "Pending" },
    ],
    contacts: [
      { id: "C1", role: "Signing Authority", name: "Meera Nambiar", designation: "VP — Digital Products", department: "Digital Banking", email: "meera.nambiar@capfirst.in", phone: "+91 99001 55678" },
    ],
    orgOwnership: { salesRep: "Rohit Verma", accountManager: "Priya Desai", projectManager: "Sunita Rao", deliveryLead: "Sunita Rao", technicalLead: "Aditya Joshi", billingOwner: "Meena Pillai", supportLead: "", escalationManager: "" },
    convertedDate: "2026-03-26", convertedSource: "CRM",
  },
  {
    id: "WP-004", name: "EduSmart Learning Management Platform", projectId: "PRJ-2026-0057",
    projectType: "Milestone-Based", dealSource: "CRM", stage: "Won",
    client: { name: "EduSmart Pvt. Ltd.", industry: "EdTech", website: "www.edusmart.co.in", headquarters: "Bangalore, Karnataka", companySize: "51–200 employees", registrationNo: "U80100KA2018PTC098765", taxId: "29AABCE5678H1ZT", incorporationDate: "2018-09-20" },
    clientContact: { name: "Ananya Krishnan", designation: "Chief Product Officer", department: "Product & Technology", email: "ananya.k@edusmart.co.in", phone: "+91 80 4567 8901" },
    billingInfo: { address: "EduSmart HQ, Whitefield, Bangalore – 560066", accountNo: "ACCT-EDU-00218", paymentTerms: "Milestone-Based", poNumber: "PO-2026-EDU-0018", poDate: "2026-06-15" },
    spoc: "Sunita Rao", spocRole: "Delivery Lead", salesRep: "Sunita Rao",
    totalCost: 2800000, currency: "INR ₹", deliveryMonths: 6,
    startDate: "2026-08-01", endDate: "2027-01-31",
    agreementSigned: true, agreementRef: "AGR-2026-EDU-0018", agreementDate: "2026-06-15", closedDate: "2026-06-12",
    notes: "Full LMS with live classes, assessments, progress tracking, and AI-powered personalised learning paths.",
    wbsItems: [
      { id: "L-E01", code: "1.0", title: "Course Management System", type: "Epic", hours: 320, category: "Development" },
      { id: "L-E02", code: "2.0", title: "Assessment & Quiz Engine", type: "Epic", hours: 200, category: "Development" },
      { id: "L-E03", code: "3.0", title: "AI Personalisation Module", type: "Epic", hours: 160, category: "AI/ML" },
    ],
    milestones: [
      { id: "M1", name: "Phase 1 — Core LMS", dueDate: "2026-10-15", deliverable: "Course creation & enrolment live", status: "Planned" },
      { id: "M2", name: "Phase 2 — Assessments", dueDate: "2026-11-30", deliverable: "Quiz engine + grading", status: "Planned" },
      { id: "M3", name: "Phase 3 — AI Features", dueDate: "2027-01-15", deliverable: "Personalised learning paths", status: "Planned" },
      { id: "M4", name: "Go Live", dueDate: "2027-01-31", deliverable: "Full platform launch", status: "Planned" },
    ],
    risks: [
      { id: "R1", description: "AI model accuracy below threshold", impact: "Medium", probability: "Medium", mitigation: "Pre-trained models with fine-tuning; accuracy KPIs defined", owner: "Tech Lead", status: "Open" },
    ],
    billingItems: [
      { id: "B1", description: "Core LMS Development", category: "Development", qty: 1200, unitPrice: 1300 },
      { id: "B2", description: "AI/ML Module Development", category: "Development", qty: 400, unitPrice: 1800 },
      { id: "B3", description: "QA & Testing", category: "Testing", qty: 200, unitPrice: 900 },
    ],
    paymentMilestones: [
      { id: "P1", name: "Advance", pct: 25, dueDate: "2026-08-01", status: "Pending" },
      { id: "P2", name: "Phase 1", pct: 30, dueDate: "2026-10-15", status: "Pending" },
      { id: "P3", name: "Phase 2", pct: 25, dueDate: "2026-11-30", status: "Pending" },
      { id: "P4", name: "Go Live", pct: 20, dueDate: "2027-01-31", status: "Pending" },
    ],
    contacts: [
      { id: "C1", role: "Signing Authority", name: "Ananya Krishnan", designation: "Chief Product Officer", department: "Product", email: "ananya.k@edusmart.co.in", phone: "+91 80 4567 8901" },
      { id: "C2", role: "Client Implementation Contact", name: "Vikash Menon", designation: "Tech Lead", department: "Engineering", email: "vikash.m@edusmart.co.in", phone: "+91 80 4567 8902" },
    ],
    orgOwnership: { salesRep: "Sunita Rao", accountManager: "Priya Desai", projectManager: "Rohit Verma", deliveryLead: "Sunita Rao", technicalLead: "Aditya Joshi", billingOwner: "Meena Pillai", supportLead: "", escalationManager: "Vikram Patel" },
  },
  {
    id: "WP-005", name: "AI ChatBot Platform for Customer Support", projectId: "PRJ-2026-0063",
    projectType: "Bot Development", dealSource: "CRM", stage: "Lead",
    client: { name: "RetailMart India Pvt. Ltd.", industry: "Retail & E-Commerce", website: "www.retailmart.in", headquarters: "Hyderabad, Telangana", companySize: "1001–5000 employees", registrationNo: "U52100TG2012PTC087654", taxId: "36AABCR7654J1ZP", incorporationDate: "2012-04-18" },
    clientContact: { name: "Sanjay Reddy", designation: "Head of Digital Innovation", department: "Technology", email: "sanjay.reddy@retailmart.in", phone: "+91 40 6789 0123" },
    billingInfo: { address: "RetailMart Tower, Hitec City, Hyderabad – 500081", accountNo: "", paymentTerms: "Net 30", poNumber: "", poDate: "" },
    spoc: "Arjun Mehta", spocRole: "Sales Manager", salesRep: "Arjun Mehta",
    totalCost: 850000, currency: "INR ₹", deliveryMonths: 2,
    startDate: "2026-08-01", endDate: "2026-09-30",
    agreementSigned: false, agreementRef: "CRM-LEAD-8832", agreementDate: "", closedDate: "",
    notes: "Conversational AI bot for customer support across WhatsApp, website chat widget, and mobile app. NLP-based intent detection + product catalogue integration.",
    wbsItems: [
      { id: "BOT-E01", code: "1.0", title: "NLP Engine & Intent Classification", type: "Epic", hours: 120, category: "AI/ML" },
      { id: "BOT-E02", code: "2.0", title: "Channel Integration (WhatsApp, Web, App)", type: "Epic", hours: 80, category: "Integration" },
      { id: "BOT-S01", code: "1.1", title: "Product Catalogue Query Handler", type: "Story", hours: 32, category: "Backend" },
      { id: "BOT-T01", code: "0.1", title: "Bot Training & Testing", type: "Task", hours: 40, category: "Testing" },
    ],
    milestones: [
      { id: "M1", name: "Bot MVP (WhatsApp)", dueDate: "2026-08-20", deliverable: "WhatsApp bot live in sandbox", status: "Planned" },
      { id: "M2", name: "Full Channel Launch", dueDate: "2026-09-30", deliverable: "All channels live in production", status: "Planned" },
    ],
    risks: [
      { id: "R1", description: "Low NLP accuracy for regional language queries", impact: "High", probability: "Medium", mitigation: "Train on regional dataset; fallback to live agent", owner: "Tech Lead", status: "Open" },
    ],
    billingItems: [
      { id: "B1", description: "AI ChatBot Development (NLP + Channels)", category: "Development", qty: 400, unitPrice: 1500 },
      { id: "B2", description: "Training Data Preparation & Bot Training", category: "Consulting", qty: 80, unitPrice: 1200 },
    ],
    paymentMilestones: [
      { id: "P1", name: "Advance on Signing", pct: 40, dueDate: "2026-08-01", status: "Pending" },
      { id: "P2", name: "On Go Live", pct: 60, dueDate: "2026-09-30", status: "Pending" },
    ],
    contacts: [
      { id: "C1", role: "Signing Authority", name: "Sanjay Reddy", designation: "Head of Digital Innovation", department: "Technology", email: "sanjay.reddy@retailmart.in", phone: "+91 40 6789 0123" },
    ],
    orgOwnership: { salesRep: "Arjun Mehta", accountManager: "", projectManager: "", deliveryLead: "", technicalLead: "Aditya Joshi", billingOwner: "", supportLead: "", escalationManager: "" },
  },
  {
    id: "WP-006", name: "TalentTrack HR & Payroll SaaS", projectId: "PRJ-2026-0068",
    projectType: "SaaS", dealSource: "CRM", stage: "Negotiation",
    client: { name: "GroupHR Solutions Pvt. Ltd.", industry: "Human Resources", website: "www.grouphr.in", headquarters: "Pune, Maharashtra", companySize: "201–500 employees", registrationNo: "U74140MH2017PTC298765", taxId: "27AABCG1111B1ZK", incorporationDate: "2017-11-10" },
    clientContact: { name: "Kavita Sharma", designation: "CHRO", department: "Human Resources", email: "kavita.sharma@grouphr.in", phone: "+91 20 4567 8901" },
    billingInfo: { address: "GroupHR Campus, Hinjewadi Phase 2, Pune – 411057", accountNo: "", paymentTerms: "Net 30", poNumber: "", poDate: "" },
    spoc: "Neha Gupta", spocRole: "Product Sales Lead", salesRep: "Neha Gupta",
    totalCost: 2400000, currency: "INR ₹", deliveryMonths: 10,
    startDate: "2026-09-01", endDate: "2027-06-30",
    agreementSigned: false, agreementRef: "CRM-DEAL-9941", agreementDate: "", closedDate: "",
    notes: "Multi-tenant SaaS HR platform — employee onboarding, attendance, payroll processing, tax computation, and self-service portal. Pricing: ₹2,400/employee/year (800 employees). Currently negotiating final pricing and SLA terms.",
    wbsItems: [
      { id: "HR-E01", code: "1.0", title: "Employee Management Core", type: "Epic", hours: 300, category: "Development" },
      { id: "HR-E02", code: "2.0", title: "Payroll & Tax Engine", type: "Epic", hours: 280, category: "Development" },
      { id: "HR-E03", code: "3.0", title: "Self-Service Portal (Web + Mobile)", type: "Epic", hours: 200, category: "Development" },
    ],
    milestones: [
      { id: "M1", name: "Tenant Setup & Onboarding Module", dueDate: "2026-11-30", deliverable: "Employee onboarding live", status: "Planned" },
      { id: "M2", name: "Payroll Engine Live", dueDate: "2027-01-31", deliverable: "First payroll run", status: "Planned" },
      { id: "M3", name: "Full SaaS Go Live", dueDate: "2027-06-30", deliverable: "All modules in production", status: "Planned" },
    ],
    risks: [
      { id: "R1", description: "Tax rule changes mid-project", impact: "High", probability: "Medium", mitigation: "Subscribe to tax API; modular tax rule engine", owner: "Tech Lead", status: "Open" },
    ],
    billingItems: [
      { id: "B1", description: "SaaS Platform Development (Annual Subscription)", category: "License", qty: 800, unitPrice: 2400 },
      { id: "B2", description: "Implementation & Onboarding Services", category: "Consulting", qty: 200, unitPrice: 1500 },
    ],
    paymentMilestones: [
      { id: "P1", name: "Annual Subscription (Upfront)", pct: 60, dueDate: "2026-09-01", status: "Pending" },
      { id: "P2", name: "Implementation Milestone", pct: 25, dueDate: "2027-01-31", status: "Pending" },
      { id: "P3", name: "Go Live Acceptance", pct: 15, dueDate: "2027-06-30", status: "Pending" },
    ],
    contacts: [
      { id: "C1", role: "Signing Authority", name: "Kavita Sharma", designation: "CHRO", department: "Human Resources", email: "kavita.sharma@grouphr.in", phone: "+91 20 4567 8901" },
    ],
    orgOwnership: { salesRep: "Neha Gupta", accountManager: "Priya Desai", projectManager: "", deliveryLead: "", technicalLead: "Aditya Joshi", billingOwner: "", supportLead: "", escalationManager: "" },
  },
  {
    id: "WP-007", name: "FashionHub E-Commerce Support Retainer", projectId: "PRJ-2026-0071",
    projectType: "Retainer", dealSource: "CRM", stage: "Proposal",
    client: { name: "FashionHub Commerce Pvt. Ltd.", industry: "Fashion & Retail", website: "www.fashionhub.in", headquarters: "Mumbai, Maharashtra", companySize: "51–200 employees", registrationNo: "U52100MH2019PTC334521", taxId: "27AABCF9988C1ZM", incorporationDate: "2019-07-01" },
    clientContact: { name: "Riya Mehta", designation: "CTO", department: "Technology", email: "riya.mehta@fashionhub.in", phone: "+91 22 6789 1234" },
    billingInfo: { address: "FashionHub HQ, Lower Parel, Mumbai – 400013", accountNo: "", paymentTerms: "Net 30", poNumber: "", poDate: "" },
    spoc: "Sanjay Kulkarni", spocRole: "Account Executive", salesRep: "Sanjay Kulkarni",
    totalCost: 600000, currency: "INR ₹", deliveryMonths: 12,
    startDate: "2026-08-01", endDate: "2027-07-31",
    agreementSigned: false, agreementRef: "CRM-PROP-0055", agreementDate: "", closedDate: "",
    notes: "12-month monthly retainer for ongoing feature development, bug fixes, performance optimisation, and DevOps support for their Shopify-custom e-commerce platform.",
    wbsItems: [
      { id: "FH-T01", code: "1.0", title: "Monthly Feature Development (20h/month)", type: "Task", hours: 240, category: "Development" },
      { id: "FH-T02", code: "2.0", title: "Bug Fix & Maintenance (10h/month)", type: "Task", hours: 120, category: "Support" },
      { id: "FH-T03", code: "3.0", title: "Performance & DevOps (10h/month)", type: "Task", hours: 120, category: "DevOps" },
    ],
    milestones: [
      { id: "M1", name: "Q3 2026 Review", dueDate: "2026-10-31", deliverable: "Quarterly progress report", status: "Planned" },
      { id: "M2", name: "Q4 2026 Review", dueDate: "2027-01-31", deliverable: "Quarterly progress report", status: "Planned" },
      { id: "M3", name: "Annual Review & Renewal", dueDate: "2027-07-31", deliverable: "Contract renewal decision", status: "Planned" },
    ],
    risks: [
      { id: "R1", description: "Scope creep beyond retainer hours", impact: "Medium", probability: "High", mitigation: "Strict hour tracking; excess billed at T&M rate", owner: "Project Manager", status: "Open" },
    ],
    billingItems: [
      { id: "B1", description: "Monthly Retainer — Dev, Maintenance & DevOps (40h/month × 12)", category: "Support", qty: 480, unitPrice: 1250 },
    ],
    paymentMilestones: [
      { id: "P1", name: "Monthly — Month 1 to 6 (advance)", pct: 50, dueDate: "2026-08-01", status: "Pending" },
      { id: "P2", name: "Monthly — Month 7 to 12", pct: 50, dueDate: "2027-01-01", status: "Pending" },
    ],
    contacts: [
      { id: "C1", role: "Signing Authority", name: "Riya Mehta", designation: "CTO", department: "Technology", email: "riya.mehta@fashionhub.in", phone: "+91 22 6789 1234" },
    ],
    orgOwnership: { salesRep: "Sanjay Kulkarni", accountManager: "Priya Desai", projectManager: "", deliveryLead: "", technicalLead: "Aditya Joshi", billingOwner: "", supportLead: "", escalationManager: "" },
  },
];

// ── Style maps ─────────────────────────────────────────────────────────────
const stageStyle: Record<Stage, string> = {
  Lead:        "bg-slate-100 text-slate-600",
  Proposal:    "bg-blue-100 text-blue-700",
  Negotiation: "bg-amber-100 text-amber-700",
  Won:         "bg-green-100 text-green-700",
  Converted:   "bg-emerald-100 text-emerald-700",
};
const stageDot: Record<Stage, string> = {
  Lead: "bg-slate-400", Proposal: "bg-blue-400", Negotiation: "bg-amber-400", Won: "bg-green-500", Converted: "bg-emerald-500",
};
const typeStyle: Record<string, string> = {
  "Fixed Price":    "bg-indigo-100 text-indigo-700",
  "Time & Material":"bg-teal-100 text-teal-700",
  "Bot Development":"bg-violet-100 text-violet-700",
  "SaaS":           "bg-cyan-100 text-cyan-700",
  "Retainer":       "bg-amber-100 text-amber-700",
  "Milestone-Based":"bg-purple-100 text-purple-700",
};
const typeIcon: Record<string, string> = {
  "Fixed Price":"🔒", "Time & Material":"⏱", "Bot Development":"🤖", "SaaS":"☁️", "Retainer":"🔄", "Milestone-Based":"🎯",
};

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

// ── Component ──────────────────────────────────────────────────────────────
export default function WonProjectsPage() {
  const [projects, setProjects] = useState<CRMProject[]>(INITIAL_PROJECTS);
  const [stageFilter, setStageFilter] = useState<"All" | Stage>("All");
  const [sourceFilter, setSourceFilter] = useState<"All" | DealSource>("All");
  const [agreementModal, setAgreementModal] = useState<CRMProject | null>(null);
  const [contactModal, setContactModal] = useState<CRMProject | null>(null);
  const [wbsModal, setWbsModal] = useState<CRMProject | null>(null);
  const [markWinModal, setMarkWinModal] = useState<CRMProject | null>(null);
  const [onboardModal, setOnboardModal] = useState<CRMProject | null>(null);
  const [onboardSource, setOnboardSource] = useState<"CRM" | "Government RFP">("CRM");
  const [onboarding, setOnboarding] = useState(false);
  const [onboardDone, setOnboardDone] = useState(false);
  const [deliveryHealthMap, setDeliveryHealthMap] = useState<Record<string, DeliveryHealth>>({});

  useEffect(() => {
    const saved = localStorage.getItem("pm_crm_projects");
    if (!saved) return;
    try {
      const overrides: Record<string, { stage: Stage; convertedDate?: string; convertedSource?: string }> = JSON.parse(saved);
      setProjects(INITIAL_PROJECTS.map((p) => overrides[p.id] ? { ...p, ...overrides[p.id] } : p));
    } catch { /* ignore */ }

    const healthRaw = localStorage.getItem("pm_delivery_health");
    if (healthRaw) {
      try { setDeliveryHealthMap(JSON.parse(healthRaw)); } catch { /* ignore */ }
    } else {
      // Default health for pre-existing converted project WP-003
      const defaultHealth: Record<string, DeliveryHealth> = {
        "WP-003": { health: "On Track", milestoneDone: 2, milestoneTotal: 3, invoiceReceived: 720000, invoiceTotal: 1200000 }
      };
      setDeliveryHealthMap(defaultHealth);
      localStorage.setItem("pm_delivery_health", JSON.stringify(defaultHealth));
    }
  }, []);

  const saveOverrides = (updated: CRMProject[]) => {
    const overrides: Record<string, { stage: Stage; convertedDate?: string; convertedSource?: string }> = {};
    updated.forEach((p) => { overrides[p.id] = { stage: p.stage, convertedDate: p.convertedDate, convertedSource: p.convertedSource }; });
    localStorage.setItem("pm_crm_projects", JSON.stringify(overrides));
  };

  const handleMarkWin = (p: CRMProject) => {
    const updated = projects.map((proj) => proj.id === p.id ? { ...proj, stage: "Won" as Stage } : proj);
    setProjects(updated);
    saveOverrides(updated);
    setMarkWinModal(null);
  };

  const handleOnboard = () => {
    if (!onboardModal) return;
    setOnboarding(true);
    const p = onboardModal;

    // Build pm_onboarding_draft in the exact format the onboarding page expects
    const draft = {
      project: {
        name: p.name,
        id: p.projectId,
        type: p.projectType,
        currency: p.currency,
        startDate: p.startDate,
        endDate: p.endDate,
        budget: p.totalCost,
        description: p.notes,
      },
      clientCompany: {
        name: p.client.name,
        industry: p.client.industry,
        website: p.client.website,
        headquarters: p.client.headquarters,
        companySize: p.client.companySize,
        registrationNo: p.client.registrationNo,
        taxId: p.client.taxId,
        incorporationDate: p.client.incorporationDate,
      },
      clientAccount: {
        billingAddress: p.billingInfo.address,
        accountNo: p.billingInfo.accountNo,
        paymentTerms: p.billingInfo.paymentTerms,
        currency: p.currency,
        poNumber: p.billingInfo.poNumber,
        poDate: p.billingInfo.poDate,
      },
      orgOwnership: p.orgOwnership,
      milestones: p.milestones,
      risks: p.risks,
      billingItems: p.billingItems,
      paymentMilestones: p.paymentMilestones,
      contacts: p.contacts,
      taxType: "GST 18%",
      inclusiveTax: false,
    };

    localStorage.setItem("pm_onboarding_draft", JSON.stringify(draft));
    localStorage.removeItem("pm_scope_seed_ts");

    // Also write pm_active_project for ProjectBanner (won project metadata)
    localStorage.setItem("pm_crm_source", JSON.stringify({
      wonProjectId: p.id,
      source: onboardSource,
      dealSource: p.dealSource,
      agreementRef: p.agreementRef,
      wbsItems: p.wbsItems,
    }));

    const currentHealth = JSON.parse(localStorage.getItem("pm_delivery_health") || "{}");
    currentHealth[p.id] = {
      health: "On Track",
      milestoneDone: 0,
      milestoneTotal: p.milestones.length,
      invoiceReceived: 0,
      invoiceTotal: p.totalCost,
    };
    localStorage.setItem("pm_delivery_health", JSON.stringify(currentHealth));

    // Mark as converted
    setTimeout(() => {
      const updated = projects.map((proj) =>
        proj.id === p.id
          ? { ...proj, stage: "Converted" as Stage, convertedDate: new Date().toISOString().slice(0, 10), convertedSource: onboardSource }
          : proj
      );
      setProjects(updated);
      saveOverrides(updated);
      setOnboarding(false);
      setOnboardDone(true);
    }, 1200);
  };

  const openOnboard = (p: CRMProject) => {
    setOnboardModal(p);
    setOnboardSource(p.dealSource === "Government RFP" ? "Government RFP" : "CRM");
    setOnboardDone(false);
    setOnboarding(false);
  };

  const filtered = projects.filter((p) => {
    if (stageFilter !== "All" && p.stage !== stageFilter) return false;
    if (sourceFilter !== "All" && p.dealSource !== sourceFilter) return false;
    return true;
  });

  const stageCount = (s: Stage) => projects.filter((p) => p.stage === s).length;
  const totalPipeline = projects.filter((p) => p.stage !== "Converted").reduce((a, p) => a + p.totalCost, 0);
  const wonValue = projects.filter((p) => p.stage === "Won").reduce((a, p) => a + p.totalCost, 0);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">CRM — Deals & Won Projects</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your pipeline · Mark deals as Won · Onboard to project delivery</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          CRM Synced · {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>

      {/* Pipeline funnel KPI */}
      <div className="grid grid-cols-5 gap-3">
        {(["Lead", "Proposal", "Negotiation", "Won", "Converted"] as Stage[]).map((s) => (
          <button key={s} onClick={() => setStageFilter(stageFilter === s ? "All" : s)}
            className={`rounded-xl p-4 text-left border transition-all ${stageFilter === s ? "ring-2 ring-indigo-400" : ""} ${s === "Won" ? "bg-green-50 border-green-200" : s === "Converted" ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full ${stageDot[s]}`} />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s}</span>
            </div>
            <div className={`text-2xl font-bold ${s === "Won" ? "text-green-700" : s === "Converted" ? "text-emerald-700" : "text-slate-800"}`}>{stageCount(s)}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {fmt(projects.filter((p) => p.stage === s).reduce((a, p) => a + p.totalCost, 0))}
            </div>
          </button>
        ))}
      </div>

      {/* Filters + summary */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden text-xs">
          {(["All", "CRM", "Government RFP"] as const).map((f) => (
            <button key={f} onClick={() => setSourceFilter(f)}
              className={`px-4 py-2 font-medium transition-colors ${sourceFilter === f ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>{f}</button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs text-slate-500">
          <span>Pipeline: <strong className="text-slate-700">{fmt(totalPipeline)}</strong></span>
          <span>Won (not onboarded): <strong className="text-green-700">{fmt(wonValue)}</strong></span>
          <span>{filtered.length} deals shown</span>
        </div>
      </div>

      {/* Project list */}
      <div className="space-y-3">
        {filtered.map((proj) => {
          const preWon = proj.stage === "Lead" || proj.stage === "Proposal" || proj.stage === "Negotiation";
          return (
            <div key={proj.id} className={`bg-white rounded-2xl border shadow-sm transition-all ${proj.stage === "Won" ? "border-green-200" : proj.stage === "Converted" ? "border-emerald-200" : "border-slate-200 hover:border-slate-300"}`}>
              {/* Card top */}
              <div className="px-6 pt-5 pb-4 flex items-start gap-5">
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-50 border border-slate-100">
                  {typeIcon[proj.projectType] ?? "📁"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono text-slate-400">{proj.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeStyle[proj.projectType] ?? "bg-gray-100 text-gray-600"}`}>{typeIcon[proj.projectType]} {proj.projectType}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${proj.dealSource === "CRM" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{proj.dealSource === "CRM" ? "🔗 CRM" : "🏛 Gov RFP"}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1 ${stageStyle[proj.stage]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${stageDot[proj.stage]}`} />
                      {proj.stage}
                    </span>
                    {proj.stage === "Converted" && <span className="text-xs text-emerald-600">Onboarded {proj.convertedDate} · {proj.convertedSource}</span>}
                  </div>
                  <div className="text-lg font-bold text-slate-800 truncate">{proj.name}</div>
                  <div className="text-sm text-slate-500">{proj.client.name} · {proj.client.industry}</div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1">{proj.notes}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-slate-800">{fmt(proj.totalCost)}</div>
                  <div className="text-xs text-slate-400">Total Contract Value</div>
                  <div className="text-sm font-medium text-slate-600 mt-1">{proj.deliveryMonths}m · {proj.startDate} → {proj.endDate}</div>
                </div>
              </div>

              {/* Detail strip */}
              <div className="px-6 pb-4 grid grid-cols-5 gap-4 border-t border-slate-50 pt-4 text-sm">
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">SPOC</div>
                  <div className="font-medium text-slate-700">{proj.spoc}</div>
                  <div className="text-xs text-slate-400">{proj.spocRole}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Client Contact</div>
                  <div className="font-medium text-slate-700">{proj.clientContact.name}</div>
                  <div className="text-xs text-slate-400">{proj.clientContact.designation}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Agreement</div>
                  {proj.agreementSigned
                    ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">✓ Signed · {proj.agreementDate}</span>
                    : <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">⏳ Pending · {proj.agreementRef}</span>}
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">WBS Items</div>
                  <div className="font-medium text-slate-700">{proj.wbsItems.length} items</div>
                  <div className="text-xs text-slate-400">{proj.wbsItems.reduce((a, w) => a + w.hours, 0)}h est.</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">{proj.closedDate ? "Closed Date" : "Lead Date"}</div>
                  <div className="font-medium text-slate-700">{proj.closedDate || "TBD"}</div>
                  <div className="text-xs text-slate-400">via {proj.salesRep}</div>
                </div>
              </div>

              {/* Delivery health strip — Converted projects only */}
              {proj.stage === "Converted" && deliveryHealthMap[proj.id] && (() => {
                const dh = deliveryHealthMap[proj.id];
                const milestonePct = dh.milestoneTotal > 0 ? Math.round(dh.milestoneDone / dh.milestoneTotal * 100) : 0;
                const invoicePct = dh.invoiceTotal > 0 ? Math.round(dh.invoiceReceived / dh.invoiceTotal * 100) : 0;
                const healthStyle = dh.health === "On Track" ? "bg-green-100 text-green-700 border-green-200" : dh.health === "At Risk" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-red-100 text-red-700 border-red-200";
                return (
                  <div className="mx-6 mb-4 bg-slate-50 rounded-xl border border-slate-100 px-5 py-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Delivery Health</div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${healthStyle}`}>
                        <span className={`w-2 h-2 rounded-full ${dh.health === "On Track" ? "bg-green-500" : dh.health === "At Risk" ? "bg-amber-500" : "bg-red-500"}`} />
                        {dh.health}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Milestones</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${milestonePct}%` }} />
                        </div>
                        <span className="text-xs font-medium text-slate-700">{dh.milestoneDone}/{dh.milestoneTotal} · {milestonePct}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Invoices Received</div>
                      <div className="text-sm font-semibold text-slate-800">₹{(dh.invoiceReceived/100000).toFixed(1)}L <span className="text-slate-400 font-normal text-xs">of ₹{(dh.invoiceTotal/100000).toFixed(1)}L</span></div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${invoicePct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Action bar */}
              <div className="px-6 pb-5 flex items-center gap-2 border-t border-slate-50 pt-3 flex-wrap">
                <button onClick={() => setAgreementModal(proj)} className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">📄 Agreement</button>
                <button onClick={() => setContactModal(proj)} className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">👤 Client Info</button>
                <button onClick={() => setWbsModal(proj)} className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">📋 WBS ({proj.wbsItems.length})</button>
                <div className="ml-auto flex items-center gap-2">
                  {preWon && (
                    <button onClick={() => setMarkWinModal(proj)}
                      className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      🏆 Mark as Win
                    </button>
                  )}
                  {proj.stage === "Won" && (
                    <button onClick={() => openOnboard(proj)}
                      className="px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                      🚀 Onboard to Delivery →
                    </button>
                  )}
                  {proj.stage === "Converted" && (
                    <a href="/onboarding" className="px-4 py-2 text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100">
                      View Onboarding →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mark as Win Modal ── */}
      {markWinModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setMarkWinModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 text-center space-y-4">
              <div className="text-4xl">🏆</div>
              <div className="text-xl font-bold text-slate-800">Mark as Won?</div>
              <div className="text-sm text-slate-500">
                Move <strong>{markWinModal.name}</strong> from <span className={`px-2 py-0.5 rounded text-xs font-medium ${stageStyle[markWinModal.stage]}`}>{markWinModal.stage}</span> → <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Won</span>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-left text-sm">
                <div className="font-semibold text-green-800 mb-2">This deal will be available to onboard once marked Won.</div>
                <div className="space-y-1 text-xs text-green-700">
                  <div>Client: {markWinModal.client.name}</div>
                  <div>Type: {markWinModal.projectType}</div>
                  <div>Value: {fmt(markWinModal.totalCost)}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setMarkWinModal(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-sm">Cancel</button>
                <button onClick={() => handleMarkWin(markWinModal)} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold">✓ Confirm Win</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Agreement / SOW Modal ── */}
      {agreementModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAgreementModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Document header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-8 py-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-mono mb-1">STATEMENT OF WORK — {agreementModal.agreementRef}</div>
                  <div className="text-xl font-bold">{agreementModal.name}</div>
                  <div className="text-sm text-slate-300 mt-0.5">{agreementModal.client.name}</div>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-lg text-sm font-bold mb-2 ${typeStyle[agreementModal.projectType]}`}>{typeIcon[agreementModal.projectType]} {agreementModal.projectType}</div>
                  <div className="text-2xl font-bold">{fmt(agreementModal.totalCost)}</div>
                  <div className="text-xs text-slate-400">{agreementModal.deliveryMonths} months</div>
                </div>
              </div>
            </div>
            <div className="px-8 py-6 space-y-6 text-sm">
              {/* Parties */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <div className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">Service Provider</div>
                  <div className="font-bold text-indigo-800">iProfit Technologies Pvt. Ltd.</div>
                  <div className="text-xs text-indigo-600 mt-1">info@iprofit.in · www.iprofit.in</div>
                  <div className="text-xs text-indigo-600">SPOC: {agreementModal.spoc} · {agreementModal.spocRole}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Client</div>
                  <div className="font-bold text-slate-800">{agreementModal.client.name}</div>
                  <div className="text-xs text-slate-600 mt-1">{agreementModal.client.headquarters}</div>
                  <div className="text-xs text-slate-600">GSTIN: {agreementModal.client.taxId || "—"}</div>
                </div>
              </div>

              {/* Agreement details */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Agreement Details</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["Ref No.", agreementModal.agreementRef],
                    ["Date", agreementModal.agreementDate || "Pending"],
                    ["Status", agreementModal.agreementSigned ? "✓ Signed" : "⏳ Awaiting"],
                    ["Start Date", agreementModal.startDate],
                    ["End Date", agreementModal.endDate],
                    ["PO Number", agreementModal.billingInfo.poNumber || "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-400">{k}</div>
                      <div className="font-medium text-slate-700 mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Scope of Work</div>
                <div className="bg-slate-50 rounded-xl p-4 text-slate-600 leading-relaxed">{agreementModal.notes}</div>
              </div>

              {/* Billing items */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Cost Breakdown</div>
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-slate-200 text-slate-400"><th className="text-left pb-1.5">Description</th><th className="text-center pb-1.5">Category</th><th className="text-right pb-1.5">Qty/Hrs</th><th className="text-right pb-1.5">Rate</th><th className="text-right pb-1.5">Amount</th></tr></thead>
                  <tbody>
                    {agreementModal.billingItems.map((b) => (
                      <tr key={b.id} className="border-b border-slate-50">
                        <td className="py-1.5 text-slate-600">{b.description}</td>
                        <td className="py-1.5 text-center text-slate-400">{b.category}</td>
                        <td className="py-1.5 text-right">{b.qty.toLocaleString()}</td>
                        <td className="py-1.5 text-right">₹{b.unitPrice.toLocaleString()}</td>
                        <td className="py-1.5 text-right font-medium">₹{(b.qty * b.unitPrice).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300">
                      <td colSpan={4} className="pt-2 font-bold text-slate-700">Total Contract Value</td>
                      <td className="pt-2 font-bold text-slate-800 text-right">{fmt(agreementModal.totalCost)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment milestones */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Payment Schedule</div>
                <div className="space-y-2">
                  {agreementModal.paymentMilestones.map((pm) => (
                    <div key={pm.id} className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <span className="font-medium text-slate-700">{pm.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500">{pm.pct}% · {fmt(Math.round(agreementModal.totalCost * pm.pct / 100))}</span>
                        <span className="text-slate-400">{pm.dueDate}</span>
                        <span className={`px-2 py-0.5 rounded font-medium ${pm.status === "Received" ? "bg-green-100 text-green-700" : pm.status === "Invoiced" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>{pm.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery milestones */}
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Delivery Timeline</div>
                <div className="space-y-1.5">
                  {agreementModal.milestones.map((m, i) => (
                    <div key={m.id} className="flex items-start gap-3 text-xs">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                      <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2">
                        <div className="font-medium text-slate-700">{m.name} <span className="text-slate-400 font-normal">· {m.dueDate}</span></div>
                        <div className="text-slate-500">{m.deliverable}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature block */}
              <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-5">
                <div>
                  <div className="text-xs text-slate-400 mb-3">For & on behalf of iProfit Technologies</div>
                  <div className="h-10 border-b-2 border-slate-300 mb-1" />
                  <div className="text-xs text-slate-500">{agreementModal.spoc} · {agreementModal.spocRole}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-3">For & on behalf of {agreementModal.client.name}</div>
                  <div className="h-10 border-b-2 border-slate-300 mb-1">
                    {agreementModal.agreementSigned && <div className="text-blue-600 font-bold italic text-sm pt-2">✓ Digitally Signed</div>}
                  </div>
                  <div className="text-xs text-slate-500">{agreementModal.clientContact.name} · {agreementModal.clientContact.designation}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setAgreementModal(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200">Close</button>
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">⬇ Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Client Info Modal ── */}
      {contactModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setContactModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="font-semibold text-slate-800">Client Information</div>
              <button onClick={() => setContactModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="px-6 py-5 space-y-5 text-sm">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Company</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Name", contactModal.client.name], ["Industry", contactModal.client.industry],
                    ["Website", contactModal.client.website], ["Headquarters", contactModal.client.headquarters],
                    ["Size", contactModal.client.companySize], ["Reg. No.", contactModal.client.registrationNo],
                    ["GSTIN", contactModal.client.taxId], ["Incorporated", contactModal.client.incorporationDate],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-slate-50 rounded-lg p-2.5">
                      <div className="text-xs text-slate-400">{k}</div>
                      <div className="font-medium text-slate-700 text-xs mt-0.5">{v || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Key Contacts</div>
                <div className="space-y-2">
                  {contactModal.contacts.map((c) => (
                    <div key={c.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">{c.name.charAt(0)}</div>
                      <div>
                        <div className="font-medium text-slate-700 text-xs">{c.name} <span className="text-slate-400 font-normal">· {c.designation}</span></div>
                        <div className="text-xs text-slate-400">{c.role} · {c.department}</div>
                        <div className="text-xs text-indigo-600 mt-0.5">{c.email} · {c.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Billing</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Address", contactModal.billingInfo.address], ["Payment Terms", contactModal.billingInfo.paymentTerms],
                    ["Account No.", contactModal.billingInfo.accountNo || "—"], ["PO Number", contactModal.billingInfo.poNumber || "—"],
                  ].map(([k, v]) => (
                    <div key={k} className={`bg-slate-50 rounded-lg p-2.5 ${k === "Address" ? "col-span-2" : ""}`}>
                      <div className="text-xs text-slate-400">{k}</div>
                      <div className="font-medium text-slate-700 text-xs mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WBS Modal ── */}
      {wbsModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setWbsModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between sticky top-0 bg-white z-10">
              <div><div className="font-semibold text-slate-800">WBS — {wbsModal.name}</div><div className="text-xs text-slate-400">{wbsModal.wbsItems.length} items · {wbsModal.wbsItems.reduce((a, w) => a + w.hours, 0)}h · auto-imported on onboarding</div></div>
              <button onClick={() => setWbsModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="px-6 py-4">
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-slate-400 border-b border-slate-100"><th className="text-left pb-2">Code</th><th className="text-left pb-2">Title</th><th className="text-left pb-2">Type</th><th className="text-left pb-2">Category</th><th className="text-right pb-2">Hrs</th></tr></thead>
                <tbody>
                  {wbsModal.wbsItems.map((w) => (
                    <tr key={w.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-2 font-mono text-xs text-slate-400">{w.code}</td>
                      <td className="py-2 text-slate-700 font-medium">{w.title}</td>
                      <td className="py-2"><span className={`px-2 py-0.5 rounded text-xs font-medium ${w.type === "Epic" ? "bg-orange-100 text-orange-700" : w.type === "Story" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{w.type}</span></td>
                      <td className="py-2 text-xs text-slate-500">{w.category}</td>
                      <td className="py-2 text-right font-medium text-indigo-600">{w.hours}h</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr className="border-t-2 border-slate-200"><td colSpan={4} className="pt-2 text-xs font-semibold text-slate-500">Total</td><td className="pt-2 text-right font-bold text-slate-800">{wbsModal.wbsItems.reduce((a, w) => a + w.hours, 0)}h</td></tr></tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Onboard Modal ── */}
      {onboardModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { if (!onboarding && !onboardDone) setOnboardModal(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            {onboardDone ? (
              <div className="px-6 py-8 text-center space-y-4">
                <div className="text-5xl">🎉</div>
                <div className="text-xl font-bold text-slate-800">Project Onboarded!</div>
                <div className="text-sm text-slate-500 max-w-xs mx-auto">
                  <strong>{onboardModal.name}</strong> has been converted from <strong>{onboardSource}</strong>. Agreement data has been pre-filled in the Onboarding form — review and initiate.
                </div>
                <div className="bg-indigo-50 rounded-xl p-4 text-left text-xs text-indigo-700 space-y-1">
                  <div>✓ Project type: <strong>{onboardModal.projectType}</strong> pre-filled</div>
                  <div>✓ Client details, contacts & billing pre-filled from agreement</div>
                  <div>✓ Milestones, risks & payment schedule imported</div>
                  <div>✓ WBS ({onboardModal.wbsItems.length} items) ready for Scope page</div>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button onClick={() => setOnboardModal(null)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg">Close</button>
                  <a href="/onboarding" className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">Go to Onboarding →</a>
                </div>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between">
                  <div className="font-semibold text-slate-800">Onboard to Delivery</div>
                  {!onboarding && <button onClick={() => setOnboardModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>}
                </div>
                <div className="px-6 py-5 space-y-5">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <div className="font-semibold text-indigo-800">{onboardModal.name}</div>
                    <div className="text-sm text-indigo-600 mt-0.5">{onboardModal.client.name}</div>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-indigo-600">
                      <span>{typeIcon[onboardModal.projectType]} {onboardModal.projectType}</span>
                      <span>·</span><span>{fmt(onboardModal.totalCost)}</span>
                      <span>·</span><span>{onboardModal.deliveryMonths} months</span>
                      <span>·</span><span>{onboardModal.wbsItems.length} WBS items</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-3">Conversion Source</div>
                    <div className="grid grid-cols-2 gap-3">
                      {(["CRM", "Government RFP"] as const).map((src) => (
                        <button key={src} onClick={() => setOnboardSource(src)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${onboardSource === src ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"}`}>
                          <div className="text-lg mb-1">{src === "CRM" ? "🔗" : "🏛"}</div>
                          <div className={`text-sm font-semibold ${onboardSource === src ? "text-indigo-700" : "text-slate-700"}`}>Convert from {src}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{src === "CRM" ? "CRM deal — agreement & WBS imported" : "Government tender — RFP documents imported"}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
                    <strong>Agreement pre-fills Onboarding:</strong> Project type, client details, billing, milestones, risks, payment schedule and WBS will be auto-populated in the Onboarding form. Review and edit before initiating.
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setOnboardModal(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm">Cancel</button>
                    <button onClick={handleOnboard} disabled={onboarding}
                      className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-70 flex items-center justify-center gap-2">
                      {onboarding ? <><span className="animate-spin">⟳</span> Importing…</> : <>🚀 Pre-fill &amp; Go to Onboarding</>}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
