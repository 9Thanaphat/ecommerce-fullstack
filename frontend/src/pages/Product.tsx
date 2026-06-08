import "../App.css";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function Products() {
  
  const [search, setSearch] = useState<string>("");

  return (
    <div className="min-h-screen">
      <NavBar 
      setSearch={setSearch}
      search={search}
      />
      <div className="flex gap-4 p-8 bg-gray-50">
        <SideBar />
        <ProductGrid
          search={search}
        />
      </div>
      <Footer />
    </div>
  );
}
