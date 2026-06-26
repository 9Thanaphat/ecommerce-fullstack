import { db } from "../db";
import { orderItems, orders, users } from "../db/schema";
import { desc, eq, sql } from "drizzle-orm";

export const getAdminOrders = async () => {
  const rows = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      shippingFirstName: orders.shippingFirstName,
      shippingLastName: orders.shippingLastName,
      shippingPhone: orders.shippingPhone,
      shippingAddress: orders.shippingAddress,
      shippingSubdistrict: orders.shippingSubdistrict,
      shippingCity: orders.shippingCity,
      shippingProvince: orders.shippingProvince,
      shippingPostalCode: orders.shippingPostalCode,
      userEmail: users.email,
      itemCount: sql<number>`(
        SELECT COALESCE(SUM(oi.quantity), 0)
        FROM order_items oi
        WHERE oi.order_id = ${orders.id}
      )`,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  return { success: true, orders: rows };
};

export const getOrderItems = async (orderId: number) => {
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
  return { success: true, items };
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const valid = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!valid.includes(status)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid status" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  return { success: true };
};
