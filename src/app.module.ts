// Serve como o ponto de entrada da aplicação e organiza os módulos internos

import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [MenuModule],
})
export class AppModule {}
