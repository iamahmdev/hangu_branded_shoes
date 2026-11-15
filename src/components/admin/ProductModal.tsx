import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { ProductFormData } from "./types";
import { resolveProductImage } from "../../utils/image";
import { X, ArrowLeft, Upload, Check, Image as ImageIcon, Loader2 } from "lucide-react";

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
    isActive: true,
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
        isActive: initialData.isActive !== false,
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
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 animate-fadeIn">
      <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-8">
        <div className="bg-white p-5 sm:p-7 md:p-8 rounded-3xl max-w-xl w-full border border-slate-200/90 shadow-2xl relative text-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>← Back to Products</span>
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
              {isEditing ? `Edit Shoe #${form.id}` : "Add New Shoe"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-slate-700 font-semibold block mb-1">Shoe Name / Title</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Royal Cap-Toe Leather Oxford"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Category</label>
              <select
                value={form.cat}
                onChange={(e) => setForm({ ...form, cat: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Price (Rs.)</label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-emerald-700 font-mono font-bold outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Cut Price (Rs.)</label>
              <input
                type="number"
                min={0}
                value={form.old}
                onChange={(e) => setForm({ ...form, old: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-400 font-mono outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Total Stock</label>
              <input
                type="number"
                required
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Badge & Brand */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Badge Tag</label>
              <select
                value={form.tag || "None"}
                onChange={(e) => setForm({ ...form, tag: e.target.value === "None" ? "" : e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white cursor-pointer"
              >
                {BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Brand Name</label>
              <input
                type="text"
                value={form.brand || "Hangu Branded Shoes"}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Sizes Selection */}
          <div>
            <label className="text-slate-700 font-semibold block mb-1.5">
              Available Shoe Sizes (Click to toggle)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVAILABLE_SIZES.map((sz) => {
                const isSelected = form.sizes.includes(sz);
                return (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`w-10 h-10 rounded-xl font-bold font-mono text-xs transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
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
            <label className="text-slate-700 font-semibold block mb-1.5">
              Shoe Photo (Cloudinary or Direct Path)
            </label>
            <div className="flex items-center gap-3">
              <img
                src={resolveProductImage(form.img)}
                alt="Product Preview"
                className="w-16 h-16 rounded-2xl object-contain bg-slate-50 border border-slate-200 shrink-0 p-1"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or image path"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-[11px] outline-none focus:border-emerald-500 focus:bg-white"
                />
                <div className="flex items-center gap-2">
                  <label className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer inline-flex items-center gap-1.5 border border-slate-200 transition-colors">
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
                  {uploading && <Loader2 size={14} className="animate-spin text-emerald-600" />}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-700 font-semibold block mb-1">Product Description</label>
            <textarea
              required
              rows={3}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Comfortable handcrafted leather shoe with cushioned insole..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* Status Active/Disabled Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <b className="text-slate-900 block text-xs">Catalog Status</b>
              <span className="text-[11px] text-slate-500">
                {form.isActive !== false
                  ? "Visible to customers in footwear catalog (Active)"
                  : "Hidden from customers (Disabled)"}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive !== false}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="py-2.5 px-5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm transition-colors"
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
  </div>
);
}

