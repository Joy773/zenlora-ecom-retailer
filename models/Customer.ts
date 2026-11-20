import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const customerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "customers",
    timestamps: true,
  },
);

customerSchema.index({ email: 1 }, { unique: true });

export type CustomerDocument = InferSchemaType<typeof customerSchema>;

export const Customer: Model<CustomerDocument> =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);
