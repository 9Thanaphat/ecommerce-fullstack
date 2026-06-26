import { ShoppingCart, ImageOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const inStock = product.stock > 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await addToCart(product);
    if (result === "auth_required") navigate("/auth");
    else if (result === "ok") toast.success("เพิ่มลงตะกร้าแล้ว", { description: product.name });
    else toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      {/* Image — click to detail */}
      <Link to={`/products/${product.id}`} className="relative bg-gray-50 aspect-square overflow-hidden flex items-center justify-center block">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ImageOff size={32} className="text-gray-300" />
        )}
        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide bg-white text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">
          {product.category}
        </span>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1 flex flex-col gap-2 mb-3">
          <Link
            to={`/products/${product.id}`}
            className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-gray-600 transition-colors"
          >
            {product.name}
          </Link>

          {product.description && (
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-base font-bold text-gray-900">
              ฿{product.price.toLocaleString()}
            </span>
            <p className={`text-[10px] mt-0.5 ${inStock ? "text-green-500" : "text-red-400"}`}>
              {inStock ? `In stock (${product.stock})` : "Out of stock"}
            </p>
          </div>
          <button
            disabled={!inStock}
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={13} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
