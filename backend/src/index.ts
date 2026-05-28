import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { db } from "./db";
import { products } from "./db/schema";

const app = new Elysia()
  .use(cors())
  .get("/", () => "🛒 E-Commerce API is running!")

  .get("/products", async () => {
    try{
      // Drizzle ORM query to fetch all products from the database
      const allProducts = await db.select().from(products); 
      return allProducts; //Elysia will automatically serialize this to JSON
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        message: "Failed to fetch products",
        data: [],
      };
    }
  })

  .post(
    "/products",
    async ({ body }) => {
      // Drizzle ORM insert a new product into the database
      const newProduct = await db
        .insert(products)
        .values({
          name: body.name,
          description: body.description,
          price: body.price,
          imageUrl: body.imageUrl,
          stock: body.stock,
          createdAt: new Date(),
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
        description: t.String(),
        imageUrl: t.String(),
        stock: t.Number(),
        price: t.Number(),
      }),
    }
  )
  .listen(8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);