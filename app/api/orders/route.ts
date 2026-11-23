import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createStoreOrder, OrderRequestError } from "@/lib/store-orders";

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "customer" || !session.user.id) {
    return NextResponse.json(
      { error: "Sign in to place an order." },
      { status: 401 },
    );
  }

  let body: unknown;
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid order request." }, { status: 400 });
  }

  if (rawBody.length > 64 * 1024) {
    return NextResponse.json({ error: "Order request is too large." }, { status: 413 });
  }

  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid order request." }, { status: 400 });
  }

  try {
    const result = await createStoreOrder(body, session.user.id);
    return NextResponse.json(result, { status: result.alreadyCreated ? 200 : 201 });
  } catch (error) {
    if (error instanceof OrderRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Order creation failed.");
    return NextResponse.json(
      { error: "We could not save your order. Please try again." },
      { status: 500 },
    );
  }
}
