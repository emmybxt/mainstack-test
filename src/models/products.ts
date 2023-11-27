import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  userId?: Types.ObjectId;
  isActive?: boolean;
  barcode?: string;
  images?: string[];
  sku?: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: [{ required: false, type: String }],
    sku: {
      index: true,
      sparse: true,
      type: String,
    },
    barcode: {
      index: true,
      sparse: true,
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isActive: {
      default: true,
      required: false,
      index: true,
      type: Boolean,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
