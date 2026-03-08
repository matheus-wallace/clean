import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { SessionsAuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/create.question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { PrismaService } from "@/domain/prisma/prisma.service";

@Module({
  controllers: [
    CreateAccountController,
    SessionsAuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
