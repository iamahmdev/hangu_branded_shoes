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
      {/* Top Filter and Actions Bar */}
      <div className="glass p-4 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-brand-red text-white shadow-glow"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
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
              placeholder="Search shoes by name or category..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-brand-gold transition-colors"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>

          <button
            onClick={onAddProduct}
            className="btn py-2.5 px-4 text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap shadow-glow shrink-0"
          >
            <Plus size={15} />
            <span>Add New Shoe</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 uppercase text-zinc-400 text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4">Footwear Model</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Available Sizes</th>
                <th className="p-4">Inventory Stock</th>
                <th className="p-4">Stock Adjuster</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-400">
                    Loading shoes catalog from database...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-500">
                    No shoes found in this filter view. Click "Add New Shoe" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p: any) => {
                  const stockNum = p.stock ?? p.stockCount ?? 0;
                  const isLowStock = stockNum <= 10;
                  const isOutOfStock = stockNum <= 0;
                  const isEnabled = p.isActive !== false;

                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      {/* Footwear Model */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={resolveProductImage(p.img)}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-zinc-900 border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <b className="text-white text-xs block truncate max-w-[200px]">{p.name}</b>
                          {p.tag && (
                            <span className="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brand-red/20 text-brand-red mt-0.5 border border-brand-red/30">
                              {p.tag}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/5 text-zinc-300 border border-white/10">
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
                              ? "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25"
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
                          }`}
                          title={isEnabled ? "Click to disable from catalog" : "Click to enable in catalog"}
                        >
                          {isEnabled ? <CheckCircle2 size={11} /> : <EyeOff size={11} />}
                          <span>{isEnabled ? "Active" : "Disabled"}</span>
                        </button>
                      </td>

                      {/* Pricing */}
                      <td className="p-4">
                        <b className="text-brand-gold font-mono text-sm block font-bold">
                          Rs. {(p.price || 0).toLocaleString()}
                        </b>
                        {p.old && p.old > p.price && (
                          <s className="text-[11px] text-zinc-500 font-mono block">
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
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-zinc-400"
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
                              ? "bg-red-500/15 text-red-400 border border-red-500/30"
                              : isLowStock
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                              : "bg-green-500/15 text-green-400 border border-green-500/30"
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
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white disabled:opacity-30 border border-white/5"
                            title="Decrease stock by 1"
                          >
                            <MinusCircle size={15} />
                          </button>
                          <span className="font-mono font-bold text-xs w-8 text-center text-white">
                            {stockNum}
                          </span>
                          <button
                            onClick={() => onAdjustStock(p.id, 1)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white border border-white/5"
                            title="Increase stock by 1"
                          >
                            <PlusCircle size={15} />
                          </button>
                          <button
                            onClick={() => onAdjustStock(p.id, 10)}
                            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-brand-gold/15 text-[10px] font-mono font-bold text-zinc-400 hover:text-brand-gold border border-white/5 ml-1"
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
                            className="p-2 rounded-xl bg-white/5 hover:bg-brand-gold/15 text-zinc-300 hover:text-brand-gold border border-white/10 transition-colors"
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
                            className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 border border-white/10 transition-colors"
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
