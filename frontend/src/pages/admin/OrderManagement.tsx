import { useEffect, useState } from "react";
import { ShoppingBag, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

type Order = {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  shippingFirstName: string | null;
  shippingLastName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingSubdistrict: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  shippingPostalCode: string | null;
  userEmail: string | null;
  itemCount: number;
};

type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
};

const statusStyle: Record<OrderStatus, string> = {
  confirmed: "bg-blue-50 text-blue-700",
  shipped:   "bg-amber-50 text-amber-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
  pending:   "bg-gray-100 text-gray-500",
};

const ALL = "all" as const;
type Filter = OrderStatus | typeof ALL;

const filterOptions: { value: Filter; label: string }[] = [
  { value: "all",       label: "All"       },
  { value: "pending",   label: "Pending"   },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped",   label: "Shipped"   },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const fmtOrderId = (id: number) => `ORD-${id.toString().padStart(6, "0")}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });

const API = import.meta.env.VITE_API_URL;

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>(ALL);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [itemsCache, setItemsCache] = useState<Record<number, OrderItem[]>>({});
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/admin/orders`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (data.success) setOrders(data.orders); })
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = async (orderId: number) => {
    if (expanded === orderId) { setExpanded(null); return; }
    setExpanded(orderId);
    if (itemsCache[orderId]) return;
    setItemsLoading(true);
    try {
      const res = await fetch(`${API}/admin/orders/${orderId}/items`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setItemsCache((prev) => ({ ...prev, [orderId]: data.items }));
    } finally {
      setItemsLoading(false);
    }
  };

  const updateStatus = async (orderId: number, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    await fetch(`${API}/admin/orders/${orderId}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const visible = filter === ALL ? orders : orders.filter((o) => o.status === filter);
  const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={20} className="text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">{orders.length} total · {pendingCount} active</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map(({ value, label }) => {
          const isActive = filter === value;
          const count = value === ALL ? orders.length : orders.filter((o) => o.status === value).length;
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {label}
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1 ${
                isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={40} className="text-gray-200 mb-4" />
            <p className="text-sm font-medium text-gray-500 mb-1">No orders</p>
            <p className="text-xs text-gray-400">No {filter === ALL ? "" : filter} orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Order", "Customer", "Items", "Status", "Total (฿)", "Date", "Update status", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => {
                  const isOpen = expanded === order.id;
                  const customerName = [order.shippingFirstName, order.shippingLastName].filter(Boolean).join(" ") || "-";
                  return [
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-xs text-gray-400 tabular-nums font-mono">{fmtOrderId(order.id)}</td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-gray-700 mb-0.5">{customerName}</div>
                        <div className="text-xs text-gray-400">{order.userEmail ?? "-"}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{order.itemCount}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${statusStyle[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 tabular-nums">{order.totalAmount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-xs text-gray-400">{fmtDate(order.createdAt)}</td>
                      <td className="px-5 py-4">
                        <select
                          className="bg-white border border-gray-200 text-gray-600 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors cursor-pointer"
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </td>
                    </tr>,

                    isOpen && (
                      <tr key={`${order.id}-items`} className="border-b border-gray-50 bg-gray-50">
                        <td colSpan={8} className="px-5 py-4">
                          {order.shippingAddress && (
                            <p className="text-xs text-gray-400 mb-3">
                              <span className="text-gray-600 font-medium">ที่อยู่จัดส่ง: </span>
                              {[order.shippingAddress, order.shippingSubdistrict, order.shippingCity, order.shippingProvince, order.shippingPostalCode].filter(Boolean).join(" ")}
                              {order.shippingPhone && ` · ${order.shippingPhone}`}
                            </p>
                          )}
                          {itemsLoading && !itemsCache[order.id] ? (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Loader2 size={12} className="animate-spin" /> Loading...
                            </div>
                          ) : (
                            <table className="w-full">
                              <thead>
                                <tr>
                                  {["สินค้า", "ราคา/ชิ้น", "จำนวน", "รวม"].map((h) => (
                                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-widest text-gray-400 pb-2 pr-6">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(itemsCache[order.id] ?? []).map((item) => (
                                  <tr key={item.id}>
                                    <td className="text-sm text-gray-700 py-1 pr-6">{item.productName}</td>
                                    <td className="text-sm text-gray-400 py-1 pr-6 tabular-nums">฿{item.price.toLocaleString()}</td>
                                    <td className="text-sm text-gray-400 py-1 pr-6">×{item.quantity}</td>
                                    <td className="text-sm text-gray-600 py-1 tabular-nums font-medium">฿{(item.price * item.quantity).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    ),
                  ];
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
