"use client";

import { useState, useEffect } from "react";

type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";

type Invoice = {
  id: string;
  invoiceNo: string;
  milestoneId: string;
  milestoneName: string;
  amount: number;
  pct: number;
  dueDate: string;
  status: InvoiceStatus;
  invoiceDate: string;
  paidDate: string;
  clientName: string;
  poNumber: string;
  taxType: string;
  notes: string;
};

const TAX_RATE = 0.18;

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: "INV-2026-001",
    invoiceNo: "INV-2026-001",
    milestoneId: "ms-1",
    milestoneName: "Advance Payment",
    amount: 370000,
    pct: 20,
    dueDate: "2026-01-15",
    status: "Paid",
    invoiceDate: "2026-01-10",
    paidDate: "2026-01-14",
    clientName: "Nexgen Technologies Pvt. Ltd.",
    poNumber: "PO-2026-0041",
    taxType: "GST 18%",
    notes: "",
  },
  {
    id: "INV-2026-002",
    invoiceNo: "INV-2026-002",
    milestoneId: "ms-2",
    milestoneName: "Requirements Freeze",
    amount: 370000,
    pct: 20,
    dueDate: "2026-02-28",
    status: "Paid",
    invoiceDate: "2026-02-20",
    paidDate: "2026-02-27",
    clientName: "Nexgen Technologies Pvt. Ltd.",
    poNumber: "PO-2026-0041",
    taxType: "GST 18%",
    notes: "",
  },
  {
    id: "INV-2026-003",
    invoiceNo: "INV-2026-003",
    milestoneId: "ms-3",
    milestoneName: "MVP Delivery",
    amount: 555000,
    pct: 30,
    dueDate: "2026-04-30",
    status: "Sent",
    invoiceDate: "2026-04-25",
    paidDate: "",
    clientName: "Nexgen Technologies Pvt. Ltd.",
    poNumber: "PO-2026-0041",
    taxType: "GST 18%",
    notes: "",
  },
  {
    id: "INV-2026-004",
    invoiceNo: "INV-2026-004",
    milestoneId: "ms-4",
    milestoneName: "UAT Sign-off",
    amount: 370000,
    pct: 20,
    dueDate: "2026-07-31",
    status: "Draft",
    invoiceDate: "",
    paidDate: "",
    clientName: "Nexgen Technologies Pvt. Ltd.",
    poNumber: "PO-2026-0041",
    taxType: "GST 18%",
    notes: "",
  },
  {
    id: "INV-2026-005",
    invoiceNo: "INV-2026-005",
    milestoneId: "ms-5",
    milestoneName: "Go Live",
    amount: 185000,
    pct: 10,
    dueDate: "2026-09-30",
    status: "Draft",
    invoiceDate: "",
    paidDate: "",
    clientName: "Nexgen Technologies Pvt. Ltd.",
    poNumber: "PO-2026-0041",
    taxType: "GST 18%",
    notes: "",
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function statusBadge(status: InvoiceStatus) {
  const classes: Record<InvoiceStatus, string> = {
    Draft: "bg-slate-100 text-slate-500",
    Sent: "bg-blue-100 text-blue-700",
    Paid: "bg-green-100 text-green-700",
    Overdue: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes[status]}`}
    >
      {status}
    </span>
  );
}

function GenerateInvoiceModal({
  invoice,
  onClose,
  onMarkSent,
}: {
  invoice: Invoice;
  onClose: () => void;
  onMarkSent: (id: string) => void;
}) {
  const tax = Math.round(invoice.amount * TAX_RATE);
  const total = invoice.amount + tax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          ✕
        </button>

        <div className="p-8">
          {/* Invoice Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <div className="mb-1 text-2xl font-bold text-indigo-600">iProfit Technologies</div>
              <div className="text-sm text-slate-500">Pvt. Ltd.</div>
              <div className="mt-1 text-xs text-slate-400">
                123, Tech Park, Pune — 411 014<br />
                GSTIN: 27AAACP1234A1ZQ
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold tracking-tight text-slate-800">INVOICE</div>
              <div className="mt-1 text-lg font-semibold text-indigo-600">{invoice.invoiceNo}</div>
              <div className="mt-1 text-sm text-slate-500">
                Date: {invoice.invoiceDate ? formatDate(invoice.invoiceDate) : formatDate(today())}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 border-t border-slate-200" />

          {/* Bill To */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Bill To
              </div>
              <div className="text-sm font-semibold text-slate-800">{invoice.clientName}</div>
              <div className="mt-0.5 text-sm text-slate-500">
                PO Number: {invoice.poNumber}
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Due Date
              </div>
              <div className="text-sm font-semibold text-slate-800">{formatDate(invoice.dueDate)}</div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-6 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Description</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">
                    {invoice.milestoneName}
                    <span className="ml-2 text-xs text-slate-400">({invoice.pct}% of contract)</span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800">
                    {formatCurrency(invoice.amount)}
                  </td>
                </tr>
                <tr className="border-t border-slate-100 bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-500">{invoice.taxType}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(tax)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-indigo-50">
                  <td className="px-4 py-3 font-bold text-slate-800">Total Payable</td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-indigo-700">
                    {formatCurrency(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Instructions */}
          <div className="mb-6 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Payment Instructions:</span> Transfer to HDFC Bank,
            A/c: 50200012345678, IFSC: HDFC0001234, Account Name: iProfit Technologies Pvt. Ltd.
            Please quote invoice number in transfer remarks.
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
            {invoice.status === "Draft" && (
              <button
                onClick={() => {
                  onMarkSent(invoice.id);
                  onClose();
                }}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                Mark as Sent
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<"All" | InvoiceStatus>("All");
  const [modalInvoice, setModalInvoice] = useState<Invoice | null>(null);

  // Load + seed on mount
  useEffect(() => {
    let loaded: Invoice[] = [];

    try {
      const raw = localStorage.getItem("pm_invoices");
      if (raw) {
        loaded = JSON.parse(raw) as Invoice[];
      }
    } catch {
      loaded = [];
    }

    if (!loaded || loaded.length === 0) {
      // Try seeding from onboarding draft
      try {
        const draftRaw = localStorage.getItem("pm_onboarding_draft");
        if (draftRaw) {
          const draft = JSON.parse(draftRaw);
          const milestones: Array<{ id: string; name: string; pct: number; dueDate: string }> =
            draft?.paymentMilestones ?? [];
          const totalBudget: number = draft?.totalBudget ?? 0;
          const clientName: string =
            draft?.clientCompany?.name ?? draft?.clientAccount?.companyName ?? "Nexgen Technologies";
          const poNumber: string = draft?.clientAccount?.poNumber ?? "—";
          const taxType: string = draft?.taxType ?? "GST 18%";
          const year = new Date().getFullYear();

          if (milestones.length > 0) {
            loaded = milestones.map((ms, i) => ({
              id: `INV-${year}-${String(i + 1).padStart(3, "0")}`,
              invoiceNo: `INV-${year}-${String(i + 1).padStart(3, "0")}`,
              milestoneId: ms.id,
              milestoneName: ms.name,
              amount: Math.round((totalBudget * ms.pct) / 100),
              pct: ms.pct,
              dueDate: ms.dueDate ?? "",
              status: "Draft",
              invoiceDate: "",
              paidDate: "",
              clientName,
              poNumber,
              taxType,
              notes: "",
            }));
          }
        }
      } catch {
        // ignore parse errors
      }

      // Fall back to sample data
      if (loaded.length === 0) {
        loaded = SAMPLE_INVOICES;
      }
    }

    // Auto-mark overdue: Sent invoices with dueDate < today
    const todayStr = today();
    loaded = loaded.map((inv) => {
      if (inv.status === "Sent" && inv.dueDate && inv.dueDate < todayStr) {
        return { ...inv, status: "Overdue" as InvoiceStatus };
      }
      return inv;
    });

    setInvoices(loaded);
    persist(loaded);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write overdue count to dashboard key
  useEffect(() => {
    const count = invoices.filter((inv) => inv.status === "Overdue").length;
    localStorage.setItem("pm_overdue_invoices", String(count));
  }, [invoices]);

  function persist(list: Invoice[]) {
    localStorage.setItem("pm_invoices", JSON.stringify(list));
  }

  function updateInvoice(id: string, changes: Partial<Invoice>) {
    setInvoices((prev) => {
      const next = prev.map((inv) => (inv.id === id ? { ...inv, ...changes } : inv));
      persist(next);
      return next;
    });
  }

  function markSent(id: string) {
    updateInvoice(id, { status: "Sent", invoiceDate: today() });
  }

  function markPaid(id: string) {
    updateInvoice(id, { status: "Paid", paidDate: today() });
  }

  function markOverdue(id: string) {
    updateInvoice(id, { status: "Overdue" });
  }

  // KPI calculations
  const totalContract = invoices.reduce((s, inv) => s + inv.amount, 0);
  const received = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((s, inv) => s + inv.amount, 0);
  const pending = invoices
    .filter((inv) => inv.status === "Draft" || inv.status === "Sent")
    .reduce((s, inv) => s + inv.amount, 0);
  const overdue = invoices
    .filter((inv) => inv.status === "Overdue")
    .reduce((s, inv) => s + inv.amount, 0);

  const filtered =
    filter === "All" ? invoices : invoices.filter((inv) => inv.status === filter);

  const tabs: Array<"All" | InvoiceStatus> = ["All", "Draft", "Sent", "Paid", "Overdue"];

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Invoice Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track, generate, and manage project invoices tied to payment milestones.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Contract */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Contract Value
          </div>
          <div className="text-2xl font-bold text-slate-800">{formatCurrency(totalContract)}</div>
          <div className="mt-1 text-xs text-slate-400">{invoices.length} invoices</div>
        </div>

        {/* Received */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-500">
            Received
          </div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(received)}</div>
          <div className="mt-1 text-xs text-slate-400">
            {invoices.filter((i) => i.status === "Paid").length} paid invoices
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-500">
            Pending
          </div>
          <div className="text-2xl font-bold text-amber-600">{formatCurrency(pending)}</div>
          <div className="mt-1 text-xs text-slate-400">
            {invoices.filter((i) => i.status === "Draft" || i.status === "Sent").length} draft / sent
          </div>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-500">
            Overdue
          </div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(overdue)}</div>
          <div className="mt-1 text-xs text-slate-400">
            {invoices.filter((i) => i.status === "Overdue").length} overdue invoices
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-2xl bg-white shadow-sm">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 border-b border-slate-100 px-6 pt-4">
          {tabs.map((tab) => {
            const count =
              tab === "All" ? invoices.length : invoices.filter((i) => i.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`mb-[-1px] rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === tab
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                    filter === tab ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center mx-6 my-6">
            <div className="mb-2 text-3xl text-slate-300">📄</div>
            <div className="text-sm font-medium text-slate-500">No invoices yet</div>
            <div className="mt-1 text-xs text-slate-400">
              Onboard a project to auto-generate invoices from payment milestones.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-500">Invoice No</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Milestone</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Due Date</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-500">Amount</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-500">% of Total</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-500">Tax (18%)</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const isOverdue = inv.status === "Overdue";
                  const tax = Math.round(inv.amount * TAX_RATE);

                  return (
                    <tr
                      key={inv.id}
                      className={`border-b border-slate-50 transition-colors hover:bg-slate-50/60 ${
                        isOverdue ? "border-l-4 border-l-red-400" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">{inv.invoiceNo}</td>
                      <td className="px-4 py-4 text-slate-700">{inv.milestoneName}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(inv.dueDate)}</td>
                      <td className="px-4 py-4 text-right font-semibold text-slate-800">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-500">{inv.pct}%</td>
                      <td className="px-4 py-4 text-right text-slate-500">{formatCurrency(tax)}</td>
                      <td className="px-4 py-4">{statusBadge(inv.status)}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {inv.status === "Draft" && (
                            <>
                              <button
                                onClick={() => setModalInvoice(inv)}
                                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                              >
                                Generate Invoice
                              </button>
                              <button
                                onClick={() => markSent(inv.id)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                              >
                                Mark as Sent
                              </button>
                            </>
                          )}

                          {inv.status === "Sent" && (
                            <>
                              <button
                                onClick={() => markPaid(inv.id)}
                                className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
                              >
                                Mark as Paid
                              </button>
                              <button
                                onClick={() => markOverdue(inv.id)}
                                className="text-xs text-red-400 underline hover:text-red-600"
                              >
                                Mark Overdue
                              </button>
                            </>
                          )}

                          {inv.status === "Paid" && (
                            <span className="text-xs text-slate-400">
                              Paid {formatDate(inv.paidDate)}
                            </span>
                          )}

                          {inv.status === "Overdue" && (
                            <button
                              onClick={() => markPaid(inv.id)}
                              className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
                            >
                              Mark as Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Invoice Modal */}
      {modalInvoice && (
        <GenerateInvoiceModal
          invoice={modalInvoice}
          onClose={() => setModalInvoice(null)}
          onMarkSent={(id) => {
            markSent(id);
            setModalInvoice(null);
          }}
        />
      )}
    </div>
  );
}
