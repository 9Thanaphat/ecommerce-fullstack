import { useState } from "react";
import { ShoppingBag } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────
type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
}

// ─── Mock data ────────────────────────────────────────────────
const mockOrders: Order[] = [
  { id: "ORD-001", customer: "Thanaphat S.",  email: "thanaphat@example.com", items: 2, total: 7350,  status: "delivered", date: "2026-06-02" },
  { id: "ORD-002", customer: "Mika T.",        email: "mika@example.com",       items: 1, total: 9500,  status: "pending",   date: "2026-06-02" },
  { id: "ORD-003", customer: "Nattapon R.",    email: "nattapon@example.com",   items: 3, total: 4200,  status: "shipped",   date: "2026-06-01" },
  { id: "ORD-004", customer: "Somsak W.",      email: "somsak@example.com",     items: 1, total: 1800,  status: "delivered", date: "2026-06-01" },
  { id: "ORD-005", customer: "Arisa P.",       email: "arisa@example.com",      items: 1, total: 3200,  status: "cancelled", date: "2026-05-31" },
  { id: "ORD-006", customer: "Chanon L.",      email: "chanon@example.com",     items: 4, total: 12400, status: "shipped",   date: "2026-05-30" },
  { id: "ORD-007", customer: "Pimchanok W.",   email: "pim@example.com",        items: 2, total: 6200,  status: "delivered", date: "2026-05-29" },
  { id: "ORD-008", customer: "Krit M.",        email: "krit@example.com",       items: 1, total: 850,   status: "pending",   date: "2026-05-29" },
];

const statusConfig: Record<OrderStatus, { label: string; cls: string }> = {
  delivered: { label: "Delivered", cls: "badge badge-success" },
  shipped:   { label: "Shipped",   cls: "badge badge-warning" },
  pending:   { label: "Pending",   cls: "badge badge-neutral" },
  cancelled: { label: "Cancelled", cls: "badge badge-error"   },
};

const ALL = "all" as const;
type Filter = OrderStatus | typeof ALL;

const filterOptions: { value: Filter; label: string }[] = [
  { value: ALL,        label: "All"       },
  { value: "pending",  label: "Pending"   },
  { value: "shipped",  label: "Shipped"   },
  { value: "delivered",label: "Delivered" },
  { value: "cancelled",label: "Cancelled" },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<Filter>(ALL);

  const visible =
    filter === ALL ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <p className="admin-page-subtitle">
          {orders.length} total · {orders.filter((o) => o.status === "pending").length} pending
        </p>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          marginBottom: "var(--space-6)",
          flexWrap: "wrap",
        }}
        role="group"
        aria-label="Filter orders by status"
      >
        {filterOptions.map(({ value, label }) => {
          const isActive = filter === value;
          const count =
            value === ALL
              ? orders.length
              : orders.filter((o) => o.status === value).length;
          return (
            <button
              key={value}
              className={isActive ? "btn btn-ghost" : "btn btn-ghost"}
              onClick={() => setFilter(value)}
              aria-pressed={isActive}
              style={
                isActive
                  ? {
                      borderColor: "var(--color-border-active)",
                      color: "var(--color-ink)",
                    }
                  : {}
              }
            >
              {label}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 18,
                  height: 18,
                  borderRadius: "var(--radius-full)",
                  background: isActive
                    ? "var(--color-primary)"
                    : "var(--color-surface-2)",
                  color: isActive ? "var(--color-ink)" : "var(--color-muted)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  padding: "0 4px",
                  marginLeft: "var(--space-1)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        {visible.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={40} className="empty-state-icon" aria-hidden="true" />
            <p className="empty-state-title">No orders</p>
            <p className="empty-state-desc">
              No {filter === ALL ? "" : filter} orders found.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table" aria-label="Order list">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Total (฿)</th>
                  <th>Date</th>
                  <th>Update status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => {
                  const s = statusConfig[order.status];
                  return (
                    <tr key={order.id}>
                      <td
                        style={{
                          color: "var(--color-muted)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {order.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{order.customer}</div>
                        <div
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-muted)",
                          }}
                        >
                          {order.email}
                        </div>
                      </td>
                      <td style={{ color: "var(--color-muted)" }}>
                        {order.items}
                      </td>
                      <td>
                        <span className={s.cls}>{s.label}</span>
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {order.total.toLocaleString()}
                      </td>
                      <td style={{ color: "var(--color-muted)" }}>
                        {order.date}
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ width: "auto", minWidth: 120 }}
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value as OrderStatus)
                          }
                          aria-label={`Update status for ${order.id}`}
                        >
                          {(
                            Object.keys(statusConfig) as OrderStatus[]
                          ).map((s) => (
                            <option key={s} value={s}>
                              {statusConfig[s].label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
