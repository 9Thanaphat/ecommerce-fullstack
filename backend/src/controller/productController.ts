import { db } from "../db";
import { products, type Product, type InsertProduct } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: Bun.env.CLOUDINARY_CLOUD_NAME,
  api_key: Bun.env.CLOUDINARY_API_KEY,
  api_secret: Bun.env.CLOUDINARY_API_SECRET,
});

type AddProductRequest = {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image?: File;
  attributes: Record<string, unknown>;
};

export const getProducts = async () => {
  try {
    const allProducts: Product[] = await db.select().from(products);
    return allProducts;
  } catch (error) {
    return { success: false, message: "Failed to fetch products" };
  }
};

export const addProduct = async ({ body }: { body: AddProductRequest }) => {
  try {
    const { image, attributes, ...rest } = body; // Extract image and attributes from the body
    let finalImageUrl = "";

    if (image && image.size > 0) {
      // convert to Base64
      const arrayBuffer = await image.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");
      const fileUri = `data:${image.type};base64,${base64Data}`;

      // upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(fileUri, {
        folder: "ecommerce_products",
      });

      finalImageUrl = uploadResult.secure_url;
      console.log("Image URL : " + finalImageUrl)
    }

    const parsedAttributes = typeof attributes === 'string' 
      ? (JSON.parse(attributes) as Record<string, unknown>)
      : (attributes as Record<string, unknown> ?? {});

    await db.insert(products).values({
      ...rest,
      imageUrl: finalImageUrl,
      attributes: parsedAttributes ?? {},
    });

    return { success: true, message: "Product added successfully" };
  } catch (error) {
    console.error("addProduct error:", error);
    return { success: false, message: "Failed to add product" };
  }
};

export const updateProduct = async ({
  params,
  body,
}: {
  params: { id: number };
  body: Partial<InsertProduct>;
}) => {
  try {
    await db.update(products).set(body).where(eq(products.id, params.id));

    return {
      success: true,
      message: `Product with ID ${params.id} updated successfully`,
    };
  } catch (error) {
    return { success: false, message: "Failed to update product" };
  }
};

export const deleteProduct = async ({ params }: { params: { id: number } }) => {
  try {
    await db.delete(products).where(eq(products.id, params.id));

    return {
      success: true,
      message: `Product with ID ${params.id} deleted successfully`,
    };
  } catch (error) {
    return { success: false, message: "Failed to delete product" };
  }
};
