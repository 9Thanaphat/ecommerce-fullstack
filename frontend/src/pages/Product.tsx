import "../App.css";
import SideBar from "../components/SideBar";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import { useState } from "react";
import type { ProductCategory } from "../mockProduct";

const PRICE_MIN = 0;
const PRICE_MAX = 50000;

export default function Products() {
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All">("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);

  return (
    <div className="min-h-screen">
      <div className="flex gap-4 p-8 bg-gray-50">
        <SideBar
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          priceMin={PRICE_MIN}
          priceMax={PRICE_MAX}
        />
        <ProductGrid
          search={search}
        />
      </div>
      <Footer />
    </div>
  );
}
