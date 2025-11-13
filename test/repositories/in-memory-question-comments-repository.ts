import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) {
      return Promise.resolve(null);
    }

    return Promise.resolve(questionComment);
  }

  findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return Promise.resolve(questionComments);
  }

  create(questionComment: QuestionComment) {
    this.items.push(questionComment);

    return Promise.resolve();
  }

  delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(itemIndex, 1);

    return Promise.resolve();
  }
}
