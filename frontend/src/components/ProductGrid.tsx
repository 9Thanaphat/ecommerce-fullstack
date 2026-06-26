import "../App.css";
import ProductCard from "./ProductCard";
import type { Product, ProductCategory } from "../types/product";
import type { SortOrder } from "./SideBar";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  search: string;
  selectedCategory?: ProductCategory | "All";
  priceRange?: [number, number];
  sortOrder?: SortOrder;
}

export default function ProductGrid({
  products,
  loading,
  search,
  selectedCategory = "All",
  priceRange,
  sortOrder = "none",
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="p-4 bg-white w-full min-h-screen border-2 border-gray-200 rounded-lg">
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="flex items-center justify-between mt-2">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-7 bg-gray-200 rounded-lg w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filtered = products
    .filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchPrice = !priceRange || (product.price >= priceRange[0] && product.price <= priceRange[1]);
      return matchSearch && matchCategory && matchPrice;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="p-4 bg-white w-full min-h-screen border-2 border-gray-200 rounded-lg">
      {filtered.length === 0 ? (
        <div className="p-8 text-sm text-gray-400">No products found</div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
