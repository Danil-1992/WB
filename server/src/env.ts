import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.union([z.undefined(), z.enum(['development', 'production'])]),
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z
    .string()
    .regex(/^[0-9]+$/, 'PORT must be a number')
    .transform((val) => parseInt(val))
    .default(5432),
  POSTGRES_DB: z.string().min(1, 'POSTGRES_DB is required'),
  POSTGRES_USER: z.string().min(1, 'POSTGRES_USER is required'),
  POSTGRES_PASSWORD: z.string().min(1, 'POSTGRES_PASSWORD is required'),
  APP_PORT: z
    .string()
    .regex(/^[0-9]+$/)
    .transform(Number)
    .default(3000),
  WB_API_KEY: z.string().min(1, 'WB_API_KEY is required'),
  URL: z.string().url('URL must be valid'),
  SPREADSHEET_ID: z.string().min(1, 'SPREADSHEET_ID is required'),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse({
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT,
    WB_API_KEY: process.env.WB_API_KEY,
    URL: process.env.URL,
    SPREADSHEET_ID: process.env.SPREADSHEET_ID,
  });

  console.log('✅ Environment variables validated');
} catch (error: any) {
  if (error && error.errors) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err: any) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
  }
  process.exit(1);
}

export default env;
