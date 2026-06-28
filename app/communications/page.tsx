"use client";

import { useState, useEffect } from "react";

type CommType = "Call" | "Email" | "Meeting" | "Note";
type Sentiment = "Positive" | "Neutral" | "Escalation Risk";

type CommEntry = {
  id: string;
  type: CommType;
  date: string;
  time: string;
  subject: string;
  summary: string;
  participants: string[];
  sentiment: Sentiment;
  followUpDate: string;
  followUpDone: boolean;
  owner: string;
  tags: string[];
};

const STORAGE_KEY = "pm_comm_log";

const SAMPLE_DATA: CommEntry[] = [
  {
    id: "1",
    type: "Call",
    date: "2026-06-10",
    time: "10:00",
    subject: "Kickoff Meeting",
    summary:
      "Discussed project goals, timelines, and key deliverables. Client expressed satisfaction with proposed approach.",
    participants: ["Rajesh Kumar", "Arjun Mehta", "Rohit Verma"],
    sentiment: "Positive",
    followUpDate: "2026-06-17",
    followUpDone: false,
    owner: "Arjun Mehta",
    tags: ["Kickoff"],
  },
  {
    id: "2",
    type: "Email",
    date: "2026-06-12",
    time: "14:30",
    subject: "Requirements clarification on user roles",
    summary:
      "Client asked for 3 additional admin role types beyond what was scoped. Sent clarification email requesting formal CR.",
    participants: ["Kiran Nair", "Priya Desai"],
    sentiment: "Neutral",
    followUpDate: "2026-06-15",
    followUpDone: false,
    owner: "Priya Desai",
    tags: ["Scope Change", "Requirements"],
  },
  {
    id: "3",
    type: "Meeting",
    date: "2026-06-18",
    time: "11:00",
    subject: "Sprint 1 Review",
    summary:
      "Demo went well. Client approved all user stories. Minor UI feedback on login page to be addressed in Sprint 2.",
    participants: ["Rajesh Kumar", "Rohit Verma", "Sunita Rao"],
    sentiment: "Positive",
    followUpDate: "",
    followUpDone: true,
    owner: "Rohit Verma",
    tags: [],
  },
  {
    id: "4",
    type: "Email",
    date: "2026-06-20",
    time: "09:15",
    subject: "Invoice query — Advance payment",
    summary:
      "Finance team asked for revised invoice with GST breakdown. Sent updated invoice (INV-2026-001).",
    participants: ["Deepa Sharma", "Meena Pillai"],
    sentiment: "Neutral",
    followUpDate: "",
    followUpDone: false,
    owner: "Arjun Mehta",
    tags: ["Billing"],
  },
  {
    id: "5",
    type: "Call",
    date: "2026-06-25",
    time: "16:00",
    subject: "UAT feedback — Escalation",
    summary:
      "Client flagged concern about performance on the reporting module. Load time 4s vs expected <2s. Escalated to tech lead.",
    participants: ["Rajesh Kumar", "Arjun Mehta"],
    sentiment: "Escalation Risk",
    followUpDate: "2026-06-28",
    followUpDone: false,
    owner: "Aditya Joshi",
    tags: ["UAT", "Performance"],
  },
  {
    id: "6",
    type: "Meeting",
    date: "2026-06-22",
    time: "10:00",
    subject: "Sprint 2 Planning",
    summary:
      "Sprint 2 backlog groomed. 12 items committed. Client stakeholder confirmed availability for UAT on July 15.",
    participants: ["Rohit Verma", "Priya M.", "Amit K."],
    sentiment: "Neutral",
    followUpDate: "",
    followUpDone: false,
    owner: "Rohit Verma",
    tags: [],
  },
  {
    id: "7",
    type: "Note",
    date: "2026-06-26",
    time: "18:00",
    subject: "Internal — Tech debt flag",
    summary:
      "Tech lead flagged auth module has hardcoded secrets. Needs refactor before UAT. Added to Sprint 3 backlog.",
    participants: ["Aditya Joshi"],
    sentiment: "Neutral",
    followUpDate: "",
    followUpDone: false,
    owner: "Aditya Joshi",
    tags: ["Tech Debt"],
  },
  {
    id: "8",
    type: "Email",
    date: "2026-06-27",
    time: "13:45",
    subject: "Change Request approval — Admin roles",
    summary:
      "Client formally approved CR-001 for additional admin roles. Budget impact ₹85,000 accepted. Signed CR doc received.",
    participants: ["Rajesh Kumar", "Arjun Mehta"],
    sentiment: "Positive",
    followUpDate: "",
    followUpDone: false,
    owner: "Arjun Mehta",
    tags: ["Scope Change"],
  },
];

