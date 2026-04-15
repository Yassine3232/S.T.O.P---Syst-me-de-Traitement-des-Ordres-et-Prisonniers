import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard, ConnectedGuard } from './admin-guards';

export function AllowedLoggedIn() {
  return applyDecorators(
    UseGuards(AdminGuard)
  );
}

export function AllowedConnected() {
  return applyDecorators(
    UseGuards(ConnectedGuard)
  );
}