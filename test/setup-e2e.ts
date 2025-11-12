import { randomUUID } from 'node:crypto';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';

const prisma = new PrismaClient();

const generateUniqueDatabaseURL = (schemaId: string) => {
  if (!process.env.DATABASE_URL) {
    console.log('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(String(process.env.DATABASE_URL));

  url.searchParams.set('schema', schemaId);

  return url.toString();
};

const schemaId = randomUUID();

beforeAll(() => {
  const databseURL = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databseURL;
  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
