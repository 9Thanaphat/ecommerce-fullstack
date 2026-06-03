import "../App.css";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

export default function Products() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="flex gap-4 p-8 bg-gray-50">
        <SideBar />
        <ProductGrid />
      </div>
      <Footer />
    </div>
  );
}
