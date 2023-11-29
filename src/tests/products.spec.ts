// import { createMock } from "@golevelup/ts-jest";

// describe("products Store", () => {
//     it("should do some stuff", () => {
//       expect(1).toBe(1);
//     });
// });

import { createMock } from '@golevelup/ts-jest';
import { Response } from 'express';

import { createProduct, updateProduct } from '../controllers/products';
import { IUser } from '../models/user';
import ProductRepository from '../repository/ProductRepositiory';
import { ExpressRequest } from '../util/express';
import ResponseHandler from '../util/response-handler';

jest.mock('../repository/ProductRepositiory');
jest.mock('../util/response-handler');

describe('Product Controller', () => {
  let mockResponse: any;

  const nextFn = jest.fn();
  let resMock: Response;

  let getOneBySpy: jest.SpyInstance;
  let createSpy: jest.SpyInstance;
  let generateSKUSpy: jest.SpyInstance;
  let updateSpy: jest.SpyInstance;
  let sendSuccessResponseSpy: jest.SpyInstance;
  let sendErrorResponseSpy: jest.SpyInstance;
  let user: IUser;

  beforeEach(() => {
    getOneBySpy = jest.spyOn(ProductRepository, 'getOneBy');
    createSpy = jest.spyOn(ProductRepository, 'create');
    generateSKUSpy = jest.spyOn(ProductRepository, 'generateSKU');
    updateSpy = jest.spyOn(ProductRepository, 'update');
    sendSuccessResponseSpy = jest.spyOn(ResponseHandler, 'sendSuccessResponse');
    sendErrorResponseSpy = jest.spyOn(ResponseHandler, 'sendErrorResponse');

    user = createMock<IUser>({
      firstname: 'emm',
      lastname: 'ooo',
      email: 'testmail@kaka.com',
      password: 'somePassword',
      phoneNumber: '1234567890',
    });

    mockResponse = {
      sendSuccessResponse: jest.fn(),
      sendErrorResponse: jest.fn(),
    };

    resMock = createMock<Response>();
    resMock.status = jest.fn().mockReturnValue(resMock);
  });

  afterEach(jest.resetAllMocks);

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const mockProduct = {
        _id: 'product123',
        name: 'Test Product',
        description: 'This is a test product',
        price: 9.99,
        quantity: 10,
        sku: 'SKU123',
        userId: 'user123',
        images: ['image1.jpg', 'image2.jpg'],
      };

      getOneBySpy.mockResolvedValue(null);
      generateSKUSpy.mockResolvedValue('SKU123');
      createSpy.mockResolvedValue(mockProduct);

      const req = createMock<ExpressRequest>();
      req.body = mockProduct;
      req.user = user;

      await createProduct(req, resMock, nextFn);

      expect(getOneBySpy).toHaveBeenCalled();
      expect(generateSKUSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalled();

      expect(nextFn).not.toHaveBeenCalled();
    });

    it('should return an error if a product with the same name already exists', async () => {
      const mockProduct = {
        _id: 'product123',
        name: 'Test Product',
        description: 'This is a test product',
        price: 9.99,
        quantity: 10,
        sku: 'SKU123',
        userId: 'user123',
        images: ['image1.jpg', 'image2.jpg'],
      };

      getOneBySpy.mockResolvedValue({});

      const req = createMock<ExpressRequest>();
      req.body = mockProduct;

      await createProduct(req, resMock, nextFn);

      expect(getOneBySpy).toHaveBeenCalled();
      expect(nextFn).not.toHaveBeenCalled();
    });

    describe('updateProduct', () => {
      it('should update an existing product', async () => {
        const mockProduct = {
          _id: 'product123',
          name: 'Test Product',
          description: 'This is a test product',
          price: 9.99,
          quantity: 10,
          sku: 'SKU123',
          userId: 'user123',
          images: ['image1.jpg', 'image2.jpg'],
        };

        getOneBySpy.mockResolvedValue(mockProduct);
        updateSpy.mockResolvedValue(mockProduct);

        const req = createMock<ExpressRequest>();
        req.body = mockProduct;

        await updateProduct(req, resMock, nextFn);

        expect(getOneBySpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalled();
        expect(sendSuccessResponseSpy).toHaveBeenCalled();
        expect(nextFn).not.toHaveBeenCalled();
      });

      it('should return an error if the product does not exist', async () => {
        getOneBySpy.mockResolvedValue(null);

        const req = createMock<ExpressRequest>();
        req.params = { productIdˀ: 'product123' };

        await updateProduct(req, resMock, nextFn);

        expect(getOneBySpy).toHaveBeenCalled();
        expect(sendErrorResponseSpy).toHaveBeenCalled();

        expect(nextFn).not.toHaveBeenCalled();
      });
    });
  });
});
