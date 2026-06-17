import type { Product, ProductCategory, ProductAttributes } from "./types/product";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Intel Core i9-14900K",
    category: "CPU",
    price: 22900,
    description: "24-Core, 32-Thread Unlocked Desktop Processor",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=i9-14900K",
    stock: 15,
    attributes: {
      componentType: "CPU",
      socket: "LGA 1700",
      cores: 24,
      threads: 32,
      baseClock: 3.2,
      boostClock: 6.0,
      tdp: 125,
      integratedGraphics: true
    }
  },
  {
    id: 2,
    name: "ASUS ROG MAXIMUS Z790 HERO",
    category: "Mainboard",
    price: 24500,
    description: "Intel Z790 ATX motherboard with 20+1 power stages, DDR5",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Z790+HERO",
    stock: 8,
    attributes: {
      componentType: "Mainboard",
      socket: "LGA 1700",
      chipset: "Z790",
      formFactor: "ATX",
      memoryType: "DDR5",
      ramSlots: 4,
      hasWifi: true
    }
  },
  {
    id: 3,
    name: "G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5-6400",
    category: "RAM",
    price: 8900,
    description: "High-performance DDR5 memory",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Trident+Z5",
    stock: 20,
    attributes: {
      componentType: "RAM",
      memoryType: "DDR5",
      capacity: 64,
      modules: 2,
      speed: 6400,
      casLatency: 32
    }
  },
  {
    id: 4,
    name: "NVIDIA GeForce RTX 4090 Founders Edition",
    category: "GPU",
    price: 65000,
    description: "The ultimate GeForce GPU.",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=RTX+4090",
    stock: 3,
    attributes: {
      componentType: "GPU",
      chipset: "RTX 4090",
      vram: 24,
      length: 304,
      recommendedPsu: 850
    }
  },
  {
    id: 5,
    name: "Samsung 990 PRO 2TB",
    category: "SSD",
    price: 6890,
    description: "PCIe 4.0 NVMe M.2 SSD",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=990+PRO",
    stock: 45,
    attributes: {
      componentType: "SSD",
      formFactor: "M.2 2280",
      interface: "PCIe 4.0 x4",
      capacity: 2000,
      readSpeed: 7450,
      writeSpeed: 6900
    }
  },
  {
    id: 6,
    name: "Seagate IronWolf Pro 16TB",
    category: "HDD",
    price: 11500,
    description: "NAS Hard Drive 7200 RPM 256MB Cache",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=IronWolf+16TB",
    stock: 12,
    attributes: {
      componentType: "HDD",
      formFactor: "3.5 inch",
      interface: "SATA III",
      capacity: 16000,
      rpm: 7200,
      cache: 256
    }
  },
  {
    id: 7,
    name: "Corsair RM1000x",
    category: "PSU",
    price: 7200,
    description: "1000 Watt 80 PLUS Gold Fully Modular ATX Power Supply",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=RM1000x",
    stock: 25,
    attributes: {
      componentType: "PSU",
      wattage: 1000,
      efficiency: "80+ Gold",
      modularity: "Full",
      formFactor: "ATX"
    }
  },
  {
    id: 8,
    name: "Lian Li O11 Dynamic EVO",
    category: "Case",
    price: 5500,
    description: "Mid-Tower chassis with dual-chamber design",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=O11+EVO",
    stock: 18,
    attributes: {
      componentType: "Case",
      formFactor: "Mid Tower",
      motherboardSupport: ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"],
      maxGpuLength: 422,
      maxCpuCoolerHeight: 167
    }
  },
  {
    id: 9,
    name: "NZXT Kraken Elite 360",
    category: "CPU Cooler",
    price: 10500,
    description: "360mm AIO Liquid Cooler with LCD Display",
    imageUrl: "https://placehold.co/400x400/111111/FFFFFF?text=Kraken+360",
    stock: 10,
    attributes: {
      componentType: "CPU Cooler",
      type: "Liquid Cooler",
      socketSupport: ["LGA 1700", "AM5"],
      radiatorSize: 360
    }
  }
];