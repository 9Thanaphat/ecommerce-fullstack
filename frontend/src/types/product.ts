export type ProductCategory =
  | "CPU"
  | "Mainboard"
  | "RAM"
  | "GPU"
  | "SSD"
  | "HDD"
  | "PSU"
  | "Case"
  | "CPU Cooler"
  | "Other";

export type ProductAttributes =
  | { componentType: "CPU"; socket: string; cores: number; threads: number; baseClock: number; boostClock: number; tdp: number; integratedGraphics: boolean }
  | { componentType: "Mainboard"; socket: string; chipset: string; formFactor: string; memoryType: string; ramSlots: number; hasWifi: boolean }
  | { componentType: "RAM"; memoryType: string; capacity: number; modules: number; speed: number; casLatency: number }
  | { componentType: "GPU"; chipset: string; vram: number; length: number; recommendedPsu: number }
  | { componentType: "SSD"; formFactor: string; interface: string; capacity: number; readSpeed: number; writeSpeed: number }
  | { componentType: "HDD"; formFactor: string; interface: string; capacity: number; rpm: number; cache: number }
  | { componentType: "PSU"; wattage: number; efficiency: string; modularity: string; formFactor: string }
  | { componentType: "Case"; formFactor: string; motherboardSupport: string[]; maxGpuLength: number; maxCpuCoolerHeight: number }
  | { componentType: "CPU Cooler"; type: string; socketSupport: string[]; height?: number; radiatorSize?: number }
  | { componentType: "Other" };

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  description: string | null;
  imageUrl: string | null;
  imageUrls: string[];
  stock: number;
  attributes: ProductAttributes;
}
