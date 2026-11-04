import { useState } from "react";
import { Users, Copy, Download, Trash2, Check, Mail } from "lucide-react";

interface SubscribersTabProps {
  subscribers: any[];
  onDeleteSubscriber: (id: string) => void;
  isLoading?: boolean;
}

export default function SubscribersTab({
  subscribers,
  onDeleteSubscriber,
  isLoading = false,
}: SubscribersTabProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmails = () => {
    const emails = subscribers.map((s) => s.email).filter(Boolean).join(", ");
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCSV = () => {
    const headers = "Email,Source,Subscribed Date\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${s.email}","${s.source || "footer"}","${
            s.createdAt ? new Date(s.createdAt).toISOString() : ""
          }"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `hangu_shoes_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="glass p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users size={18} className="text-brand-gold" />
            <span>VIP Newsletter Subscribers</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Registered customer emails for seasonal drop announcements and discount promos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyEmails}
            disabled={subscribers.length === 0}
            className="btn ghost py-2 px-3.5 text-xs text-zinc-300 hover:text-white inline-flex items-center gap-1.5"
            title="Copy all emails comma-separated"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            <span>{copied ? "Copied All!" : "Copy Emails"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="btn py-2 px-3.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-glow"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Email Address</th>
                <th className="p-4">Acquisition Source</th>
                <th className="p-4">Subscription Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-400">
                    Loading VIP subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    No newsletter subscribers registered yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((s: any) => (
                  <tr key={s._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-brand-gold" />
                        <b className="text-white text-xs font-mono">{s.email}</b>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-zinc-300 border border-white/10">
                        {s.source || "website_footer"}
                      </span>
                    </td>

                    <td className="p-4 text-zinc-400 font-mono text-[11px]">
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recently"}
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-green-500/15 text-green-400 border border-green-500/30">
                        Active
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Unsubscribe email "${s.email}"?`)) {
                            onDeleteSubscriber(s._id);
                          }
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 border border-white/10 transition-colors"
                        title="Remove Subscriber"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

