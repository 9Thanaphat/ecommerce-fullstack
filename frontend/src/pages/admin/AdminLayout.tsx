import { useState, useEffect } from "react";
import { NavLink, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Menu, X, Cpu, Loader2, Users } from "lucide-react";
import Dashboard from "./Dashboard";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import UserManagement from "./UserManagement";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products",  label: "Products",  icon: Package },
  { to: "/admin/orders",    label: "Orders",    icon: ShoppingBag },
  { to: "/admin/users",     label: "Users",     icon: Users },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authState, setAuthState] = useState<"loading" | "authorized" | "unauthorized">("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/auth/check-auth`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated) { navigate("/auth", { replace: true }); return; }
        if (data.user?.role !== "admin") { navigate("/", { replace: true }); return; }
        setAuthState("authorized");
      })
      .catch(() => navigate("/auth", { replace: true }));
  }, [navigate]);

  if (authState === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 size={22} className="text-gray-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-100 flex flex-col z-40 transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center gap-2 px-5 border-b border-gray-100 shrink-0">
          <Cpu size={15} className="text-gray-900" />
          <span className="text-xs font-bold tracking-widest uppercase text-gray-900">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                }`
              }
            >
              <Icon size={15} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Back to store */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← Back to store
          </NavLink>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col md:ml-56 min-h-screen">
        {/* Topbar */}
        <header className="h-14 flex items-center gap-4 px-6 border-b border-gray-100 bg-white sticky top-0 z-20">
          <button
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="ml-auto text-xs text-gray-400 tabular-nums">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </header>

        {/* Page */}
        <main className="flex-1">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
