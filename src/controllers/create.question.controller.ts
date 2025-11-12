import { Body, ConflictException, Controller, HttpCode, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CurrentuUser } from '@/auth/current-user-decorator';
import { JwtAuthGuad } from '@/auth/jwt-auth.guard';
import { UserPayload } from '@/auth/jwt.strategy';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidationSchema = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuad)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationSchema) body: CreateQuestionBodySchema,
    @CurrentuUser()
    user: UserPayload,
  ) {
    const { title, content } = body;
    const userId = user.sub;
    const slug = this.convertToSlug(title);

    const registredSlug = await this.prisma.question.findFirst({
      where: {
        slug,
      },
    });

    if (registredSlug) {
      throw new ConflictException('Slug already registred');
    }

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    });
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}
