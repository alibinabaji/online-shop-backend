import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'online_shop',
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true,
      }),
    UsersModule,
    ProductsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
