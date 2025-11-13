import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create Account (E2E)", () => {
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

  test("[POST] /accounts", async () => {
    const email = "jorge@gmail.com";
    const name = "Jorge";
    const password = "teste";

    const response = await request(app.getHttpServer() as import("http").Server)
      .post("/accounts")
      .send({ name, email, password });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = prisma.user.findUnique({
      where: {
        email,
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
