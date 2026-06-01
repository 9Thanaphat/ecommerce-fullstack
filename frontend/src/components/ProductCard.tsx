interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border-gray-200 border-2 rounded-lg p-4 bg-white shadow-md flex flex-col items-center rounded-lg">
      <img
        src={product.imageUrl || undefined}
        alt={product.name}
        className="w-48 h-48 object-cover rounded-lg"
      />
      <div className="mr-auto text-xl text-gray-800 font-bold text-center">
        {product.name}
      </div>{" "}
      <div className="mr-auto text-green-600 font-semibold">
        ${product.price.toFixed(2)}
      </div>
    </div>
  );
}
