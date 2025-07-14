import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MenuService {
  getMenuItems() {
    const filePath = join(__dirname, 'menu.json');
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  createOrder(order: CreateOrderDto) {
    const orderId = Math.floor(Math.random() * 10000);
    return {
      orderId,
      ...order,
      status: 'Pedido recebido',
      timestamp: new Date(),
    };
  }
}
