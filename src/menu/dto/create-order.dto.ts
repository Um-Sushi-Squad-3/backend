import { ApiProperty } from '@nestjs/swagger';

export class OrderItem {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  productId!: number;

  @ApiProperty({ example: 2, description: 'Quantidade do produto' })
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Gil do Vigor', description: 'Nome do cliente' })
  customerName!: string;

  @ApiProperty({ example: '999999999', description: 'Telefone do cliente' })
  customerPhone!: string;

  @ApiProperty({ example: 'Rua das Flores, 123', description: 'Endereço para entrega' })
  address!: string;

  @ApiProperty({ type: [OrderItem], description: 'Lista de itens do pedido' })
  items!: OrderItem[];
}