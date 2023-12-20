import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';
import { OrderDto } from 'src/orders/dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async placeOrder(user: User, orderDto: OrderDto): Promise<Order> {

  
    const order = new Order();
    order.user = user;
    Object.assign(order, orderDto);
  
    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      throw new Error(`Error placing order: ${error.message}`);
    }
}

  

  async getOrderHistory(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({where : {id: orderId}});

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: number, newStatus: string): Promise<Order> {
    const order = await this.orderRepository.findOne({where : {id: orderId}});

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.orderStatus = newStatus;

    return this.orderRepository.save(order);
  }

}