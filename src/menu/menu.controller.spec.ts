import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { CreateOrderDto } from './dto/create-order.dto';

// Mock do MenuService
const mockMenuService = {
  getMenuItems: jest
    .fn()
    .mockReturnValue([{ id: 1, name: 'Sushi de Salmão', price: 15.9 }]),
  createOrder: jest.fn((order: CreateOrderDto) => ({
    orderId: 123,
    ...order,
    status: 'Pedido recebido',
    timestamp: new Date('2023-01-01'),
  })),
};

describe('MenuController', () => {
  let controller: MenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: mockMenuService,
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return menu items', () => {
    const result = controller.getMenu() as any[];
    expect(mockMenuService.getMenuItems).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1, name: 'Sushi de Salmão', price: 15.9 }]);
  });

  it('should create an order', () => {
    const orderDto: CreateOrderDto = {
      customerName: 'João Silva',
      customerPhone: '11999999999',
      address: 'Rua das Flores, 123',
      items: [{ productId: 1, quantity: 2 }],
    };

    const result = controller.createOrder(orderDto);

    expect(mockMenuService.createOrder).toHaveBeenCalledWith(orderDto);
    expect(result).toEqual({
      orderId: 123,
      customerName: 'João Silva',
      customerPhone: '11999999999',
      address: 'Rua das Flores, 123',
      items: [{ productId: 1, quantity: 2 }],
      status: 'Pedido recebido',
      timestamp: new Date('2023-01-01'),
    });
  });
});
