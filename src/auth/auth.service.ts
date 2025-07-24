import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface ValidatedUser {
  id: number;
  username: string;
  email: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  // Usuários de exemplo - em produção, isso viria de um banco de dados
  private readonly users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: '$2a$10$N9qo8uLOickgx2ZMRZoMye0LY4H.4xRJiMJHZPHF8q3L6c5K0PYsC', // 'admin123'
    },
    {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      password: '$2a$10$N9qo8uLOickgx2ZMRZoMye0LY4H.4xRJiMJHZPHF8q3L6c5K0PYsC', // 'user123'
    },
  ];

  constructor(private jwtService: JwtService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    const user = this.users.find((user) => user.username === username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  findUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
