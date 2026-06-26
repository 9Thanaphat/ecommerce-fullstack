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
    <nav className="navbar h-24 pl-8 pr-8 md:pl-16 md:pr-16 border-b-3 border-gray-100 bg-white text-black p-4 flex items-center gap-6 w-full">
      <h1 className="navbar-title text-xl font-bold cursor-pointer flex-shrink-0" onClick={() => navigate("/")}>BOSS IT</h1>

      <div className="flex items-center ml-auto min-w-fit gap-6">
        {authUser && (
          <button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="My Orders"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">คำสั่งซื้อ</span>
          </button>
        )}

        <button
          className="relative cursor-pointer hover:text-blue-500 transition-colors"
          onClick={() => navigate("/cart")}
          aria-label="Cart"
        >
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </button>

        {authUser ? (
          <button
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center hover:bg-gray-700 transition-colors flex-shrink-0"
            aria-label="Profile"
            title={authUser.email}
          >
            {getInitials(authUser.firstName, authUser.lastName, authUser.email)}
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Login"
          >
            <User size={24} />
          </button>
        )}
      </div>
    </nav>
  );
}
