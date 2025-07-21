// Estruturam os dados necessários para criar um pedido em uma API 
// Eles são usados na rota POST /menu/order

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItem {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  @IsNotEmpty()
  @IsNumber()
  productId!: number;

  @ApiProperty({ example: 2, description: 'Quantidade do produto' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Gil do Vigor', description: 'Nome do cliente' })
  @IsNotEmpty()
  @IsString()
  customerName!: string;

  @ApiProperty({ example: '999999999', description: 'Telefone do cliente' })
  @IsNotEmpty()
  @IsString()
  customerPhone!: string;

  @ApiProperty({ example: 'Rua das Flores, 123', description: 'Endereço para entrega' })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty({ type: [OrderItem], description: 'Lista de itens do pedido' })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items!: OrderItem[];
}