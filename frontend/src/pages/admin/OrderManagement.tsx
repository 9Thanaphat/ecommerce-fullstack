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

const statusStyle: Record<OrderStatus, string> = {
  delivered: "bg-emerald-500/10 text-emerald-400",
  shipped:   "bg-amber-500/10 text-amber-400",
  pending:   "bg-white/5 text-white/40",
  cancelled: "bg-red-500/10 text-red-400",
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
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Orders</h1>
        <p className="text-sm text-white/35 mt-0.5">
          {orders.length} total · {orders.filter((o) => o.status === "pending").length} pending
        </p>
      </div>

      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-2 mb-6"
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
              onClick={() => setFilter(value)}
              aria-pressed={isActive}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                isActive
                  ? "bg-white/[0.07] border-white/20 text-white"
                  : "bg-transparent border-transparent text-white/40 hover:bg-white/[0.04] hover:text-white/70"
              }`}
            >
              {label}
              <span
                className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1 ${
                  isActive
                    ? "bg-red-500/20 text-red-400"
                    : "bg-white/5 text-white/40"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-white/[0.06] rounded-xl overflow-hidden">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <ShoppingBag size={40} className="text-white/10 mb-4" aria-hidden="true" />
            <p className="text-sm font-medium text-white/70 mb-1">No orders</p>
            <p className="text-xs text-white/30">
              No {filter === ALL ? "" : filter} orders found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" aria-label="Order list">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Order</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Customer</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Items</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Status</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25 text-right">Total (฿)</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Date</th>
                  <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">Update status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => {
                  return (
                    <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-xs text-white/30 tabular-nums">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white/80 mb-0.5">{order.customer}</div>
                        <div className="text-xs text-white/30">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/50">
                        {order.items}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${statusStyle[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/70 text-right tabular-nums">
                        {order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-white/30">
                        {order.date}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="bg-[#0a0a0a] border border-white/10 text-white/70 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500/50 hover:border-white/20 transition-colors cursor-pointer"
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value as OrderStatus)
                          }
                          aria-label={`Update status for ${order.id}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
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
