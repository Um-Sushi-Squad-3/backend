import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //  Servir imagens da pasta 'public'
  app.useStaticAssets(join(__dirname, '..', 'public'));

  //  Habilitar CORS
  app.enableCors({
    origin: '*', // substitua por seu domínio em produção
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Um Sushi API')
    .setDescription('API para o cardápio e pedidos do Um Sushi')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();