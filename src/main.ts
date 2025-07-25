import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('UmSushi');

  // Configurar ValidationPipe global para validação dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, 
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transformOptions: {
        enableImplicitConversion: true, 
      },
      stopAtFirstError: true, 
      validateCustomDecorators: true, 
    }),
  );

  // Servir arquivos estáticos da pasta 'public' (ex: imagens)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Configuração CORS com lista de origens permitidas
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? ['https://um-sushi-front-lake.vercel.app']
      : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // Configuração Swagger para documentação da API
  const config = new DocumentBuilder()
    .setTitle('Um Sushi API')
    .setDescription('API para o cardápio e pedidos do Um Sushi')
    .setVersion('1.0')
    .addTag('Menu', 'Operações do cardápio')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Um Sushi API iniciada na porta ${port}`);

  // URL da documentação mostra o hostname correto no ambiente local e produção
  const host = process.env.NODE_ENV === 'production' ? `https://backend-ftbh.onrender.com` : `http://localhost:${port}`;
  logger.log(`Documentação: ${host}/api`);

  logger.log('Validações AAA ativadas');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});