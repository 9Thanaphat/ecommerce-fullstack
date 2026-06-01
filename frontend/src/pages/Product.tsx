import "../App.css";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ProductGrid from "../components/ProductGrid";

export default function Products() {
  return (
    <div className="pl-8 pr-8 min-h-screen">
      <NavBar />
      <div className="flex gap-4 p-4">
        <SideBar />
        <ProductGrid />
      </div>
    </div>
  );
}
