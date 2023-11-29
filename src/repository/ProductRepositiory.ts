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
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;
    if (sku) product.sku = sku;
    if (deleted) product.deleted = deleted;
    if (images) {
      if (product.images) {
        if (!product.images.includes(images)) product.images.push(images);
      } else {
        product.images = [images];
      }
    }

    return product.save();
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
