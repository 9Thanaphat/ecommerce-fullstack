import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { db } from "./db";
import { products, users } from "./db/schema";


import { productRoutes } from "./routes/products";
import { userRoutes } from "./routes/users";

const app = new Elysia()
  .use(cors())
  .get("/", () => "🛒 E-Commerce API is running!")
  .use(productRoutes) // Mount product routes under /products
  .use(userRoutes)
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);