import { Link } from "react-router-dom";
import { ArrowRight, Cpu, CircuitBoard, Monitor, MemoryStick, HardDrive, Zap } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import type { Product } from "../types/product";

const categories = [
  { label: "CPU",       icon: Cpu,          to: "/products" },
  { label: "Mainboard", icon: CircuitBoard,  to: "/products" },
  { label: "GPU",       icon: Monitor,       to: "/products" },
  { label: "RAM",       icon: MemoryStick,   to: "/products" },
  { label: "SSD",       icon: HardDrive,     to: "/products" },
  { label: "PSU",       icon: Zap,           to: "/products" },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data: Product[]) => setFeatured(data.slice(0, 4)))
      .catch((err) => console.error("Failed to fetch featured products:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-8 py-20 flex flex-col gap-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            IT Components Store
          </p>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight max-w-xl">
            Build your perfect PC
          </h1>

          <div className="flex items-center gap-3 mt-2">
            <Link
              to="/products"
              className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Shop now <ArrowRight size={15} />
            </Link>
            <Link
              to="/products"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors px-4 py-2.5"
            >
              View all products
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-12 flex flex-col gap-12">

        {/* Categories */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5">
            Categories
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map(({ label, icon: Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl py-5 px-3 hover:border-gray-400 hover:shadow-sm transition-all group"
              >
                <Icon size={20} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                <span className="text-xs text-gray-500 group-hover:text-gray-800 font-medium transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
              Featured
            </h2>
            <Link
              to="/products"
              className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
