import { Elysia, t } from "elysia";
import { db } from "./db";
import { products } from "./db/schema";

const app = new Elysia()
  .get("/", () => "🛒 E-Commerce API is running!")

  .get("/products", async () => {
    const allProducts = await db.select().from(products);
    return allProducts;
  })

  .post(
    "/products",
    async ({ body }) => {
      // Drizzle ORM insert a new product into the database
      const newProduct = await db
        .insert(products)
        .values({
          name: body.name,
          price: body.price,
        })
        .returning(); 

      return {
        message: "Product added successfully!",
        data: newProduct[0],
      };
    },
    {
      // Elysia type validation for request body
      body: t.Object({
        name: t.String(),
        price: t.Number(),
      }),
    }
  )
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);