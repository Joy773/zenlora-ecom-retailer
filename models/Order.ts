import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const deliveryDetailsSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true, trim: true },
    productSlug: { type: String, required: true, trim: true },
    variantSize: { type: String, default: "", trim: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    idempotencyKey: { type: String, required: true, unique: true },
    requestHash: { type: String, required: true },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      default: undefined,
    },
    deliveryDetails: { type: deliveryDetailsSchema, required: true },
    items: { type: [orderItemSchema], required: true, minlength: 1 },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "completed"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true, collection: "orders" },
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export type OrderDocument = InferSchemaType<typeof orderSchema>;

if (process.env.NODE_ENV !== "production" && mongoose.models.Order) {
  mongoose.deleteModel("Order");
}

export const Order: Model<OrderDocument> =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
