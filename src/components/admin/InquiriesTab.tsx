import { useState } from "react";
import { MessageSquare, Phone, Mail, MapPin, Trash2, CheckCircle, Clock } from "lucide-react";
import { WhatsAppIcon } from "../WhatsAppButton";

interface InquiriesTabProps {
  inquiries: any[];
  filterStatus: string;
  onFilterChange: (status: string) => void;
  onUpdateStatus: (id: string, status: string, adminNotes?: string) => void;
  onDeleteInquiry: (id: string) => void;
  isLoading?: boolean;
}

const STATUS_FILTERS = ["all", "new", "replied", "resolved"];

export default function InquiriesTab({
  inquiries,
  filterStatus,
  onFilterChange,
  onUpdateStatus,
  onDeleteInquiry,
  isLoading = false,
}: InquiriesTabProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [adminNote, setAdminNote] = useState<string>("");

  const filtered = inquiries.filter((inq) => {
    if (filterStatus === "all") return true;
    return inq.status === filterStatus;
  });

  const handleWhatsAppReply = (inq: any) => {
    const cleanPhone = (inq.phone || "").replace(/[^0-9]/g, "");
    const msg = `Assalam-o-Alaikum *${inq.name}*! 👟\n\nThank you for reaching out to *Hangu Branded Shoes* regarding "${inq.subject || "Footwear Inquiry"}".\n\nHow can we assist you with your shoe order today?`;
    const waUrl = cleanPhone.startsWith("0")
      ? `https://wa.me/92${cleanPhone.slice(1)}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
    onUpdateStatus(inq._id, "replied");
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header & Filter Pills */}
      <div className="glass p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-brand-gold" />
            <span>Customer Inquiries & Leads</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage inquiries submitted via the Contact Us storefront page
          </p>
        </div>

        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map((st) => {
            const count =
              st === "all"
                ? inquiries.length
                : inquiries.filter((i) => i.status === st).length;
            const isSelected = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => onFilterChange(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-brand-red text-white shadow-glow"
                    : "bg-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-black/40 text-white" : "bg-white/10 text-zinc-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Subject / Shoe Interest</th>
                <th className="p-4">Message</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-400">
                    Loading inquiries...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    No {filterStatus === "all" ? "" : filterStatus} inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((inq: any) => {
                  const isNew = inq.status === "new";
                  return (
                    <tr key={inq._id} className="hover:bg-white/5 transition-colors">
                      {/* Customer Details */}
                      <td className="p-4">
                        <b className="text-white text-xs block">{inq.name}</b>
                        <span className="text-brand-gold font-mono text-[11px] block mt-0.5">
                          {inq.phone}
                        </span>
                        {inq.email && (
                          <span className="text-zinc-500 text-[10px] block truncate max-w-[150px]">
                            {inq.email}
                          </span>
                        )}
                      </td>

                      {/* Subject */}
                      <td className="p-4">
                        <span className="text-white font-semibold text-xs block">
                          {inq.subject || "General Inquiry"}
                        </span>
                        {inq.city && (
                          <span className="text-zinc-400 text-[11px] block mt-0.5">
                            📍 {inq.city}
                          </span>
                        )}
                      </td>

                      {/* Message Body */}
                      <td className="p-4 max-w-xs">
                        <p className="text-zinc-300 text-xs line-clamp-2 leading-relaxed" title={inq.message}>
                          "{inq.message}"
                        </p>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(inq.createdAt || Date.now()).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={inq.status}
                          onChange={(e) => onUpdateStatus(inq._id, e.target.value)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase outline-none cursor-pointer border ${
                            isNew
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : inq.status === "replied"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                          }`}
                        >
                          <option value="new" className="bg-zinc-950 text-white">NEW</option>
                          <option value="replied" className="bg-zinc-950 text-white">REPLIED</option>
                          <option value="resolved" className="bg-zinc-950 text-white">RESOLVED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleWhatsAppReply(inq)}
                            className="p-2 rounded-xl bg-[#25d366]/15 hover:bg-[#25d366]/30 text-[#25d366] border border-[#25d366]/30 transition-colors"
                            title="Reply directly on WhatsApp"
                          >
                            <WhatsAppIcon size={14} color="#25d366" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete inquiry from "${inq.name}"?`)) {
                                onDeleteInquiry(inq._id);
                              }
                            }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 border border-white/10 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
