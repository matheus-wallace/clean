import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts', async () => {
    const email = 'jorge@gmail.com';
    const name = 'Jorge';
    const password = 'teste';

    await prisma.user.create({
      data: {
        name,
        email,
        password: await hash('teste', 8),
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({ email, password });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = prisma.user.findUnique({
      where: {
        email,
      },
    });

    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
