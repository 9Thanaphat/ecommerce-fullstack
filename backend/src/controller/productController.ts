import { db } from "../db";
import { products, type Product, type InsertProduct } from "../db/schema";
import { eq, and } from "drizzle-orm";

export const getProducts = async () => {
  try {
    const allProducts: Product[] = await db.select().from(products);
    return allProducts;
  } catch (error) {
    return { success: false, message: "Failed to fetch products" };
  }
};

export const addProduct = async ({ body }: { body: InsertProduct }) => {
  try {
    await db.insert(products).values(body); 
    return { success: true, message: "Product added successfully" };
  } catch (error) {
    return { success: false, message: "Failed to add product" };
  }
};

export const updateProduct = async ({ params, body }: { params: { id: number }; body: Partial<InsertProduct> }) => {
  try {
    await db
      .update(products)
      .set(body)
      .where(eq(products.id, params.id));

    return { success: true, message: `Product with ID ${params.id} updated successfully` };
  } catch (error) {
    return { success: false, message: "Failed to update product" };
  }
};

export const deleteProduct = async ({ params }: { params: { id: number } }) => {
  try {
    await db
      .delete(products)
      .where(eq(products.id, params.id));

    return { success: true, message: `Product with ID ${params.id} deleted successfully` };
  } catch (error) {
    return { success: false, message: "Failed to delete product" };
  }
};