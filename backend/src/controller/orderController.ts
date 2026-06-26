import { db } from "../db";
import { cartItems, orderItems, orders, products } from "../db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { sendOrderConfirmation } from "../utils/mailer";

type AuthUser = { id: number; email: string; role: string };

type ShippingAddress = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postalCode: string;
};

export const createOrder = async (user: AuthUser, shipping: ShippingAddress) => {
  // 1. Fetch cart with product info
  const items = await db
    .select({
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      name: products.name,
      price: products.price,
      stock: products.stock,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, user.id));

  if (items.length === 0) {
    return new Response(
      JSON.stringify({ success: false, message: "Cart is empty" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Check stock
  for (const item of items) {
    if (item.stock < item.quantity) {
      return new Response(
        JSON.stringify({ success: false, message: `สต็อก "${item.name}" ไม่พอ (เหลือ ${item.stock})` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // 3. Create order record
  const [order] = await db
    .insert(orders)
    .values({
      userId: user.id,
      totalAmount,
      status: "confirmed",
      shippingFirstName: shipping.firstName,
      shippingLastName: shipping.lastName,
      shippingPhone: shipping.phone,
      shippingAddress: shipping.address,
      shippingSubdistrict: shipping.subdistrict,
      shippingCity: shipping.city,
      shippingProvince: shipping.province,
      shippingPostalCode: shipping.postalCode,
    })
    .returning({ id: orders.id });

  // 4. Create order_items (price snapshot)
  await db.insert(orderItems).values(
    items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
  );

  // 5. Deduct stock
  for (const item of items) {
    await db
      .update(products)
      .set({ stock: item.stock - item.quantity })
      .where(eq(products.id, item.productId));
  }

  // 6. Clear cart
  await db.delete(cartItems).where(eq(cartItems.userId, user.id));

  // 7. Send confirmation email (non-blocking — don't fail the order if email fails)
  sendOrderConfirmation({
    to: user.email,
    orderId: order.id,
    items: items.map((i) => ({ productName: i.name, price: i.price, quantity: i.quantity })),
    totalAmount,
    shipping,
  }).catch((err) => console.error("Order email failed:", err));

  return { success: true, orderId: order.id, totalAmount };
};

export const getMyOrders = async (user: AuthUser) => {
  const rows = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      itemCount: sql<number>`(
        SELECT COALESCE(SUM(oi.quantity), 0)
        FROM order_items oi
        WHERE oi.order_id = ${orders.id}
      )`,
    })
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));

  return { success: true, orders: rows };
};

export const getMyOrderItems = async (user: AuthUser, orderId: number) => {
  // ตรวจว่า order นี้เป็นของ user คนนี้ก่อน
  const [order] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)));

  if (!order) {
    return new Response(
      JSON.stringify({ success: false, message: "Order not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  return { success: true, items };
};
