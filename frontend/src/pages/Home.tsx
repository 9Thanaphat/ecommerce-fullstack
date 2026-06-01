import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="p-8 bg-gray-200 min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome to Store 🛍️</h1>
      </div>
    </div>
  );
}
