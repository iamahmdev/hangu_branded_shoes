import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { ProductFormData } from "./types";
import { resolveProductImage } from "../../utils/image";
import { X, Upload, Check, Image as ImageIcon, Loader2 } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductFormData) => Promise<void>;
  initialData?: ProductFormData | null;
  onUploadImage: (file: File) => Promise<{ success: boolean; data?: { url: string }; message?: string }>;
}

const CATEGORIES = ["Sneakers", "Formal", "Loafers", "Comfort"];
const AVAILABLE_SIZES = ["39", "40", "41", "42", "43", "44"];
const BADGES = ["None", "New", "Hot", "Sale", "Bestseller", "Limited"];

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  onUploadImage,
}: ProductModalProps) {
  if (!isOpen) return null;

  const isEditing = Boolean(initialData && initialData.id);

  const [form, setForm] = useState<ProductFormData>({
    name: "",
    cat: "Sneakers",
    price: 6499,
    old: 7999,
    img: "/images/p1.jpg",
    tag: "New",
    stock: 25,
    desc: "",
    brand: "Hangu Branded Shoes",
    sizes: ["40", "41", "42", "43", "44"],
  });

  const [uploading, setUploading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        name: initialData.name || "",
        cat: initialData.cat || "Sneakers",
        price: initialData.price || 6499,
        old: initialData.old || 7999,
        img: initialData.img || "/images/p1.jpg",
        tag: initialData.tag || "",
        stock: initialData.stock || 25,
        desc: initialData.desc || "",
        brand: initialData.brand || "Hangu Branded Shoes",
        sizes: initialData.sizes && initialData.sizes.length > 0 ? initialData.sizes : ["40", "41", "42", "43", "44"],
      });
    }
  }, [initialData]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const res = await onUploadImage(file);
      if (res.success && res.data?.url) {
        setForm((prev) => ({ ...prev, img: res.data!.url }));
      } else {
        setError(res.message || "Failed to upload image to Cloudinary.");
      }
    } catch (err: any) {
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const toggleSize = (sz: string) => {
    setForm((prev) => {
      const exists = prev.sizes.includes(sz);
      const nextSizes = exists ? prev.sizes.filter((s) => s !== sz) : [...prev.sizes, sz];
      return { ...prev, sizes: nextSizes };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.desc.trim()) {
      setError("Product title and description are required.");
      return;
    }
    if (form.sizes.length === 0) {
      setError("Please select at least one available shoe size.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="glass p-6 md:p-8 rounded-3xl max-w-xl w-full border border-white/15 bg-zinc-950/95 shadow-2xl relative my-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <h2 className="text-lg md:text-xl font-bold text-white">
            {isEditing ? `Edit Product #${form.id}` : "Add New Footwear Model"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-zinc-300 font-semibold block mb-1">Product Title</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Oxford Cap-Toe Royal Leather"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Category</label>
              <select
                value={form.cat}
                onChange={(e) => setForm({ ...form, cat: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-brand-gold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-zinc-950 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Sale Price (Rs.)</label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-brand-gold font-mono font-bold outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Original Price (Rs.)</label>
              <input
                type="number"
                min={0}
                value={form.old}
                onChange={(e) => setForm({ ...form, old: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-400 font-mono outline-none focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Inventory Stock</label>
              <input
                type="number"
                required
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Badge & Brand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Badge Tag</label>
              <select
                value={form.tag || "None"}
                onChange={(e) => setForm({ ...form, tag: e.target.value === "None" ? "" : e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-brand-gold"
              >
                {BADGES.map((b) => (
                  <option key={b} value={b} className="bg-zinc-950 text-white">
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Brand Name</label>
              <input
                type="text"
                value={form.brand || "Hangu Branded Shoes"}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Sizes Selection */}
          <div>
            <label className="text-zinc-300 font-semibold block mb-1.5">
              Available Shoe Sizes (EU / PK)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVAILABLE_SIZES.map((sz) => {
                const isSelected = form.sizes.includes(sz);
                return (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`w-9 h-9 rounded-xl font-bold font-mono text-xs transition-all ${
                      isSelected
                        ? "bg-brand-gold text-black shadow-glow"
                        : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Upload & Preview */}
          <div>
            <label className="text-zinc-300 font-semibold block mb-1.5">
              Shoe Image (Cloudinary or Direct URL)
            </label>
            <div className="flex items-center gap-3">
              <img
                src={resolveProductImage(form.img)}
                alt="Product Preview"
                className="w-16 h-16 rounded-2xl object-cover bg-zinc-900 border border-white/15 shrink-0"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or image path"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-[11px] outline-none focus:border-brand-gold"
                />
                <div className="flex items-center gap-2">
                  <label className="btn ghost py-1.5 px-3 text-[11px] font-bold cursor-pointer inline-flex items-center gap-1.5 hover:bg-white/10">
                    <Upload size={13} />
                    <span>{uploading ? "Uploading to Cloud..." : "Upload from Device"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {uploading && <Loader2 size={14} className="animate-spin text-brand-gold" />}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-zinc-300 font-semibold block mb-1">Product Description</label>
            <textarea
              required
              rows={3}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Comfortable handcrafted leather shoe with cushioned insole..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-brand-gold"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="btn ghost py-2.5 px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn py-2.5 px-5 text-xs font-bold disabled:opacity-50 inline-flex items-center gap-1.5 shadow-glow"
            >
              {submitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>{isEditing ? "Save Changes" : "Create Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

