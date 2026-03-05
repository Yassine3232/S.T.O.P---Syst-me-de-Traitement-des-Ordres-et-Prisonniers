import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard } from './admin-guards';

export function AllowedLoggedIn() {
  return applyDecorators(
    UseGuards(AdminGuard)
  );
}