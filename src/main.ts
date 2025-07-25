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

  // Configurar ValidationPipe global
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

  // Servir imagens da pasta 'public'
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Defina as origens permitidas conforme ambiente
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [
      
          'https://um-sushi-front-lake.vercel.app', // Adicione seu domínio Vercel aqui
        ]
      : ['http://localhost:3000', 'http://localhost:3001'];

  // Habilitar CORS com callback para validar a origem
  app.enableCors({
    origin: (origin, callback) => {
      // Permite requests sem origin (como Postman, curl)
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

  // Seu middleware de auditoria e demais configurações seguem normalmente
  // ...

  await app.listen(3000);

  logger.log('🍣 Um Sushi API iniciada na porta 3000');
  logger.log('📖 Documentação: http://localhost:3000/api');
  logger.log('✅ Validações AAA ativadas');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});