import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuad extends AuthGuard('jwt') {}
