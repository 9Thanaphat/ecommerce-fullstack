import { Package, ShoppingBag, DollarSign, AlertTriangle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

type Stats = {
  totalOrders: number;
  todayOrders: number;
  revenue: number;
  totalProducts: number;
  lowStock: number;
};

type RecentOrder = {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingFirstName: string | null;
  shippingLastName: string | null;
  userEmail: string | null;
};

const statusStyle: Record<string, string> = {
  delivered: "bg-emerald-50 text-emerald-700",
  shipped:   "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  pending:   "bg-gray-100 text-gray-500",
  cancelled: "bg-red-50 text-red-600",
};

const fmtOrderId = (id: number) => `ORD-${id.toString().padStart(6, "0")}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("th-TH", { day: "2-digit", month: "short" });

const API = import.meta.env.VITE_API_URL;

function StatSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse">
      <div className="h-3 w-20 bg-gray-100 rounded mb-4" />
      <div className="h-8 w-16 bg-gray-100 rounded mb-3" />
      <div className="h-3 w-24 bg-gray-100 rounded" />
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/dashboard`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Total Products", value: stats.totalProducts, meta: `${stats.lowStock} low stock`,        icon: Package },
        { label: "Total Orders",   value: stats.totalOrders,   meta: `${stats.todayOrders} today`,         icon: ShoppingBag },
        { label: "Revenue",        value: `฿${(stats.revenue / 1000).toFixed(1)}k`, meta: "ยกเว้นออเดอร์ยกเลิก", icon: DollarSign },
        { label: "Low Stock",      value: stats.lowStock,      meta: "สินค้าใกล้หมด (≤ 5 ชิ้น)",          icon: AlertTriangle },
      ]
    : null;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Store at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading || !statCards
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : statCards.map(({ label, value, meta, icon: Icon }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
                  <Icon size={14} className="text-gray-300" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-400">{meta}</div>
              </div>
            ))}
      </div>


      {/* Recent orders */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-900">ออเดอร์ล่าสุด</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={18} className="text-gray-300 animate-spin" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-400">ยังไม่มีออเดอร์</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Order", "Customer", "Status", "Total", "Date"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const name = [order.shippingFirstName, order.shippingLastName].filter(Boolean).join(" ") || order.userEmail || "-";
                  return (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5 text-xs text-gray-400 tabular-nums font-mono">{fmtOrderId(order.id)}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-600">{name}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${statusStyle[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-600 tabular-nums">฿{order.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-3.5 text-xs text-gray-400">{fmtDate(order.createdAt)}</td>
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
