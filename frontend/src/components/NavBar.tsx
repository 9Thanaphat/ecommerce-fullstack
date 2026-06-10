import { ShoppingCart, User } from "lucide-react";

export default function NavBar() {

  return (
    <nav className="navbar gap-4 h-24 pl-16 pr-16 border-b-3 border-gray-100 bg-white text-black p-4 flex gap-12 items-center w-full">
      <h1 className="navbar-title text-xl font-bold">SHOP</h1>
      <div className="flex min-w-fit">
      </div>
      <div className="flex items-center ml-auto min-w-fit gap-6">
        <ShoppingCart
          className="cursor-pointer hover:text-blue-500"
          size={24}
        />
        <User className="cursor-pointer hover:text-blue-500" size={24} />
      </div>
    </nav>
  );
}
