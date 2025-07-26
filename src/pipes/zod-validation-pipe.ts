import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodObject } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Failed to validate parameters',
          statusCode: 400,
          errors: fromZodError(error),
        });
      }

      throw new BadRequestException('Failed to validate parametes');
    }
    return value;
  }
}
