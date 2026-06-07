import { useState } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Menu,
  X,
  Zap,
} from "lucide-react";
import Dashboard from "./Dashboard";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(0 0 0 / 0.5)",
            zIndex: 35,
          }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`} aria-label="Admin navigation">
        <div className="admin-sidebar-logo">
          Admin
        </div>

        <nav className="admin-sidebar-nav" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                "admin-nav-link" + (isActive ? " active" : "")
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div
          style={{
            padding: "var(--space-4) var(--space-6)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <NavLink
            to="/"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-muted)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              transition: "color var(--duration-fast) var(--ease-out)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-ink)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-muted)")
            }
          >
            ← Back to store
          </NavLink>
        </div>
      </aside>

      {/* Main area */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <button
            className="btn btn-ghost btn-icon"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <span
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-muted)",
              marginLeft: "auto",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </header>

        {/* Page content */}
        <main>
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
