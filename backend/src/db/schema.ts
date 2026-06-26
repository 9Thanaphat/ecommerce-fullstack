import {
  InferSelectModel,
  InferInsertModel
} from "drizzle-orm";

import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core"

export type ProductAttributes =
  // cpu
  | {
    componentType: "CPU";
    socket: string;
    cores: number;
    threads: number;
    baseClock: number;
    boostClock: number;
    tdp: number;
    integratedGraphics: boolean;
  }
  // mainboard
  | {
    componentType: "Mainboard";
    socket: string;
    chipset: string;
    formFactor: "ATX" | "Micro-ATX" | "Mini-ITX" | "E-ATX";
    memoryType: "DDR4" | "DDR5";
    ramSlots: number;
    hasWifi: boolean;
  }
  // ram
  | {
    componentType: "RAM";
    memoryType: "DDR4" | "DDR5";
    capacity: number;
    modules: number;
    speed: number;
    casLatency: number;
  }
  // gpu
  | {
    componentType: "GPU";
    chipset: string;
    vram: number;
    length: number;
    recommendedPsu: number;
  }
  // ssd
  | {
    componentType: "SSD";
    formFactor: "M.2 2280" | "2.5 inch" | "PCIe Add-in Card";
    interface: "PCIe 5.0 x4" | "PCIe 4.0 x4" | "PCIe 3.0 x4" | "SATA III";
    capacity: number;
    readSpeed: number;
    writeSpeed: number;
  }
  // hdd
  | {
    componentType: "HDD";
    formFactor: "3.5 inch" | "2.5 inch";
    interface: "SATA III";
    capacity: number;
    rpm: 5400 | 7200;
    cache: number;
  }
  // psu
  | {
    componentType: "PSU";
    wattage: number;
    efficiency: "80+ Titanium" | "80+ Platinum" | "80+ Gold" | "80+ Bronze" | "80+ Standard";
    modularity: "Full" | "Semi" | "Non";
    formFactor: "ATX" | "SFX" | "SFX-L";
  }
  // case
  | {
    componentType: "Case";
    formFactor: "Full Tower" | "Mid Tower" | "Mini ITX";
    motherboardSupport: string[];
    maxGpuLength: number;
    maxCpuCoolerHeight: number;
  }
  // cpu cooler
  | {
    componentType: "CPU Cooler";
    type: "Air Cooler" | "Liquid Cooler";
    socketSupport: string[];
    height?: number;
    radiatorSize?: 120 | 240 | 280 | 360 | 420;
  }
  | Record<string, any>;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  imageUrls: jsonb("image_urls").$type<string[]>().default([]).notNull(),
  stock: integer("stock").notNull(),
  attributes: jsonb("attributes").$type<ProductAttributes>().default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Product = InferSelectModel<typeof products>;

export type InsertProduct = InferInsertModel<typeof products>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("customer"), // "customer" | "admin"
  isVerified: boolean("is_verified").default(false).notNull(),
  // profile
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  address: text("address"),
  subdistrict: text("subdistrict"),
  city: text("city"),
  province: text("province"),
  postalCode: text("postal_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const otps = pgTable("otps", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type CartItem = InferSelectModel<typeof cartItems>;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("confirmed"),
  shippingFirstName: text("shipping_first_name"),
  shippingLastName: text("shipping_last_name"),
  shippingPhone: text("shipping_phone"),
  shippingAddress: text("shipping_address"),
  shippingSubdistrict: text("shipping_subdistrict"),
  shippingCity: text("shipping_city"),
  shippingProvince: text("shipping_province"),
  shippingPostalCode: text("shipping_postal_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
});
