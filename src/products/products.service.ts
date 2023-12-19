// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createProduct(data: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(data);
    return this.productsRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async getProductById(productId: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(productId: number, updates: Partial<Product>): Promise<Product> {
    const product = await this.getProductById(productId);
    Object.assign(product, updates);
    return this.productsRepository.save(product);
  }

  async deleteProduct(productId: number): Promise<void> {
    const product = await this.getProductById(productId);
    await this.productsRepository.remove(product);
  }
}