const OWNERS = [
  "Arjun Mehta",
  "Priya Desai",
  "Rohit Verma",
  "Sunita Rao",
  "Aditya Joshi",
];

function typeIcon(type: CommType) {
  const icons: Record<CommType, string> = {
    Call: "📞",
    Email: "✉️",
    Meeting: "📅",
    Note: "📝",
  };
  return icons[type];
}

function sentimentAccent(sentiment: Sentiment) {
  if (sentiment === "Positive") return "bg-green-500";
  if (sentiment === "Escalation Risk") return "bg-red-500";
  return "bg-slate-400";
}

function sentimentBadge(sentiment: Sentiment) {
  if (sentiment === "Positive")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
        ✓ Positive
      </span>
    );
  if (sentiment === "Escalation Risk")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">
        ⚠ Escalation Risk
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
      ● Neutral
    </span>
  );
}

function formatDate(d: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
}

function isOverdue(dateStr: string) {
  if (!dateStr) return false;
  return dateStr < "2026-06-28";
}

function isDueThisWeek(dateStr: string) {
  if (!dateStr) return false;
  const weekEnd = "2026-07-05";
  return dateStr >= "2026-06-28" && dateStr <= weekEnd;
}

const emptyForm = {
  type: "Call" as CommType,
  date: "2026-06-28",
  time: "09:00",
  subject: "",
  summary: "",
  participantsRaw: "",
  sentiment: "Neutral" as Sentiment,
  followUpDate: "",
  tagsRaw: "",
  owner: OWNERS[0],
};

