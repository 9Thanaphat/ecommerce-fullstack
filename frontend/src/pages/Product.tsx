import "../App.css";
import SideBar, { type SortOrder } from "../components/SideBar";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product, ProductCategory } from "../types/product";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All">(
    (searchParams.get("category") as ProductCategory) ?? "All"
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        const prices = data.map((p) => p.price);
        const lo = prices.length > 0 ? Math.min(...prices) : 0;
        const hi = prices.length > 0 ? Math.max(...prices) : 100000;
        setPriceRange([lo, hi]);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  // คำนวณ bounds ตาม category ที่เลือก และ reset slider ทุกครั้งที่ category เปลี่ยน
  const categoryProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory);

  const priceMin = categoryProducts.length > 0 ? Math.min(...categoryProducts.map((p) => p.price)) : 0;
  const priceMax = categoryProducts.length > 0 ? Math.max(...categoryProducts.map((p) => p.price)) : 100000;

  useEffect(() => {
    if (products.length === 0) return;
    setPriceRange([priceMin, priceMax]);
  }, [selectedCategory, products.length]);

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
          priceMin={priceMin}
          priceMax={priceMax}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <ProductGrid
          products={products}
          loading={loading}
          search={search}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
          sortOrder={sortOrder}
        />
      </div>
      <Footer />
    </div>
  );
}
