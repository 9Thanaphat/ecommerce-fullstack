import { useEffect, useState } from "react";
import "../App.css";

// Define the Product interface to match the backend schema
interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  stock: number;
}

export default function Products() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from the backend API
    fetch("http://localhost:8000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return <div className="p-8">Loading products...</div>;
  }
  return (
    <div className="p-8 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <img src={product.imageUrl || "https://via.placeholder.com/150"} alt={product.name} className="w-full h-48 object-cover mt-2 rounded-lg" />
            <p className="text-green-600 font-semibold">${(product.price / 100).toFixed(2)}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          </div>
        ))} 
      </div>
    </div>
  );
}