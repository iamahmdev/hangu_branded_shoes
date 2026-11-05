import { useState } from "react";
import { ProductFormData } from "./types";
import { resolveProductImage } from "../../utils/image";
import { Plus, Search, Edit2, Trash2, PlusCircle, MinusCircle, CheckCircle2, EyeOff } from "lucide-react";

interface ProductsTabProps {
  products: any[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddProduct: () => void;
  onEditProduct: (product: any) => void;
  onDeleteProduct: (productId: number) => void;
  onAdjustStock: (productId: number, delta: number) => void;
  onToggleActive?: (product: any) => void;
  isLoading?: boolean;
}

const CATEGORIES = ["All", "Sneakers", "Formal", "Loafers", "Comfort"];

export default function ProductsTab({
  products,
  searchQuery,
  onSearchChange,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAdjustStock,
  onToggleActive,
  isLoading = false,
}: ProductsTabProps) {
  const [selectedCat, setSelectedCat] = useState<string>("All");

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCat === "All" || p.cat === selectedCat;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.cat?.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Filter and Actions Bar Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Add New Shoe Button */}
        <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search shoes by name..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <button
            onClick={onAddProduct}
            className="py-2 px-4 text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors shrink-0"
          >
            <Plus size={15} />
            <span>Add Shoe</span>
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase text-slate-500 text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4 whitespace-nowrap">Shoe</th>
                <th className="p-4 whitespace-nowrap">Category</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">Price</th>
                <th className="p-4 whitespace-nowrap">Sizes</th>
                <th className="p-4 whitespace-nowrap">Stock</th>
                <th className="p-4 whitespace-nowrap">Quick Adjust</th>
                <th className="p-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    Loading shoes catalog from database...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    No shoes found in this filter view. Click "Add Shoe" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p: any) => {
                  const stockNum = p.stock ?? p.stockCount ?? 0;
                  const isLowStock = stockNum <= 10;
                  const isOutOfStock = stockNum <= 0;
                  const isEnabled = p.isActive !== false;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Footwear Model */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={resolveProductImage(p.img)}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <b className="text-slate-900 text-xs block truncate max-w-[200px]">{p.name}</b>
                          {p.tag && (
                            <span className="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 mt-0.5 border border-emerald-200">
                              {p.tag}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {p.cat}
                        </span>
                      </td>

                      {/* Status / Toggle Active */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => onToggleActive && onToggleActive(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all flex items-center gap-1 ${
                            isEnabled
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                          }`}
                          title={isEnabled ? "Click to disable from catalog" : "Click to enable in catalog"}
                        >
                          {isEnabled ? <CheckCircle2 size={11} /> : <EyeOff size={11} />}
                          <span>{isEnabled ? "Active" : "Disabled"}</span>
                        </button>
                      </td>

                      {/* Pricing */}
                      <td className="p-4">
                        <b className="text-slate-900 font-mono text-sm block font-bold">
                          Rs. {(p.price || 0).toLocaleString()}
                        </b>
                        {p.old && p.old > p.price && (
                          <s className="text-[11px] text-slate-400 font-mono block">
                            Rs. {p.old.toLocaleString()}
                          </s>
                        )}
                      </td>

                      {/* Available Sizes */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 flex-wrap max-w-[140px]">
                          {(p.sizes || ["39", "40", "41", "42", "43", "44"]).map((sz: string) => (
                            <span
                              key={sz}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600"
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Inventory Stock Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                            isOutOfStock
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : isLowStock
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {isOutOfStock ? "Out of Stock" : `${stockNum} in stock`}
                        </span>
                      </td>

                      {/* Quick Stock Adjuster */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onAdjustStock(p.id, -1)}
                            disabled={stockNum <= 0}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 border border-slate-200 transition-colors"
                            title="Decrease stock by 1"
                          >
                            <MinusCircle size={15} />
                          </button>
                          <span className="font-mono font-bold text-xs w-8 text-center text-slate-900">
                            {stockNum}
                          </span>
                          <button
                            onClick={() => onAdjustStock(p.id, 1)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                            title="Increase stock by 1"
                          >
                            <PlusCircle size={15} />
                          </button>
                          <button
                            onClick={() => onAdjustStock(p.id, 10)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[10px] font-mono font-bold text-emerald-700 border border-emerald-200 ml-1 transition-colors"
                            title="Quick Restock +10"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors"
                            title="Edit Product Details & Image"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete shoe "${p.name}"? This cannot be undone.`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors"
                            title="Delete Product from Catalog"
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
