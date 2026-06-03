import { ShoppingCart, User } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="navbar gap-4 h-24 pl-16 pr-16 border-b-3 border-gray-100 bg-white text-black p-4 flex gap-12 items-center w-full">
      <h1 className="navbar-title text-xl font-bold">SHOP</h1>
      <div className="flex min-w-fit">
        <ul className="flex gap-8">
          <li className="cursor-pointer hover:text-blue-500">Home</li>
          <li className="cursor-pointer hover:text-blue-500">Products</li>
          <li className="cursor-pointer hover:text-blue-500">About</li>
        </ul>
      </div>
      <input
        className="bg-gray-100 rounded-lg flex-1 px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search..."
      />
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
