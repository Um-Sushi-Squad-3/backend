//Responsável por gerenciar as rotas relacionadas ao cardápio (menu) e criação de pedidos 

import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna os itens do cardápio' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso.' })
  getMenu() {
    return this.menuService.getMenuItems();
  }

  @Post('order')
  @ApiOperation({ summary: 'Cria um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
  createOrder(@Body() order: CreateOrderDto) {
    return this.menuService.createOrder(order);
  }
}
