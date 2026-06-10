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
    <div className="form-group" key={key}>
      <label className="form-label" htmlFor={`attr-${key}`}>{label}</label>
      <input
        id={`attr-${key}`}
        type="number"
        className="form-input"
        value={value || ""}
        step={step}
        min={0}
        onChange={(e) => set(key, Number(e.target.value))}
      />
    </div>
  );

  const txtField = (label: string, key: string, value: string) => (
    <div className="form-group" key={key}>
      <label className="form-label" htmlFor={`attr-${key}`}>{label}</label>
      <input
        id={`attr-${key}`}
        className="form-input"
        value={value}
        onChange={(e) => set(key, e.target.value)}
      />
    </div>
  );

  const selField = (label: string, key: string, value: string, options: string[]) => (
    <div className="form-group" key={key}>
      <label className="form-label" htmlFor={`attr-${key}`}>{label}</label>
      <select
        id={`attr-${key}`}
        className="form-input"
        value={value}
        onChange={(e) => set(key, e.target.value)}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const boolField = (label: string, key: string, value: boolean) => (
    <div className="form-group" key={key} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <label className="form-label">{label}</label>
      <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer", fontSize: "var(--text-sm)" }}>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => set(key, e.target.checked)}
          style={{ accentColor: "var(--color-primary)", width: 16, height: 16 }}
        />
        {value ? "Yes" : "No"}
      </label>
    </div>
  );

  const arrField = (label: string, key: string, value: string[]) => (
    <div className="form-group" key={key}>
      <label className="form-label" htmlFor={`attr-${key}`}>{label} <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>(comma separated)</span></label>
      <input
        id={`attr-${key}`}
        className="form-input"
        value={value.join(", ")}
        onChange={(e) => set(key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
      />
    </div>
  );

  if (!("componentType" in attributes)) return null;
  const type = (attributes as { componentType: string }).componentType;

  const grid2 = (children: React.ReactNode) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
      {children}
    </div>
  );

  switch (type) {
    case "CPU": {
      const a = attributes as Extract<ProductAttributes, { componentType: "CPU" }>;
      return (
        <>
          {grid2(<>{txtField("Socket", "socket", a.socket)}{numField("Cores", "cores", a.cores)}</>)}
          {grid2(<>{numField("Threads", "threads", a.threads)}{numField("Base Clock (GHz)", "baseClock", a.baseClock, 0.1)}</>)}
          {grid2(<>{numField("Boost Clock (GHz)", "boostClock", a.boostClock, 0.1)}{numField("TDP (W)", "tdp", a.tdp)}</>)}
          {boolField("Integrated Graphics", "integratedGraphics", a.integratedGraphics)}
        </>
      );
    }
    case "Mainboard": {
      const a = attributes as Extract<ProductAttributes, { componentType: "Mainboard" }>;
      return (
        <>
          {grid2(<>{txtField("Socket", "socket", a.socket)}{txtField("Chipset", "chipset", a.chipset)}</>)}
          {grid2(<>
            {selField("Form Factor", "formFactor", a.formFactor, ["ATX", "Micro-ATX", "Mini-ITX", "E-ATX"])}
            {selField("Memory Type", "memoryType", a.memoryType, ["DDR4", "DDR5"])}
          </>)}
          {grid2(<>{numField("RAM Slots", "ramSlots", a.ramSlots)}{boolField("Has Wi-Fi", "hasWifi", a.hasWifi)}</>)}
        </>
      );
    }
    case "RAM": {
      const a = attributes as Extract<ProductAttributes, { componentType: "RAM" }>;
      return (
        <>
          {selField("Memory Type", "memoryType", a.memoryType, ["DDR4", "DDR5"])}
          {grid2(<>{numField("Capacity (GB)", "capacity", a.capacity)}{numField("Modules", "modules", a.modules)}</>)}
          {grid2(<>{numField("Speed (MHz)", "speed", a.speed)}{numField("CAS Latency", "casLatency", a.casLatency)}</>)}
        </>
      );
    }
    case "GPU": {
      const a = attributes as Extract<ProductAttributes, { componentType: "GPU" }>;
      return (
        <>
          {txtField("Chipset", "chipset", a.chipset)}
          {grid2(<>{numField("VRAM (GB)", "vram", a.vram)}{numField("Card Length (mm)", "length", a.length)}</>)}
          {numField("Recommended PSU (W)", "recommendedPsu", a.recommendedPsu)}
        </>
      );
    }
    case "SSD": {
      const a = attributes as Extract<ProductAttributes, { componentType: "SSD" }>;
      return (
        <>
          {grid2(<>
            {selField("Form Factor", "formFactor", a.formFactor, ["M.2 2280", "2.5 inch", "PCIe Add-in Card"])}
            {selField("Interface", "interface", a.interface, ["PCIe 5.0 x4", "PCIe 4.0 x4", "PCIe 3.0 x4", "SATA III"])}
          </>)}
          {grid2(<>{numField("Capacity (GB)", "capacity", a.capacity)}{numField("Read Speed (MB/s)", "readSpeed", a.readSpeed)}</>)}
          {numField("Write Speed (MB/s)", "writeSpeed", a.writeSpeed)}
        </>
      );
    }
    case "HDD": {
      const a = attributes as Extract<ProductAttributes, { componentType: "HDD" }>;
      return (
        <>
          {grid2(<>
            {selField("Form Factor", "formFactor", a.formFactor, ["3.5 inch", "2.5 inch"])}
            {selField("RPM", "rpm", String(a.rpm), ["5400", "7200"])}
          </>)}
          {grid2(<>{numField("Capacity (GB)", "capacity", a.capacity)}{numField("Cache (MB)", "cache", a.cache)}</>)}
        </>
      );
    }
    case "PSU": {
      const a = attributes as Extract<ProductAttributes, { componentType: "PSU" }>;
      return (
        <>
          {numField("Wattage (W)", "wattage", a.wattage)}
          {grid2(<>
            {selField("Efficiency", "efficiency", a.efficiency, ["80+ Titanium", "80+ Platinum", "80+ Gold", "80+ Bronze", "80+ Standard"])}
            {selField("Modularity", "modularity", a.modularity, ["Full", "Semi", "Non"])}
          </>)}
          {selField("Form Factor", "formFactor", a.formFactor, ["ATX", "SFX", "SFX-L"])}
        </>
      );
    }
    case "Case": {
      const a = attributes as Extract<ProductAttributes, { componentType: "Case" }>;
      return (
        <>
          {selField("Form Factor", "formFactor", a.formFactor, ["Full Tower", "Mid Tower", "Mini ITX"])}
          {arrField("Motherboard Support", "motherboardSupport", a.motherboardSupport)}
          {grid2(<>{numField("Max GPU Length (mm)", "maxGpuLength", a.maxGpuLength)}{numField("Max CPU Cooler Height (mm)", "maxCpuCoolerHeight", a.maxCpuCoolerHeight)}</>)}
        </>
      );
    }
    case "CPU Cooler": {
      const a = attributes as Extract<ProductAttributes, { componentType: "CPU Cooler" }>;
      return (
        <>
          {selField("Type", "type", a.type, ["Air Cooler", "Liquid Cooler"])}
          {arrField("Socket Support", "socketSupport", a.socketSupport)}
          {a.type === "Air Cooler"
            ? numField("Height (mm)", "height", a.height ?? 0)
            : selField("Radiator Size (mm)", "radiatorSize", String(a.radiatorSize ?? 240), ["120", "240", "280", "360", "420"])
          }
        </>
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
    <div className="admin-page">
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 className="admin-page-title">Products</h1>
            <p className="admin-page-subtitle">
              {products.length} item{products.length !== 1 ? "s" : ""} in catalogue
            </p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={14} aria-hidden="true" />
            Add product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        {products.length === 0 ? (
          <div className="empty-state">
            <Package size={40} className="empty-state-icon" aria-hidden="true" />
            <p className="empty-state-title">No products yet</p>
            <p className="empty-state-desc">Add your first product to start building the catalogue.</p>
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={14} />
              Add product
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table" aria-label="Product catalogue">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th style={{ textAlign: "right" }}>Price (฿)</th>
                  <th style={{ textAlign: "right" }}>Stock</th>
                  <th>Stock status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const stockBadge =
                    p.stock === 0
                      ? { label: "Out of stock", cls: "badge badge-error" }
                      : p.stock <= 5
                        ? { label: "Low stock",    cls: "badge badge-warning" }
                        : { label: "In stock",     cls: "badge badge-success" };
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                          <div
                            style={{
                              width: 36, height: 36,
                              borderRadius: "var(--radius-sm)",
                              background: "var(--color-surface-2)",
                              overflow: "hidden", flexShrink: 0,
                            }}
                          >
                            {p.imageUrl && (
                              <img src={p.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{p.name}</div>
                            {p.description && (
                              <div
                                style={{
                                  fontSize: "var(--text-xs)", color: "var(--color-muted)",
                                  maxWidth: "28ch", overflow: "hidden",
                                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                                }}
                              >
                                {p.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: "var(--color-surface-2)", color: "var(--color-ink)" }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                        {p.price.toLocaleString()}
                      </td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                        {p.stock}
                      </td>
                      <td><span className={stockBadge.cls}>{stockBadge.label}</span></td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "var(--space-2)" }}>
                          <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => openEdit(p)}
                            aria-label={`Edit ${p.name}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-icon"
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
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-label={modal.mode === "create" ? "Add product" : "Edit product"}
        >
          <div className="modal" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <span className="modal-title">
                {modal.mode === "create" ? "Add product" : "Edit product"}
              </span>
              <button className="btn btn-ghost btn-icon" onClick={closeModal} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {/* Category selector — shown first so attributes form below reacts */}
              <div className="form-group">
                <label className="form-label" htmlFor="pm-category">Category</label>
                <select
                  id="pm-category"
                  className="form-input"
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Base fields */}
              <div className="form-group">
                <label className="form-label" htmlFor="pm-name">Name</label>
                <input
                  id="pm-name"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => field("name", e)}
                  placeholder="Product name"
                  autoFocus
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="pm-price">Price (฿)</label>
                  <input
                    id="pm-price"
                    type="number"
                    className="form-input"
                    value={form.price || ""}
                    onChange={(e) => field("price", e)}
                    placeholder="0"
                    min={0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pm-stock">Stock</label>
                  <input
                    id="pm-stock"
                    type="number"
                    className="form-input"
                    value={form.stock || ""}
                    onChange={(e) => field("stock", e)}
                    placeholder="0"
                    min={0}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pm-desc">Description</label>
                <textarea
                  id="pm-desc"
                  className="form-textarea"
                  value={form.description ?? ""}
                  onChange={(e) => field("description", e)}
                  placeholder="Short product description"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pm-img">Image URL</label>
                <input
                  id="pm-img"
                  className="form-input"
                  value={form.imageUrl ?? ""}
                  onChange={(e) => field("imageUrl", e)}
                  placeholder="https://..."
                />
              </div>

              {/* ── Dynamic attributes section ── */}
              <div
                style={{
                  borderTop: "1px solid var(--color-border)",
                  paddingTop: "var(--space-4)",
                  marginTop: "var(--space-2)",
                }}
              >
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  {form.category} Specifications
                </p>
                <AttributesForm
                  attributes={form.attributes}
                  onChange={(updated) => setForm((f) => ({ ...f, attributes: updated }))}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button
                className="btn btn-primary"
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
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
        >
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <span className="modal-title">Delete product</span>
              <button className="btn btn-ghost btn-icon" onClick={closeModal} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)", lineHeight: 1.6 }}>
                Delete{" "}
                <strong style={{ color: "var(--color-ink)" }}>{modal.product.name}</strong>
                ? This cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={submitting}>
                {submitting ? "Deleting…" : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
