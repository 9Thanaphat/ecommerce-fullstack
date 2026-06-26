import { useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const { state } = useLocation();
  const orderId: number | undefined = state?.orderId;
  const total: number | undefined = state?.total;

  const orderNumber = orderId
    ? `ORD-${orderId.toString().padStart(6, "0")}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-8">
      <div className="text-center max-w-sm w-full">

        <div className="flex justify-center mb-6">
          <CheckCircle size={72} className="text-green-500" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>

        {orderNumber && (
          <p className="text-sm text-gray-400 mb-1">
            หมายเลขคำสั่งซื้อ
          </p>
        )}
        {orderNumber && (
          <p className="text-lg font-semibold text-gray-800 mb-2 tracking-wide">
            {orderNumber}
          </p>
        )}
        {total !== undefined && (
          <p className="text-sm text-gray-500 mb-8">
            ยอดรวม{" "}
            <span className="font-semibold text-gray-800">
              ฿{total.toLocaleString()}
            </span>
          </p>
        )}

        {!orderNumber && <div className="mb-8" />}

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-700 transition-colors text-center"
          >
            กลับหน้าหลัก
          </Link>
          <Link
            to="/products"
            className="w-full text-sm text-gray-500 hover:text-gray-800 py-2 transition-colors"
          >
            ช้อปต่อ
          </Link>
        </div>

      </div>
    </div>
  );
}
