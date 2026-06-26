import React, { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Package, ImagePlus } from "lucide-react";
import type { Product, ProductCategory, ProductAttributes } from "../../types/product";

const CATEGORIES: ProductCategory[] = [
  "CPU", "Mainboard", "RAM", "GPU", "SSD", "HDD", "PSU", "Case", "CPU Cooler", "Other"
];

function defaultAttributes(category: ProductCategory): ProductAttributes {
  switch (category) {
    case "CPU": return { componentType: "CPU", socket: "", cores: 0, threads: 0, baseClock: 0, boostClock: 0, tdp: 0, integratedGraphics: false };
    case "Mainboard": return { componentType: "Mainboard", socket: "", chipset: "", formFactor: "ATX", memoryType: "DDR5", ramSlots: 4, hasWifi: false };
    case "RAM": return { componentType: "RAM", memoryType: "DDR5", capacity: 0, modules: 2, speed: 0, casLatency: 0 };
    case "GPU": return { componentType: "GPU", chipset: "", vram: 0, length: 0, recommendedPsu: 0 };
    case "SSD": return { componentType: "SSD", formFactor: "M.2 2280", interface: "PCIe 4.0 x4", capacity: 0, readSpeed: 0, writeSpeed: 0 };
    case "HDD": return { componentType: "HDD", formFactor: "3.5 inch", interface: "SATA III", capacity: 0, rpm: 7200, cache: 0 };
    case "PSU": return { componentType: "PSU", wattage: 0, efficiency: "80+ Gold", modularity: "Full", formFactor: "ATX" };
    case "Case": return { componentType: "Case", formFactor: "Mid Tower", motherboardSupport: [], maxGpuLength: 0, maxCpuCoolerHeight: 0 };
    case "CPU Cooler": return { componentType: "CPU Cooler", type: "Air Cooler", socketSupport: [] };
    case "Other": return { componentType: "Other" };
  }
}

type ProductForm = Omit<Product, "id" | "imageUrl" | "imageUrls"> & {
  newImages: File[];
  existingImageUrls: string[];
};

function emptyForm(): ProductForm {
  return { name: "", category: "CPU", price: 0, description: "", newImages: [], existingImageUrls: [], stock: 0, attributes: defaultAttributes("CPU") };
}

// ─── Shared input class ───────────────────────────────────────
const inp = "bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors";
const lbl = "text-xs font-medium text-gray-500";

// ─── Image Upload Section ─────────────────────────────────────
function ImageUploadSection({ form, setForm }: { form: ProductForm; setForm: React.Dispatch<React.SetStateAction<ProductForm>> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalCount = form.existingImageUrls.length + form.newImages.length;

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const picked = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setForm((prev) => ({ ...prev, newImages: [...prev.newImages, ...picked] }));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className={lbl}>Images</label>
      <div className="flex flex-wrap gap-2">
        {form.existingImageUrls.map((url, i) => (
          <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group flex-shrink-0">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => setForm((p) => ({ ...p, existingImageUrls: p.existingImageUrls.filter((_, j) => j !== i) }))}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={16} className="text-white" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 text-[9px] font-bold uppercase text-center bg-gray-900/70 text-white py-0.5">หลัก</span>
            )}
          </div>
        ))}
        {form.newImages.map((file, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-dashed border-blue-400 bg-blue-50 group flex-shrink-0">
            <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => setForm((p) => ({ ...p, newImages: p.newImages.filter((_, j) => j !== i) }))}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={16} className="text-white" />
            </button>
            <span className="absolute bottom-0 left-0 right-0 text-[9px] font-bold uppercase text-center bg-blue-100 text-blue-600 py-0.5">ใหม่</span>
          </div>
        ))}
        {totalCount < 8 && (
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-lg border border-dashed border-gray-300 hover:border-gray-500 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center gap-1 transition-colors flex-shrink-0">
            <ImagePlus size={18} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">Add</span>
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      {totalCount > 0 && <p className="text-[10px] text-gray-400">{totalCount}/8 รูป · รูปแรกจะเป็นรูปหลัก</p>}
    </div>
  );
}

