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
    name: "Thick-Sole Derby Shoes",
    price: 4500.00,
    description: "Classic black leather derby shoes with a modern thick sole.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Derby+Shoes",
    stock: 8
  },
  {
    id: 7,
    name: "M42 to E-Mount Adapter",
    price: 850.00,
    description: "Matte black adapter for vintage M42 lenses.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Lens+Adapter",
    stock: 50
  },
  {
    id: 8,
    name: "Vintage 50mm f/1.4 Lens",
    price: 3200.00,
    description: "Manual focus film camera lens with beautiful bokeh.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Vintage+Lens",
    stock: 3
  },
  {
    id: 9,
    name: "Silver Mountain Water",
    price: 9500.00,
    description: "Quiet luxury fragrance with crisp, icy notes.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Fragrance",
    stock: 12
  },
  {
    id: 10,
    name: "Colonia Essenza",
    price: 6200.00,
    description: "Classic Italian citrus scent in a signature black bottle.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Cologne",
    stock: 15
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
    name: "Minimalist Black T-Shirt",
    price: 900.00,
    description: "Premium cotton oversized fit.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Black+Tee",
    stock: 100
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
    name: "Leather Camera Strap",
    price: 1500.00,
    description: "Handcrafted black leather strap for mirrorless cameras.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Camera+Strap",
    stock: 22
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
    name: "Samurai Clan Art Print",
    price: 1200.00,
    description: "Dark-themed canvas print of historical crests.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Art+Print",
    stock: 10
  }
];