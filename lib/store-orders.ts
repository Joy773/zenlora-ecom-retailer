import { createHash, randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { getDeliveryFee } from "@/lib/delivery";
import { connectMongoose } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { listingPrice, Product } from "@/models/Product";

type DeliveryDetailsInput = {
  fullName: string;
  contact: string;
  address: string;
  city: string;
  zipCode: string;
};

type CartLineInput = {
  productId?: string;
  href?: string;
  variantSize?: string;
  quantity: number;
};

type CreateOrderInput = {
  idempotencyKey: string;
  expectedSubtotal: number;
  deliveryDetails: DeliveryDetailsInput;
  items: CartLineInput[];
};

type ProductForOrder = {
  _id: { toString(): string };
  seoSlug?: string;
  name: string;
  quantity: number;
  inStock?: boolean;
  listingPrice?: number | null;
  sizePrices?: {
    size?: string;
    price?: string;
    discountedPrice?: string;
    inStock?: boolean;
  }[];
};

type AdminOrderRecord = {
  orderNumber: string;
  deliveryDetails: DeliveryDetailsInput;
  items: {
    productName: string;
    variantSize?: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: Date;
};

export type AdminOrder = Omit<AdminOrderRecord, "createdAt"> & {
  createdAt: string;
};

export class OrderRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400,
  ) {
    super(message);
    this.name = "OrderRequestError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function productSlugFromHref(value: string) {
  if (!value.startsWith("/product/")) return "";

  try {
    const slug = decodeURIComponent(value.split("?")[0].split("#")[0].slice("/product/".length));
    return slug && !slug.includes("/") ? slug : "";
  } catch {
    return "";
  }
}

function validateOrderInput(value: unknown): CreateOrderInput {
  if (!isRecord(value)) throw new OrderRequestError("Invalid order request.");

  const idempotencyKey = text(value.idempotencyKey);
  if (!/^[a-f0-9-]{30,40}$/i.test(idempotencyKey)) {
    throw new OrderRequestError("Refresh checkout and try again.");
  }

  if (
    typeof value.expectedSubtotal !== "number" ||
    !Number.isFinite(value.expectedSubtotal) ||
    value.expectedSubtotal < 0
  ) {
    throw new OrderRequestError("Refresh your cart and try again.");
  }

  if (!isRecord(value.deliveryDetails)) {
    throw new OrderRequestError("Enter all delivery details.");
  }

  const deliveryDetails: DeliveryDetailsInput = {
    fullName: text(value.deliveryDetails.fullName),
    contact: text(value.deliveryDetails.contact),
    address: text(value.deliveryDetails.address),
    city: text(value.deliveryDetails.city),
    zipCode: text(value.deliveryDetails.zipCode),
  };

  if (
    deliveryDetails.fullName.length < 2 ||
    deliveryDetails.fullName.length > 100 ||
    deliveryDetails.address.length < 5 ||
    deliveryDetails.address.length > 300 ||
    deliveryDetails.city.length < 2 ||
    deliveryDetails.city.length > 100 ||
    deliveryDetails.zipCode.length < 2 ||
    deliveryDetails.zipCode.length > 20
  ) {
    throw new OrderRequestError("Check the delivery details and try again.");
  }

  const phoneDigits = deliveryDetails.contact.replace(/\D/g, "");
  if (
    !/^[0-9+()\s-]+$/.test(deliveryDetails.contact) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    throw new OrderRequestError("Enter a valid contact number.");
  }

  if (!Array.isArray(value.items) || value.items.length === 0 || value.items.length > 50) {
    throw new OrderRequestError("Your cart is empty or contains too many items.");
  }

  const items = value.items.map((entry): CartLineInput => {
    if (!isRecord(entry)) throw new OrderRequestError("Invalid item in your cart.");

    const productId = text(entry.productId);
    const href = text(entry.href);
    const variantSize = text(entry.variantSize);
    const quantity = entry.quantity;

    if (
      (productId && !mongoose.isValidObjectId(productId)) ||
      (!productId && !productSlugFromHref(href)) ||
      (variantSize && variantSize.length > 80) ||
      typeof quantity !== "number" ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      throw new OrderRequestError("An item in your cart is invalid. Refresh your cart and try again.");
    }

    return { productId: productId || undefined, href, variantSize, quantity };
  });

  return {
    idempotencyKey,
    expectedSubtotal: money(value.expectedSubtotal),
    deliveryDetails,
    items,
  };
}

function makeOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `ZL-${date}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function money(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function createStoreOrder(input: unknown, customerId: string) {
  const orderInput = validateOrderInput(input);
  if (!mongoose.isValidObjectId(customerId)) {
    throw new OrderRequestError("Sign in to place this order.", 401);
  }
  const requestHash = createHash("sha256")
    .update(
      JSON.stringify({
        customerId,
        deliveryDetails: orderInput.deliveryDetails,
        items: orderInput.items,
        expectedSubtotal: orderInput.expectedSubtotal,
      }),
    )
    .digest("hex");
  await connectMongoose();

  const existing = await Order.findOne({ idempotencyKey: orderInput.idempotencyKey })
    .select("orderNumber total requestHash")
    .lean();
  if (existing) {
    if (existing.requestHash !== requestHash) {
      throw new OrderRequestError("This checkout request was already used. Start checkout again.", 409);
    }
    return {
      orderNumber: existing.orderNumber,
      total: existing.total,
      alreadyCreated: true,
    };
  }

  const productIds = orderInput.items
    .map((item) => item.productId)
    .filter((id): id is string => Boolean(id));
  const slugs = orderInput.items
    .filter((item) => !item.productId)
    .map((item) => productSlugFromHref(item.href ?? ""));
  const ids = [
    ...productIds,
    ...slugs.filter((slug) => mongoose.isValidObjectId(slug)),
  ];
  const productFilters: Record<string, unknown>[] = [];
  if (ids.length) {
    productFilters.push({ _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) } });
  }
  if (slugs.length) productFilters.push({ seoSlug: { $in: slugs } });

  const products = await Product.find({ $or: productFilters }).lean<ProductForOrder[]>();
  const productsById = new Map(products.map((product) => [product._id.toString(), product]));
  const productsBySlug = new Map(
    products
      .filter((product) => product.seoSlug)
      .map((product) => [product.seoSlug!, product]),
  );
  const requestedPerProduct = new Map<string, number>();

  const orderItems = orderInput.items.map((item) => {
    const legacySlug = productSlugFromHref(item.href ?? "");
    const product = item.productId
      ? productsById.get(item.productId)
      : productsBySlug.get(legacySlug) ??
        (mongoose.isValidObjectId(legacySlug)
          ? productsById.get(legacySlug)
          : undefined);
    if (!product) {
      throw new OrderRequestError("A product in your cart is no longer available.", 409);
    }

    const variant = item.variantSize
      ? product.sizePrices?.find(
          (candidate) => candidate.size?.trim().toLowerCase() === item.variantSize?.toLowerCase(),
        )
      : product.sizePrices?.[0];
    if (item.variantSize && !variant) {
      throw new OrderRequestError(`${product.name} no longer has the selected size.`, 409);
    }

    const unitPrice = variant ? listingPrice(variant) : product.listingPrice ?? null;
    if (
      product.inStock === false ||
      product.quantity < 1 ||
      variant?.inStock === false ||
      unitPrice === null ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      throw new OrderRequestError(`${product.name} is currently unavailable.`, 409);
    }

    const productId = product._id.toString();
    requestedPerProduct.set(
      productId,
      (requestedPerProduct.get(productId) ?? 0) + item.quantity,
    );

    return {
      productId: new mongoose.Types.ObjectId(productId),
      productName: product.name,
      productSlug: product.seoSlug || productId,
      variantSize: variant?.size?.trim() ?? "",
      unitPrice: money(unitPrice),
      quantity: item.quantity,
      lineTotal: money(unitPrice * item.quantity),
    };
  });

  for (const [productId, requestedQuantity] of requestedPerProduct) {
    const product = productsById.get(productId)!;
    if (requestedQuantity > product.quantity) {
      throw new OrderRequestError(`${product.name} does not have enough stock.`, 409);
    }
  }

  const subtotal = money(orderItems.reduce((sum, item) => sum + item.lineTotal, 0));
  if (Math.abs(subtotal - orderInput.expectedSubtotal) > 0.01) {
    throw new OrderRequestError(
      "A product price changed. Remove and re-add affected items to review the updated total.",
      409,
    );
  }
  const deliveryFee = getDeliveryFee(orderInput.deliveryDetails.city);
  if (deliveryFee === null) {
    throw new OrderRequestError("Enter a city so we can calculate delivery.");
  }

  const document = {
    orderNumber: makeOrderNumber(),
    idempotencyKey: orderInput.idempotencyKey,
    requestHash,
    customerId: new mongoose.Types.ObjectId(customerId),
    deliveryDetails: orderInput.deliveryDetails,
    items: orderItems,
    subtotal,
    deliveryFee,
    total: money(subtotal + deliveryFee),
    status: "pending" as const,
  };

  try {
    const [order] = await Order.create([document]);
    return {
      orderNumber: order.orderNumber,
      total: order.total,
      alreadyCreated: false,
    };
  } catch (error) {
    if (isRecord(error) && error.code === 11000) {
      const duplicate = await Order.findOne({ idempotencyKey: orderInput.idempotencyKey })
        .select("orderNumber total requestHash")
        .lean();
      if (duplicate) {
        if (duplicate.requestHash !== requestHash) {
          throw new OrderRequestError("This checkout request was already used. Start checkout again.", 409);
        }
        return {
          orderNumber: duplicate.orderNumber,
          total: duplicate.total,
          alreadyCreated: true,
        };
      }
    }
    throw error;
  }
}

export async function getAdminOrders(limit = 100): Promise<AdminOrder[]> {
  await connectMongoose();
  const orders = await Order.find()
    .sort({ createdAt: -1, _id: -1 })
    .limit(Math.min(Math.max(limit, 1), 200))
    .lean<AdminOrderRecord[]>();

  return orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
  }));
}
