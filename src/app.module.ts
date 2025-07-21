import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MenuModule],
  controllers: [AppController],     
  providers: [AppService],          
})
export class AppModule {}
