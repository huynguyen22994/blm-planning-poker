import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CACHE_TTL} from './constants/cache-ttl.constant'

/** IMPORTS */
import { CacheModule } from '@nestjs/cache-manager';

/** SERVICES */
import { AppService } from './services/app.service';
import { EventsGateway } from './app.events.gateways';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: CACHE_TTL.FIFTEEN_MINUTES,
      max: 1000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
