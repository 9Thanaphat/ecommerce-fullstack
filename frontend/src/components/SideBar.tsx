import {
  Layers,
  Cpu,
  CircuitBoard,
  MemoryStick,
  Monitor,
  HardDrive,
  Database,
  Zap,
  Box,
  Wind,
} from "lucide-react";
import type { ProductCategory } from "../types/product";

export type SortOrder = "none" | "asc" | "desc";

interface SideBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory?: ProductCategory | "All";
  setSelectedCategory?: (c: ProductCategory | "All") => void;
  priceRange?: [number, number];
  setPriceRange?: (range: [number, number]) => void;
  priceMin?: number;
  priceMax?: number;
  sortOrder?: SortOrder;
  setSortOrder?: (order: SortOrder) => void;
}

const categories: { label: ProductCategory | "All"; icon: React.ElementType }[] = [
  { label: "All",        icon: Layers },
  { label: "CPU",        icon: Cpu },
  { label: "Mainboard",  icon: CircuitBoard },
  { label: "RAM",        icon: MemoryStick },
  { label: "GPU",        icon: Monitor },
  { label: "SSD",        icon: HardDrive },
  { label: "HDD",        icon: Database },
  { label: "PSU",        icon: Zap },
  { label: "Case",       icon: Box },
  { label: "CPU Cooler", icon: Wind },
];

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 50000;

export default function SideBar({
  search,
  setSearch,
  selectedCategory = "All",
  setSelectedCategory,
  priceRange,
  setPriceRange,
  priceMin = DEFAULT_MIN,
  priceMax = DEFAULT_MAX,
  sortOrder = "none",
  setSortOrder,
}: SideBarProps) {
  const min = Array.isArray(priceRange) ? priceRange[0] : priceMin;
  const max = Array.isArray(priceRange) ? priceRange[1] : priceMax;

  const minPct = priceMax > priceMin ? ((min - priceMin) / (priceMax - priceMin)) * 100 : 0;
  const maxPct = priceMax > priceMin ? ((max - priceMin) / (priceMax - priceMin)) * 100 : 100;

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setPriceRange) return;
    const val = Math.min(Number(e.target.value), max - 1000);
    setPriceRange([val, max]);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setPriceRange) return;
    const val = Math.max(Number(e.target.value), min + 1000);
    setPriceRange([min, val]);
  };

  return (
    <aside className="w-52 shrink-0 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col gap-5">
      {/* Search */}
      <input
        className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Sort */}
      {setSortOrder && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sort by price
          </p>
          {([["none", "Default"], ["asc", "Low → High"], ["desc", "High → Low"]] as [SortOrder, string][]).map(
            ([value, label]) => (
              <button
                key={value}
                onClick={() => setSortOrder(value)}
                className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  sortOrder === value
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      )}

      {/* Price Range — แสดงเฉพาะเมื่อ setPriceRange ถูกส่งมา */}
      {setPriceRange && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Price
            </p>
            <button
              onClick={() => setPriceRange([priceMin, priceMax])}
              className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>฿{min.toLocaleString()}</span>
            <span>฿{max.toLocaleString()}</span>
          </div>

          <div className="relative h-5 flex items-center">
            {/* Track */}
            <div className="absolute w-full h-1 bg-gray-200 rounded-full" />
            {/* Active range */}
            <div
              className="absolute h-1 bg-gray-800 rounded-full pointer-events-none"
              style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
            />
            {/* Min thumb */}
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              step={500}
              value={min}
              onChange={handleMin}
              className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-800 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-800"
              style={{ zIndex: min >= max - 500 ? 5 : 3 }}
            />
            {/* Max thumb */}
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              step={500}
              value={max}
              onChange={handleMax}
              className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-800 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-800"
              style={{ zIndex: min >= max - 500 ? 3 : 5 }}
            />
          </div>
        </div>
      )}

      {/* Divider */}
      {setSelectedCategory && <div className="border-t border-gray-100" />}

      {/* Categories — แสดงเฉพาะเมื่อ setSelectedCategory ถูกส่งมา */}
      {setSelectedCategory && (
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-2">
            Category
          </p>
          {categories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setSelectedCategory(label)}
              className={`flex items-center gap-2.5 text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === label
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
