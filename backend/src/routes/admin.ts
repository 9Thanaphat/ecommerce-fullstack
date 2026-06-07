import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { users } from "../db/schema";
import { db } from "../db";
import { cors } from "@elysiajs/cors";
import { addProduct, updateProduct, deleteProduct } from "../controller/productController";

const frontendUrl = Bun.env.FRONTEND_URL;

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
        body: t.Object({
          name: t.String(),
          description: t.String(),
          price: t.Integer(),
          imageUrl: t.String(),
          stock: t.Integer(),
        }),
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
