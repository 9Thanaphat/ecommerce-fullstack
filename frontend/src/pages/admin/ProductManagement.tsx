import { useState } from "react";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { mockProducts, type Product } from "../../mockProduct";

// ─── Types ────────────────────────────────────────────────────
type ProductForm = Omit<Product, "id">;

const emptyForm: ProductForm = {
  name: "",
  price: 0,
  description: "",
  imageUrl: "",
  stock: 0,
};

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [modal, setModal] = useState<
    | { mode: "create" }
    | { mode: "edit"; product: Product }
    | { mode: "delete"; product: Product }
    | null
  >(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // ── Handlers ──────────────────────────────────────────────
  const openCreate = () => {
    setForm(emptyForm);
    setModal({ mode: "create" });
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      price: p.price,
      description: p.description ?? "",
      imageUrl: p.imageUrl ?? "",
      stock: p.stock,
    });
    setModal({ mode: "edit", product: p });
  };

  const openDelete = (p: Product) => setModal({ mode: "delete", product: p });

  const closeModal = () => setModal(null);

  const handleSave = async () => {
    setSubmitting(true);
    // Simulate async save — replace with real API call
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
            ? {
                ...p,
                ...form,
                description: form.description || null,
                imageUrl: form.imageUrl || null,
              }
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
    key: keyof ProductForm,
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
            <p className="empty-state-desc">
              Add your first product to start building the catalogue.
            </p>
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
                              width: 36,
                              height: 36,
                              borderRadius: "var(--radius-sm)",
                              background: "var(--color-surface-2)",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {p.imageUrl && (
                              <img
                                src={p.imageUrl}
                                alt=""
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{p.name}</div>
                            {p.description && (
                              <div
                                style={{
                                  fontSize: "var(--text-xs)",
                                  color: "var(--color-muted)",
                                  maxWidth: "28ch",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {p.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {p.price.toLocaleString()}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {p.stock}
                      </td>
                      <td>
                        <span className={stockBadge.cls}>{stockBadge.label}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            gap: "var(--space-2)",
                          }}
                        >
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
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">
                {modal.mode === "create" ? "Add product" : "Edit product"}
              </span>
              <button
                className="btn btn-ghost btn-icon"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label" htmlFor="pm-name">
                  Name
                </label>
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
                  <label className="form-label" htmlFor="pm-price">
                    Price (฿)
                  </label>
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
                  <label className="form-label" htmlFor="pm-stock">
                    Stock
                  </label>
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
                <label className="form-label" htmlFor="pm-desc">
                  Description
                </label>
                <textarea
                  id="pm-desc"
                  className="form-textarea"
                  value={form.description ?? ""}
                  onChange={(e) => field("description", e)}
                  placeholder="Short product description"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pm-img">
                  Image URL
                </label>
                <input
                  id="pm-img"
                  className="form-input"
                  value={form.imageUrl ?? ""}
                  onChange={(e) => field("imageUrl", e)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
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
                <strong style={{ color: "var(--color-ink)" }}>
                  {modal.product.name}
                </strong>
                ? This cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
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
