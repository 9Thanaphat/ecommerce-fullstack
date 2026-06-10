import { Package, ShoppingBag, DollarSign, AlertTriangle } from "lucide-react";
import { mockProducts } from "../../mockProduct";

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

const statusStyle: Record<string, string> = {
  delivered: "bg-emerald-500/10 text-emerald-400",
  shipped:   "bg-amber-500/10 text-amber-400",
  pending:   "bg-white/5 text-white/40",
  cancelled: "bg-red-500/10 text-red-400",
};

const stats = [
  { label: "Total Products", value: totalProducts,                      meta: `${lowStock} low stock`,        icon: Package },
  { label: "Total Orders",   value: mockRecentOrders.length,            meta: "last 30 days",                 icon: ShoppingBag },
  { label: "Revenue",        value: `฿${(totalRevenue / 1000).toFixed(1)}k`, meta: "estimated",             icon: DollarSign },
  { label: "Low Stock",      value: lowStock,                           meta: "items need restocking",        icon: AlertTriangle },
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-white/35 mt-0.5">Store at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, meta, icon: Icon }) => (
          <div
            key={label}
            className="bg-[#161616] border border-white/[0.06] rounded-xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {label}
              </span>
              <Icon size={14} className="text-red-500/60" />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-white/30">{meta}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-[#161616] border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <span className="text-sm font-medium text-white">Recent orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Recent orders">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Order", "Customer", "Status", "Total", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-white/25"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockRecentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-3.5 text-xs text-white/30 tabular-nums">{order.id}</td>
                  <td className="px-6 py-3.5 text-sm text-white/70">{order.customer}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${statusStyle[order.status] ?? "bg-white/5 text-white/40"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-white/70 tabular-nums">
                    ฿{order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-white/30">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
