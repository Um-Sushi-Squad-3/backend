//Responsável por gerenciar as rotas relacionadas ao cardápio (menu) e criação de pedidos 

import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Cria um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado - Token inválido ou ausente.' })
  createOrder(@Body() order: CreateOrderDto) {
    return this.menuService.createOrder(order);
  }
}
