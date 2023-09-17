import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  const url = configService.get('TYPEORM_HOST');
  if (!url) {
    throw new Error('Database is empty');
  }

  return {
    type: 'postgres',
    schema: 'public',
    logging: configService.get('IS_PROD') === 'false',
    entities: [
      join(process.cwd(), 'dist', 'libs', 'entities', '**', '*.entity.{ts,js}'),
    ],
    migrations: [join(process.cwd(), 'migrations', '**', '*migration.ts')],
    migrationsRun: false,
    migrationsTableName: configService.get('TYPEORM_MIGRATIONS_TABLE_NAME'),
    synchronize: false,
    host: configService.get('TYPEORM_HOST'),
    port: configService.get('TYPEORM_PORT'),
    database: configService.get('TYPEORM_DATABASE'),
    username: configService.get('TYPEORM_USERNAME'),
    password: configService.get('TYPEORM_PASSWORD'),
    subscribers: [],
  };
};
export const AppDataSource = new DataSource(options());
