import { db } from "../db";
import { products, type Product, type InsertProduct } from "../db/schema";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: Bun.env.CLOUDINARY_CLOUD_NAME,
  api_key: Bun.env.CLOUDINARY_API_KEY,
  api_secret: Bun.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");
  const fileUri = `data:${file.type};base64,${base64Data}`;
  const result = await cloudinary.uploader.upload(fileUri, { folder: "ecommerce_products" });
  return result.secure_url;
};

const normalizeFiles = (raw: File | File[] | undefined): File[] => {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr.filter((f) => f instanceof File && f.size > 0);
};

const parseAttributes = (raw: unknown): Record<string, unknown> => {
  if (typeof raw === "string") return JSON.parse(raw);
  return (raw as Record<string, unknown>) ?? {};
};

type AddProductRequest = {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  images?: File | File[];
  attributes: Record<string, unknown>;
};

type UpdateProductRequest = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: File | File[];
  keepImageUrls?: string; // JSON stringified string[]
  attributes?: unknown;
};

export const getProducts = async () => {
  try {
    const allProducts: Product[] = await db.select().from(products);
    return allProducts;
  } catch {
    return { success: false, message: "Failed to fetch products" };
  }
};

export const addProduct = async ({ body }: { body: AddProductRequest }) => {
  try {
    const { images, attributes, ...rest } = body;
    const files = normalizeFiles(images);

    const urls: string[] = [];
    for (const file of files) {
      urls.push(await uploadFile(file));
    }

    await db.insert(products).values({
      ...rest,
      imageUrl: urls[0] ?? "",
      imageUrls: urls,
      attributes: parseAttributes(attributes),
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
  body: UpdateProductRequest;
}) => {
  try {
    const { images, keepImageUrls, attributes, ...rest } = body;

    const files = normalizeFiles(images);
    const newUrls: string[] = [];
    for (const file of files) {
      newUrls.push(await uploadFile(file));
    }

    const updateData: Partial<InsertProduct> = { ...rest };

    // Merge kept existing URLs + newly uploaded URLs
    const kept: string[] = keepImageUrls !== undefined ? JSON.parse(keepImageUrls) : null;
    if (kept !== null || newUrls.length > 0) {
      const finalUrls = [...(kept ?? []), ...newUrls];
      updateData.imageUrls = finalUrls;
      updateData.imageUrl = finalUrls[0] ?? "";
    }

    if (attributes !== undefined) {
      updateData.attributes = parseAttributes(attributes);
    }

    await db.update(products).set(updateData).where(eq(products.id, params.id));
    return { success: true, message: `Product ${params.id} updated successfully` };
  } catch (error) {
    console.error("updateProduct error:", error);
    return { success: false, message: "Failed to update product" };
  }
};

export const deleteProduct = async ({ params }: { params: { id: number } }) => {
  try {
    await db.delete(products).where(eq(products.id, params.id));
    return { success: true, message: `Product ${params.id} deleted successfully` };
  } catch {
    return { success: false, message: "Failed to delete product" };
  }
};
