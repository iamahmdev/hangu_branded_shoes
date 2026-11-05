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
      {/* Header Bar Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Star size={18} className="text-amber-500 fill-amber-500" />
            <span>Customer Reviews Moderation</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Approve or reject customer ratings displayed publicly on the storefront and shoe pages
          </p>
        </div>

        <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          Total Reviews: <b className="text-slate-900 font-mono">{reviews.length}</b>
        </div>
      </div>

      {/* Reviews Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase text-slate-500 text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4 whitespace-nowrap">Customer</th>
                <th className="p-4 whitespace-nowrap">Footwear Model</th>
                <th className="p-4 whitespace-nowrap">Rating</th>
                <th className="p-4 whitespace-nowrap">Customer Feedback</th>
                <th className="p-4 whitespace-nowrap">Moderation Status</th>
                <th className="p-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    No customer reviews submitted yet.
                  </td>
                </tr>
              ) : (
                reviews.map((r: any) => {
                  const reviewerName = r.userName || r.name || "Customer";
                  return (
                    <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Customer */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <b className="text-slate-900 text-xs block">{reviewerName}</b>
                          {r.verified && (
                            <span
                              className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                              title="Verified Buyer"
                            >
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        {r.city && (
                          <span className="text-slate-400 text-[10px] block mt-0.5">
                            📍 {r.city}
                          </span>
                        )}
                      </td>

                      {/* Shoe Reviewed */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="text-slate-900 font-semibold text-xs block">
                          {r.shoeName || "Footwear"}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={
                                s <= r.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"
                              }
                            />
                          ))}
                          <span className="font-mono text-xs font-bold text-slate-900 ml-1.5">
                            {r.rating}.0
                          </span>
                        </div>
                      </td>

                      {/* Comment */}
                      <td className="p-4 max-w-sm">
                        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed" title={r.comment}>
                          "{r.comment}"
                        </p>
                      </td>

                      {/* Moderation Status Dropdown */}
                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={r.status || "approved"}
                          onChange={(e) => onUpdateStatus(r._id, e.target.value)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase outline-none cursor-pointer border ${
                            r.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : r.status === "rejected"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <option value="approved">APPROVED</option>
                          <option value="pending">PENDING</option>
                          <option value="rejected">REJECTED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (confirm(`Delete review by "${reviewerName}"?`)) {
                              onDeleteReview(r._id);
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors"
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
