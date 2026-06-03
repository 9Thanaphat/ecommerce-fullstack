import { useEffect, useState } from "react";
import "../App.css";
import ProductCard from "./ProductCard";

import { mockProducts, type Product } from "../mockProduct";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // const apiUrl = import.meta.env.VITE_API_URL;
        // const response = await fetch(`${apiUrl}/products`);

        // // Check if the response is successful
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

        // const data = await response.json();
        // setProducts(data);
        // setLoading(false);

        setTimeout(() => {
          setProducts(mockProducts);
          setLoading(false);
        }, 500);
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

  return (
    <div className="p-4 bg-white w-full min-h-screen border-2 border-gray-200 rounded-lg ">
      <div className="grid grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
