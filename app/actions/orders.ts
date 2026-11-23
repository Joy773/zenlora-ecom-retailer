"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/admin-auth";
import { connectMongoose } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export async function completeOrder(orderNumber: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Sign in as an admin to complete an order." };
  }
  if (typeof orderNumber !== "string" || !orderNumber.trim()) {
    return { error: "Choose a valid order." };
  }

  await connectMongoose();
  const result = await Order.updateOne(
    { orderNumber, status: "pending" },
    { $set: { status: "completed" } },
    { runValidators: true },
  );
  revalidatePath("/admin/orders");
  if (!result.matchedCount) {
    return { error: "This order is no longer pending." };
  }
  return { error: null };
}
