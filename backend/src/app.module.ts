import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // chứa index.html
      exclude: ['/api*'], // không đụng API
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
