import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.{js, ts}'],
  migrations: ['dist/src/database/migrations/*.{js, ts}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
