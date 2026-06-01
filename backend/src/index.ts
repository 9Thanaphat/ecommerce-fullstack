import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

import { productRoutes } from "./routes/products";
import { authRoutes } from "./routes/auth";

if (!Bun.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const app = new Elysia()
  .use(cors())
  .get("/", () => "🛒 E-Commerce API is running!")
  .use(productRoutes) // Mount product routes under /products
  .use(authRoutes)
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
