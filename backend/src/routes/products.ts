import { Elysia } from "elysia";
import { getProducts } from "../controller/productController";
export const productRoutes = new Elysia({ prefix: "/products" })
  .get("/", getProducts);