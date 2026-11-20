import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    name: String,
    role: String,
  },
  { collection: "users", timestamps: true },
);

adminUserSchema.index({ email: 1 }, { unique: true });

type AdminUserFields = InferSchemaType<typeof adminUserSchema>;

export const AdminUser: Model<AdminUserFields> =
  mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);
