import { execSync } from 'child_process';
import dotenv from 'dotenv';

export default async function setup() {
  dotenv.config();

  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

  execSync(
    'npx prisma migrate reset --force --skip-seed'
  );
}