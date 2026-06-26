import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package, ChevronDown, ChevronUp, ShoppingBag, XCircle } from "lucide-react";
import { toast } from "sonner";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

type Order = {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
};

type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
};

const statusStyle: Record<OrderStatus, string> = {
  pending:   "bg-gray-100 text-gray-500",
  confirmed: "bg-blue-50 text-blue-600",
  shipped:   "bg-amber-50 text-amber-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
};

const statusLabel: Record<OrderStatus, string> = {
  pending:   "Pending",
  confirmed: "Confirmed",
  shipped:   "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const fmtOrderId = (id: number) => `ORD-${id.toString().padStart(6, "0")}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("th-TH", {
    day: "2-digit", month: "short", year: "numeric",
  });

const API = import.meta.env.VITE_API_URL;

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [itemsCache, setItemsCache] = useState<Record<number, OrderItem[]>>({});
  const [itemsLoading, setItemsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/auth/check-auth`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (!data.authenticated) navigate("/auth"); })
      .catch(() => navigate("/auth"));

    fetch(`${API}/orders/my`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (data.success) setOrders(data.orders); })
      .finally(() => setLoading(false));
  }, []);

  const cancelOrder = async (orderId: number) => {
    const res = await fetch(`${API}/orders/my/${orderId}/cancel`, {
      method: "PATCH",
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: "cancelled" } : o));
      toast.success("ยกเลิกออเดอร์สำเร็จ");
    } else {
      toast.error(data.message ?? "เกิดข้อผิดพลาด");
    }
  };

  const toggleExpand = async (orderId: number) => {
    if (expanded === orderId) { setExpanded(null); return; }
    setExpanded(orderId);
    if (itemsCache[orderId]) return;
    setItemsLoading(true);
    try {
      const res = await fetch(`${API}/orders/my/${orderId}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setItemsCache((prev) => ({ ...prev, [orderId]: data.items }));
    } finally {
      setItemsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-8 py-12">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Account</p>
          <h1 className="text-2xl font-bold text-gray-900">คำสั่งซื้อของฉัน</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-gray-400">กำลังโหลด...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <ShoppingBag size={40} className="text-gray-300" />
            <p className="text-sm text-gray-400">ยังไม่มีคำสั่งซื้อ</p>
            <Link
              to="/products"
              className="text-sm text-gray-900 font-medium hover:underline underline-offset-4"
            >
              เริ่มช้อปเลย
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => {
              const isOpen = expanded === order.id;
              const items = itemsCache[order.id] ?? [];

              return (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Header row */}
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Package size={16} className="text-gray-400 flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-semibold text-gray-800 font-mono">
                          {fmtOrderId(order.id)}
                        </span>
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${statusStyle[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                          {statusLabel[order.status] ?? order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {fmtDate(order.createdAt)} · {order.itemCount} ชิ้น
                      </p>
                    </div>

                    <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                      ฿{order.totalAmount.toLocaleString()}
                    </span>

                    <span className="text-gray-400 flex-shrink-0 ml-1">
                      {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </span>
                  </button>

                  {(order.status === "pending" || order.status === "confirmed") && (
                    <div className="border-t border-gray-50 px-6 py-3 flex justify-end">
                      <button
                        onClick={() => {
                          if (confirm("ยืนยันการยกเลิกออเดอร์นี้?")) cancelOrder(order.id);
                        }}
                        className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <XCircle size={13} />
                        ยกเลิกออเดอร์
                      </button>
                    </div>
                  )}

                  {/* Expanded items */}
                  {isOpen && (
                    <div className="border-t border-gray-100 px-6 py-4">
                      {itemsLoading && items.length === 0 ? (
                        <p className="text-xs text-gray-400">กำลังโหลด...</p>
                      ) : (
                        <div className="flex flex-col divide-y divide-gray-50">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  ฿{item.price.toLocaleString()} × {item.quantity}
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-gray-700 flex-shrink-0 ml-4">
                                ฿{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}

                          <div className="flex justify-between pt-3 mt-1">
                            <span className="text-xs text-gray-400">ยอดรวม</span>
                            <span className="text-sm font-bold text-gray-900">
                              ฿{order.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
