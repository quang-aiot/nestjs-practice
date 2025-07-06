import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/database.config';
import { AuthModule } from './domain/auth/auth.module';
import { TasksModule } from './domain/tasks/tasks.module';
import { RedisModule } from './domain/redis/redis.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from 'src/config/winston-logger.config';

@Module({
  imports: [
    WinstonModule.forRoot(winstonLoggerConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    RedisModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
