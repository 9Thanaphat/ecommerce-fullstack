import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
import { db } from "../db";
import { orders, orderItems, products, users } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { createOrder, getMyOrderItems, getMyOrders } from "../controller/orderController";

const frontendUrl = Bun.env.FRONTEND_URL;

const authError = (msg: string) =>
  new Response(JSON.stringify({ success: false, message: msg }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });

export const orderRoutes = new Elysia({ prefix: "/orders" })
  .use(cors({ origin: frontendUrl, credentials: true }))
  .use(jwt({ name: "orderJwt", secret: Bun.env.JWT_SECRET! }))
  .derive(async ({ cookie: { auth_token }, orderJwt }) => {
    if (!auth_token?.value) throw authError("Authentication required");
    const payload = await orderJwt.verify(auth_token.value as string);
    if (!payload?.id) throw authError("Invalid or expired token");
    const [user] = await db
      .select({ id: users.id, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, Number(payload.id)));
    if (!user) throw authError("User not found");
    return { orderUser: user };
  })

  .get("/my", ({ orderUser }) => getMyOrders(orderUser))

  .get(
    "/my/:id",
    ({ orderUser, params }) => getMyOrderItems(orderUser, Number(params.id)),
    { params: t.Object({ id: t.Numeric() }) }
  )

  .patch(
    "/my/:id/cancel",
    async ({ orderUser, params }) => {
      const orderId = Number(params.id);
      const [order] = await db
        .select({ id: orders.id, status: orders.status, userId: orders.userId })
        .from(orders)
        .where(eq(orders.id, orderId));

      if (!order || order.userId !== orderUser.id) {
        return new Response(
          JSON.stringify({ success: false, message: "Order not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      if (order.status !== "pending" && order.status !== "confirmed") {
        return new Response(
          JSON.stringify({ success: false, message: "ไม่สามารถยกเลิกออเดอร์ที่จัดส่งแล้วได้" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Restore stock
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
      for (const item of items) {
        await db
          .update(products)
          .set({ stock: sql`stock + ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }

      await db.update(orders).set({ status: "cancelled" }).where(eq(orders.id, orderId));
      return { success: true };
    },
    { params: t.Object({ id: t.Numeric() }) }
  )

  .post(
    "/checkout",
    ({ orderUser, body }) => createOrder(orderUser, body),
    {
      body: t.Object({
        firstName: t.String(),
        lastName: t.String(),
        phone: t.String(),
        address: t.String(),
        subdistrict: t.String(),
        city: t.String(),
        province: t.String(),
        postalCode: t.String(),
      }),
    }
  );
