import { Controller, Get, Post, Body } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getMenu() {
    return this.menuService.getMenuItems();
  }

  @Post('order')
  createOrder(@Body() orderDto: CreateOrderDto) {
    return this.menuService.createOrder(orderDto);
  }
}
