import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { users } from "../db/schema";
import { db } from "../db";
import { cors } from "@elysiajs/cors";

const frontendUrl = Bun.env.FRONTEND_URL;

export const adminRoutes = new Elysia({ prefix: "/admin" })
  .use(
    cors({
      origin: frontendUrl,
      credentials: true,
    }),
  )

  .group("products", (adminRoutes) =>
    adminRoutes
      .post("/", async ({ body }) => {
        // Implement logic to add a product
        return { message: "Product added successfully" };
      })
      .put("/:id", async ({ params, body }) => {
        // Implement logic to update a product by ID
        return { message: `Product with ID ${params.id} updated successfully` };
      })
      .delete("/:id", async ({ params }) => {
        // Implement logic to delete a product by ID
        return { message: `Product with ID ${params.id} deleted successfully` };
      }),
  );
