import { Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    console.log(body);
    const { name, email, password } = body;

    const userWithEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithEmail) {
      throw new ConflictException('User with same e-mail address already exists.');
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }
}
