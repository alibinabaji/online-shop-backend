import { Controller, Post, Body, Get, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity'
import { OrderDto } from 'src/orders/dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('add')
  async placeOrder(@Req() req, @Body() orderDto: OrderDto){
    const user = req.user;
    return this.orderService.placeOrder(user, orderDto);
  }

  @Get('history')
  async getOrderHistory(@Req() req) {
    const user = req.user;
    return this.orderService.getOrderHistory(user.id);
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: number) {
    return this.orderService.getOrderById(orderId);
  }

  @Patch(':id/status')
  async updateOrderStatus(@Param('id') orderId: number, @Body('status') newStatus: string) {
    return this.orderService.updateOrderStatus(orderId, newStatus);
  }

}
