import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('addNew')
  async createProduct(@Body() body: Partial<Product>): Promise<Product> {
    return this.productsService.createProduct(body);
  }

  @Get('list')
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    const productId = parseInt(id, 10);
    return this.productsService.getProductById(productId);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() body: Partial<Product>): Promise<Product> {
    const productId = parseInt(id, 10);
    return this.productsService.updateProduct(productId, body);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    const productId = parseInt(id, 10);
    return this.productsService.deleteProduct(productId);
  }
}
