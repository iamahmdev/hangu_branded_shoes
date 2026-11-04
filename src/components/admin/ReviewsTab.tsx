import { Star, CheckCircle, Trash2, MessageSquare, ShieldCheck } from "lucide-react";

interface ReviewsTabProps {
  reviews: any[];
  onUpdateStatus: (id: string, status: string) => void;
  onDeleteReview: (id: string) => void;
  isLoading?: boolean;
}

export default function ReviewsTab({
  reviews,
  onUpdateStatus,
  onDeleteReview,
  isLoading = false,
}: ReviewsTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="glass p-4 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Star size={18} className="text-brand-gold fill-brand-gold" />
            <span>Customer Reviews Moderation</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Approve or reject customer ratings displayed publicly on the storefront and shoe pages
          </p>
        </div>

        <div className="text-xs text-zinc-400">
          Total Reviews: <b className="text-white font-mono">{reviews.length}</b>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Footwear Model</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Customer Feedback</th>
                <th className="p-4">Moderation Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-400">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-zinc-500">
                    No customer reviews submitted yet.
                  </td>
                </tr>
              ) : (
                reviews.map((r: any) => {
                  const reviewerName = r.userName || r.name || "Customer";
                  return (
                    <tr key={r._id} className="hover:bg-white/5 transition-colors">
                      {/* Customer */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <b className="text-white text-xs block">{reviewerName}</b>
                          {r.verified && (
                            <span
                              className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-green-500/20 text-green-400 border border-green-500/30"
                              title="Verified Buyer"
                            >
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        {r.city && (
                          <span className="text-zinc-500 text-[10px] block mt-0.5">
                            📍 {r.city}
                          </span>
                        )}
                      </td>

                      {/* Shoe Reviewed */}
                      <td className="p-4">
                        <span className="text-brand-gold font-semibold text-xs block">
                          {r.shoeName || "Footwear"}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-brand-gold">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={
                                s <= r.rating ? "fill-brand-gold text-brand-gold" : "text-zinc-700"
                              }
                            />
                          ))}
                          <span className="font-mono text-xs font-bold text-white ml-1.5">
                            {r.rating}.0
                          </span>
                        </div>
                      </td>

                      {/* Comment */}
                      <td className="p-4 max-w-sm">
                        <p className="text-zinc-300 text-xs line-clamp-2 leading-relaxed" title={r.comment}>
                          "{r.comment}"
                        </p>
                      </td>

                      {/* Moderation Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={r.status || "approved"}
                          onChange={(e) => onUpdateStatus(r._id, e.target.value)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase outline-none cursor-pointer border ${
                            r.status === "approved"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : r.status === "rejected"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <option value="approved" className="bg-zinc-950 text-white">APPROVED</option>
                          <option value="pending" className="bg-zinc-950 text-white">PENDING</option>
                          <option value="rejected" className="bg-zinc-950 text-white">REJECTED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Delete review by "${reviewerName}"?`)) {
                              onDeleteReview(r._id);
                            }
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 border border-white/10 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 size={14} />
                        </button>
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

