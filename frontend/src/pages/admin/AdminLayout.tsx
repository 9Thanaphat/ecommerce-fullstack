import { useState } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Menu,
  X,
  Cpu,
} from "lucide-react";
import Dashboard from "./Dashboard";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products",  label: "Products",  icon: Package },
  { to: "/admin/orders",    label: "Orders",    icon: ShoppingBag },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-56 bg-[#111111] border-r border-white/[0.06] flex flex-col z-40 transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className="h-14 flex items-center gap-2 px-5 border-b border-white/[0.06] shrink-0">
          <Cpu size={15} className="text-red-500/80" />
          <span className="text-xs font-bold tracking-widest uppercase text-red-500/80">
            Admin
          </span>
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
                    ? "bg-white/[0.07] text-white"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                }`
              }
            >
              <Icon size={15} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Back to store */}
        <div className="p-3 border-t border-white/[0.06] shrink-0">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            ← Back to store
          </NavLink>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col md:ml-56 min-h-screen">
        {/* Topbar */}
        <header className="h-14 flex items-center gap-4 px-6 border-b border-white/[0.06] bg-[#0d0d0d] sticky top-0 z-20">
          <button
            className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="ml-auto text-xs text-white/25 tabular-nums">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </header>

        {/* Page */}
        <main className="flex-1">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
