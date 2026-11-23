"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { completeOrder } from "@/app/actions/orders";

export default function PendingOrderStatus({ orderNumber }: { orderNumber: string }) {
  const [isSaving, startTransition] = useTransition();

  return (
    <select
      aria-label={`Status for order ${orderNumber}`}
      className="cursor-pointer rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 disabled:cursor-wait"
      value="pending"
      disabled={isSaving}
      onChange={(event) => {
        if (event.target.value !== "completed") return;
        startTransition(async () => {
          try {
            const { error } = await completeOrder(orderNumber);
            if (error) toast.error(error);
          } catch {
            toast.error("Could not update the order status. Please try again.");
          }
        });
      }}
    >
      <option value="pending">{isSaving ? "Saving…" : "Pending"}</option>
      <option value="completed">Completed</option>
    </select>
  );
}
