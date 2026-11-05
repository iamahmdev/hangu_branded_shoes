import { useState, FormEvent, ChangeEvent } from "react";
import { useReviews, useCreateReview, useProducts } from "../hooks/useApi";

interface ReviewItem {
  id: string | number;
  n: string;
  c?: string;
  r: number;
  p: string;
  t: string;
  d: string;
  v?: number;
}

const Stars = ({ n }: { n: number }) => (
  <span className="stars text-brand-gold">
    {"★".repeat(Math.max(1, Math.min(5, n)))}
    <i className="text-zinc-600 not-italic">{"★".repeat(Math.max(0, 5 - Math.max(1, Math.min(5, n))))}</i>
  </span>
);

export default function Reviews() {
  const { data: reviewsResponse, isLoading } = useReviews();
  const { data: products } = useProducts();
  const createReviewMutation = useCreateReview();

  const [filterRating, setFilterRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successToast, setSuccessToast] = useState<boolean>(false);
  const [form, setForm] = useState({
    n: "",
    c: "",
    p: "",
    t: "",
  });

  const reviewsList: ReviewItem[] = (reviewsResponse?.data || []).map((r: any) => ({
    id: r._id || r.id,
    n: r.userName || r.name || r.n || "Customer",
    c: r.city || "Pakistan",
    r: r.rating || 5,
    p: r.shoeName || r.productName || "Hangu Branded Shoe",
    t: r.comment || r.text || "",
    d: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recently",
    v: r.verified ? 1 : 0,
  }));

  const totalReviews = reviewsList.length;
  const avg =
    totalReviews > 0
      ? (reviewsList.reduce((acc, r) => acc + r.r, 0) / totalReviews).toFixed(1)
      : "5.0";

  const handleChange = (k: string) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRating) {
      setErrorMsg("Please select a star rating.");
      return;
    }

    const shoeSelection = form.p || products?.[0]?.name || "Skylite Slip-On Sneaker";

    createReviewMutation.mutate(
      {
        name: form.n,
        userName: form.n,
        city: form.c,
        shoeName: shoeSelection,
        rating: selectedRating,
        comment: form.t,
      },
      {
        onSuccess: () => {
          setForm({ n: "", c: "", p: "", t: "" });
          setSelectedRating(5);
          setErrorMsg("");
          setSuccessToast(true);
          setTimeout(() => setSuccessToast(false), 5000);
        },
        onError: (err: any) => {
          setErrorMsg(err?.message || "Failed to submit review.");
        },
      }
    );
  };

  return (
    <div id="reviews">
      <div className="title text-center mb-8">
        <small className="text-brand-red uppercase tracking-wider text-xs font-bold">REVIEWS</small>
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mt-1">What Our Customers Say</h2>
      </div>

      {/* Aggregate Stats Summary Card */}
      <div className="bg-white border border-zinc-200/80 shadow-sm rsum p-6 rounded-3xl flex flex-wrap items-center justify-around gap-6 mb-10">
        <div className="avg text-center">
          <b className="text-4xl md:text-5xl font-extrabold text-zinc-900 block">{avg}</b>
          <Stars n={Math.round(Number(avg))} />
          <p className="text-zinc-500 text-xs mt-1">Based on {totalReviews} customer reviews</p>
        </div>
        <div className="flex flex-col gap-1.5 min-w-[240px]">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = reviewsList.filter((x) => x.r === s).length;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div className="bar flex items-center gap-2 text-xs text-zinc-500" key={s}>
                <span className="w-6 font-mono">{s}★</span>
                <div className="flex-1 bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <i className="block bg-brand-gold h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-6 text-right font-mono">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rw grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
        {/* Write a Review Form */}
        <form className="bg-white border border-zinc-200/80 shadow-sm rform p-6 rounded-3xl flex flex-col gap-3.5 h-fit" onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold text-zinc-900">Write a Review</h3>
          <p className="text-zinc-500 text-xs">Bought from us? Share your experience with shoe fit and sole comfort.</p>

          <div className="rate flex gap-1 text-2xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={n <= selectedRating ? "on text-brand-gold" : "text-zinc-300"}
                onClick={() => {
                  setSelectedRating(n);
                  setErrorMsg("");
                }}
              >
                ★
              </span>
            ))}
          </div>

          {errorMsg && <div className="rerr text-brand-red text-xs">{errorMsg}</div>}

          <input
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 text-xs outline-none focus:border-zinc-900"
            required
            placeholder="Your full name"
            value={form.n}
            onChange={handleChange("n")}
          />

          <input
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 text-xs outline-none focus:border-zinc-900"
            placeholder="City (e.g. Peshawar, Lahore, Kohat)"
            value={form.c}
            onChange={handleChange("c")}
          />

          <select
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 text-xs outline-none focus:border-zinc-900"
            value={form.p || products?.[0]?.name || ""}
            onChange={handleChange("p")}
          >
            {products?.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <textarea
            className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 text-xs outline-none focus:border-zinc-900"
            required
            rows={3}
            placeholder="Tell us about the fit, sole cushioning and finish…"
            value={form.t}
            onChange={handleChange("t")}
          />

          <button
            type="submit"
            disabled={createReviewMutation.isPending}
            className="btn w-full py-2.5 text-xs font-bold disabled:opacity-50"
          >
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {/* Reviews List & Filter Chips */}
        <div className="flex flex-col gap-4">
          {successToast && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold animate-fadeIn">
              ✅ Thank you! Your review has been saved to the database.
            </div>
          )}

          <div className="chips flex gap-2 flex-wrap mb-2">
            {[0, 5, 4, 3].map((s) => (
              <button
                key={s}
                className={
                  "sz px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all " +
                  (filterRating === s
                    ? "on bg-zinc-900 border-zinc-900 text-white"
                    : "border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400")
                }
                onClick={() => setFilterRating(s)}
              >
                {s ? s + " ★" : "All Reviews"}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-zinc-200 p-5 rounded-2xl h-24 animate-pulse" />
              ))}
            </div>
          ) : (
            reviewsList
              .filter((x) => !filterRating || x.r === filterRating)
              .map((x) => (
                <div className="bg-white border border-zinc-200/80 shadow-sm rcard p-5 rounded-2xl flex flex-col gap-2" key={x.id}>
                  <div className="rtop flex items-center gap-3">
                    <div className="av w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                      {(x.n && x.n[0]) || "U"}
                    </div>
                    <div>
                      <b className="text-zinc-900 text-sm block font-bold">{x.n || "Anonymous Customer"}</b>
                      {x.v ? (
                        <span className="vb text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5">✔ Verified Buyer</span>
                      ) : (
                        <span className="vb text-[11px] text-amber-700 bg-amber-50 border border-amber-200 font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5">Verified Review</span>
                      )}
                      <br />
                      <small className="text-zinc-500 text-xs">
                        {x.c || "Pakistan"} • {x.d}
                      </small>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                      <Stars n={x.r} />
                    </div>
                  </div>
                  <p className="text-zinc-700 text-sm mt-1 leading-relaxed">{x.t}</p>
                  <small className="text-zinc-500 text-xs">Shoe: {x.p}</small>
                </div>
              ))
          )}

          {!isLoading && reviewsList.length === 0 && (
            <div className="bg-white border border-zinc-200/80 shadow-sm p-8 text-center rounded-2xl text-zinc-500 text-xs">
              No reviews available yet. Be the first customer to leave feedback!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
