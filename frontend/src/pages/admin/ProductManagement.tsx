import { useState } from "react";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { mockProducts, type Product, type ProductCategory, type ProductAttributes } from "../../mockProduct";

// ─── Category list ────────────────────────────────────────────
const CATEGORIES: ProductCategory[] = [
  "CPU", "Mainboard", "RAM", "GPU", "SSD", "HDD", "PSU", "Case", "CPU Cooler",
];

// ─── Default attributes per category ─────────────────────────
function defaultAttributes(category: ProductCategory): ProductAttributes {
  switch (category) {
    case "CPU":       return { componentType: "CPU", socket: "", cores: 0, threads: 0, baseClock: 0, boostClock: 0, tdp: 0, integratedGraphics: false };
    case "Mainboard": return { componentType: "Mainboard", socket: "", chipset: "", formFactor: "ATX", memoryType: "DDR5", ramSlots: 4, hasWifi: false };
    case "RAM":       return { componentType: "RAM", memoryType: "DDR5", capacity: 0, modules: 2, speed: 0, casLatency: 0 };
    case "GPU":       return { componentType: "GPU", chipset: "", vram: 0, length: 0, recommendedPsu: 0 };
    case "SSD":       return { componentType: "SSD", formFactor: "M.2 2280", interface: "PCIe 4.0 x4", capacity: 0, readSpeed: 0, writeSpeed: 0 };
    case "HDD":       return { componentType: "HDD", formFactor: "3.5 inch", interface: "SATA III", capacity: 0, rpm: 7200, cache: 0 };
    case "PSU":       return { componentType: "PSU", wattage: 0, efficiency: "80+ Gold", modularity: "Full", formFactor: "ATX" };
    case "Case":      return { componentType: "Case", formFactor: "Mid Tower", motherboardSupport: [], maxGpuLength: 0, maxCpuCoolerHeight: 0 };
    case "CPU Cooler":return { componentType: "CPU Cooler", type: "Air Cooler", socketSupport: [] };
  }
}

// ─── Types ─────────────────────────────────────────────────────
type ProductForm = Omit<Product, "id">;

function emptyForm(): ProductForm {
  return {
    name: "",
    category: "CPU",
    price: 0,
    description: "",
    imageUrl: "",
    stock: 0,
    attributes: defaultAttributes("CPU"),
  };
}

