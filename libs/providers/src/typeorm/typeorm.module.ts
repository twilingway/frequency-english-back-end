import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppDataSource } from './typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
})
export class TypeormModule {}
