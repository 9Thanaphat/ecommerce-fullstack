import { db } from "../db";
import { orders, orderItems, products, users } from "../db/schema";
import { desc, eq, gte, sql, sum } from "drizzle-orm";

export const getDashboardStats = async () => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalOrdersRow] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders);

  const [todayOrdersRow] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(gte(orders.createdAt, todayStart));

  const [revenueRow] = await db
    .select({ total: sql<number>`COALESCE(SUM(total_amount), 0)` })
    .from(orders)
    .where(sql`status != 'cancelled'`);

  const [totalProductsRow] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(products);

  const [lowStockRow] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(products)
    .where(sql`stock <= 5`);

  const recentOrders = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      shippingFirstName: orders.shippingFirstName,
      shippingLastName: orders.shippingLastName,
      userEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(5);

  return {
    success: true,
    stats: {
      totalOrders: Number(totalOrdersRow.count),
      todayOrders: Number(todayOrdersRow.count),
      revenue: Number(revenueRow.total),
      totalProducts: Number(totalProductsRow.count),
      lowStock: Number(lowStockRow.count),
    },
    recentOrders,
  };
};

export const getAdminUsers = async () => {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      firstName: users.firstName,
      lastName: users.lastName,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return { success: true, users: rows };
};
