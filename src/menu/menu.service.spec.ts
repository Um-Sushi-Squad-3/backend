import { MenuService } from './menu.service';
import { CreateOrderDto } from './dto/create-order.dto';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    service = new MenuService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getMenuItems', () => {
    it('should read and parse the menu.json file', () => {
      const mockJson = JSON.stringify([
        { id: 1, name: 'Burger', price: 10.5 },
        { id: 2, name: 'Pizza', price: 15.0 },
      ]);

      const filePath = path.join(__dirname, 'menu.json');
      (fs.readFileSync as jest.Mock).mockReturnValue(mockJson);

      const result = service.getMenuItems();

      expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
      expect(result).toEqual([
        { id: 1, name: 'Burger', price: 10.5 },
        { id: 2, name: 'Pizza', price: 15.0 },
      ]);
    });
  });

  describe('createOrder', () => {
    it('should create and return an order object', () => {
      const mockOrder: CreateOrderDto = {
        customerName: 'Enzo',
        customerPhone: '11999999999',
        address: 'Rua dos Bobos, 0',
        items: [{ productId: 1, quantity: 2 }],
      };

      const result = service.createOrder(mockOrder);

      expect(result).toHaveProperty('orderId');
      expect(result).toMatchObject({
        ...mockOrder,
        status: 'Pedido recebido',
      });
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });
});
