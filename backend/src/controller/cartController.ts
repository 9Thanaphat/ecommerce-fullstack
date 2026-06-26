import { db } from "../db";
import { cartItems, products } from "../db/schema";
import { and, eq } from "drizzle-orm";

type AuthUser = { id: number; email: string; role: string };

export const getCart = async (user: AuthUser) => {
  const items = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      name: products.name,
      price: products.price,
      imageUrl: products.imageUrl,
      category: products.category,
      stock: products.stock,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, user.id));

  return { success: true, items };
};

export const addToCart = async (
  user: AuthUser,
  body: { productId: number; quantity: number }
) => {
  const [product] = await db
    .select({ id: products.id, stock: products.stock })
    .from(products)
    .where(eq(products.id, body.productId));

  if (!product) {
    return { success: false, message: "Product not found" };
  }

  const [existing] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, user.id), eq(cartItems.productId, body.productId)));

  if (existing) {
    const newQty = Math.min(existing.quantity + body.quantity, product.stock);
    await db
      .update(cartItems)
      .set({ quantity: newQty })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      userId: user.id,
      productId: body.productId,
      quantity: Math.min(body.quantity, product.stock),
    });
  }

  return { success: true, message: "Added to cart" };
};

export const updateCartItem = async (
  user: AuthUser,
  productId: number,
  quantity: number
) => {
  if (quantity < 1) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)));
    return { success: true, message: "Item removed" };
  }

  const [product] = await db
    .select({ stock: products.stock })
    .from(products)
    .where(eq(products.id, productId));

  const clampedQty = product ? Math.min(quantity, product.stock) : quantity;

  await db
    .update(cartItems)
    .set({ quantity: clampedQty })
    .where(and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)));

  return { success: true, message: "Cart updated" };
};

export const removeFromCart = async (user: AuthUser, productId: number) => {
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)));

  return { success: true, message: "Item removed" };
};

export const clearCart = async (user: AuthUser) => {
  await db.delete(cartItems).where(eq(cartItems.userId, user.id));
  return { success: true, message: "Cart cleared" };
};