// ─── Attribute sub-form ────────────────────────────────────────
function AttributesForm({ attributes, onChange }: { attributes: ProductAttributes; onChange: (u: ProductAttributes) => void }) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const set = (key: string, value: unknown) =>
    onChange({ ...(attributes as Record<string, unknown>), [key]: value } as ProductAttributes);

  const removeCustom = (key: string) => {
    const updated = { ...(attributes as Record<string, unknown>) };
    delete updated[key];
    onChange(updated as ProductAttributes);
  };

  const handleAddCustom = () => {
    if (newKey.trim() && !(attributes as Record<string, unknown>)[newKey.trim()]) {
      set(newKey.trim(), newValue);
      setNewKey(""); setNewValue("");
    }
  };

  const numField = (label: string, key: string, value: number, step = 1) => (
    <div className="flex flex-col gap-1.5" key={key}>
      <label className={lbl} htmlFor={`attr-${key}`}>{label}</label>
      <input id={`attr-${key}`} type="number" className={inp} value={value || ""} step={step} min={0}
        onChange={(e) => set(key, Number(e.target.value))} />
    </div>
  );

  const txtField = (label: string, key: string, value: string) => (
    <div className="flex flex-col gap-1.5" key={key}>
      <label className={lbl} htmlFor={`attr-${key}`}>{label}</label>
      <input id={`attr-${key}`} className={inp} value={value} onChange={(e) => set(key, e.target.value)} />
    </div>
  );

  const selField = (label: string, key: string, value: string, options: string[]) => (
    <div className="flex flex-col gap-1.5" key={key}>
      <label className={lbl} htmlFor={`attr-${key}`}>{label}</label>
      <select id={`attr-${key}`} className={`${inp} appearance-none cursor-pointer`} value={value}
        onChange={(e) => set(key, e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const boolField = (label: string, key: string, value: boolean) => (
    <div className="flex flex-col gap-1.5" key={key}>
      <label className={lbl}>{label}</label>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
        <input type="checkbox" checked={value} onChange={(e) => set(key, e.target.checked)} className="accent-blue-600 w-4 h-4 cursor-pointer" />
        {value ? "Yes" : "No"}
      </label>
    </div>
  );

  const arrField = (label: string, key: string, value: string[]) => (
    <div className="flex flex-col gap-1.5" key={key}>
      <label className={lbl} htmlFor={`attr-${key}`}>{label} <span className="font-normal text-gray-400">(comma separated)</span></label>
      <input id={`attr-${key}`} className={inp} value={value.join(", ")}
        onChange={(e) => set(key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
    </div>
  );

  if (!("componentType" in attributes)) return null;
  const type = (attributes as { componentType: string }).componentType;
  const grid2 = (children: React.ReactNode) => <div className="grid grid-cols-2 gap-4">{children}</div>;

  const standardKeys = Object.keys(defaultAttributes(type as ProductCategory));
  const customKeys = Object.keys(attributes).filter(k => !standardKeys.includes(k) && k !== "componentType");

  const renderSpecifics = () => {
    switch (type) {
      case "CPU": {
        const a = attributes as Extract<ProductAttributes, { componentType: "CPU" }>;
        return <div className="flex flex-col gap-4">
          {grid2(<>{txtField("Socket", "socket", a.socket)}{numField("Cores", "cores", a.cores)}</>)}
          {grid2(<>{numField("Threads", "threads", a.threads)}{numField("Base Clock (GHz)", "baseClock", a.baseClock, 0.1)}</>)}
          {grid2(<>{numField("Boost Clock (GHz)", "boostClock", a.boostClock, 0.1)}{numField("TDP (W)", "tdp", a.tdp)}</>)}
          {boolField("Integrated Graphics", "integratedGraphics", a.integratedGraphics)}
        </div>;
      }
      case "Mainboard": {
        const a = attributes as Extract<ProductAttributes, { componentType: "Mainboard" }>;
        return <div className="flex flex-col gap-4">
          {grid2(<>{txtField("Socket", "socket", a.socket)}{txtField("Chipset", "chipset", a.chipset)}</>)}
          {grid2(<>{selField("Form Factor", "formFactor", a.formFactor, ["ATX", "Micro-ATX", "Mini-ITX", "E-ATX"])}{selField("Memory Type", "memoryType", a.memoryType, ["DDR4", "DDR5"])}</>)}
          {grid2(<>{numField("RAM Slots", "ramSlots", a.ramSlots)}{boolField("Has Wi-Fi", "hasWifi", a.hasWifi)}</>)}
        </div>;
      }
      case "RAM": {
        const a = attributes as Extract<ProductAttributes, { componentType: "RAM" }>;
        return <div className="flex flex-col gap-4">
          {selField("Memory Type", "memoryType", a.memoryType, ["DDR4", "DDR5"])}
          {grid2(<>{numField("Capacity (GB)", "capacity", a.capacity)}{numField("Modules", "modules", a.modules)}</>)}
          {grid2(<>{numField("Speed (MHz)", "speed", a.speed)}{numField("CAS Latency", "casLatency", a.casLatency)}</>)}
        </div>;
      }
      case "GPU": {
        const a = attributes as Extract<ProductAttributes, { componentType: "GPU" }>;
        return <div className="flex flex-col gap-4">
          {txtField("Chipset", "chipset", a.chipset)}
          {grid2(<>{numField("VRAM (GB)", "vram", a.vram)}{numField("Card Length (mm)", "length", a.length)}</>)}
          {numField("Recommended PSU (W)", "recommendedPsu", a.recommendedPsu)}
        </div>;
      }
      case "SSD": {
        const a = attributes as Extract<ProductAttributes, { componentType: "SSD" }>;
        return <div className="flex flex-col gap-4">
          {grid2(<>{selField("Form Factor", "formFactor", a.formFactor, ["M.2 2280", "2.5 inch", "PCIe Add-in Card"])}{selField("Interface", "interface", a.interface, ["PCIe 5.0 x4", "PCIe 4.0 x4", "PCIe 3.0 x4", "SATA III"])}</>)}
          {grid2(<>{numField("Capacity (GB)", "capacity", a.capacity)}{numField("Read Speed (MB/s)", "readSpeed", a.readSpeed)}</>)}
          {numField("Write Speed (MB/s)", "writeSpeed", a.writeSpeed)}
        </div>;
      }
      case "HDD": {
        const a = attributes as Extract<ProductAttributes, { componentType: "HDD" }>;
        return <div className="flex flex-col gap-4">
          {grid2(<>{selField("Form Factor", "formFactor", a.formFactor, ["3.5 inch", "2.5 inch"])}{selField("RPM", "rpm", String(a.rpm), ["5400", "7200"])}</>)}
          {grid2(<>{numField("Capacity (GB)", "capacity", a.capacity)}{numField("Cache (MB)", "cache", a.cache)}</>)}
        </div>;
      }
      case "PSU": {
        const a = attributes as Extract<ProductAttributes, { componentType: "PSU" }>;
        return <div className="flex flex-col gap-4">
          {numField("Wattage (W)", "wattage", a.wattage)}
          {grid2(<>{selField("Efficiency", "efficiency", a.efficiency, ["80+ Titanium", "80+ Platinum", "80+ Gold", "80+ Bronze", "80+ Standard"])}{selField("Modularity", "modularity", a.modularity, ["Full", "Semi", "Non"])}</>)}
          {selField("Form Factor", "formFactor", a.formFactor, ["ATX", "SFX", "SFX-L"])}
        </div>;
      }
      case "Case": {
        const a = attributes as Extract<ProductAttributes, { componentType: "Case" }>;
        return <div className="flex flex-col gap-4">
          {selField("Form Factor", "formFactor", a.formFactor, ["Full Tower", "Mid Tower", "Mini ITX"])}
          {arrField("Motherboard Support", "motherboardSupport", a.motherboardSupport)}
          {grid2(<>{numField("Max GPU Length (mm)", "maxGpuLength", a.maxGpuLength)}{numField("Max CPU Cooler Height (mm)", "maxCpuCoolerHeight", a.maxCpuCoolerHeight)}</>)}
        </div>;
      }
      case "CPU Cooler": {
        const a = attributes as Extract<ProductAttributes, { componentType: "CPU Cooler" }>;
        return <div className="flex flex-col gap-4">
          {selField("Type", "type", a.type, ["Air Cooler", "Liquid Cooler"])}
          {arrField("Socket Support", "socketSupport", a.socketSupport)}
          {a.type === "Air Cooler"
            ? numField("Height (mm)", "height", a.height ?? 0)
            : selField("Radiator Size (mm)", "radiatorSize", String(a.radiatorSize ?? 240), ["120", "240", "280", "360", "420"])}
        </div>;
      }
      default: return null;
    }
  };

  return (
    <div className="flex flex-col">
      {renderSpecifics()}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Additional Specifications</p>
        <div className="flex flex-col gap-3">
          {customKeys.map(k => (
            <div key={k} className="flex gap-2 items-center">
              <input className={`${inp} w-1/3 text-gray-400`} value={k} disabled />
              <input className={`${inp} flex-1`} value={String((attributes as Record<string, unknown>)[k])}
                onChange={(e) => set(k, e.target.value)} />
              <button type="button" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                onClick={() => removeCustom(k)}><X size={14} /></button>
            </div>
          ))}
          <div className="flex gap-2 items-center mt-1">
            <input className={`${inp} w-1/3`} placeholder="e.g. RGB" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
            <input className={`${inp} flex-1`} placeholder="e.g. Yes" value={newValue} onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustom())} />
            <button type="button" className="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors disabled:opacity-30"
              onClick={(e) => { e.preventDefault(); handleAddCustom(); }} disabled={!newKey.trim()}>
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<
    | { mode: "create" } | { mode: "edit"; product: Product } | { mode: "delete"; product: Product } | null
  >(null);
  const [form, setForm] = useState<ProductForm>(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      if (res.ok) { const data = await res.json(); setProducts(Array.isArray(data) ? data : []); }
    } catch { setProducts([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setForm(emptyForm()); setModal({ mode: "create" }); };
  const openEdit = (p: Product) => {
    const existing = p.imageUrls?.length > 0 ? p.imageUrls : p.imageUrl ? [p.imageUrl] : [];
    setForm({ name: p.name, category: p.category, price: p.price, description: p.description ?? "", newImages: [], existingImageUrls: existing, stock: p.stock, attributes: p.attributes });
    setModal({ mode: "edit", product: p });
  };
  const openDelete = (p: Product) => setModal({ mode: "delete", product: p });
  const closeModal = () => setModal(null);

  const handleCategoryChange = (cat: ProductCategory) =>
    setForm((f) => ({ ...f, category: cat, attributes: defaultAttributes(cat) }));

  const handleSave = async () => {
    setSubmitting(true);
    try {
      if (modal?.mode === "create") {
        const fd = new FormData();
        fd.append("name", form.name); fd.append("category", form.category);
        fd.append("price", String(form.price)); fd.append("stock", String(form.stock));
        fd.append("description", form.description || ""); fd.append("attributes", JSON.stringify(form.attributes));
        form.newImages.forEach((file) => fd.append("images", file));
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/products`, { method: "POST", body: fd, credentials: "include" });
        if (res.ok) { fetchProducts(); closeModal(); }
      } else if (modal?.mode === "edit") {
        const fd = new FormData();
        fd.append("name", form.name); fd.append("price", String(form.price));
        fd.append("stock", String(form.stock)); fd.append("description", form.description || "");
        fd.append("attributes", JSON.stringify(form.attributes)); fd.append("keepImageUrls", JSON.stringify(form.existingImageUrls));
        form.newImages.forEach((file) => fd.append("images", file));
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${modal.product.id}`, { method: "PUT", body: fd, credentials: "include" });
        if (res.ok) { fetchProducts(); closeModal(); }
      }
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (modal?.mode !== "delete") return;
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${modal.product.id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) { fetchProducts(); closeModal(); }
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const field = (key: keyof Omit<ProductForm, "attributes" | "category" | "newImages" | "existingImageUrls">, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [key]: key === "price" || key === "stock" ? Number(val) : val }));
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} item{products.length !== 1 ? "s" : ""} in catalogue</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={14} /> Add product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-400">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={40} className="text-gray-200 mb-4" />
            <p className="text-sm font-medium text-gray-500 mb-1">No products yet</p>
            <p className="text-xs text-gray-400 mb-6">Add your first product to start building the catalogue.</p>
            <button onClick={openCreate}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus size={14} /> Add product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Product", "Category", "Price (฿)", "Stock", "Stock status", "Actions"].map((h, i) => (
                    <th key={h} className={`px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 ${i >= 2 && i <= 4 ? "text-right" : ""} ${i === 5 ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const stockBadge =
                    p.stock === 0 ? { label: "Out of stock", cls: "bg-red-50 text-red-600" }
                    : p.stock <= 5 ? { label: "Low stock", cls: "bg-amber-50 text-amber-700" }
                    : { label: "In stock", cls: "bg-emerald-50 text-emerald-700" };
                  return (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-700">{p.name}</div>
                            {p.description && <div className="text-[11px] text-gray-400 max-w-[28ch] truncate">{p.description}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{p.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-right tabular-nums">{p.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-right tabular-nums">{p.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${stockBadge.cls}`}>{stockBadge.label}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-1.5">
                          <button onClick={() => openEdit(p)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => openDelete(p)}
                            className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-900">
                {modal.mode === "create" ? "Add product" : "Edit product"}
              </span>
              <button onClick={closeModal} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className={lbl} htmlFor="pm-category">Category</label>
                <select id="pm-category" className={`${inp} appearance-none cursor-pointer`} value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={lbl} htmlFor="pm-name">Name</label>
                <input id="pm-name" className={inp} value={form.name} onChange={(e) => field("name", e)} placeholder="Product name" autoFocus />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={lbl} htmlFor="pm-price">Price (฿)</label>
                  <input id="pm-price" type="number" className={inp} value={form.price || ""} onChange={(e) => field("price", e)} placeholder="0" min={0} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={lbl} htmlFor="pm-stock">Stock</label>
                  <input id="pm-stock" type="number" className={inp} value={form.stock || ""} onChange={(e) => field("stock", e)} placeholder="0" min={0} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={lbl} htmlFor="pm-desc">Description</label>
                <textarea id="pm-desc" className={`${inp} resize-none min-h-[80px]`} value={form.description ?? ""}
                  onChange={(e) => field("description", e)} placeholder="Short product description" />
              </div>

              <ImageUploadSection form={form} setForm={setForm} />

              <div className="border-t border-gray-100 pt-5 mt-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">{form.category} Specifications</p>
                <AttributesForm attributes={form.attributes} onChange={(updated) => setForm((f) => ({ ...f, attributes: updated }))} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!form.name.trim() || submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40">
                {submitting ? "Saving…" : modal.mode === "create" ? "Add product" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal?.mode === "delete" && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-900">Delete product</span>
              <button onClick={closeModal} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 leading-relaxed">
                Delete <strong className="text-gray-900 font-medium">{modal.product.name}</strong>? This cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={submitting}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40">
                {submitting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
