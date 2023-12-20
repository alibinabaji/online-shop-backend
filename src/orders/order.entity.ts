import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'jsonb', nullable: false })
  orderItems: Array<{ productId: number; quantity: number; price: number }>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  orderStatus: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  invoiceNumber: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  shippingMethod: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate: Date;
}
