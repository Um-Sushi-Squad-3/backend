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

  //  Servir imagens da pasta 'public'
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Habilitar CORS com validações de origem
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? ['https://umsushi.com']
      : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // Middleware de auditoria para logs
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const ip = req.ip || 'unknown';

      if (req.url.includes('/menu/order')) {
        logger.log(
          `PEDIDO: ${req.method} ${req.url} - Status: ${res.statusCode} - IP: ${ip} - ${duration}ms`,
        );
      } else if (res.statusCode >= 400) {
        logger.warn(
          `ERRO: ${req.method} ${req.url} - Status: ${res.statusCode} - IP: ${ip}`,
        );
      }
    });

    next();
  });

  // Limite de tamanho para requisições
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      req.headers['content-length'] &&
      parseInt(req.headers['content-length']) > 1048576
    ) {
      logger.warn(`Requisição muito grande rejeitada de ${req.ip}`);
      return res.status(413).json({
        message: 'Dados enviados são muito grandes',
        maxSize: '1MB',
      });
    }
    next();
  });

  // Headers de segurança básicos
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Um Sushi API')
    .setDescription('API para o cardápio e pedidos do Um Sushi')
    .setVersion('1.0')
    .addTag('Menu', 'Operações do cardápio')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Endpoint de status da aplicação
  app.use('/status', (req: Request, res: Response) => {
    res.json({
      status: 'online',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  await app.listen(3000);

  logger.log('🍣 Um Sushi API iniciada na porta 3000');
  logger.log('📖 Documentação: http://localhost:3000/api');
  logger.log('✅ Validações AAA ativadas');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