// ─── Attribute sub-form ────────────────────────────────────────
function AttributesForm({
  attributes,
  onChange,
}: {
  attributes: ProductAttributes;
  onChange: (updated: ProductAttributes) => void;
}) {
  const set = (key: string, value: unknown) =>
    onChange({ ...(attributes as Record<string, unknown>), [key]: value } as ProductAttributes);

  const numField = (label: string, key: string, value: number, step = 1) => (
    <div className="flex flex-col gap-1.5" key={key}>
      <label className="text-xs font-medium text-white/50" htmlFor={`attr-${key}`}>{label}</label>
      <input
        id={`attr-${key}`}
        type="number"
        className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors"
        value={value || ""}
        step={step}
        min={0}
        onChange={(e) => set(key, Number(e.target.value))}
      />
    </div>
  );

  const txtField = (label: string, key: string, value: string) => (
    <div className="flex flex-col gap-1.5" key={key}>
      <label className="text-xs font-medium text-white/50" htmlFor={`attr-${key}`}>{label}</label>
      <input
        id={`attr-${key}`}
        className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors"
        value={value}
        onChange={(e) => set(key, e.target.value)}
      />
    </div>
  );

  const selField = (label: string, key: string, value: string, options: string[]) => (
    <div className="flex flex-col gap-1.5" key={key}>
      <label className="text-xs font-medium text-white/50" htmlFor={`attr-${key}`}>{label}</label>
      <select
        id={`attr-${key}`}
        className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors appearance-none cursor-pointer"
        value={value}
        onChange={(e) => set(key, e.target.value)}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const boolField = (label: string, key: string, value: boolean) => (
    <div className="flex flex-col gap-1.5" key={key}>
      <label className="text-xs font-medium text-white/50">{label}</label>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-white/70">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => set(key, e.target.checked)}
          className="accent-red-500 w-4 h-4 cursor-pointer"
        />
        {value ? "Yes" : "No"}
      </label>
    </div>
  );

  const arrField = (label: string, key: string, value: string[]) => (
    <div className="flex flex-col gap-1.5" key={key}>
      <label className="text-xs font-medium text-white/50" htmlFor={`attr-${key}`}>{label} <span className="font-normal text-white/30">(comma separated)</span></label>
      <input
        id={`attr-${key}`}
        className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors"
        value={value.join(", ")}
        onChange={(e) => set(key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
      />
    </div>
  );

  if (!("componentType" in attributes)) return null;
  const type = (attributes as { componentType: string }).componentType;

  const grid2 = (children: React.ReactNode) => (
    <div className="grid grid-cols-2 gap-4">
      {children}
    </div>
  );

  switch (type) {
    case "CPU": {
      const a = attributes as Extract<ProductAttributes, { componentType: "CPU" }>;
      return (
        <div className="flex flex-col gap-4">
          {grid2(<>{txtField("Socket", "socket", a.socket)}{numField("Cores", "cores", a.cores)}</>)}
          {grid2(<>{numField("Threads", "threads", a.threads)}{numField("Base Clock (GHz)", "baseClock", a.baseClock, 0.1)}</>)}
          {grid2(<>{numField("Boost Clock (GHz)", "boostClock", a.boostClock, 0.1)}{numField("TDP (W)", "tdp", a.tdp)}</>)}
          {boolField("Integrated Graphics", "integratedGraphics", a.integratedGraphics)}
        </div>
      );
    }
    case "Mainboard": {
      const a = attributes as Extract<ProductAttributes, { componentType: "Mainboard" }>;
      return (
        <div className="flex flex-col gap-4">
          {grid2(<>{txtField("Socket", "socket", a.socket)}{txtField("Chipset", "chipset", a.chipset)}</>)}
          {grid2(<>
            {selField("Form Factor", "formFactor", a.formFactor, ["ATX", "Micro-ATX", "Mini-ITX", "E-ATX"])}
            {selField("Memory Type", "memoryType", a.memoryType, ["DDR4", "DDR5"])}
          </>)}
          {grid2(<>{numField("RAM Slots", "ramSlots", a.ramSlots)}{boolField("Has Wi-Fi", "hasWifi", a.hasWifi)}</>)}
        </div>
      );
    }
    case "RAM": {
      const a = attributes as Extract<ProductAttributes, { componentType: "RAM" }>;
      return (
        <div className="flex flex-col gap-4">
          {selField("Memory Type", "memoryType", a.memoryType, ["DDR4", "DDR5"])}
          {grid2(<>{numField("Capacity (GB)", "capacity", a.capacity)}{numField("Modules", "modules", a.modules)}</>)}
          {grid2(<>{numField("Speed (MHz)", "speed", a.speed)}{numField("CAS Latency", "casLatency", a.casLatency)}</>)}
        </div>
      );
    }
    case "GPU": {
      const a = attributes as Extract<ProductAttributes, { componentType: "GPU" }>;
      return (
        <div className="flex flex-col gap-4">
          {txtField("Chipset", "chipset", a.chipset)}
          {grid2(<>{numField("VRAM (GB)", "vram", a.vram)}{numField("Card Length (mm)", "length", a.length)}</>)}
          {numField("Recommended PSU (W)", "recommendedPsu", a.recommendedPsu)}
        </div>
      );
    }
    case "SSD": {
      const a = attributes as Extract<ProductAttributes, { componentType: "SSD" }>;
      return (
        <div className="flex flex-col gap-4">
          {grid2(<>
            {selField("Form Factor", "formFactor", a.formFactor, ["M.2 2280", "2.5 inch", "PCIe Add-in Card"])}
            {selField("Interface", "interface", a.interface, ["PCIe 5.0 x4", "PCIe 4.0 x4", "PCIe 3.0 x4", "SATA III"])}
          </>)}
          {grid2(<>{numField("Capacity (GB)", "capacity", a.capacity)}{numField("Read Speed (MB/s)", "readSpeed", a.readSpeed)}</>)}
          {numField("Write Speed (MB/s)", "writeSpeed", a.writeSpeed)}
        </div>
      );
    }
    case "HDD": {
      const a = attributes as Extract<ProductAttributes, { componentType: "HDD" }>;
      return (
        <div className="flex flex-col gap-4">
          {grid2(<>
            {selField("Form Factor", "formFactor", a.formFactor, ["3.5 inch", "2.5 inch"])}
            {selField("RPM", "rpm", String(a.rpm), ["5400", "7200"])}
          </>)}
          {grid2(<>{numField("Capacity (GB)", "capacity", a.capacity)}{numField("Cache (MB)", "cache", a.cache)}</>)}
        </div>
      );
    }
    case "PSU": {
      const a = attributes as Extract<ProductAttributes, { componentType: "PSU" }>;
      return (
        <div className="flex flex-col gap-4">
          {numField("Wattage (W)", "wattage", a.wattage)}
          {grid2(<>
            {selField("Efficiency", "efficiency", a.efficiency, ["80+ Titanium", "80+ Platinum", "80+ Gold", "80+ Bronze", "80+ Standard"])}
            {selField("Modularity", "modularity", a.modularity, ["Full", "Semi", "Non"])}
          </>)}
          {selField("Form Factor", "formFactor", a.formFactor, ["ATX", "SFX", "SFX-L"])}
        </div>
      );
    }
    case "Case": {
      const a = attributes as Extract<ProductAttributes, { componentType: "Case" }>;
      return (
        <div className="flex flex-col gap-4">
          {selField("Form Factor", "formFactor", a.formFactor, ["Full Tower", "Mid Tower", "Mini ITX"])}
          {arrField("Motherboard Support", "motherboardSupport", a.motherboardSupport)}
          {grid2(<>{numField("Max GPU Length (mm)", "maxGpuLength", a.maxGpuLength)}{numField("Max CPU Cooler Height (mm)", "maxCpuCoolerHeight", a.maxCpuCoolerHeight)}</>)}
        </div>
      );
    }
    case "CPU Cooler": {
      const a = attributes as Extract<ProductAttributes, { componentType: "CPU Cooler" }>;
      return (
        <div className="flex flex-col gap-4">
          {selField("Type", "type", a.type, ["Air Cooler", "Liquid Cooler"])}
          {arrField("Socket Support", "socketSupport", a.socketSupport)}
          {a.type === "Air Cooler"
            ? numField("Height (mm)", "height", a.height ?? 0)
            : selField("Radiator Size (mm)", "radiatorSize", String(a.radiatorSize ?? 240), ["120", "240", "280", "360", "420"])
          }
        </div>
      );
    }
    default: return null;
  }
}

// ─── Main Component ────────────────────────────────────────────
export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [modal, setModal] = useState<
    | { mode: "create" }
    | { mode: "edit"; product: Product }
    | { mode: "delete"; product: Product }
    | null
  >(null);
  const [form, setForm] = useState<ProductForm>(emptyForm());
  const [submitting, setSubmitting] = useState(false);

  // ── Handlers ──────────────────────────────────────────────
  const openCreate = () => {
    setForm(emptyForm());
    setModal({ mode: "create" });
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description ?? "",
      imageUrl: p.imageUrl ?? "",
      stock: p.stock,
      attributes: p.attributes,
    });
    setModal({ mode: "edit", product: p });
  };

  const openDelete = (p: Product) => setModal({ mode: "delete", product: p });
  const closeModal = () => setModal(null);

  const handleCategoryChange = (cat: ProductCategory) => {
    setForm((f) => ({ ...f, category: cat, attributes: defaultAttributes(cat) }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));

    if (modal?.mode === "create") {
      const newProduct: Product = {
        ...form,
        id: Date.now(),
        description: form.description || null,
        imageUrl: form.imageUrl || null,
      };
      setProducts((prev) => [newProduct, ...prev]);
    } else if (modal?.mode === "edit") {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === modal.product.id
            ? { ...p, ...form, description: form.description || null, imageUrl: form.imageUrl || null }
            : p,
        ),
      );
    }

    setSubmitting(false);
    closeModal();
  };

  const handleDelete = async () => {
    if (modal?.mode !== "delete") return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    setProducts((prev) => prev.filter((p) => p.id !== modal.product.id));
    setSubmitting(false);
    closeModal();
  };

  const field = (
    key: keyof Omit<ProductForm, "attributes" | "category">,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const val = e.target.value;
    setForm((f) => ({
      ...f,
      [key]: key === "price" || key === "stock" ? Number(val) : val,
    }));
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Products</h1>
            <p className="text-sm text-white/35 mt-0.5">
              {products.length} item{products.length !== 1 ? "s" : ""} in catalogue
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={openCreate}
          >
            <Plus size={14} aria-hidden="true" />
            Add product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-white/[0.06] rounded-xl overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Package size={40} className="text-white/10 mb-4" aria-hidden="true" />
            <p className="text-sm font-medium text-white/70 mb-1">No products yet</p>
            <p className="text-xs text-white/30 mb-6">Add your first product to start building the catalogue.</p>
            <button
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              onClick={openCreate}
            >
              <Plus size={14} />
              Add product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" aria-label="Product catalogue">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Product</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Category</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25 text-right">Price (฿)</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25 text-right">Stock</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Stock status</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const stockBadge =
                    p.stock === 0
                      ? { label: "Out of stock", cls: "bg-red-500/10 text-red-400" }
                      : p.stock <= 5
                        ? { label: "Low stock",    cls: "bg-amber-500/10 text-amber-400" }
                        : { label: "In stock",     cls: "bg-emerald-500/10 text-emerald-400" };
                  return (
                    <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden shrink-0">
                            {p.imageUrl && (
                              <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white/80">{p.name}</div>
                            {p.description && (
                              <div className="text-[11px] text-white/30 max-w-[28ch] truncate">
                                {p.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/5 text-white/60">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70 text-right tabular-nums">
                        {p.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70 text-right tabular-nums">
                        {p.stock}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${stockBadge.cls}`}>
                          {stockBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-1.5">
                          <button
                            className="p-1.5 rounded-md text-white/40 hover:text-white/90 hover:bg-white/5 transition-colors"
                            onClick={() => openEdit(p)}
                            aria-label={`Edit ${p.name}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="p-1.5 rounded-md text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            onClick={() => openDelete(p)}
                            aria-label={`Delete ${p.name}`}
                          >
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

      {/* ── Create / Edit Modal ─────────────────────────────── */}
      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-label={modal.mode === "create" ? "Add product" : "Edit product"}
        >
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#161616]">
              <span className="text-sm font-semibold text-white">
                {modal.mode === "create" ? "Add product" : "Edit product"}
              </span>
              <button
                className="p-1 rounded-md text-white/40 hover:text-white/90 hover:bg-white/5 transition-colors"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-5">
              {/* Category selector — shown first so attributes form below reacts */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50" htmlFor="pm-category">Category</label>
                <select
                  id="pm-category"
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors appearance-none cursor-pointer"
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Base fields */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50" htmlFor="pm-name">Name</label>
                <input
                  id="pm-name"
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors"
                  value={form.name}
                  onChange={(e) => field("name", e)}
                  placeholder="Product name"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50" htmlFor="pm-price">Price (฿)</label>
                  <input
                    id="pm-price"
                    type="number"
                    className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors"
                    value={form.price || ""}
                    onChange={(e) => field("price", e)}
                    placeholder="0"
                    min={0}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50" htmlFor="pm-stock">Stock</label>
                  <input
                    id="pm-stock"
                    type="number"
                    className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors"
                    value={form.stock || ""}
                    onChange={(e) => field("stock", e)}
                    placeholder="0"
                    min={0}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50" htmlFor="pm-desc">Description</label>
                <textarea
                  id="pm-desc"
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors resize-none min-h-[80px]"
                  value={form.description ?? ""}
                  onChange={(e) => field("description", e)}
                  placeholder="Short product description"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50" htmlFor="pm-img">Image URL</label>
                <input
                  id="pm-img"
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors"
                  value={form.imageUrl ?? ""}
                  onChange={(e) => field("imageUrl", e)}
                  placeholder="https://..."
                />
              </div>

              {/* ── Dynamic attributes section ── */}
              <div className="border-t border-white/[0.06] pt-5 mt-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">
                  {form.category} Specifications
                </p>
                <AttributesForm
                  attributes={form.attributes}
                  onChange={(updated) => setForm((f) => ({ ...f, attributes: updated }))}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/[0.06] bg-[#161616] flex justify-end gap-3">
              <button
                className="text-white/50 hover:text-white/90 hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                onClick={handleSave}
                disabled={!form.name.trim() || submitting}
              >
                {submitting
                  ? "Saving…"
                  : modal.mode === "create"
                    ? "Add product"
                    : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────── */}
      {modal?.mode === "delete" && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
        >
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#161616]">
              <span className="text-sm font-semibold text-white">Delete product</span>
              <button
                className="p-1 rounded-md text-white/40 hover:text-white/90 hover:bg-white/5 transition-colors"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-white/50 leading-relaxed">
                Delete{" "}
                <strong className="text-white font-medium">{modal.product.name}</strong>
                ? This cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-white/[0.06] bg-[#161616] flex justify-end gap-3">
              <button
                className="text-white/50 hover:text-white/90 hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? "Deleting…" : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
