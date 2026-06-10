import { Link } from "react-router-dom";
import { ArrowRight, Cpu, CircuitBoard, Monitor, MemoryStick, HardDrive, Zap } from "lucide-react";
import { mockProducts } from "../mockProduct";

const featured = mockProducts.slice(0, 4);

const categories = [
  { label: "CPU",       icon: Cpu,          to: "/products" },
  { label: "Mainboard", icon: CircuitBoard,  to: "/products" },
  { label: "GPU",       icon: Monitor,       to: "/products" },
  { label: "RAM",       icon: MemoryStick,   to: "/products" },
  { label: "SSD",       icon: HardDrive,     to: "/products" },
  { label: "PSU",       icon: Zap,           to: "/products" },
];

export default function Home() {
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
          <p className="text-gray-400 max-w-md text-sm leading-relaxed">
            CPU, GPU, RAM, SSD และอีกมากมาย — คัดเลือกชิ้นส่วนคุณภาพสำหรับ build ของคุณ
          </p>
          <div className="flex items-center gap-3 mt-2">
            <Link
              to="/products"
              className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
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
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <div className="bg-gray-50 aspect-square flex items-center justify-center p-4">
                  <img
                    src={product.imageUrl || undefined}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{product.category}</p>
                  <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-2">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    ฿{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
