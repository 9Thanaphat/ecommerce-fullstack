import { Package, ShoppingBag, DollarSign, AlertTriangle } from "lucide-react";
import { mockProducts } from "../../mockProduct";

// ─── Mock stats derived from mock data ───────────────────────
const totalProducts = mockProducts.length;
const lowStock = mockProducts.filter((p) => p.stock <= 5).length;
const totalRevenue = mockProducts.reduce(
  (sum, p) => sum + p.price * (Math.floor(Math.random() * 8) + 1),
  0,
);

const mockRecentOrders = [
  { id: "ORD-001", customer: "Thanaphat S.",  status: "delivered", total: 7350,  date: "2026-06-02" },
  { id: "ORD-002", customer: "Mika T.",        status: "pending",   total: 9500,  date: "2026-06-02" },
  { id: "ORD-003", customer: "Nattapon R.",    status: "shipped",   total: 4200,  date: "2026-06-01" },
  { id: "ORD-004", customer: "Somsak W.",      status: "delivered", total: 1800,  date: "2026-06-01" },
  { id: "ORD-005", customer: "Arisa P.",       status: "cancelled", total: 3200,  date: "2026-05-31" },
];

const statusMap: Record<string, { label: string; cls: string }> = {
  delivered: { label: "Delivered", cls: "badge badge-success" },
  shipped:   { label: "Shipped",   cls: "badge badge-warning" },
  pending:   { label: "Pending",   cls: "badge badge-neutral" },
  cancelled: { label: "Cancelled", cls: "badge badge-error"   },
};

const stats = [
  {
    label: "Total Products",
    value: totalProducts,
    meta: `${lowStock} low stock`,
    icon: Package,
  },
  {
    label: "Total Orders",
    value: mockRecentOrders.length,
    meta: "last 30 days",
    icon: ShoppingBag,
  },
  {
    label: "Revenue",
    value: `฿${(totalRevenue / 1000).toFixed(1)}k`,
    meta: "estimated",
    icon: DollarSign,
  },
  {
    label: "Low Stock",
    value: lowStock,
    meta: "items need restocking",
    icon: AlertTriangle,
  },
];

export default function Dashboard() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Store at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {stats.map(({ label, value, meta, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className="stat-card-label">{label}</span>
              <Icon size={16} className="stat-card-icon" aria-hidden="true" />
            </div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-meta">{meta}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="data-table-wrapper">
        <div className="data-table-header">
          <span className="data-table-title">Recent orders</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" aria-label="Recent orders">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentOrders.map((order) => {
                const s = statusMap[order.status] ?? {
                  label: order.status,
                  cls: "badge badge-neutral",
                };
                return (
                  <tr key={order.id}>
                    <td style={{ fontVariantNumeric: "tabular-nums", color: "var(--color-muted)" }}>
                      {order.id}
                    </td>
                    <td>{order.customer}</td>
                    <td>
                      <span className={s.cls}>{s.label}</span>
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      ฿{order.total.toLocaleString()}
                    </td>
                    <td style={{ color: "var(--color-muted)" }}>{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
