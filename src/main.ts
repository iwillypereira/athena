import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad básica con Helmet
  app.use(helmet());

  // 2. Configuración de CORS
  app.enableCors({
    origin: ['*'], // Define aquí los dominios permitidos (ej: ['http://localhost:4200'])
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Métodos HTTP permitidos
    credentials: true, // Permite enviar cookies y cabeceras de autenticación
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Ignora cualquier campo que no esté definido en el DTO.
      forbidNonWhitelisted: true, // Lanza un error si se envía un campo extra.
      transform: true,         // Transforma los datos de payload a instancias del DTO.
      transformOptions: {
        enableImplicitConversion: true, // Permite la conversión implícita de tipos (por ejemplo, string a number).
      },
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();