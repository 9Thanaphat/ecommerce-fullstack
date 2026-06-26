import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

import { productRoutes } from "./routes/products";
import { authRoutes } from "./routes/auth";
import { adminRoutes } from "./routes/admin";
import { cartRoutes } from "./routes/cart";
import { orderRoutes } from "./routes/orders";

if (!Bun.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const frontendUrl = Bun.env.FRONTEND_URL;

const app = new Elysia()
  .use(cors({
    origin: frontendUrl,
    credentials: true,
  }))
  .get("/", () => "🛒 E-Commerce API is running!")
  .use(productRoutes)
  .use(authRoutes)
  .use(adminRoutes)
  .use(cartRoutes)
  .use(orderRoutes)
  .listen(Bun.env.PORT ?? 8000);

console.log(app.routes.map(r => `${r.method} ${r.path}`));

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
