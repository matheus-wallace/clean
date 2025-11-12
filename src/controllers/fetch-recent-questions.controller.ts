import { Body, ConflictException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentuUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuad } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuad)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamsSchema) {
    const perPage = 1;
    const questions = await this.prisma.question.findMany({
      take: 1,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { questions };
  }
}
