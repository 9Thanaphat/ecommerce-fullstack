export type ProductCategory =
  | "CPU"
  | "Mainboard"
  | "RAM"
  | "GPU"
  | "SSD"
  | "HDD"
  | "PSU"
  | "Case"
  | "CPU Cooler";

export type ProductAttributes =
  | { componentType: "CPU"; socket: string; cores: number; threads: number; baseClock: number; boostClock: number; tdp: number; integratedGraphics: boolean }
  | { componentType: "Mainboard"; socket: string; chipset: string; formFactor: "ATX" | "Micro-ATX" | "Mini-ITX" | "E-ATX"; memoryType: "DDR4" | "DDR5"; ramSlots: number; hasWifi: boolean }
  | { componentType: "RAM"; memoryType: "DDR4" | "DDR5"; capacity: number; modules: number; speed: number; casLatency: number }
  | { componentType: "GPU"; chipset: string; vram: number; length: number; recommendedPsu: number }
  | { componentType: "SSD"; formFactor: "M.2 2280" | "2.5 inch" | "PCIe Add-in Card"; interface: "PCIe 5.0 x4" | "PCIe 4.0 x4" | "PCIe 3.0 x4" | "SATA III"; capacity: number; readSpeed: number; writeSpeed: number }
  | { componentType: "HDD"; formFactor: "3.5 inch" | "2.5 inch"; interface: "SATA III"; capacity: number; rpm: 5400 | 7200; cache: number }
  | { componentType: "PSU"; wattage: number; efficiency: "80+ Titanium" | "80+ Platinum" | "80+ Gold" | "80+ Bronze" | "80+ Standard"; modularity: "Full" | "Semi" | "Non"; formFactor: "ATX" | "SFX" | "SFX-L" }
  | { componentType: "Case"; formFactor: "Full Tower" | "Mid Tower" | "Mini ITX"; motherboardSupport: string[]; maxGpuLength: number; maxCpuCoolerHeight: number }
  | { componentType: "CPU Cooler"; type: "Air Cooler" | "Liquid Cooler"; socketSupport: string[]; height?: number; radiatorSize?: 120 | 240 | 280 | 360 | 420 }
  | Record<string, unknown>;

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  description: string | null;
  imageUrl: string | null;
  stock: number;
  attributes: ProductAttributes;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Intel Core i9-14900K",
    category: "CPU",
    price: 18900,
    description: "Flagship desktop processor with 24 cores.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=i9-14900K",
    stock: 15,
    attributes: { componentType: "CPU", socket: "LGA1700", cores: 24, threads: 32, baseClock: 3.2, boostClock: 6.0, tdp: 125, integratedGraphics: true },
  },
  {
    id: 2,
    name: "AMD Ryzen 9 7950X",
    category: "CPU",
    price: 21500,
    description: "16-core powerhouse for workstations.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Ryzen+9+7950X",
    stock: 8,
    attributes: { componentType: "CPU", socket: "AM5", cores: 16, threads: 32, baseClock: 4.5, boostClock: 5.7, tdp: 170, integratedGraphics: false },
  },
  {
    id: 3,
    name: "ASUS ROG Strix Z790-E",
    category: "Mainboard",
    price: 15900,
    description: "High-end Z790 motherboard with Wi-Fi 6E.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=ROG+Z790",
    stock: 12,
    attributes: { componentType: "Mainboard", socket: "LGA1700", chipset: "Z790", formFactor: "ATX", memoryType: "DDR5", ramSlots: 4, hasWifi: true },
  },
  {
    id: 4,
    name: "G.Skill Trident Z5 32GB DDR5",
    category: "RAM",
    price: 5200,
    description: "High-speed DDR5 kit for next-gen builds.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=DDR5+32GB",
    stock: 30,
    attributes: { componentType: "RAM", memoryType: "DDR5", capacity: 32, modules: 2, speed: 6000, casLatency: 36 },
  },
  {
    id: 5,
    name: "NVIDIA RTX 4080 Super",
    category: "GPU",
    price: 34900,
    description: "Ada Lovelace flagship for 4K gaming.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=RTX+4080S",
    stock: 6,
    attributes: { componentType: "GPU", chipset: "AD103", vram: 16, length: 336, recommendedPsu: 750 },
  },
  {
    id: 6,
    name: "Samsung 990 Pro 2TB",
    category: "SSD",
    price: 4890,
    description: "Ultra-fast NVMe SSD with PCIe 4.0.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=990+Pro+2TB",
    stock: 25,
    attributes: { componentType: "SSD", formFactor: "M.2 2280", interface: "PCIe 4.0 x4", capacity: 2000, readSpeed: 7450, writeSpeed: 6900 },
  },
  {
    id: 7,
    name: "Seagate Barracuda 4TB",
    category: "HDD",
    price: 2990,
    description: "Reliable 3.5\" desktop hard drive.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Barracuda+4TB",
    stock: 40,
    attributes: { componentType: "HDD", formFactor: "3.5 inch", interface: "SATA III", capacity: 4000, rpm: 7200, cache: 256 },
  },
  {
    id: 8,
    name: "Corsair RM1000x",
    category: "PSU",
    price: 6490,
    description: "1000W fully modular 80+ Gold PSU.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=RM1000x",
    stock: 18,
    attributes: { componentType: "PSU", wattage: 1000, efficiency: "80+ Gold", modularity: "Full", formFactor: "ATX" },
  },
  {
    id: 9,
    name: "Lian Li PC-O11 Dynamic EVO",
    category: "Case",
    price: 4200,
    description: "Dual chamber mid-tower with showcase design.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=O11+EVO",
    stock: 14,
    attributes: { componentType: "Case", formFactor: "Mid Tower", motherboardSupport: ["ATX", "Micro-ATX", "Mini-ITX"], maxGpuLength: 400, maxCpuCoolerHeight: 167 },
  },
  {
    id: 10,
    name: "Noctua NH-D15 G2",
    category: "CPU Cooler",
    price: 3590,
    description: "Dual-tower air cooler with premium fans.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=NH-D15",
    stock: 20,
    attributes: { componentType: "CPU Cooler", type: "Air Cooler", socketSupport: ["LGA1700", "LGA1200", "AM5", "AM4"], height: 168 },
  },
];