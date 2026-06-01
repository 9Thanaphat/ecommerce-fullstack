import { useEffect, useState } from "react";
import "../App.css";
import NavBar from "../components/NavBar";

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
    const fetchProduct = async () => {
    	try {
		    const apiUrl = import.meta.env.VITE_API_URL;
		    const response = await fetch(`${apiUrl}/products`);

        // Check if the response is successful
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
  }
    fetchProduct();
  },[]);

  if (loading) {
    return <div className="p-8">Loading products...</div>;
  }
  return (
    <div className="">
      <NavBar />
      {/* <div className="text-black grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 bg-white shadow-md">
            <h2 className="text-xl text-gray-800 font-bold">{product.name}</h2>
            <img src={product.imageUrl || "https://via.placeholder.com/150"} alt={product.name} className="w-full h-48 object-cover mt-2 rounded-lg" />
            <p className="text-green-600 font-semibold">${(product.price / 100).toFixed(2)}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
          </div>
        ))} 
      </div> */}
    </div>
  );
}
