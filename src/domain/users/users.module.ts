import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
