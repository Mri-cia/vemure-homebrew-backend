import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173'
  })
  const port = 3001;
  await app.listen(process.env.PORT ?? port);
}
await bootstrap();
