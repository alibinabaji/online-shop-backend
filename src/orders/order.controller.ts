import { Controller, Post, Body, Get, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async placeOrder(@Req() req, @Body() orderItems: Array<{ productId: number; quantity: number; price: number }>) {
    const user = req.user;
    return this.orderService.placeOrder(user, orderItems);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  async getOrderHistory(@Req() req) {
    const user = req.user;
    return this.orderService.getOrderHistory(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getOrderById(@Param('id') orderId: number) {
    return this.orderService.getOrderById(orderId);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateOrderStatus(@Param('id') orderId: number, @Body('status') newStatus: string) {
    return this.orderService.updateOrderStatus(orderId, newStatus);
  }

}
