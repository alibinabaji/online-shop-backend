import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../users/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async placeOrder(user: User, orderItems: Array<{ productId: number; quantity: number; price: number }>): Promise<Order> {
    const totalAmount = orderItems.reduce((total, item) => total + item.quantity * item.price, 0);

    const order = new Order();
    order.user = user;
    order.orderItems = orderItems;
    order.totalAmount = totalAmount;
    order.orderStatus = 'pending';

    return this.orderRepository.save(order);
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