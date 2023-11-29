import { Types } from 'mongoose';
import randomstring from 'randomstring';

import { IProduct, Product } from '../models/products';
import { logger } from '../util/logger';

class ProductRepository {
  async create({
    name,
    description,
    price,
    quantity,
    images,
    sku,
    userId,
  }: {
    name: string;
    description: string;
    images: string;
    price: number;
    quantity: number;
    sku: string;
    userId: Types.ObjectId;
  }): Promise<IProduct> {
    const data = {
      name,
      description,
      price,
      quantity,
      images,
      sku,
      userId,
    };
    const createProduct = new Product(data);
    return createProduct.save();
  }

  public async update({
    product,
    name,
    description,
    price,
    quantity,
    sku,
    deleted,
    images,
  }: {
    product: IProduct;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    sku?: string;
    deleted?: boolean;
    images?: string;
  }): Promise<IProduct> {
    const updateData: Partial<IProduct> = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (quantity) updateData.quantity = quantity;
    if (sku) updateData.sku = sku;
    if (deleted) updateData.deleted = deleted;
    if (images) {
      if (product.images) {
        if (!product.images.includes(images)) {
          updateData.images = [...product.images, images];
        }
      } else {
        updateData.images = [images];
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id },
      updateData,
      { new: true }, // Return the updated document
    );

    if (!updatedProduct) {
      throw new Error('Failed to update product');
    }

    return updatedProduct;
  }
  public async getOneBy(
    query: object,
    leanVersion = true,
  ): Promise<IProduct | null> {
    return Product.findOne(query).lean(leanVersion);
  }
  public async getAllProducts(leanVersion = true): Promise<IProduct[] | null> {
    return Product.find({}).lean(leanVersion);
  }
  public async getUserProducts(
    query: object,
    leanVersion = true,
  ): Promise<IProduct | null> {
    return Product.find(query).lean(leanVersion);
  }

  async generateSKU(): Promise<string> {
    logger.info('generating SKU');
    const sku = randomstring.generate({
      capitalization: 'uppercase',
      charset: 'alphanumeric',
      length: 32,
    });

    const existingSKU = await this.getOneBy({ sku });
    if (existingSKU) await this.generateSKU();

    logger.info('SKU created successfully');
    return sku;
  }
}

export default new ProductRepository();
