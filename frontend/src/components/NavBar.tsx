import { ShoppingCart, ShoppingBag, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function getInitials(firstName: string | null, lastName: string | null, email: string): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  return email[0].toUpperCase();
}

export default function NavBar() {
  const navigate = useNavigate();
  const { totalItems, authUser } = useCart();

  return (
    <nav className="sticky top-0 z-50 h-14 px-8 md:px-16 bg-gray-900 flex items-center gap-6 w-full">
      <h1
        className="text-xl font-bold text-white cursor-pointer flex-shrink-0"
        onClick={() => navigate("/")}
      >
        BOSS IT
      </h1>

      <div className="flex items-center ml-auto gap-6">
        {authUser && (
          <button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            aria-label="My Orders"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">คำสั่งซื้อ</span>
          </button>
        )}

        {authUser && (
          <button
            className="relative cursor-pointer text-gray-400 hover:text-white transition-colors"
            onClick={() => navigate("/cart")}
            aria-label="Cart"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        )}

        {authUser ? (
          <button
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0"
            aria-label="Profile"
            title={authUser.email}
          >
            {getInitials(authUser.firstName, authUser.lastName, authUser.email)}
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Login"
          >
            <User size={22} />
          </button>
        )}
      </div>
    </nav>
  );
}
