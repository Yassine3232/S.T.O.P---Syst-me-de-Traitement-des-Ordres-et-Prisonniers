import { SetMetadata } from '@nestjs/common';
import { Profile } from '../enum/profile.enum';

export const Roles = (...roles: Profile[]) => SetMetadata('roles', roles);