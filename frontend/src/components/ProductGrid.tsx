import { useEffect, useState } from "react";
import "../App.css";
import ProductCard from "./ProductCard";

import type { Product } from "../types/product";

interface ProductGridProps {
  search: string;
}

export default function ProductGrid({search}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/products`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  if (loading) {
    return <div className="p-8">Loading products...</div>;
  }

  const filteredProducts = products.filter((product) => {
    return product?.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-4 bg-white w-full min-h-screen border-2 border-gray-200 rounded-lg ">
      
        {filteredProducts.length === 0 ? (
          <div className="p-8">No products found</div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
  );
}
