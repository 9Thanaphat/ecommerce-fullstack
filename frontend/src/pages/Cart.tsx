import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Minus, Plus, X, ImageOff, LogIn } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, authUser } = useCart();
  const navigate = useNavigate();

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <LogIn size={40} className="text-gray-300" />
        <p className="text-sm font-medium text-gray-700">กรุณาเข้าสู่ระบบก่อน</p>
        <p className="text-xs text-gray-400">เพื่อดูสินค้าในตะกร้าของคุณ</p>
        <button
          onClick={() => navigate("/auth")}
          className="mt-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <ShoppingCart size={40} className="text-gray-300" />
        <p className="text-sm text-gray-400">ตะกร้าว่างเปล่า</p>
        <Link
          to="/products"
          className="text-sm text-gray-900 font-medium hover:underline underline-offset-4"
        >
          เลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-8 py-12">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Shopping
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Items list */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center"
              >
                {/* Image */}
                <Link
                  to={`/products/${item.productId}`}
                  className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <ImageOff size={20} className="text-gray-300" />
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">{item.category}</p>
                  <Link
                    to={`/products/${item.productId}`}
                    className="text-sm font-semibold text-gray-800 leading-snug line-clamp-1 hover:text-gray-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    ฿{(item.price * item.quantity).toLocaleString()}
                    <span className="text-xs font-normal text-gray-400 ml-1">
                      (฿{item.price.toLocaleString()} each)
                    </span>
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:border-gray-400 transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-medium text-gray-800 w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 ml-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-xs text-gray-400 hover:text-red-400 self-start transition-colors mt-1"
            >
              Clear cart
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Order Summary
              </p>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm font-medium text-gray-800">
                  ฿{totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                <span className="text-sm text-gray-500">Shipping</span>
                <span className="text-xs text-gray-400">Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold text-gray-800">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ฿{totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-blue-600 text-white text-sm font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
