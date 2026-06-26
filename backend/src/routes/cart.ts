import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controller/cartController";

const frontendUrl = Bun.env.FRONTEND_URL;

const authError = (msg: string, status = 401) =>
  new Response(JSON.stringify({ success: false, message: msg }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const cartRoutes = new Elysia({ prefix: "/cart" })
  .use(cors({ origin: frontendUrl, credentials: true }))
  .use(jwt({ name: "cartJwt", secret: Bun.env.JWT_SECRET! }))
  .derive(async ({ cookie: { auth_token }, cartJwt }) => {
    if (!auth_token?.value) throw authError("Authentication required");

    const payload = await cartJwt.verify(auth_token.value as string);
    if (!payload?.id) throw authError("Invalid or expired token");

    const [user] = await db
      .select({ id: users.id, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, Number(payload.id)));

    if (!user) throw authError("User not found");

    return { cartUser: user };
  })

  .get("/", ({ cartUser }) => getCart(cartUser))

  .post(
    "/",
    ({ cartUser, body }) => addToCart(cartUser, body),
    {
      body: t.Object({
        productId: t.Integer(),
        quantity: t.Integer({ minimum: 1 }),
      }),
    }
  )

  .put(
    "/:productId",
    ({ cartUser, params, body }) =>
      updateCartItem(cartUser, Number(params.productId), body.quantity),
    {
      params: t.Object({ productId: t.Numeric() }),
      body: t.Object({ quantity: t.Integer({ minimum: 0 }) }),
    }
  )

  .delete(
    "/:productId",
    ({ cartUser, params }) => removeFromCart(cartUser, Number(params.productId)),
    { params: t.Object({ productId: t.Numeric() }) }
  )

  .delete("/", ({ cartUser }) => clearCart(cartUser));
