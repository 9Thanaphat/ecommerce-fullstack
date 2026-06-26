import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Package, ImageOff } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product, ProductAttributes } from "../types/product";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import ProductCard from "../components/ProductCard";

// ─── Attribute renderers per componentType ────────────────────
function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}

function Specs({ attrs }: { attrs: ProductAttributes }) {
  if (!("componentType" in attrs)) return null;

  switch (attrs.componentType) {
    case "CPU":
      return (
        <>
          <SpecRow label="Socket"               value={attrs.socket} />
          <SpecRow label="Cores / Threads"      value={`${attrs.cores}C / ${attrs.threads}T`} />
          <SpecRow label="Base Clock"           value={`${attrs.baseClock} GHz`} />
          <SpecRow label="Boost Clock"          value={`${attrs.boostClock} GHz`} />
          <SpecRow label="TDP"                  value={`${attrs.tdp} W`} />
          <SpecRow label="Integrated Graphics"  value={attrs.integratedGraphics ? "Yes" : "No"} />
        </>
      );
    case "Mainboard":
      return (
        <>
          <SpecRow label="Socket"         value={attrs.socket} />
          <SpecRow label="Chipset"        value={attrs.chipset} />
          <SpecRow label="Form Factor"    value={attrs.formFactor} />
          <SpecRow label="Memory Type"    value={attrs.memoryType} />
          <SpecRow label="RAM Slots"      value={attrs.ramSlots} />
          <SpecRow label="Wi-Fi"          value={attrs.hasWifi ? "Yes" : "No"} />
        </>
      );
    case "RAM":
      return (
        <>
          <SpecRow label="Memory Type"  value={attrs.memoryType} />
          <SpecRow label="Capacity"     value={`${attrs.capacity} GB`} />
          <SpecRow label="Modules"      value={`${attrs.modules}x ${attrs.capacity / attrs.modules} GB`} />
          <SpecRow label="Speed"        value={`${attrs.speed} MHz`} />
          <SpecRow label="CAS Latency"  value={`CL${attrs.casLatency}`} />
        </>
      );
    case "GPU":
      return (
        <>
          <SpecRow label="Chipset"         value={attrs.chipset} />
          <SpecRow label="VRAM"            value={`${attrs.vram} GB`} />
          <SpecRow label="Card Length"     value={`${attrs.length} mm`} />
          <SpecRow label="Recommended PSU" value={`${attrs.recommendedPsu} W`} />
        </>
      );
    case "SSD":
      return (
        <>
          <SpecRow label="Form Factor"  value={attrs.formFactor} />
          <SpecRow label="Interface"    value={attrs.interface} />
          <SpecRow label="Capacity"     value={`${attrs.capacity} GB`} />
          <SpecRow label="Read Speed"   value={`${attrs.readSpeed} MB/s`} />
          <SpecRow label="Write Speed"  value={`${attrs.writeSpeed} MB/s`} />
        </>
      );
    case "HDD":
      return (
        <>
          <SpecRow label="Form Factor"  value={attrs.formFactor} />
          <SpecRow label="Interface"    value={attrs.interface} />
          <SpecRow label="Capacity"     value={`${attrs.capacity} GB`} />
          <SpecRow label="RPM"          value={attrs.rpm} />
          <SpecRow label="Cache"        value={`${attrs.cache} MB`} />
        </>
      );
    case "PSU":
      return (
        <>
          <SpecRow label="Wattage"      value={`${attrs.wattage} W`} />
          <SpecRow label="Efficiency"   value={attrs.efficiency} />
          <SpecRow label="Modularity"   value={attrs.modularity} />
          <SpecRow label="Form Factor"  value={attrs.formFactor} />
        </>
      );
    case "Case":
      return (
        <>
          <SpecRow label="Form Factor"          value={attrs.formFactor} />
          <SpecRow label="Motherboard Support"  value={attrs.motherboardSupport.join(", ")} />
          <SpecRow label="Max GPU Length"       value={`${attrs.maxGpuLength} mm`} />
          <SpecRow label="Max CPU Cooler"       value={`${attrs.maxCpuCoolerHeight} mm`} />
        </>
      );
    case "CPU Cooler":
      return (
        <>
          <SpecRow label="Type"           value={attrs.type} />
          <SpecRow label="Socket Support" value={attrs.socketSupport.join(", ")} />
          {attrs.height     && <SpecRow label="Height"        value={`${attrs.height} mm`} />}
          {attrs.radiatorSize && <SpecRow label="Radiator"    value={`${attrs.radiatorSize} mm`} />}
        </>
      );
    default:
      return null;
  }
}

// ─── Page ─────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!product) return;
    const result = await addToCart(product);
    if (result === "auth_required") navigate("/auth");
    else if (result === "ok") toast.success("เพิ่มลงตะกร้าแล้ว", { description: product.name });
    else toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data: Product[]) => {
        const found = data.find((p) => p.id === Number(id));
        setProduct(found || null);
        setSelectedImg(0);
        if (found) {
          setRelated(
            data.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 4)
          );
        }
      })
      .catch((err) => console.error("Failed to fetch product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Package size={40} className="text-gray-300" />
        <p className="text-gray-400 text-sm">Product not found</p>
        <Link to="/products" className="text-sm text-gray-500 hover:text-gray-800 underline underline-offset-4">
          Back to products
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const allImages = product.imageUrls?.length > 0
    ? product.imageUrls
    : product.imageUrl ? [product.imageUrl] : [];
  const mainImg = allImages[selectedImg] ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* Back */}
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back to products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Image gallery */}
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-gray-200 rounded-2xl aspect-square flex items-center justify-center p-10">
              {mainImg ? (
                <img src={mainImg} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <ImageOff size={48} className="text-gray-300" />
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => setSelectedImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden bg-white transition-colors ${
                      i === selectedImg ? "border-gray-900" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {product.category}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1 leading-snug">
                {product.name}
              </h1>
            </div>

            {product.description && (
              <p className="text-sm text-gray-500 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ฿{product.price.toLocaleString()}
              </span>
              <span className={`text-xs font-medium pb-1 ${inStock ? "text-emerald-500" : "text-red-400"}`}>
                {inStock ? `In stock (${product.stock})` : "Out of stock"}
              </span>
            </div>

            <button
              disabled={!inStock}
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart size={16} />
              Add to cart
            </button>

            {/* Specs */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 mt-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Specifications
              </p>
              <Specs attrs={product.attributes} />
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
              สินค้าในหมวดเดียวกัน
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
