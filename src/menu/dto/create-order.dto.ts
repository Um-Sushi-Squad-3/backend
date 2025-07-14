export class CreateOrderDto {
  items!: { productId: number; quantity: number }[];
  customerName!: string;
  customerPhone!: string;
  address?: string;
}
