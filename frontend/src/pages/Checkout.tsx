import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, ShoppingBag, AlertCircle, ImageOff } from "lucide-react";
import { useCart } from "../context/CartContext";

type UserProfile = {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  subdistrict: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
};

export default function Checkout() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/auth/check-auth`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) { navigate("/auth"); return; }
        setProfile(data.user);
      })
      .catch(() => navigate("/auth"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && items.length === 0) navigate("/cart");
  }, [loading, items]);

  const hasAddress =
    profile?.address && profile?.subdistrict &&
    profile?.city && profile?.province && profile?.postalCode;

  const handleConfirm = async () => {
    if (!hasAddress || !profile) return;
    setPlacing(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/orders/checkout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName ?? "",
          lastName: profile.lastName ?? "",
          phone: profile.phone ?? "",
          address: profile.address,
          subdistrict: profile.subdistrict,
          city: profile.city,
          province: profile.province,
          postalCode: profile.postalCode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/success", { state: { orderId: data.orderId, total: data.totalAmount } });
      } else {
        setError(data.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อ server ได้");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-12">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Checkout</p>
          <h1 className="text-2xl font-bold text-gray-900">ยืนยันคำสั่งซื้อ</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left — address + items */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Shipping address */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-gray-400" />
                  <p className="text-sm font-semibold text-gray-800">ที่อยู่จัดส่ง</p>
                </div>
                <Link
                  to="/profile"
                  className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-4 transition-colors"
                >
                  แก้ไข
                </Link>
              </div>

              {hasAddress ? (
                <div className="text-sm text-gray-700 leading-relaxed">
                  {(profile?.firstName || profile?.lastName) && (
                    <p className="font-semibold text-gray-900 mb-0.5">
                      {[profile.firstName, profile.lastName].filter(Boolean).join(" ")}
                      {profile?.phone && <span className="ml-2 font-normal text-gray-500">{profile.phone}</span>}
                    </p>
                  )}
                  <p>{profile?.address}</p>
                  <p>
                    {[profile?.subdistrict, profile?.city, profile?.province].filter(Boolean).join(" ")}
                    {" "}{profile?.postalCode}
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">ยังไม่ได้กรอกที่อยู่</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      กรุณา{" "}
                      <Link to="/profile" className="underline font-medium">
                        กรอกข้อมูลที่อยู่ในหน้า Profile
                      </Link>{" "}
                      ก่อนสั่งซื้อ
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={15} className="text-gray-400" />
                <p className="text-sm font-semibold text-gray-800">รายการสินค้า ({items.length})</p>
              </div>
              <div className="flex flex-col divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <ImageOff size={16} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                สรุปคำสั่งซื้อ
              </p>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">ยอดรวม</span>
                <span className="font-medium text-gray-800">฿{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm pb-4 border-b border-gray-100 mb-4">
                <span className="text-gray-500">ค่าส่ง</span>
                <span className="text-gray-400 text-xs">ฟรี (Mock)</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-sm font-semibold text-gray-800">ยอดสุทธิ</span>
                <span className="text-xl font-bold text-gray-900">฿{totalPrice.toLocaleString()}</span>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handleConfirm}
                disabled={!hasAddress || placing}
                className="w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {placing ? "กำลังดำเนินการ..." : "Confirm Order (Mock Payment)"}
              </button>

              {!hasAddress && (
                <p className="text-xs text-gray-400 text-center mt-3">
                  กรอกที่อยู่ก่อนจึงจะสั่งซื้อได้
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