export default function CommunicationsPage() {
  const [entries, setEntries] = useState<CommEntry[]>([]);
  const [filter, setFilter] = useState<"All" | Sentiment>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState(emptyForm);
  const [followUpOpen, setFollowUpOpen] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setEntries(JSON.parse(raw));
      } catch {
        setEntries(SAMPLE_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
      }
    } else {
      setEntries(SAMPLE_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
    }
  }, []);

  function save(updated: CommEntry[]) {
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function markDone(id: string) {
    save(entries.map((e) => (e.id === id ? { ...e, followUpDone: true } : e)));
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAddEntry() {
    const newEntry: CommEntry = {
      id: Date.now().toString(),
      type: form.type,
      date: form.date,
      time: form.time,
      subject: form.subject.trim(),
      summary: form.summary.trim(),
      participants: form.participantsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      sentiment: form.sentiment,
      followUpDate: form.followUpDate,
      followUpDone: false,
      owner: form.owner,
      tags: form.tagsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    save([newEntry, ...entries]);
    setModalOpen(false);
    setForm(emptyForm);
  }

  // KPI calculations
  const totalThisMonth = entries.filter((e) => e.date.startsWith("2026-06")).length;
  const followUpsDueThisWeek = entries.filter(
    (e) => e.followUpDate && !e.followUpDone && isDueThisWeek(e.followUpDate)
  ).length;
  const escalationsActive = entries.filter(
    (e) => e.sentiment === "Escalation Risk" && !e.followUpDone
  ).length;
  const positiveCount = entries.filter((e) => e.sentiment === "Positive").length;
  const positivePct =
    entries.length > 0 ? Math.round((positiveCount / entries.length) * 100) : 0;

  // Filtered + sorted entries: escalations first, then by date desc
  const filtered = entries
    .filter((e) => filter === "All" || e.sentiment === filter)
    .sort((a, b) => {
      const aEsc = a.sentiment === "Escalation Risk" ? 0 : 1;
      const bEsc = b.sentiment === "Escalation Risk" ? 0 : 1;
      if (aEsc !== bEsc) return aEsc - bEsc;
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });

  // Follow-up reminders
  const pendingFollowUps = entries
    .filter((e) => e.followUpDate && !e.followUpDone)
    .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Client Communication Log
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Activity feed & interaction history
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <span className="text-base">+</span> New Entry
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Interactions (Jun)
            </p>
            <p className="text-3xl font-bold text-slate-800 mt-1">
              {totalThisMonth}
            </p>
          </div>
          <div
            className={`bg-white rounded-xl shadow-sm p-4 ${
              followUpsDueThisWeek > 0 ? "ring-2 ring-amber-400" : ""
            }`}
          >
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Follow-ups Due
            </p>
            <p
              className={`text-3xl font-bold mt-1 ${
                followUpsDueThisWeek > 0 ? "text-amber-600" : "text-slate-800"
              }`}
            >
              {followUpsDueThisWeek}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">this week</p>
          </div>
          <div
            className={`bg-white rounded-xl shadow-sm p-4 ${
              escalationsActive > 0 ? "ring-2 ring-red-400" : ""
            }`}
          >
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Active Escalations
            </p>
            <p
              className={`text-3xl font-bold mt-1 ${
                escalationsActive > 0 ? "text-red-600" : "text-slate-800"
              }`}
            >
              {escalationsActive}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Positive Sentiment
            </p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {positivePct}%
            </p>
          </div>
        </div>

        {/* Sentiment filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {(["All", "Positive", "Neutral", "Escalation Risk"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === tab
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {tab}
              </button>
            )
          )}
          <span className="ml-auto text-xs text-slate-400 self-center">
            {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
          </span>
        </div>

        {/* Activity feed */}
        <div className="flex flex-col gap-3 mb-8">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-slate-400 text-sm">
              No entries found.
            </div>
          )}
          {filtered.map((entry) => {
            const isExpanded = expandedIds.has(entry.id);
            const isEscalation = entry.sentiment === "Escalation Risk";
            return (
              <div
                key={entry.id}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden flex ${
                  isEscalation ? "ring-2 ring-red-400" : ""
                }`}
              >
                {/* Colored accent bar */}
                <div
                  className={`w-1.5 flex-shrink-0 ${sentimentAccent(entry.sentiment)}`}
                />

                <div className="flex-1 p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl">{typeIcon(entry.type)}</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {entry.type}
                      </span>
                      {isEscalation && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          🚨 Escalation
                        </span>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs font-medium text-slate-500">
                        {formatDate(entry.date)}
                      </p>
                      <p className="text-xs text-slate-400">{entry.time}</p>
                    </div>
                  </div>

                  {/* Subject */}
                  <h3 className="font-bold text-slate-800 text-base mt-2 leading-snug">
                    {entry.subject}
                  </h3>

                  {/* Summary */}
                  <p
                    className={`text-sm text-slate-600 mt-1 ${
                      isExpanded ? "" : "line-clamp-2"
                    }`}
                  >
                    {entry.summary}
                  </p>
                  {entry.summary.length > 120 && (
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 font-medium"
                    >
                      {isExpanded ? "Collapse ▲" : "Expand ▼"}
                    </button>
                  )}

                  {/* Participants + tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {entry.participants.map((p) => (
                      <span
                        key={p}
                        className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium"
                      >
                        {p}
                      </span>
                    ))}
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium border border-indigo-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Sentiment + follow-up row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      {sentimentBadge(entry.sentiment)}
                      {entry.followUpDate && !entry.followUpDone && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Follow-up: {formatDate(entry.followUpDate)}
                        </span>
                      )}
                      {entry.followUpDate && !entry.followUpDone && (
                        <button
                          onClick={() => markDone(entry.id)}
                          className="text-xs px-2.5 py-0.5 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors"
                        >
                          Mark Done
                        </button>
                      )}
                      {entry.followUpDone && entry.followUpDate && (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Done
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      Owner: {entry.owner}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Follow-up reminders section */}
        {pendingFollowUps.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            <button
              onClick={() => setFollowUpOpen((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  Pending Follow-ups
                </span>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  {pendingFollowUps.length}
                </span>
              </div>
              <span className="text-slate-400 text-sm">
                {followUpOpen ? "▲ Collapse" : "▼ Expand"}
              </span>
            </button>

            {followUpOpen && (
              <div className="border-t border-slate-100">
                {pendingFollowUps.map((entry, idx) => {
                  const overdue = isOverdue(entry.followUpDate);
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between px-5 py-3 gap-3 ${
                        idx !== pendingFollowUps.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-base">{typeIcon(entry.type)}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {entry.subject}
                          </p>
                          <p
                            className={`text-xs font-semibold mt-0.5 ${
                              overdue ? "text-red-600" : "text-amber-600"
                            }`}
                          >
                            Due: {formatDate(entry.followUpDate)}
                            {overdue && " — Overdue"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => markDone(entry.id)}
                        className="flex-shrink-0 text-xs px-3 py-1.5 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                      >
                        Mark Done
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                New Communication Entry
              </h2>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setForm(emptyForm);
                }}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

              {/* Type selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Type
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(["Call", "Email", "Meeting", "Note"] as CommType[]).map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                          form.type === t
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {typeIcon(t)} {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Time
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, time: e.target.value }))
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  placeholder="e.g. Sprint 3 kick-off call"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Summary
                </label>
                <textarea
                  rows={3}
                  value={form.summary}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, summary: e.target.value }))
                  }
                  placeholder="Brief description of the interaction..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>

              {/* Participants */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Participants{" "}
                  <span className="font-normal text-slate-400 normal-case">
                    (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.participantsRaw}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, participantsRaw: e.target.value }))
                  }
                  placeholder="Rajesh Kumar, Arjun Mehta"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {form.participantsRaw.trim() && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.participantsRaw
                      .split(",")
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((p) => (
                        <span
                          key={p}
                          className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium"
                        >
                          {p}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Sentiment */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Sentiment
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(["Positive", "Neutral", "Escalation Risk"] as Sentiment[]).map(
                    (s) => {
                      const active = form.sentiment === s;
                      const colors =
                        s === "Positive"
                          ? active
                            ? "bg-green-500 text-white border-green-500"
                            : "border-slate-200 text-slate-600 hover:bg-green-50"
                          : s === "Escalation Risk"
                          ? active
                            ? "bg-red-500 text-white border-red-500"
                            : "border-slate-200 text-slate-600 hover:bg-red-50"
                          : active
                          ? "bg-slate-600 text-white border-slate-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50";
                      return (
                        <button
                          key={s}
                          onClick={() =>
                            setForm((f) => ({ ...f, sentiment: s }))
                          }
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${colors}`}
                        >
                          {s}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Follow-up date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Follow-up Date{" "}
                  <span className="font-normal text-slate-400 normal-case">
                    (optional)
                  </span>
                </label>
                <input
                  type="date"
                  value={form.followUpDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, followUpDate: e.target.value }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Tags{" "}
                  <span className="font-normal text-slate-400 normal-case">
                    (comma-separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.tagsRaw}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tagsRaw: e.target.value }))
                  }
                  placeholder="UAT, Billing, Scope Change"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                {form.tagsRaw.trim() && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tagsRaw
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium border border-indigo-100"
                        >
                          {t}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Owner */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Owner
                </label>
                <select
                  value={form.owner}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, owner: e.target.value }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                  {OWNERS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setForm(emptyForm);
                }}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEntry}
                disabled={!form.subject.trim() || !form.summary.trim()}
                className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
