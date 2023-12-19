import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  page_unique: string;

  @Column()
  page_url: string;

  @Column()
  title: string;

  @Column()
  current_price: number;

  @Column({ nullable: true })
  old_price: number;

  @Column()
  availability: string;

  @Column()
  image_link: string;

  @Column()
  short_desc: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  image_links: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column()
  category: string;
}
