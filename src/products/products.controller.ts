import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Post()
  async createProduct(@Body() body: { name: string; price: number; description: string; }): Promise<Product> {
    const { name, price, description } = body;
    return this.productsService.createProduct(name, price, description);
  }

}
