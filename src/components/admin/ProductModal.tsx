import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { ProductFormData } from "./types";
import { resolveProductImage } from "../../utils/image";
import { X, ArrowLeft, Upload, Check, Loader2, Trash2 } from "lucide-react";

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
const PRESET_COLORS = [
  "Black",
  "Brown",
  "Dark Brown",
  "Tan",
  "White",
  "Navy Blue",
  "Royal Blue",
  "Grey",
  "Light Grey",
  "Dark Grey",
  "Beige",
  "Camel",
  "Olive Green",
  "Army Green",
  "Burgundy",
  "Maroon",
  "Red",
  "Mustard Yellow",
  "Dark Yellow",
  "Yellow",
  "Khaki",
  "Charcoal",
  "Coffee",
  "Silver"
];

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
    img: "",
    images: [],
    colors: ["Black", "Brown"],
    tag: "New",
    stock: 25,
    desc: "",
    brand: "Hangu Branded Shoes",
    sizes: ["40", "41", "42", "43", "44"],
    isActive: true,
  });

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [newColorInput, setNewColorInput] = useState<string>("");
  const [customImageUrl, setCustomImageUrl] = useState<string>("");
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      const initialImages = (Array.isArray(initialData.images) && initialData.images.length > 0
        ? initialData.images
        : (initialData.img ? [initialData.img] : [])).filter((u) => u && u !== "/images/p1.jpg");

      const coverImg = (initialData.img && initialData.img !== "/images/p1.jpg")
        ? initialData.img
        : (initialImages[0] || "");

      setForm({
        id: initialData.id,
        name: initialData.name || "",
        cat: initialData.cat || "Sneakers",
        price: initialData.price || 3500,
        old: initialData.old || 4999,
        img: coverImg,
        images: initialImages.length > 0 ? initialImages : (coverImg ? [coverImg] : []),
        colors: initialData.colors && initialData.colors.length > 0 ? initialData.colors : ["Black", "Brown"],
        tag: initialData.tag || "",
        stock: initialData.stock ?? 25,
        desc: initialData.desc || "",
        brand: initialData.brand || "Hangu Branded Shoes",
        sizes: initialData.sizes && initialData.sizes.length > 0 ? initialData.sizes : ["40", "41", "42", "43", "44"],
        isActive: initialData.isActive !== false,
      });
    } else {
      setForm({
        name: "",
        cat: "Sneakers",
        price: 3500,
        old: 4999,
        img: "",
        images: [],
        colors: ["Black", "Brown"],
        tag: "New",
        stock: 25,
        desc: "",
        brand: "Hangu Branded Shoes",
        sizes: ["40", "41", "42", "43", "44"],
        isActive: true,
      });
    }
    setError("");
  }, [initialData, isOpen]);

  // Handle multiple image uploads concurrently / sequentially
  const handleMultipleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Create immediate local object URLs for instant, zero-delay preview in browser
    const previews = files.map((f) => ({
      file: f,
      blobUrl: URL.createObjectURL(f),
    }));

    setUploading(true);
    setError("");

    const uploadedUrls: string[] = [];
    const previewMap: Record<string, string> = {};

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadStatus(`Uploading ${i + 1} of ${files.length}...`);
        const res = await onUploadImage(files[i]);
        if (res.success && res.data?.url) {
          uploadedUrls.push(res.data.url);
          previewMap[res.data.url] = previews[i].blobUrl;
        } else {
          setError(res.message || `Failed to upload ${files[i].name}`);
        }
      }

      setLocalPreviews((prev) => ({ ...prev, ...previewMap }));

      if (uploadedUrls.length > 0) {
        setForm((prev) => {
          const currentImages = (prev.images || []).filter((u) => u && u !== "/images/p1.jpg");
          const combined = [...currentImages, ...uploadedUrls.filter((u) => !currentImages.includes(u))];
          return {
            ...prev,
            img: combined[0] || "",
            images: combined,
          };
        });
      }
    } catch (err: any) {
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
      setUploadStatus("");
      e.target.value = "";
    }
  };

  const handleSetMainImage = (url: string) => {
    setForm((prev) => {
      const currentImages = (prev.images || []).filter((u) => u !== url && u !== "/images/p1.jpg");
      return {
        ...prev,
        img: url,
        images: [url, ...currentImages],
      };
    });
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setForm((prev) => {
      const currentImages = (prev.images || []).filter((u) => u && u !== urlToRemove && u !== "/images/p1.jpg");
      const nextMain = prev.img === urlToRemove ? (currentImages[0] || "") : prev.img;
      return {
        ...prev,
        img: nextMain,
        images: currentImages,
      };
    });
  };

  const handleAddCustomImageUrl = () => {
    const trimmed = customImageUrl.trim();
    if (!trimmed) return;
    setForm((prev) => {
      const currentImages = (prev.images || []).filter((u) => u && u !== "/images/p1.jpg");
      if (currentImages.includes(trimmed)) return prev;
      const combined = [...currentImages, trimmed];
      return {
        ...prev,
        img: prev.img && prev.img !== "/images/p1.jpg" ? prev.img : trimmed,
        images: combined,
      };
    });
    setCustomImageUrl("");
  };

  const toggleSize = (sz: string) => {
    setForm((prev) => {
      const exists = prev.sizes.includes(sz);
      const nextSizes = exists ? prev.sizes.filter((s) => s !== sz) : [...prev.sizes, sz];
      return { ...prev, sizes: nextSizes };
    });
  };

  const toggleColor = (colorName: string) => {
    setForm((prev) => {
      const currentColors = prev.colors || [];
      const exists = currentColors.some((c) => c.toLowerCase() === colorName.toLowerCase());
      const nextColors = exists
        ? currentColors.filter((c) => c.toLowerCase() !== colorName.toLowerCase())
        : [...currentColors, colorName];
      return { ...prev, colors: nextColors };
    });
  };

  const handleAddCustomColor = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newColorInput.trim();
    if (!trimmed) return;
    setForm((prev) => {
      const currentColors = prev.colors || [];
      if (currentColors.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return { ...prev, colors: [...currentColors, trimmed] };
    });
    setNewColorInput("");
  };

  const handleRemoveColorChip = (cToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      colors: (prev.colors || []).filter((c) => c !== cToRemove),
    }));
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

    const currentImages = (form.images && form.images.length > 0 ? form.images : (form.img ? [form.img] : [])).filter((u) => u && u !== "/images/p1.jpg");
    const coverImage = (form.img && form.img !== "/images/p1.jpg") ? form.img : (currentImages[0] || "");
    if (!coverImage && currentImages.length === 0) {
      setError("Please upload at least one photo for this shoe.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSave({
        ...form,
        img: coverImage,
        images: currentImages.length > 0 ? currentImages : [coverImage],
        colors: form.colors && form.colors.length > 0 ? form.colors : ["Black", "Brown"],
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const imagesList = form.images && form.images.length > 0 ? form.images : (form.img ? [form.img] : []);

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 animate-fadeIn">
      <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-8">
        <div className="bg-white p-5 sm:p-7 md:p-8 rounded-3xl max-w-2xl w-full border border-slate-200/90 shadow-2xl relative text-slate-800">
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

            {/* Price & Stock */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Selling Price (Rs.)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Original Price (Rs.)</label>
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

            {/* ======================================================= */}
            {/* MULTI-IMAGE GALLERY (Supports all colors & angles)       */}
            {/* ======================================================= */}
            <div className="border border-slate-200/90 rounded-2xl p-4 bg-slate-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <label className="text-slate-900 font-bold block text-xs">
                    Shoe Photos Gallery ({imagesList.length} photo{imagesList.length !== 1 ? "s" : ""})
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Upload multiple pictures for all shoe colors, side angles, sole & details.
                  </span>
                </div>
                <label className="self-start sm:self-auto py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-sm transition-all shrink-0">
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>{uploadStatus || "Uploading..."}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Upload Photos</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={handleMultipleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Photos Grid */}
              {imagesList.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-white border border-slate-200 mb-3">
                  {imagesList.map((imgUrl, idx) => {
                    const isMain = form.img === imgUrl || (!form.img && idx === 0);
                    return (
                      <div
                        key={idx}
                        className={`relative group rounded-xl overflow-hidden border-2 bg-slate-50 aspect-square flex items-center justify-center transition-all ${
                          isMain
                            ? "border-emerald-500 ring-2 ring-emerald-500/20"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <img
                          src={localPreviews[imgUrl] || resolveProductImage(imgUrl)}
                          alt={`Shoe photo ${idx + 1}`}
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.retried) {
                              target.dataset.retried = "true";
                              if (imgUrl.startsWith("/api/images/")) {
                                target.src = `${window.location.origin}${imgUrl}?t=${Date.now()}`;
                                return;
                              }
                            }
                            target.src = "/images/p1.jpg";
                          }}
                          className="w-full h-full object-contain p-1"
                        />

                        {/* Badges & Actions Overlay */}
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-between p-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(imgUrl)}
                            className="self-end p-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <Trash2 size={13} />
                          </button>

                          {!isMain ? (
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(imgUrl)}
                              className="w-full py-1 px-1 rounded-lg bg-white/95 hover:bg-white text-slate-900 font-bold text-[10px] text-center shadow transition-all cursor-pointer"
                            >
                              Set as Cover
                            </button>
                          ) : (
                            <span className="w-full py-1 px-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] text-center shadow">
                              Cover Photo
                            </span>
                          )}
                        </div>

                        {/* Main Cover Indicator */}
                        {isMain && (
                          <span className="group-hover:hidden absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold shadow">
                            Cover
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl mb-3 text-xs">
                  No photos uploaded yet. Click &quot;Upload Photos&quot; to add pictures.
                </div>
              )}

              {/* Direct Path / URL Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomImageUrl();
                    }
                  }}
                  placeholder="Or paste direct image URL and click Add..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono text-[11px] outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomImageUrl}
                  className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors shrink-0"
                >
                  + Add URL
                </button>
              </div>
            </div>

            {/* ======================================================= */}
            {/* SHOE COLORS MANAGEMENT                                  */}
            {/* ======================================================= */}
            <div className="border border-slate-200/90 rounded-2xl p-4 bg-slate-50/50">
              <label className="text-slate-900 font-bold block mb-1">
                Available Colors ({form.colors?.length || 0} selected)
              </label>
              <span className="text-[11px] text-slate-500 block mb-2.5">
                Click color pills to toggle availability, or type custom colors:
              </span>

              {/* Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {PRESET_COLORS.map((cName) => {
                  const isSelected = (form.colors || []).some(
                    (c) => c.toLowerCase() === cName.toLowerCase()
                  );
                  return (
                    <button
                      type="button"
                      key={cName}
                      onClick={() => toggleColor(cName)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                        isSelected
                          ? "bg-slate-950 text-white border-slate-950 shadow-xs scale-102"
                          : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {isSelected ? `✓ ${cName}` : `+ ${cName}`}
                    </button>
                  );
                })}
              </div>

              {/* Selected custom chips & Input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={newColorInput}
                  onChange={(e) => setNewColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomColor();
                    }
                  }}
                  placeholder="Type custom color (e.g. Olive, Burgundy) & Enter..."
                  className="w-full sm:flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomColor()}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors shrink-0 flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  + Add Color
                </button>
              </div>

              {/* Display all active selected colors with remove badge */}
              {form.colors && form.colors.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Active:</span>
                  {form.colors.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-xs"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => handleRemoveColorChip(c)}
                        className="hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove color"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="py-2.5 px-5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
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
