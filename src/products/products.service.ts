import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async createProduct(name: string, price: number, description: string, ): Promise<Product> {
    const product = new Product();
    product.name = name;
    product.price = price;
    product.description = description;

    return this.productsRepository.save(product);
  }

}
