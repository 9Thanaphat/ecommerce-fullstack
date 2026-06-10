import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { users } from "../db/schema";
import { db } from "../db";
import { cors } from "@elysiajs/cors";
import { addProduct, updateProduct, deleteProduct } from "../controller/productController";

const frontendUrl = Bun.env.FRONTEND_URL;

// ─── Shared base fields ───────────────────────────────────────────────────────
const baseProductBody = {
  name: t.String(),
  description: t.String(),
  price: t.Integer(),
  imageUrl: t.String(),
  stock: t.Integer(),
};

// ─── Per-type attribute schemas ───────────────────────────────────────────────
const cpuAttributes = t.Object({
  socket: t.String(),
  cores: t.Integer(),
  threads: t.Integer(),
  baseClock: t.Number(),
  boostClock: t.Number(),
  tdp: t.Integer(),
  integratedGraphics: t.Boolean(),
});

const mainboardAttributes = t.Object({
  socket: t.String(),
  chipset: t.String(),
  formFactor: t.Union([t.Literal("ATX"), t.Literal("Micro-ATX"), t.Literal("Mini-ITX"), t.Literal("E-ATX")]),
  memoryType: t.Union([t.Literal("DDR4"), t.Literal("DDR5")]),
  ramSlots: t.Integer(),
  hasWifi: t.Boolean(),
});

const ramAttributes = t.Object({
  memoryType: t.Union([t.Literal("DDR4"), t.Literal("DDR5")]),
  capacity: t.Integer(),
  modules: t.Integer(),
  speed: t.Integer(),
  casLatency: t.Integer(),
});

const gpuAttributes = t.Object({
  chipset: t.String(),
  vram: t.Integer(),
  length: t.Integer(),
  recommendedPsu: t.Integer(),
});

const ssdAttributes = t.Object({
  formFactor: t.Union([t.Literal("M.2 2280"), t.Literal("2.5 inch"), t.Literal("PCIe Add-in Card")]),
  interface: t.Union([
    t.Literal("PCIe 5.0 x4"),
    t.Literal("PCIe 4.0 x4"),
    t.Literal("PCIe 3.0 x4"),
    t.Literal("SATA III"),
  ]),
  capacity: t.Integer(),
  readSpeed: t.Integer(),
  writeSpeed: t.Integer(),
});

const hddAttributes = t.Object({
  formFactor: t.Union([t.Literal("3.5 inch"), t.Literal("2.5 inch")]),
  interface: t.Literal("SATA III"),
  capacity: t.Integer(),
  rpm: t.Union([t.Literal(5400), t.Literal(7200)]),
  cache: t.Integer(),
});

const psuAttributes = t.Object({
  wattage: t.Integer(),
  efficiency: t.Union([
    t.Literal("80+ Titanium"),
    t.Literal("80+ Platinum"),
    t.Literal("80+ Gold"),
    t.Literal("80+ Bronze"),
    t.Literal("80+ Standard"),
  ]),
  modularity: t.Union([t.Literal("Full"), t.Literal("Semi"), t.Literal("Non")]),
  formFactor: t.Union([t.Literal("ATX"), t.Literal("SFX"), t.Literal("SFX-L")]),
});

const caseAttributes = t.Object({
  formFactor: t.Union([t.Literal("Full Tower"), t.Literal("Mid Tower"), t.Literal("Mini ITX")]),
  motherboardSupport: t.Array(t.String()),
  maxGpuLength: t.Integer(),
  maxCpuCoolerHeight: t.Integer(),
});

const cpuCoolerAttributes = t.Object({
  type: t.Union([t.Literal("Air Cooler"), t.Literal("Liquid Cooler")]),
  socketSupport: t.Array(t.String()),
  height: t.Optional(t.Integer()),
  radiatorSize: t.Optional(
    t.Union([t.Literal(120), t.Literal(240), t.Literal(280), t.Literal(360), t.Literal(420)])
  ),
});

// ─── Discriminated union body ─────────────────────────────────────────────────
const addProductBody = t.Union([
  t.Object({ ...baseProductBody, category: t.Literal("CPU"),        attributes: cpuAttributes }),
  t.Object({ ...baseProductBody, category: t.Literal("Mainboard"),  attributes: mainboardAttributes }),
  t.Object({ ...baseProductBody, category: t.Literal("RAM"),        attributes: ramAttributes }),
  t.Object({ ...baseProductBody, category: t.Literal("GPU"),        attributes: gpuAttributes }),
  t.Object({ ...baseProductBody, category: t.Literal("SSD"),        attributes: ssdAttributes }),
  t.Object({ ...baseProductBody, category: t.Literal("HDD"),        attributes: hddAttributes }),
  t.Object({ ...baseProductBody, category: t.Literal("PSU"),        attributes: psuAttributes }),
  t.Object({ ...baseProductBody, category: t.Literal("Case"),       attributes: caseAttributes }),
  t.Object({ ...baseProductBody, category: t.Literal("CPU Cooler"), attributes: cpuCoolerAttributes }),
]);

export const adminRoutes = new Elysia({ prefix: "/admin" })
  // .use(
  //   cors({
  //     origin: frontendUrl,
  //     credentials: true,
  //   }),
  // )

  .group("/products", (group) =>
    group
      .post("/", addProduct, {
        body: addProductBody,
      })
      .put("/:id", updateProduct, {
        params: t.Object({
          id: t.Numeric(),
        }),
        body: t.Partial(
          t.Object({
            name: t.String(),
            description: t.String(),
            price: t.Integer(),
            imageUrl: t.String(),
            stock: t.Integer(),
          })
        ),
      })
      .delete("/:id", deleteProduct, {
        params: t.Object({
          id: t.Numeric(),
        }),
      })
  );
