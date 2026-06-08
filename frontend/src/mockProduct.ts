export interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  stock: number;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Mechanical Keyboard",
    price: 3500.00,
    description: "Minimalist all-black layout.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Keyboard+V1",
    stock: 15
  },
  {
    id: 2,
    name: "Mechanical Keyboard V2",
    price: 4200.00,
    description: "Upgraded version with linear switches.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Keyboard+V2",
    stock: 5
  },
  {
    id: 3,
    name: "Mechanical Keyboard V3",
    price: 1200.00,
    description: "Compact 60% layout.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Keyboard+V3",
    stock: 20
  },
  {
    id: 4,
    name: "Wireless Mouse",
    price: 2500.00,
    description: "Ergonomic black mouse.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Mouse",
    stock: 10
  },
  {
    id: 5,
    name: "Katakana Keycap Set",
    price: 1800.00,
    description: "Black aesthetic keycaps with Katakana legends for styling.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Keycap+Set",
    stock: 30
  },
  {
    id: 6,
    name: "Portable NVMe SSD 1TB",
    price: 3890.00,
    description: "Ultra-fast external storage with USB 3.2 Gen 2 interface.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Portable+SSD",
    stock: 25
  },
  {
    id: 7,
    name: "USB-C Hub 8-in-1",
    price: 1450.00,
    description: "Aluminum multiport adapter with HDMI 4K and Ethernet.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=USB-C+Hub",
    stock: 40
  },
  {
    id: 8,
    name: "Dual Monitor Desk Mount",
    price: 1990.00,
    description: "Heavy-duty gas spring arm for 17-32 inch screens.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Monitor+Mount",
    stock: 12
  },
  {
    id: 9,
    name: "4K Ultra HD Webcam",
    price: 4500.00,
    description: "Pro webcam with auto-focus and dual noise-canceling mics.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=4K+Webcam",
    stock: 18
  },
  {
    id: 10,
    name: "GaN Fast Charger 100W",
    price: 1690.00,
    description: "Compact 4-port wall charger for laptops and smartphones.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=GaN+Charger",
    stock: 35
  },
  {
    id: 11,
    name: "VR Headset Display Stand",
    price: 1100.00,
    description: "Sleek 3D printed stand for your VR equipment.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=VR+Stand",
    stock: 25
  },
  {
    id: 12,
    name: "RGB Laptop Cooling Pad",
    price: 950.00,
    description: "High-performance quiet fans with adjustable height.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Laptop+Cooler",
    stock: 50
  },
  {
    id: 13,
    name: "High-Speed 3D Printer Nozzle",
    price: 650.00,
    description: "Hardened steel nozzle for fast and precise printing.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Printer+Nozzle",
    stock: 40
  },
  {
    id: 14,
    name: "Stream Deck Controller",
    price: 5900.00,
    description: "15 customizable LCD keys for studio and workflow automation.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Stream+Deck",
    stock: 8
  },
  {
    id: 15,
    name: "Matte Black Desk Mat",
    price: 890.00,
    description: "Large size, waterproof material for a clean setup.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Desk+Mat",
    stock: 60
  },
  {
    id: 16,
    name: "Wi-Fi 6E Mesh Router",
    price: 4800.00,
    description: "Tri-band gigabit wireless router for seamless home coverage.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Mesh+Router",
    stock: 14
  },
  {
    id: 17,
    name: "Wi-Fi 6E Mesh Router",
    price: 4800.00,
    description: "Tri-band gigabit wireless router for seamless home coverage.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Mesh+Router",
    stock: 20
  }
];