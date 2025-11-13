import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );

    return Promise.resolve(questionAttachments);
  }

  deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );

    this.items = questionAttachments;

    return Promise.resolve();
  }
}
