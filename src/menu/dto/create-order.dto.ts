// Estruturam os dados necessários para criar um pedido em uma API
// Eles são usados na rota POST /menu/order

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
  Max,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItem {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  @IsNotEmpty({ message: 'O ID do produto é obrigatório' })
  @IsNumber({}, { message: 'O ID do produto deve ser um número' })
  @Min(1, { message: 'O ID do produto deve ser maior que 0' })
  productId!: number;

  @ApiProperty({ example: 2, description: 'Quantidade do produto' })
  @IsNotEmpty({ message: 'A quantidade é obrigatória' })
  @IsNumber({}, { message: 'A quantidade deve ser um número' })
  @Min(1, { message: 'A quantidade mínima é 1' })
  @Max(50, { message: 'A quantidade máxima é 50' })
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Gil do Vigor', description: 'Nome do cliente' })
  @IsNotEmpty({ message: 'O nome do cliente é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  @MinLength(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, {
    message: 'O nome deve conter apenas letras e espaços',
  })
  customerName!: string;

  @ApiProperty({ example: '11999999999', description: 'Telefone do cliente' })
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @IsString({ message: 'O telefone deve ser uma string' })
  @Matches(/^\d{10,11}$/, { message: 'O telefone deve ter 10 ou 11 dígitos' })
  customerPhone!: string;

  @ApiProperty({
    example: 'Rua das Flores, 123',
    description: 'Endereço para entrega',
  })
  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @IsString({ message: 'O endereço deve ser uma string' })
  @MinLength(10, { message: 'O endereço deve ter pelo menos 10 caracteres' })
  @MaxLength(200, { message: 'O endereço deve ter no máximo 200 caracteres' })
  address!: string;

  @ApiProperty({ type: [OrderItem], description: 'Lista de itens do pedido' })
  @IsArray({ message: 'Items deve ser um array' })
  @ArrayMinSize(1, { message: 'O pedido deve ter pelo menos 1 item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items!: OrderItem[];

  @ApiProperty({
    example: 'Sem cebola',
    description: 'Observações adicionais',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'As observações devem ser uma string' })
  @MaxLength(500, {
    message: 'As observações devem ter no máximo 500 caracteres',
  })
  observations?: string;
}
